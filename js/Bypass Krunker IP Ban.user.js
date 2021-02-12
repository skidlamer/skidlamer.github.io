// ==UserScript==
// @name         Bypass Krunker IP Ban
// @namespace    https://skidlamer.github.io/
// @version      0.1
// @description  try to take over the world!
// @author       Lemons
// @match        https://*/*
// @run-at       document-start
// @grant        none
// @noframes
// ==/UserScript==

(function(base64, socket, encode, proxy) {
    'use strict';

    this.WebSocket = new proxy(socket, {
        construct(target, [url]) {
            console.log(url)
            while (url.match(/wss:\/\/ip_(.+?).krunker.io:(\d+)\/ws\?gameId=(\w+:\w+)&clientKey=(.+)/)) {
                console.log("Masking Your IP Address");
                return new target('wss://krunker.space/c5580cf2af/ws', encode(btoa(url)))
            }
            return new target(url);
        }
    });
})(btoa, WebSocket, encodeURIComponent, Proxy);