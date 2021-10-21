
const {app} = require('./server.js');

const port = 9000;

const server = app.listen(port, async () => {
	console.log(`App listening to: ${port}`);

	try {
		const response = await fetch('http://localhost:'+port+'/read/trigger');

		const data = await response.json();

		console.log('data received:', data.results.length);
	} catch(ex){
		console.log(ex);
	}

	server.close();
});
