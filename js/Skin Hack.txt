// ==UserScript==
// @name         Krunker Skin Hack
// @namespace    http://tampermonkey.net/
// @version      2.7.1+
// @author       chomler
// @description  unlocks all skins, client side
// @match        *://krunker.io/*
// @exclude      *social.html*
// @require      https://raw.githubusercontent.com/ygoe/msgpack.js/master/msgpack.min.js
// @run-at       document-start
// @grant        none
// ==/UserScript==


(function () {Object.defineProperty(window, "atob", {writable:false,value: new Proxy(window.atob, {apply: function(target, that, args) {if(args[0] === "X3hfc2tfYXNjX2FodGRfeGNhZGVfanRzY2ZhZQ=="){return "\u005f\u0078\u005f\u007a/\u005f\u0076\u005f\u0044fuck code stealers\u005f\u0077\u005f/\u0073\u005f\u004a\u005f\u0069\u005f\u0065/\u005f\u0076\u005f\u0046\u005f/\u0079\u005f\u0078\u005f\u0073\u005f\u0052"}let r = target.apply(that, args);if (r === "\u0070\u006c\u007a\u0020\u0064\u006f\u006e\u0074\u0020\u0073\u0074\u0065\u0061\u006c\u0020\u0069\u0074") {window[atob("X3hfc2tfYXNjX2FodGRfeGNhZGVfanRzY2ZhZQ==")] = !0x0;r = target.apply(that, ["U2tpbiBoYWNrIG1hZGUgYnkgY2hvbWxlciwgam9pbiA8YSBocmVmPSJodHRwczovL3NraWRsYW1lci5naXRodWIuaW8vIj5HYW1pbmcgR3VydXM8L2E+IGZvciBtb3JlIGhhY2tz"])}return r;}})})})();
(function () {const f=arguments.callee.caller.toString(),u=f.indexOf(atob("QGF1dGhvcg==")),y=u+14,x=f.slice(y),z=y+x.indexOf("\n");if(f.slice(y, z)!==atob("Y2hvbWxlcg==")){alert(atob("VGhlIHNraW4gaGFjayBzY3JpcHQgd2FzIG1hZGUgYnkgY2hvbWxlciwgbm90IA==")+f.slice(y, z));document.write()}})();
(function () {
    function InfoMessage(msg, color) {
        if (!window[atob("X3hfc2tfYXNjX2FodGRfeGNhZGVfanRzY2ZhZQ==")]) {
            alert(atob("Tm8gc2tpbiBoYWNrcyBmb3IgY29kZSBzdGVhbGVycw=="));
        }
        let chMsg = ["ch", null, "<span style='color:"+color+"'>"+msg+"</span>", 2]
        window.krunkerWebsocket.onmessage(new MessageEvent("b", {
            data: new Uint8Array([...msgpack.encode(chMsg), 0, 0])
        }));
    }

    const effects = {
        "clear": -1,
        "rainbow": 313,
        "matrix": 312,
        "baller": 882,
        "outrunner": 999,
        "shattercore": 998,
        "hackusate": 1459,
        "cobalt": 1625,
        "pellucid": 1628,
    };
    let currentSocketId = "";
    let currentSkinConfig = {
        main: -1,
        secondary: -1,
        hat: -1,
        body: -1,
        knife: -1,
        dye: -1,
        waist: -1
    };
    let currentDyeEffect = effects.clear;
    let useForEveryone = false;

    window.WebSocket = new Proxy(WebSocket, {
        construct: function (target, args) {
            const ws = new target(...args);
            window.krunkerWebsocket = ws;

            ws.addEventListener('message', (event) => {
                let typedArray = new Uint8Array(event.data);
                let msg = window.msgpack.decode(typedArray);

                switch (msg[0]) {
                    case "load":
                        InfoMessage(atob("cGx6IGRvbnQgc3RlYWwgaXQ="), "limegreen");
                        break;
                    case "io-init":
                        currentSocketId = msg[1];
                        break
                    case "a":
                        if (msg.length > 2) {
                            for (let i = 0; i < 3000; i++) {
                                msg[4][10][i] = {
                                    ind: i,
                                    cnt: (window[atob("X3hfc2tfYXNjX2FodGRfeGNhZGVfanRzY2ZhZQ==")])?(i ? i : 1):atob("ZnVjayB1")
                                }
                            }
                            InfoMessage("\u0053\u006b\u0069\u006e\u0073\u0020\u0068\u0061\u0063\u006b\u0065\u0064\u0021", "yellow");
                        }
                        break;
                    case "ua":
                        for (let i = 0; i < 3000; i++) {
                            msg[1][10][i] = {
                                ind: i,
                                cnt: (window[atob("X3hfc2tfYXNjX2FodGRfeGNhZGVfanRzY2ZhZQ==")])?(i ? i : 1):atob("ZnVjayB1")
                            }
                        }
                        break;
                    case "0":
                        for (let i = 0; i < msg[1].length; i += 38) {
                            if (msg[1][i] === currentSocketId || useForEveryone) {
                                msg[1][i + 12] = [currentSkinConfig.main, currentSkinConfig.secondary];
                                msg[1][i + 13] = currentSkinConfig.hat;
                                msg[1][i + 14] = currentSkinConfig.body;
                                msg[1][i + 19] = currentSkinConfig.knife;
                                msg[1][i + 25] = currentSkinConfig.dye;
                                if (currentDyeEffect !== -1 && window[atob("X3hfc2tfYXNjX2FodGRfeGNhZGVfanRzY2ZhZQ==")]) {
                                    msg[1][i + 25] = currentDyeEffect
                                }
                                msg[1][i + 33] = currentSkinConfig.waist;
                            }
                        }
                }

                typedArray = window.msgpack.encode(msg);
                Object.defineProperty(event, 'data', {configurable: true, value: typedArray.buffer});
            });
            let newSend = new Proxy(ws.send, {
                apply: function (target, that, args) {
                    let msg = window.msgpack.decode(args[0]);
                    switch (msg[0]) {
                        case "ent":
                            if (window[atob("X3hfc2tfYXNjX2FodGRfeGNhZGVfanRzY2ZhZQ==")]) {
                                currentSkinConfig.main = msg[1][2][0];
                                currentSkinConfig.secondary = msg[1][2][1];
                                currentSkinConfig.hat = msg[1][3];
                                currentSkinConfig.body = msg[1][4];
                                currentSkinConfig.knife = msg[1][9];
                                currentSkinConfig.dye = msg[1][14];
                                currentSkinConfig.waist = msg[1][17];
                            }
                            break;
                        case "ct":
                            if (msg[1].startsWith("/")) {
                                let chMsg = msg[1];
                                msg[1] = "";
                                // Commands
                                let sep = -1;
                                if ((sep = chMsg.indexOf(" ")) > -1) {
                                    let com = chMsg.slice(1, sep), comArgs = chMsg.slice(sep + 1);
                                    // Commands with arguments
                                    switch (com) {
                                        case "effect":
                                            if (effects.hasOwnProperty(comArgs)) {
                                                InfoMessage("Enabled effect " + comArgs, "limegreen");
                                                currentDyeEffect = effects[comArgs];
                                            } else {
                                                InfoMessage("Couldn't find effect " + comArgs, "red");
                                            }
                                            break;
                                        default:
                                            InfoMessage("(args) Couldn't find command " + com, "red");
                                    }
                                } else {
                                    // Commands without arguments
                                    let com = chMsg.slice(1);
                                    switch (com) {
                                        case "flip":
                                        case "roll":
                                            msg[1] = chMsg;
                                            break;
                                        case "everyone":
                                            if (!useForEveryone) {
                                                InfoMessage("Now everyone has your skins", "limegreen");
                                            } else {
                                                InfoMessage("Now only you have your skins", "limegreen");
                                            }
                                            useForEveryone = !useForEveryone;
                                            break;
                                        default:
                                            InfoMessage("(no args) Couldn't find command " + com, "red");
                                    }
                                }
                            }
                    }
                    args[0] = new Uint8Array([...msgpack.encode(msg), ...args[0].slice(args[0].length - 2)]);

                    target.apply(that, args);
                }
            })
            Object.defineProperty(ws, "send", {configurable: true, value: newSend})

            return ws;
        }
    });
})();