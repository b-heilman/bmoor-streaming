
const stream = require('stream');

function transform(fn){
	return new stream.Transform({
		objectMode: true,
		transform: async (chunk, encoding, next) => {
			next(null, await fn(chunk));
		}
	});
}

module.exports = {
	transform
};
