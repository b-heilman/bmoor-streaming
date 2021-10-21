
const fetch = require('node-fetch');

const {app, port} = require('./server.js');

const server = app.listen(port, async () => {
	console.log(`App listening to: ${port}`);
});

app.post('/kill', function(){
	server.close();
});