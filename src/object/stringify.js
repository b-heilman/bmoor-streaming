
const stream = require('stream');

async function encodeStream(incomingStream, cb){
	return new Promise(async (resolve) => {
		let first = true;

		const myStream = new stream.Writable({
			objectMode: true,
			write: async (chunk, encoding, next) => {
				if (first){
					first = false;
				} else {
					cb(',');
				}

				cb(JSON.stringify(chunk));

				next();
			}
		});

		incomingStream.pipe(myStream);

		incomingStream.on('end', function (data) {
			resolve();
		});
	});
	
}

async function stringify(value, cb){
	if (typeof(value) === 'object'){
		if (value.pipe){
			cb('[');
			await encodeStream(value, cb);
			cb(']');
		} else if (value.then){
			return complexStringify(await value, cb);
		} else {
			cb('{');
			await Object.keys(value).reduce(
				async (prom, key, i) => {
					await prom;

					if (i !== 0){
						cb(',');
					}

					cb(`"${key}":`);
					return stringify(value[key], cb);
				},
				null
			);
			cb('}');
		}
	} else if (typeof(value) === 'function'){
		return complexStringify(value(), cb);
	} else {
		cb(JSON.stringify(value));
	}
}

module.exports = {
	stringify
};
