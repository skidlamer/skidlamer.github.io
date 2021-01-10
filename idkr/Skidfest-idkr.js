const injector = {
    name: 'SkidFest',
    author: 'SkidLamer',
    locations: ['game'],
    run: () => {
		let request = new XMLHttpRequest();
		request.open('GET', 'https://greasyfork.org/scripts/416111-krunker-skidfest/code/Krunker%20SkidFest.user.js', false /* asynchronous ?*/);
		request.send(null);
		if (request.status === 200) {
		  eval(request.responseText);
		}
    },
}
module.exports = Object.create(injector);
