const injector = {
    name: 'Krunker Shitsploit',
    author: 'Divide',
    locations: ['game'],
    run: () => {
		let request = new XMLHttpRequest();
		request.open('GET', 'https://greasyfork.org/scripts/421228-sploit/code/Sploit.user.js', false /* asynchronous ?*/);
		request.send(null);
		if (request.status === 200) {
		  eval(request.responseText);
		}
    },
}
module.exports = Object.create(injector);
