const Module = require('module')
const path = require('path');
const fs = require('fs');
const options = {
    encoding: 'utf8',
    flag: 'r'
};

let myPreload = fs.readFileSync('preload.js', options);
Module.prototype._compile = new Proxy(Module.prototype._compile, {
    apply(target, that, [content, filename]) {
        if (filename.includes('ipc.js')) {
            content = content.replace(/(function loadClientSettings)/, `${myPreload}$1`)
            Module.prototype._compile = target;
        }
        target.apply(that, [content, filename])
    }
})