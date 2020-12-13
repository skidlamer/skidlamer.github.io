// ==UserScript==
// @name         NameTags or Base For Coders
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Use This To Make Your Own Cheat Or Just Use It As Name Tags
// @author       SkidLamer
// @match        *krunker.io/*
// @exclude      *krunker.io/social*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function(wnd) {
    /* eslint-disable no-caller, no-undef, no-sequences, no-return-assign */
    const isProxy = Symbol("isProxy");
    let isDefined = (object) => !isType(object, "undefined") && object !== null;
    let rndStr = sz => [...Array(sz)].map(_ => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[~~(Math.random()*52)]).join('');
    const skid = wnd[rndStr(8)] = new function() {
        this.vars = {};
        this.hndls = {};
        this.opts = {
            nameTags: true,
        }
        this.init = function (script) {
            const obfu = {
                inView: { regex: /(\w+\['(\w+)']\){if\(\(\w+=\w+\['\w+']\['position']\['clone']\(\))/, pos: 2 },
                objInstances: { regex: /\w+\['\w+']\(0x0,0x0,0x0\);if\(\w+\['(\w+)']=\w+\['\w+']/, pos: 1 },
                procInputs: { regex: /this\['(\w+)']=function\((\w+),(\w+),\w+,\w+\){(this)\['recon']/, pos: 1 },
            };
            for (let key in obfu) {
                let result = obfu[key].regex.exec(script);
                if (result) {
                    this.vars[key] = result[obfu[key].pos];
                    console.log("found: ", key, " at ", result.index, " value: ", this.vars[key]);
                } else {
                    alert("Failed to find " + key);
                    this.vars[key] = null;
                }
            }

            wnd.addEventListener("keydown", event => { //https://keycode.info/
                switch (event.code) {
                    case "KeyC": skid.opts.nameTags ^= 1; break;
                }
            })
        }

        this.render = function (scale, game, controls, rendering, me) {
            for (const player of game.players.list) {
                if (player.id != me.id) {
                    wnd.Object.defineProperty(player, skid.vars.inView, {
                        get: _ => skid.opts.nameTags ? true : player[skid.vars.objInstances]?player[skid.vars.objInstances].visible&&skid.utils.lineOfSite(player[skid.vars.objInstances].position):false,
                        configurable: true
                    });
                }
            }
        }
        this.inputs = function (me, input, game, recon, lock) {
            const key = { frame: 0, delta:1,xdir:2,ydir:3,moveDir:4,shoot:5,scope:6,jump:7,reload:8,crouch:9,weaponScroll:10,weaponSwap:11, moveLock:12};
            //input[key.scope] = 1
        }
        this.utils = {
            lineOfSite: function (point) {
                for (let i = 0; i < 6; i ++) {
                    if (skid.hndls.rendering.frustum.planes[i].distanceToPoint(point) < 0) {
                        return false;
                    }
                }
                return true;
            }
        }
    }

    const join = wnd.Function.prototype.toString;
    wnd.Function.prototype.toString = function() {
        let str = join.apply(this, arguments);
        if (str.length > 43e5) {
            console.log(skid)
            let result = str.match(/:\w+\['\w+']=0x1,window\['(\w+)']&&window\['spectMode']/);
            if (result) {
                skid.init(str);
                wnd.Object.defineProperty(wnd, result[1], {
                    get: function() {
                        let caller = arguments.callee.caller, args = caller ? caller.arguments : null;
                        if (args && args.length == 8) {
                            ["game", "controls", "rendering", "me"].map((hndl,indx)=>{ skid.hndls[hndl] = args[indx + 1] });
                            if (skid.hndls.me) {
                                skid.render(...args);
                                if (!skid.hndls.me[skid.vars.procInputs][isProxy]) {
                                    skid.hndls.me[skid.vars.procInputs] = new wnd.Proxy(skid.hndls.me[skid.vars.procInputs], {
                                        apply(target, that, args) {
                                            return skid.inputs.apply(that, [that, ...args]), target.apply(that, args)
                                        },
                                        get(target, key) {
                                            const value = wnd.Reflect.get(target, key)
                                            return key === isProxy ? true : value;
                                        },
                                    })
                                }
                            }
                        }
                        return false;
                    }
                })
            }
        }
        return str;
    }

})(globalThis);