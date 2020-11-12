// ==UserScript==
// @name         GAMING GURUS CODERS KRUNKER BASE
// @namespace    http://skidlamer.github.io/
// @version      0.1
// @description  a Base for our coding team to work with
// @author       Chonker and Skid And You
// @match        *://krunker.io/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
/* eslint-disable no-caller */

(function() {

    /******************************************************************************************************************************************************/
    // DEFINITIONS
    /******************************************************************************************************************************************************/

    const twoPI = Math.PI * 2;
    const halfPI = Math.PI / 2;
    const isProxy = Symbol("isProxy");
    const patchesGame = new Map()
    .set("inView", [/if\((!\w+\['\w+'])\)continue;/, "if($1&&void 0 !== window.nametags)continue;"])

    let log = {

        msg: console.log.bind(console, '%c MSG ', "color: #212121; font-weight:bold; background-color:#b0bec5; padding: 3px 6px; border-radius: 2px;"),
        error: console.log.bind(console, '%c ERROR ', "color: #ffebee; font-weight:bold; background-color:#c62828; padding: 3px 6px; border-radius: 2px;"),
        warn: console.log.bind(console, '%c WARN ', "color: #fff3e0; font-weight:bold; background-color:#f4511e; padding: 3px 6px; border-radius: 2px;"),
        info: console.log.bind(console, '%c INFO ', "color: #ede7f6; font-weight:bold; background-color:#651fff; padding: 3px 6px; border-radius: 2px;"),
        success: console.log.bind(console, '%c SUCCESS ', "color: #e8f5e9; font-weight:bold; background-color:#2e7d32; padding: 3px 6px; border-radius: 2px;"),
        dir: console.dir.bind(console),
        log: console.info.bind(console),
        start: console.groupCollapsed.bind(console),
        end: console.groupEnd.bind(console),
    };

    let vars = {

        canSee: {regex:/this\['(\w+)']=function\(\w+,\w+,\w+,\w+,\w+,\w+\){if\(!\w+\)return!0x1;/, pos:1, val:null},
        inView: {regex:/if\(!\w+\['(\w+)']\)continue/, pos:1, val:null},
        procInputs: {regex:/this\['(\w+)']=function\((\w+),(\w+),\w+,\w+\){(this)\['recon']/, pos:1, val:null},
        aimVal: {regex: /this\['(\w+)']-=0x1\/\(this\['weapon']\['aimSpeed']/, pos:1, val:null},
        pchObjc: {regex: /0x0,this\['(\w+)']=new \w+\['Object3D']\(\),this/, pos:1, val:null},
        didShoot: {regex: /--,\w+\['(\w+)']=!0x0/, pos:1, val:null},
        nAuto: {regex: /'Single\\x20Fire','varN':'(\w+)'/, pos:1, val:null},
        crouchVal: {regex: /this\['(\w+)']\+=\w\['crouchSpeed']\*\w+,0x1<=this\['\w+']/, pos:1, val:null},
        recoilAnimY: {regex: /this\['(\w+)']=0x0,this\['recoilForce']=0x0/, pos:1, val:null},
        ammos: {regex: /\['noReloads']\|\|!\w\['\w+']&&\w\['(\w+)']/, pos:1, val:null},
        weaponIndex: {regex: /\['noReloads']\|\|!\w\['\w+']&&\w\['\w+']\[\w\['(\w+)']]/, pos:1, val:null},
        isYou: {regex: /this\['\w+']=0x0,this\['(\w+)']=w,this\['\w+']=!0x0/, pos:1, val:null},
        objInstances: {regex: /\w+\['genObj3D']\(0x0,0x0,0x0\);if\(\w+\['(\w+)']=\w+\['genObj3D']/, pos:1, val:null},
        getWorldPosition: {regex: /\['display'],\w+=\w+\['camera']\['(\w+)']\(\);/, pos: 1, val:null},
    };

    /******************************************************************************************************************************************************/
    // KRUNKER CHEAT
    /******************************************************************************************************************************************************/

    let isType = (item, type) => {
        return typeof item === type;
    }

    let isDefined = (object) => {
        return !isType(object, "undefined") && object !== null
    }

    let RENDER = (three, utils, colors, config, overlay, scale, game, controls, renderer, me, delta) => {

    }

    let INPUTS = (three, utils, colors, config, overlay, that, input, game, recon, lock) => {

    }

    /******************************************************************************************************************************************************/
    // EXPLOIT THE GAME
    /******************************************************************************************************************************************************/

    let setVars = function(script) {
        log.start("SETVARS...");
        for (let key in vars) {
            let result = vars[key].regex.exec(script);
            if (result) {
                vars[key].val = result[vars[key].pos];
                log.info("found: ", key, " at ", result.index, " value: ", vars[key].val);
            } else {
                vars[key].val = null;
                alert("Failed to find " + key);
            }
        }
        log.end();
    }

    let patchScript = (script, patches) => {

        log.start("PATCHING...");
        for (let [name, arr] of patches) {
            let found = arr[0].exec(script);
            if (found) {
                log.start(name);
                for (let i = 0; i < found.length; ++i) {
                    if (i == 0) {
                        log.info("Regex ", arr[0]);
                        log.info("Found ", found[i]);
                        log.info("Index ", found.index);
                    } else log.info("$", i, " ", found[i]);
                }
                log.msg("Replace " + arr[1]);
                const patched =
                      script.substr(0, found.index) +
                      String.prototype.replace.call(
                          script.substr(found.index, script.length),
                          arr[0],
                          arr[1]
                      );
                if (script === patched) {
                    log.error(`Failed to patch ${name}`);
                    continue;
                } else {
                    script = patched;
                    log.success("patched");
                }
                log.end();
            } else {
                log.error("Failed to find " + name);
            }
        }
        log.end();
        return script;
    }

    let hookChain = function(three, utils, colors, config, overlay) {

        if (!overlay.render[isProxy]) {
            overlay.render = new Proxy(overlay.render, {
                apply(target, that, [scale, game, controls, renderer, me, delta]) {

                    if (me && me.active) {
                        RENDER(three, utils, colors, config, overlay, scale, game, controls, renderer, me, delta);
                        if (!me[vars.procInputs.val][isProxy]) {
                            me[vars.procInputs.val] = new Proxy(me[vars.procInputs.val], {
                                apply: function(target, that, [input, game, recon, lock]) {
                                    if (that) {
                                        INPUTS(three, utils, colors, config, overlay, that, input, game, recon, lock)
                                    }
                                    return target.apply(that, [input, game, recon, lock]);
                                },
                                get(target, key) {
                                    return key === isProxy ? true : Reflect.get(target, key);
                                },
                            })
                        }

                    }

                    return target.apply(that, [scale, game, controls, renderer, me, delta]);
                },
                get(target, key) {
                    return key === isProxy ? true : Reflect.get(target, key);
                },
            });

        }
    }

    const hooked_arrayBuffer = new Proxy(Response.prototype.arrayBuffer, {

        apply(target, that, args) {
            return (async function(key) {
                let array = await target.apply(that, args);
                array = await Array.from(new Uint8Array(array));
                array = await array.map((code) => String.fromCharCode(code ^ key));
                let string = array.join("");
                setVars(string);
                string = patchScript(string, patchesGame);
                array = Uint8Array.from(
                    string.split("").map((char) => char.charCodeAt(0) ^ key)
                );
                return array.buffer;
            })(0xf1);
        }
    });

    const hooked_freeze = new Proxy(Object.freeze, {

        apply: function(target, that, args) {
            let Caller = arguments.callee.caller;
            if (Caller && Caller.arguments.length == 5 && Caller.arguments[0].ACESFilmicToneMapping) {
                hookChain(...Caller.arguments);
            }
            return target.apply(that, args);
        }
    });

    Element.prototype.appendChild = new Proxy(Element.prototype.appendChild, {

        apply(target, that, [node]) {
            target.apply(that, [node]);
            if (node.contentWindow) {
                node.contentWindow.Response.prototype.arrayBuffer = hooked_arrayBuffer;
                node.contentWindow.Object.freeze = hooked_freeze;
            }
        }
    })
})();