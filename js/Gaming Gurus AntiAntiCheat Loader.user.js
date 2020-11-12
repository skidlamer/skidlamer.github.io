// ==UserScript==
// @name         Gaming Gurus AntiAntiCheat Loader
// @namespace    https://skidlamer.github.io/
// @version      1.0
// @description  try to take over Krunker!
// @author       The Gaming Gurus Development Team
// @match        *://krunker.io/*
// @run-at       document-start
// @grant        none
// @noframes
// ==/UserScript==
/* eslint-disable no-caller, no-undef, no-sequences */

(function() {
    'use strict';
    let gameCode = (str) => {
        str+="alert('cunt')";
        return str;
    }
    let observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT' && node.type === "text/javascript" && node.innerHTML.startsWith("*!", 1)) {
                    node.innerHTML = `
fetch( "https://krunker.io/social.html" )
  .then(resp => resp.text())
  .then(text => fetch( "https://krunker.io/pkg/krunker." + /\\w.exports="(\\w+)"/.exec(text)[1] + ".vries" ))
  .then(resp => resp.arrayBuffer())
  .then(buff => new Uint8Array(buff))
  .then(data => new TextDecoder().decode(data.map(arr => arr ^ data[0]^'!'.charCodeAt(0))))
  .then(str => str+="alert('cunt')")
  .then(game => new Function("__LOADER__mmTokenPromise", game)(window.mmTokenPromise));
`
                    //_atob("ZmV0Y2goImh0dHBzOi8va3J1bmtlci5pby9zb2NpYWwuaHRtbCIpCi50aGVuKHJlc3AgPT4gcmVzcC50ZXh0KCkpCi50aGVuKHRleHQgPT4gZmV0Y2goImh0dHBzOi8va3J1bmtlci5pby9wa2cva3J1bmtlci4iKy9cdy5leHBvcnRzPSIoXHcrKSIvLmV4ZWModGV4dClbMV0rIi52cmllcyIpKQoudGhlbihyZXNwID0+IHJlc3AuYXJyYXlCdWZmZXIoKSkKLnRoZW4oYnVmICA9PiB7CmxldCB2cmllcyA9IG5ldyBVaW50OEFycmF5KGJ1Zik7CmxldCB4b3IgPSB2cmllc1swXSBeIDMzOwpyZXR1cm4gbmV3IFRleHREZWNvZGVyKCkuZGVjb2RlKHZyaWVzLm1hcChiID0+IGJeeG9yKSkKfSkKLnRoZW4oZ2FtZWpzID0+IEZ1bmN0aW9uKCJfX0xPQURFUl9fbW1Ub2tlblByb21pc2UiLCBnYW1lanMpKHdpbmRvdy5tbVRva2VuUHJvbWlzZSkp");
                    observer.disconnect();
                }
            }
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true
    });

    let frame = document.createElement('iframe');
    frame.setAttribute('style', 'display:none');
    frame.src = location.origin;
    document.documentElement.appendChild(frame);

    window.custLoaderResolve = {};
    window.mmTokenPromise = new Promise(resolve => { window.mmTokenPromised = resolve })
    document.addEventListener("DOMContentLoaded", () => {
        new Promise(resolve => {
            window.custLoaderResolve = resolve
        }).then(token => {
            document.documentElement.removeChild(frame)
            delete window.custLoaderResolve;
            window.mmTokenPromised(token)
        })

        frame.contentWindow.fetch = function(url) {
            if (url.startsWith("seek-game", 30)) {
                let token = decodeURIComponent(/Token=(.+)&data/.exec(url)[1])
                window.custLoaderResolve(token)
                frame.contentWindow.document.write();
                return
            }
            return fetch.apply(this, arguments);
        }
    })
})();