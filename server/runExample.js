
const fetch = require('node-fetch');

const {app} = require('./server.js');

const port = 9000;

const server = app.listen(port, async () => {
	console.log(`App listening to: ${port}`);

	try {
		let response = null;

		response = await fetch('http://localhost:'+port+'/read/trigger');

		const data = await response.json();

		console.log('data received:', data.results.length);

		response = await fetch('http://localhost:'+port+'/read/cache');

		const cache1 = await response.json();

		console.log('cache1 received:', cache1.results.length);

		response = await fetch('http://localhost:'+port+'/read/cache');

		const cache2 = await response.json();

		console.log('cache2 received:', cache2.results.length);
	} catch(ex){
		console.log(ex);
	}

	server.close();
});
