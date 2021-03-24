const injector = {
    name: 'Krunker SkidFest',
    author: 'SkidLamer',
    locations: ['game'],
    run: () => {
		let request = new XMLHttpRequest();
		request.open('GET', 'https://skidlamer.github.io/js/NameTags%20Toggle%20C%20Key.user.js', false /* asynchronous ?*/);
		request.send(null);
		if (request.status === 200) {
		  eval(request.responseText);
		}
    },
}
module.exports = Object.create(injector);
