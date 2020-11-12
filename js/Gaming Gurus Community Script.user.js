// ==UserScript==
// @name         Gaming Gurus Community Script
// @namespace    Gaming Gurus Community Bitcoin Address: 3C5wYLHwSZo2ZEMx1CjtcZim6BFsBEUkd9
// @homepage     http://skidlamer.github.io/
// @version      2.7.7
// @description  Krunker.io Cheat Script
// @author       SkidLamer, chonker and Friends
// @iconURL      https://cdn.discordapp.com/icons/692606346645733396/2c8c01e76973634afcaec17d22ba5e80.webp?size=128
// @require      https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js
// @match        *://krunker.io/*
// @run-at       document-start
// @grant        none
// @noframes
// ==/UserScript==
/* eslint-disable no-caller */

/*
  * Features:
  * Unlocked Player NameTags
  * Player Chams
  * Player WireFrame
  * Auto Slide (Hold SpaceKey)
  * Auto Reload
*/

function start(skid) {
    let isProxy = Symbol("isProxy");
    const twoPI = Math.PI * 2;
    const halfPI = Math.PI / 2;
    let frameCount = 0;
    let isType = (item, type) => {
        return typeof item === type;
    }
    let isDefined = (object) => {
        return !isType(object, "undefined") && object
    }
    let canStore = (typeof(Storage) !== "undefined");
    let createElement = (type, html, id) => {
        let newElement = document.createElement(type)
        if (id) newElement.id = id
        newElement.innerHTML = html
        return newElement
    }
    let saveVal = function(name, val) {
        if (canStore) localStorage.setItem(name, val);
    }
    let deleteVal = function(name) {
        if (canStore) localStorage.removeItem(name);
    }
    let getSavedVal = function(name) {
        if (canStore) return localStorage.getItem(name);
        return null;
    }
    let intitialize = (script) => {
        let log = (...args) => console.log("[SKID] ".concat(...args));
        let vars = new Map()
        .set("isYou", {regex:/continue;if\(\w+\['(\w+)']\|\|!\w+\['(\w+)']\)continue;if\(!\w+\['(\w+)']\)continue;if\(!/,pos:1})
        .set("inView", {regex:/continue;if\(\w+\['(\w+)']\|\|!\w+\['(\w+)']\)continue;if\(!\w+\['(\w+)']\)continue;if\(!/,pos:3})
        .set("objInstances", {regex: /\w+\['genObj3D']\(0x0,0x0,0x0\);if\(\w+\['(\w+)']=\w+\['genObj3D']/,pos:1})
        .set("ammos", {regex:/\['noReloads']\|\|!\w\['\w+']&&\w\['(\w+)']/,pos:1})
        .set("weaponIndex", {regex:/\['noReloads']\|\|!\w\['\w+']&&\w\['\w+']\[\w\['(\w+)']]/,pos:1})
        .set("pchObjc", {regex:/0x0,this\['(\w+)']=new \w+\['Object3D']\(\),this/,pos:1})
        .set("crouchVal", {regex:/this\['(\w+)']\+=\w\['crouchSpeed']\*\w+,0x1<=this\['\w+']/,pos:1})
        .set("recoilAnimY", {regex:/this\['(\w+)']=0x0,this\['recoilForce']=0x0/,pos:1})
        .set("canSee", {regex:/this\['(\w+)']=function\(\w+,\w+,\w+,\w+,\w+,\w+\){if\(!\w+\)return!0x1;/,pos:1})

        for (const [name, object] of vars.entries()) {
            let result = object.regex.exec(script);
            if ( result ) {
                object.val = result[object.pos];
                log("found: ", name, " at ", result.index, " value: ", object.val);
            } else {
                object.val = null;
                alert("Failed to find " + name);
            }
        }

        const config = {
            crouchDst:2.85,
            camChaseDst:24,
        };

        Object.entries({
            hideAdverts: `#aMerger, #endAMerger { display: none !important }`,
            //hideStreams: `#streamContainer { display: none !important }`
        }).forEach(entry => {
            const node = createElement("style", entry[1])
            document.head.appendChild(node);
        });

        let constructor = function(three) {
            this.three = three;
            this.renderArgs = null;
            this.context = document.getElementById('game-overlay').getContext('2d');
            this.mouseBtns = new Set();
            this.mouseDown = (btn) => this.mouseBtns && this.mouseBtns.has(btn);
            this.downKeys = new Set();
            this.keyDown = (key) => this.downKeys && this.downKeys.has(key);
            this.features = [];
            this.feature = function(name, keybind, status) {
                this.name = name;
                this.keybind = keybind;
                this.status = status;
            }
            this.getFeature = function(name) {
                let feature = null;
                this.features.forEach((item)=> {
                    if (item.name === name) feature = item;
                });
                return feature;
            }
            // Add Features
            this.features.push(new this.feature("NameTags", "Digit2", parseInt(getSavedVal("utilities_NameTags"))||false));
            this.features.push(new this.feature("Chams", "Digit3", parseInt(getSavedVal("utilities_Chams"))||false));
            this.features.push(new this.feature("WireFrame", "Digit4", parseInt(getSavedVal("utilities_WireFrame"))||false));
            this.features.push(new this.feature("AutoKeySlide", "Digit5", parseInt(getSavedVal("utilities_AutoKeySlide"))||false));
            this.features.push(new this.feature("AutoReload", "Digit6", parseInt(getSavedVal("utilities_AutoReload"))||false));
            this.features.push(new this.feature("Aimbot", "Digit7", parseInt(getSavedVal("utilities_Aimbot"))||false));
            this.getD3D = function(x1, y1, z1, x2, y2, z2) {
                var dx = x1 - x2;
                var dy = y1 - y2;
                var dz = z1 - z2;
                return Math.sqrt(dx * dx + dy * dy + dz * dz);
            };
            this.getDir = function(x1, y1, x2, y2) {
                return Math.atan2(y1 - y2, x1 - x2);
            };
            this.getXDire = function(x1, y1, z1, x2, y2, z2) {
                var h = Math.abs(y1 - y2);
                var dst = this.getD3D(x1, y1, z1, x2, y2, z2);
                return (Math.asin(h / dst) * ((y1 > y2) ? -1 : 1));
            };
            this.GUI = document.createElement('div');
            this.GUI.style = `visibility: visible;float:right;width:100%;background-color: rgba(0,0,0,0.25);border:4px solid #000000;padding:10px;border-radius:5%;text-align:center;margin-top:5%;`;
            this.guiReload = function() {
                this.GUI.innerHTML = "";
                if (this.GUI.style.visibility === "visible") {
                    this.GUI.innerHTML += "<p><h2 style='color:white; text-shadow: 4px 4px #000000;'> <img class='a' src='https://i.imgur.com/DqbNq4z.png' width='42' height='42'> &nbsp Gaming Guru's &nbsp <img class='a' src='https://i.imgur.com/DqbNq4z.png' width='42' height='42'> </h2><hr style='color:white'/></p>"
                    this.features.forEach((item) => {
                        this.GUI.innerHTML += `<p><span style='float:left;margin-left:10%;text-shadow: 1px 1px 0px #000000;color:rgb(216,53,255)'>[ ${item.keybind.startsWith("Digit")?item.keybind.substring(5, item.keybind.length):item.keybind} ]</span><span style='margin-left:-10%;text-shadow: 1px 1px 0px #000000;color:${item.status ? "#9eeb46" : "#eb5646"};'>${item.name}</span></p>`;
                    });
                    this.GUI.innerHTML += "<br>";
                }
            }

            // add event listeners...

            window.addEventListener("mouseup", event => {
                const btns = ["L","M","R"];
                let btn = btns[event.button];
                if (btn !== undefined) {
                    if (this.mouseBtns && this.mouseBtns.has(btn)) this.mouseBtns.delete(btn)
                }
            });

            window.addEventListener("mousedown", event => {
                const btns = ["L","M","R"];
                let btn = btns[event.button];
                if (btn !== undefined) {
                    if (this.mouseBtns && !this.mouseBtns.has(btn)) this.mouseBtns.add(btn)
                }
            });

            window.addEventListener("keyup", event => {
                if (this.downKeys && this.downKeys.has(event.code)) this.downKeys.delete(event.code)
            });

            window.addEventListener('keydown', (event) => {
                if ('INPUT' == document.activeElement.tagName || !window.endUI && window.endUI.style.display) return;
                switch (event.code) {
                    case 'F1':
                        event.preventDefault();
                        this.GUI.style.visibility = this.GUI.style.visibility == "visible" ? "hidden" : "visible";
                        window.SOUND.play('tick_0', 0.1);
                        break;
                    default:
                        if (this.downKeys && !this.downKeys.has(event.code)) {
                            this.downKeys.add(event.code);
                        }
                        this.features.forEach((item) => {
                            if (item.keybind === event.code) {
                                item.status ^= 1;
                                saveVal("utilities_" + item.name, item.status);
                            }
                        });
                        break;
                }
            });
        }

        let render = function() {
            if (!isDefined(window[skid].context)) return;
            if (!window[skid].context.clearRect[isProxy]) {
                window[skid].context.clearRect = new Proxy(window[skid].context.clearRect, {
                    apply: function(target, that, args) {
                        target.apply(that, args);
                        let Caller = arguments.callee.caller;
                        if (Caller && Caller.arguments.length == 8){
                            window[skid].renderArgs = Caller.arguments;
                        }
                    },
                    get: function(target, key) {
                        const value = Reflect.get(target, key)
                        return key === isProxy ? true : value;
                    },
                })
            }
            if (!window[skid].renderArgs) return;
            const [scale, game, controls, renderer, me, delta] = window[skid].renderArgs;
            frameCount++; if (frameCount >= 100000) frameCount = 0;
            if (frameCount % 50 == 0) {
                let topRight = document.getElementById("topRight");
                if(!topRight) return;
                if(!topRight.contains(window[skid].GUI)) {
                    topRight.appendChild(window[skid].GUI);
                } else {
                    window[skid].guiReload();
                }
            }
            if (!controls.update[isProxy]) {
                controls.update = new Proxy(controls.update, {
                    apply: function(target, that, args) {
                        if (!isDefined(that.aimTarget)) that.aimTarget = null;
                        else if (!that.target && that.aimTarget) {
                            that.object.rotation.y = that.aimTarget.yD;
                            that[vars.get("pchObjc").val].rotation.x = that.aimTarget.xD;
                            that[vars.get("pchObjc").val].rotation.x = Math.max(-halfPI, Math.min(halfPI, that[vars.get("pchObjc").val].rotation.x));
                            that.yDr = (that[vars.get("pchObjc").val].rotation.x % twoPI).round(3);
                            that.xDr = (that.object.rotation.y % twoPI).round(3);
                        }
                        return target.apply(that, args);
                    },
                    get: function(target, key) {
                        const value = Reflect.get(target, key)
                        return key === isProxy ? true : value;
                    },
                })
            }

            if (game) window[skid].game = game;
            if (me && me.active) {
                let camLookAt = function(entity) {
                    if (null === entity) return void(controls.aimTarget = null);
                    const xDire = window[skid].getXDire(game.controls.object.position.x, controls.object.position.y, controls.object.position.z, entity.pos.x, (entity.pos.y + entity.height - 1.5) - (entity[vars.get("crouchVal").val] * config.crouchDst) - me[vars.get("recoilAnimY").val] * 0.25 * 25, entity.pos.z);
                    const yDire = window[skid].getDir(controls.object.position.z, controls.object.position.x, entity.pos.z, entity.pos.x);
                    controls.aimTarget = {
                        xD: xDire,
                        yD: yDire,
                        x: entity.pos.x + config.camChaseDst || 24 * Math.sin(yDire) * Math.cos(xDire),
                        y: entity.pos.y - config.camChaseDst || 24 * Math.sin(xDire),
                        z: entity.pos.z + config.camChaseDst || 24 * Math.cos(yDire) * Math.cos(xDire)
                    }
                }
                let resetLookAt = function() {
                    controls.yDr = controls[vars.get("pchObjc").val].rotation.x;
                    controls.xDr = controls.object.rotation.y;
                    camLookAt(null);
                }
                let isValidNumber = function(num) {
                    return num !== undefined && !isNaN(parseFloat(num)) && isFinite(num) && num !== 0;
                }
                let hasPos = function(entity) {
                    return entity.hasOwnProperty('pos') && isDefined(entity.pos) && ([entity.pos.x, entity.pos.y, entity.pos.z].map(isValidNumber)) && Date.now() - entity.time < 500
                }
                let getIsFriendly = (entity) => (me && me.team ? me.team : me.spectating ? 0x1 : 0x0) == entity.team;
                let getInView = (entity) => hasPos(entity) && (null == game[vars.get("canSee").val](me, entity.pos.x, entity.pos.y, entity.pos.z));
                let enemies = game.players.list.filter(x => {
                    let obj = x[vars.get("objInstances").val];
                    if (isDefined(obj)) {
                        obj.visible = true;
                        if (window[skid].getFeature("NameTags").status||0) Object.defineProperty(x, vars.get("inView").val, {value: true, configurable: true})
                    }
                    return x.active && !x[vars.get("isYou").val] && !getIsFriendly(x) && isDefined(obj);
                })

                if (window[skid].getFeature("Aimbot").status||0) {
                    let target = enemies.filter(enemy => {
                        return getInView(enemy)
                    }).sort((p1, p2) => p1.pos.distanceTo(me) - p2.pos.distanceTo(me)).shift();
                    if (target) {
                        if (window[skid].mouseDown("R")) {
                            camLookAt(target);
                        } else resetLookAt();
                    } else resetLookAt();
                } else if (controls.aimTarget) resetLookAt();

                let obj = me[vars.get("objInstances").val];
                let chams = window[skid].getFeature("Chams").status||0;
                let wire = window[skid].getFeature("WireFrame").status||0;
                if (isDefined(obj) && obj) {
                    obj.traverse((child) => {
                        if (child && child.type == "Mesh") {
                            child.material.depthTest = chams ? false : true;
                            child.material.opacity = chams ? 0.85 : 1.0;
                            child.material.transparent = chams ? true : false;
                            child.material.fog = chams ? false : true;
                            if (child.material.emissive && frameCount % 50 == 0) {
                                child.material.emissive.r = chams ? 0.55 : 0;
                                child.material.emissive.g = chams ? 0.55 : 0;
                                child.material.emissive.b = chams ? 0.55 : 0;
                            }
                            child.material.wireframe = wire ? true : false;
                        }
                    })
                }
                let slidey = window[skid].getFeature("AutoKeySlide").status||0;
                if (slidey) {
                    if (window[skid].keyDown("Space")) {
                        controls.binds.jumpKey.val ^= 1;
                        controls.binds.crouchKey.val ^= (me.yVel < -0.04 && me.canSlide);
                    }
                }
                let reload = window[skid].getFeature("AutoReload").status||0;
                if (reload) {
                    let ammoLeft = me[vars.get("ammos").val][me[vars.get("weaponIndex").val]];
                    if (ammoLeft == 0) {
                        game.players.reload(me);
                    }
                }
            }
        }

        Object.prototype.hasOwnProperty.call = new Proxy(Object.prototype.hasOwnProperty.call, {
            apply: function(target, that, args) {
                if (args[1] == "Frustum") {
                    window[skid] = new constructor(args[0]);
                }
                return target.apply(that, args);
            }
        });

        window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
            apply: function(target, that, args) {
                render();
                return target.apply(that, args);
            },
        })
    }

    Object.defineProperty = new Proxy(Object.defineProperty, {
        apply: function(target, that, [obj, prop, descriptor]) {
            return (["WebAssembly", "WebSocket", "Uint8Array", "Uint16Array", "Uint32Array", "Int8Array", "Int16Array", "Int32Array", "Float32Array", "Float64Array"].includes(prop)) ? obj : target.apply(that, [obj, prop, descriptor]);
        }
    })

    Object.freeze = new Proxy(Object.freeze, {
        apply: function(target, that, [obj]) {
            ["WebAssembly", "WebSocket", "Uint8Array", "Uint16Array", "Uint32Array", "Int8Array", "Int16Array", "Int32Array", "Float32Array", "Float64Array"].forEach(type => {
                return obj.isPrototypeOf(window) && obj === window[type].prototype ? obj : target.apply(that, [obj]);
            })
        }
    })

    WebAssembly.instantiate = new Proxy(WebAssembly.instantiate, {
        apply: function(target, that, args) {
            window.wasm = args[1][Object.keys(args[1])];
            return target.apply(that,args);
        }
    })

    window.WebSocket = new Proxy(window.WebSocket, {
        construct: function(target, args) {
            const ws = new target(...args);
            let xorKey, offset; (async () => await fetch('https://raw.githubusercontent.com/skidlamer/krunkerOffset/master/offset.txt').then(res => res.text()).then(body => { offset = parseInt(body) || 0 }))();
            let unscramble = function (int) {
                if (!xorKey) {
                    let buffData = new DataView(window.wasm.memory.buffer);
                    xorKey = buffData.getUint32(offset, true);
                } else {
                    return (xorKey ^ (int - 15)) / 1000;
                }
                return int;
            }
            const openHandler = (event) => {
                console.log('Open', event);
            };
            const messageHandler = (event) => {
                let typedArray = new Uint8Array(event.data);
                let [id, ...data] = window.msgpack.decode(typedArray);
                if (id == "k") {
                    if (isDefined(window[skid]) && isDefined(window[skid].game)) {
                        let [pkt, sz] = data;
                        for (let i = 0, il = pkt.length; i < il; i += sz) {
                            let sid = pkt[i];
                            let player = window[skid].game.players.findBySid(sid);
                            if (player) {
                                player.pos = new window[skid].three.Vector3(unscramble(pkt[i + 1]), unscramble(pkt[i + 2]), unscramble(pkt[i + 3]));
                                player.time = Date.now();
                            }
                        }
                    }
                }
            };
            const closeHandler = (event) => {
                console.log('Close', event);
                ws.removeEventListener('open', openHandler);
                ws.removeEventListener('message', messageHandler);
                ws.removeEventListener('close', closeHandler);
            };
            ws.addEventListener('open', openHandler);
            ws.addEventListener('message', messageHandler);
            ws.addEventListener('close', closeHandler);
            return ws;
        }
    });
    AudioParam.prototype.setTargetAtTime = function(...args) {}

    function getGameScript() {
        fetch('https://krunker.io/social.html')
            .then(res => res.text())
            .then(body => /\w.exports="(\w+)"/.exec(body)[1])
            .then(build => fetch(`https://krunker.io/pkg/krunker.${build}.vries`))
            .then(res => res.arrayBuffer())
            .then(arrayBuffer => Array.from(new Uint8Array(arrayBuffer)))
            .then(array => array.map((code) => String.fromCharCode(code ^ 0xf1)))
            .then(array => array.join(''))
            .then(string => intitialize(string))
    }
    try {
        getGameScript();
    } catch(err) { throw err };
}

let observer = new window.parent.window.MutationObserver((mutations, observer) => {
    for(const mutation of mutations) {
        for (let node of mutation.addedNodes) {
            if (node.tagName == 'HEAD') {
                for (let child of node.children) {
                    if (child.tagName == 'SCRIPT') {
                        console.log(child.innerHTML)
                        observer.disconnect();
                        start([...Array(16)].map(() => Math.random().toString(36)[2]).join(''));
                    }
                }
            }
        }
    }
}).observe(document, { attributes: true, childList: true, subtree: true });