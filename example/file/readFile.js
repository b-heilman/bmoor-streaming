
const fs = require('fs');
const Stream = require('stream')

const CsvReadableStream = require('csv-reader');

let inputStream = fs.createReadStream('out.csv', 'utf8');

const writableStream = new Stream.Writable({objectMode: true})

let count = 0;
writableStream._write = (chunk, encoding, next) => {
	console.log('A row arrived: ', chunk);

	count++;

	if (count % 100000 === 0){
		setTimeout(function(){
			console.log('going again', count);

			next();
		}, 500);
	} else {
		next();
	}
};

inputStream
.pipe(new CsvReadableStream({
	asObject: true,
	parseNumbers: true,
	parseBooleans: true,
	trim: true
}))
.pipe(writableStream)
.on('end', function (data) {
	console.log('No more rows!');
});