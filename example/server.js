

const fs = require('fs');
const stream = require('stream');
const fetch = require('node-fetch');

// let's set up the test server
const express = require('express');
const app = express();

const port = 9000;
const router = express.Router();

app.use('/read', router);

const {combine: combineStreams} = require('../src/object/combine.js');
const {transform: transformStream} = require('../src/object/transform.js');
const {stringify} = require('../src/object/stringify.js');
const {logging} = require('../src/object/logging.js');
const {Memory: StreamMemory} = require('../src/object/memory.js');
const {express: expressRouteFactory} = require('../src/route.js');

async function complexStringify(obj, writeStream){
	return stringify(obj, function(str){
		writeStream.write(str);
	});
}

router.get('/file', expressRouteFactory(function(){
	const {parser} = require('stream-json');
	const {streamArray} = require('stream-json/streamers/StreamArray');

	return fs.createReadStream('sample.json', 'utf8')
		.pipe(parser())
		.pipe(streamArray())
		.pipe(transformStream((datum) => {
			return datum.value;
		}));
}));

const cache = new StreamMemory(
	() => {
		const {parser} = require('stream-json');
		const {streamArray} = require('stream-json/streamers/StreamArray');
		
		return fs.createReadStream('sample.json', 'utf8')
			.pipe(parser())
			.pipe(streamArray())
			.pipe(transformStream((datum) => {
				return datum.value;
			}));
	}
);

router.get('/cache', expressRouteFactory(function(){
	return {
		hasCache: !!cache.memory,
		results: cache.getValue()
	};
}));

router.get('/trigger', expressRouteFactory(function(){
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

	return {
		results: combineStreams(
			() => request('eins'),
			() => request('zwei')
		)
	};
}));

module.exports = {
	app,
	port
};
