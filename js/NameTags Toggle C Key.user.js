// ==UserScript==
// @name         NameTags Toggle C Key
// @namespace    https://skidlamer.github.io/
// @version      0.1
// @description  The Gaming Guru's
// @author       SkidLamer
// @match         *://krunker.io/*
// @exclude       *://krunker.io/editor*
// @exclude       *://krunker.io/social*
// @run-at       document-start
// @grant        none
// ==/UserScript==
(function(hash) {
    'use strict';
    const global = window[hash] = Object.assign({}, {
        nameTags: true,
        request: async function(url, type, opt = {}) {
            return fetch(url, opt).then(response => {
            if (!response.ok) throw Error(response.statusText);
            else return type ? response[type]() : response;
            })
        }
    });
    global.request("https://krunker.io/social.html", "text").then(data => {
        global.request(`https://krunker.space/krunker.${/\w.exports="(\w+)"/.exec(data)[1]}.js`, "text").then(gameJS => {
            const inView = /&&\w+\['(\w+)']\){(if\(\(\w+=\w+\['\w+']\['\w+']\['\w+'])/.exec(gameJS)[1];
                Object.defineProperty(Object.prototype, inView, {set(val){this.inView=val},get(){return global.nameTags||this.inView},writeable:false});
                document.addEventListener('keydown', e => { if (e.code == "KeyC") global.nameTags ^= 1})
        })
    }).catch(err => console.error(err));
})([...Array(8)].map(_ => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[~~(Math.random()*52)]).join(''));