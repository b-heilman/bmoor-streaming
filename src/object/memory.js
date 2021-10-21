
const stream = require('stream');
const {transform} = require('./transform.js');

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

			const memorizer = transform((chunk) => {
				this.memory.push(chunk);

				return chunk;
			});

			return this.factory(ctx)
				.pipe(memorizer);
		}
	}
}

module.exports = {
	Memory: StreamMemory
};
