
const fs = require('fs');
const Stream = require('stream');

const cols = 10;
const headers = [];

for(let i = 0; i < cols; i++){
	headers.push('header'+i);
}

const writer = fs.createWriteStream('out.csv', {
	flags: 'w'
});

const readable = new Stream.Readable({objectMode: true});

readable._read = () => {};
readable.pipe(writer);
/*
readable.on('data', function(datum){
	console.log(':', datum);
});
*/

readable.push(headers.join(',')+'\n');

function run(j, max, step){
	console.log('=>', j);

	for(let c = j+step; j < c; j++){
		const row = [];

		for(let i = 0; i < cols; i++){
			row.push('col'+i+'_'+j);
		}

		readable.push(row.join(',')+'\n');
	}

	if (j < max){
		process.nextTick(function(){
			console.log('**************** next');
			run(j, max, step);
		}); 
	} else {
		console.log('**************** done');
		readable.push(null);
	}
}

run(0, 8000000, 10000);
