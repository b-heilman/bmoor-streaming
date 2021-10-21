
const {transform} = require('./transform.js');

function logging(){
	return transformStream(function(chunk){
		console.log(JSON.stringify(chunk, null, '\t'));
		
		return chunk;
	});
}

module.exports = {
	logging
};
