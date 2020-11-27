// ==UserScript==
// @name         Krunker NameTags
// @namespace    http://skidlamer.github.io/
// @version      0.1
// @description  somebody stop me!
// @author       SkidLamer
// @match        *://krunker.io/*
// @run-at       document-start
// @grant        none
// ==/UserScript==



(function(rndm) {
    window[rndm] = new Object();
    window.Function = new Proxy(window.Function, {
        construct(target, args) {
            const that = new target(...args);
            if (args && args.length === 3 && typeof args[2] === "string" && args[2].length > 38e5) {
                args[2] = String.prototype.replace.call(args[2], /if\((!\w+\['\w+'])\)continue;/, `if($1&&void 0 === window['${rndm}'].nametags)continue;`);
                const patched = new target(...args);
                patched.toString = () => that.toString();
                return patched;
            }
            return that;
        }
    })
    window.addEventListener('keydown', (event) => {
        if ('INPUT' == document.activeElement.tagName || !window.endUI && window.endUI.style.display) return;
        if (event.key == 't') {
            window.SOUND.play('tick_0', 0.1);
            window[rndm].nametags = window[rndm].nametags === undefined ? true : undefined;
        }
    });
})([...Array(16)].map(() => Math.random().toString(36)[2]).join(''));