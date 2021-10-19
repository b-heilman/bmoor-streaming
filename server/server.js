

const fs = require('fs');
const stream = require('stream');
const fetch = require('node-fetch');

// let's set up the test server
const express = require('express');
const app = express();

const port = 9000;
const router = express.Router();

app.use('/read', router);

function combineStreams(...incoming){
	let called = false;
	const fn = incoming.reverse().reduce(
		(cur, streamFactory) => (async function(){
			const incomingStream = await streamFactory();

			const writableStream = new stream.Writable({objectMode: true});

			writableStream._write = (chunk, encoding, next) => {
				// console.log('chunk', chunk);
				if (chunk){
					outgoingStream.push(chunk);
				}

				next();
			};

			incomingStream
			.on('end', function (data) {
				if (cur){
					console.log('run next');
					cur();
				} else {
					console.log('closing');
					setTimeout(function(){
						// let things clear out
						outgoingStream.push(null);
					}, 5);
				}
			})
			.pipe(writableStream);

			return writableStream;
		}),
		null
	);

	const outgoingStream = new stream.Readable({
		objectMode: true,
		pause: function(){
			console.log('hey, hold up');
		},
		read: function(){
			if (!called){
				fn();
				called = true;
			}
		}	
	});

	return outgoingStream;
}

function transformStream(fn){
	return new stream.Transform({
		objectMode: true,
		transform: async (chunk, encoding, next) => {
			next(null, await fn(chunk));
		}
	});
}

async function encodeStream(incomingStream, writeStream){
	return new Promise(async (resolve) => {
		let first = true;

		const myStream = new stream.Writable({
			objectMode: true,
			write: async (chunk, encoding, next) => {
				if (first){
					first = false;
				} else {
					writeStream.write(',');
				}

				writeStream.write(JSON.stringify(chunk));

				next();
			}
		});

		incomingStream.pipe(myStream);

		incomingStream.on('end', function (data) {
			resolve();
		});
	});
	
}

async function complexStringify(value, writeStream){
	if (typeof(value) === 'object'){
		if (value.pipe){
			writeStream.write('[');
			await encodeStream(value, writeStream);
			writeStream.write(']');
		} else if (value.then){
			return complexStringify(await value, writeStream);
		} else {
			writeStream.write('{');
			await Object.keys(value).reduce(
				async (prom, key, i) => {
					await prom;

					if (i !== 0){
						writeStream.write(',');
					}

					writeStream.write(`"${key}":`);
					return complexStringify(value[key], writeStream);
				},
				null
			);
			writeStream.write('}');
		}
	} else if (typeof(value) === 'function'){
		return complexStringify(value(), writeStream);
	} else {
		writeStream.write(JSON.stringify(value));
	}
}

router.get('/file', async (req, res) => {
	const {parser} = require('stream-json');
	const {streamArray} = require('stream-json/streamers/StreamArray');

	res.statusCode = 200;
	res.setHeader('Content-type', 'text/json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	
	const incomingStream = fs.createReadStream('sample.json', 'utf8')
		.pipe(parser())
		.pipe(streamArray())
		.pipe(transformStream((datum) => {
			// console.log('parsing: a');

			return datum.value;
		}));

	await complexStringify({
		results: incomingStream,
		pagination: {
			foo: 'bar'
		}
	}, res);

	res.end();
});

function getLogger(){
	return transformStream(function(chunk){
		console.log(JSON.stringify(chunk, null, '\t'));
		
		return chunk;
	});
}

class StreamMemory {
	constructor(factory, settings={}){
		this.factory = factory;
		this.settings = settings;
	}

	getValue(ctx){
		if (this.memory){
			return stream.Readable.from(this.memory);
		} else {
			this.memory = [];

			const memorizer = transformStream((chunk) => {
				this.memory.push(chunk);

				return chunk;
			});

			return this.factory(ctx)
				.pipe(getLogger())
				.pipe(memorizer);
		}
	}
}

const cache = new StreamMemory(
	() => {
		const {parser} = require('stream-json');
		const {streamArray} = require('stream-json/streamers/StreamArray');
		
		return fs.createReadStream('sample.json', 'utf8')
			.pipe(parser())
			.pipe(streamArray())
			.pipe(transformStream((datum) => {
				// console.log('parsing: a');

				return datum.value;
			}));
	}
);

router.get('/cache', async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-type', 'text/json');
	res.setHeader('Access-Control-Allow-Origin', '*');

	await complexStringify({
		hasCache: !!cache.memory,
		results: cache.getValue()
	}, res);

	res.end();
});

router.get('/trigger', async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-type', 'text/json');
	res.setHeader('Access-Control-Allow-Origin', '*');

	async function request(key){
		const {parser} = require('stream-json');
		const {streamArray} = require('stream-json/streamers/StreamArray.js');
		const {pick} = require('stream-json/filters/Pick.js');
		
		console.log('invoking:', key);
		const response = await fetch('http://localhost:'+port+'/read/file?name='+key);
		
		return response.body
			.pipe(parser())
			.pipe(pick({filter: 'results'}))
			.pipe(streamArray())
			.pipe(transformStream((datum) => {
				// console.log('parsing: b');

				return datum.value;
			}));
	}

	const combinedStream = combineStreams(
		() => request('eins'),
		() => request('zwei')
	);

	await complexStringify({results: combinedStream}, res);

	res.end();
});

module.exports = {
	app
};
