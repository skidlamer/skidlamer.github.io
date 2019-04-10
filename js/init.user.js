// ==UserScript==
// @name         Krunker Redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ¯\_(ツ)_/¯
// @author       Skid Lamer
// @match        *://krunker.io/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

// swap the game script with your modifed version.
const SwapURL = "https://skidlamer.github.io/js/game.js";

(Redirect => {
    'use strict';
    window.stop();
    document.innerHTML = null;
    GM_xmlhttpRequest({
        method: "GET",
        url: document.location.origin,
        onload: load => {
            let body = load.responseText;
            let swap = body.replace(/<script src="js\/game\.\w+?(?=\.)\.js\?build=.+"><\/script>/g, `<script type="text/javascript" src="` + SwapURL + `"></script>`);
            document.open();
            document.write(swap);
            document.close();
        }
    });
})();