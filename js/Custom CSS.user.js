// ==UserScript==
// @name         Custom CSS
// @namespace    https://skidlamer.github.io/
// @version      0.1
// @description  Apply Krunker Custom CSS
// @author       SkidLamer - From The Gaming Gurus
// @match        *://krunker.io/*
// @exclude      *://krunker.io/editor*
// @exclude      *://krunker.io/social*
// @run-at       document-end
// @grant        none
// ==/UserScript==

let cssUrl = "https://skidlamer.github.io/css/kpal.css"
new Array(...document.styleSheets).map(css => {
    if (css.href && css.href.includes("main_custom.css")) {
        if (cssUrl.startsWith("http") && cssUrl.endsWith(".css")) {
            css.ownerNode.href = cssUrl;
        }
    }
})