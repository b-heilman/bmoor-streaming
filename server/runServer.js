
const fs = require('fs');
const stream = require('stream');
const fetch = require('node-fetch');

// let's set up the test server
const express = require('express');
const app = express();
const port = 9000;

const router = express.Router();

app.use('/read', router);

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
			console.log('parsing: a');

			return datum.value;
		}));

	await complexStringify(incomingStream, res);

	res.end();
});

router.get('/trigger', async (req, res) => {
	const {parser} = require('stream-json');
	const {streamArray} = require('stream-json/streamers/StreamArray');

	res.statusCode = 200;
    res.setHeader('Content-type', 'text/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    let count = 0;
	const response = await fetch('http://localhost:'+port+'/read/file');
	const incomingStream = response.body
		.pipe(parser())
		.pipe(streamArray())
		.pipe(transformStream((datum) => {
			console.log('parsing: b');
			count++;
			return datum.value;
		}));

	await complexStringify({
		results: incomingStream,
		pagination: {
			count: () => count
		}
	}, res);

	res.end();
});

const server = app.listen(port, async () => {
	console.log(`App listening to: ${port}`);

	const response = await fetch('http://localhost:'+port+'/read/trigger');
	try {
		const data = await response.json();
		
		console.log('data received:', data.results.length, data.pagination.count);
	} catch(ex){
		console.log('!!!');
	}

	server.close();
});
