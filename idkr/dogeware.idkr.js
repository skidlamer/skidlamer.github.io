const injector = {
    name: 'Krunker Dogeware',
    author: 'SkidLamer',
    locations: ['game'],
    run: () => {
		let request = new XMLHttpRequest();
		request.open('GET', 'https://skidlamer.github.io/obfu/dogeware.js', false);
		request.send(null);
		if (request.status === 200) {
		  eval(request.responseText);
		}
    },
}
module.exports = Object.create(injector);
