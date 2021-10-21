
require("babel-polyfill");

document.body.innerHTML = `
<style>
body {
	background: #00151c;
	margin: 0px;
}
#dashboard {
	background: #0e3040;
	color: #67809f;
	margin: 0px;
}
</style>

<section id='dashboard'
	style='border: 1px solid black'
	>Check the console</section>
`;

const port = 9000;

async function boot(){
	console.log('async/await');
	const response = await fetch('http://localhost:'+port+'/read/trigger');

	const data = await response.json();

	console.log('data received:', data.results);
	const streaming = await fetch('http://localhost:'+port+'/read/trigger');
	const reader = streaming.body//.getReader();
		.pipeThrough(new TextDecoderStream())
  	.getReader();

	let res = await reader.read();
	while(!res.done){
		console.log(res.value);

		res = await reader.read();
	}
	/*
		.on('data', function(data){
			console.log('data?', data);
		});
	*/
}

console.log('ready to roll..');
boot();
