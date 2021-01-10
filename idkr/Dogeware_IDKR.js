const injector = {
    name: 'SkidFest',
    author: 'SkidLamer',
    locations: ['game'],
    run: () => {
		let request = new XMLHttpRequest();
		request.open('GET', 'https://greasyfork.org/scripts/418592-krunker-dogeware-by-the-gaming-gurus/code/Krunker%20%20Dogeware%20-%20by%20The%20Gaming%20Gurus.user.js', false /* asynchronous ?*/);
		request.send(null);
		if (request.status === 200) {
		  eval(request.responseText);
		}
    },
}
module.exports = Object.create(injector);
