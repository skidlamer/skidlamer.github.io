// ==UserScript==
// @name         Game.js altering script
// @author       chonker1337
// @version      0.1
// @description  Allows you to change anything in game.js
// @match        *://krunker.io/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function hook(data) {
        // Here put code that will change things in the data variable
        console.log(data)
        return data
    }

    // Dont use TextDecoder and TextEncoder because something makes them not work
    function decode(data) {
        let built = ""
        for (let i = 0; i < data.length; i++) {
            built += String.fromCharCode(data[i])
        }
        return built
    }
    function encode(data) {
        let built = new Uint8Array(data.length)
        for (let i = 0; i < data.length; i++) {
            built[i] = data.charCodeAt(i)
        }
        return built
    }

    function rotateGameJs(data) {
        let built = ""
        for (let i = 0; i < data.length; i++) {
            built += String.fromCharCode(data.charCodeAt(i)^0x69)
        }
        return built
    }

    Promise.prototype.then = new Proxy(Promise.prototype.then, {
        apply(target, that, argArray) {
            if (typeof argArray[0] === "function") {
                argArray[0] = new Proxy(argArray[0], {
                    apply(target2, thisArg2, argArray2) {
                        let v = argArray2[0]
                        if (v && v.body && v.url && v.url.endsWith(".vries")) {
                            let ret = target2.apply(thisArg2, argArray2)
                            return ret.then(async function(v) {
                                return encode(rotateGameJs(hook(rotateGameJs(decode(new Uint8Array(v)))))).buffer
                            })
                        }
                        return target2.apply(thisArg2, argArray2)
                    }
                })
            }
            return target.apply(that, argArray)
        }
    })
})();