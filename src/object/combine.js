
const stream = require('stream');

function combine(...incoming){
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

module.exports = {
	combine
};
