// ==UserScript==
// @name         Krunker Custom Billboards
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Some Skid
// @match        *://krunker.io/*
// @require      https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

window.WebSocket = new Proxy(window.WebSocket, {
    construct: function(target, args) {

        const ws = new target(...args);

        const billArray = ["Krunker Skid. to win every game.",
                           "'This game sux' SkidLamer",
                           "Sidney is Ronald McDonald",
                           "Zares Stop stealing my Scripts",
                           "I blame Nathan",
                           "Tehchy is still a hacker",
                           "Vince rides his brothers success"]

        // WebSocket "onopen"
        const openHandler = (event) => {
            console.log('Open', event);
        };

        // WebSocket "onmessage"
        const messageHandler = (event) => {
            let typedArray = new Uint8Array(event.data);
            let [id, ...data] = window.msgpack.decode(typedArray);

            switch (id)
            {
                case "init":
                    //console.dir(data)
                    data[9].bill.txt = billArray[Math.floor( Math.random() * billArray.length )];
                    break;
            }

            typedArray = window.msgpack.encode([id, ...data]);
            Object.defineProperty(event, 'data', {
                value: typedArray.buffer
            });
        };

        // WebSocket "onclose"
        const closeHandler = (event) => {
            console.log('Close', event);
            // remove event listeners
            ws.removeEventListener('open', openHandler);
            ws.removeEventListener('message', messageHandler);
            ws.removeEventListener('close', closeHandler);
        };

        // add event listeners
        ws.addEventListener('open', openHandler);
        ws.addEventListener('message', messageHandler);
        ws.addEventListener('close', closeHandler);

        // proxied send
        ws.send = new Proxy(ws.send, {
            apply: function(target, that, args) {
                //console.log('Send', args);
                target.apply(that, args);
            }
        });

        return ws;
    }
});