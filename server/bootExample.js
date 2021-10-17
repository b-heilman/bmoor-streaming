
const fetch = require('node-fetch');

const {app} = require('./server.js');

const port = 9000;

const server = app.listen(port, async () => {
	console.log(`App listening to: ${port}`);
});

app.post('/kill', function(){
	server.close();
});