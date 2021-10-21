
const {stringify} = require('./object/stringify.js');

function express(generator){
	return async function route(req, res){
		const content = await generator(req);

		res.statusCode = 200;
		res.setHeader('Content-type', 'text/json');
		res.setHeader('Access-Control-Allow-Origin', '*');

		await stringify(content, function(str){
			res.write(str);
		});

		res.end();
	};
}

module.exports = {
	express
};
