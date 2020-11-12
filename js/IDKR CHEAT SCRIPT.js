const injector = {
	name: 'injector',
	author: 'SkidLamer',
    locations: ['game'],
    wait: async (test, timeout_ms = Infinity, doWhile = null) => {
        let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        return new Promise(async (resolve, reject) => {
            if (typeof timeout_ms != "number") reject("Timeout argument not a number in waitFor(selector, timeout_ms)");
            let result, freq = 100;
            while (result === undefined || result === false || result === null || result.length === 0) {
                if (doWhile && doWhile instanceof Function) doWhile();
                if (timeout_ms % 1000 < freq) console.log("waiting for: ", test);
                if ((timeout_ms -= freq) < 0) {
                    console.log( "Timeout : ", test );
                    resolve(false);
                    return;
                }
                await sleep(freq);
                result = typeof test === "string" ? Function(test)() : test();
            }
            console.log("Passed : ", test);
            resolve(result);
        });
    },
	run: (iframe, observer) => {
        'use strict';
        class Utilities {
            constructor() {
                this.vars = {};
                this.consts = {
                    twoPI: Math.PI * 2,
                    halfPI: Math.PI / 2,
                    playerHeight: 11,
                    cameraHeight: 1.5,
                    headScale: 2,
                    armScale: 1.3,
                    armInset: 0.1,
                    chestWidth: 2.6,
                    hitBoxPad: 1,
                    crouchDst: 3,
                    recoilMlt: 0.27, //0.3,
                    nameOffset: 0.6,
                    nameOffsetHat: 0.8,
                    jumpVel: 0.072
                };
                this.settings = {
                    wallPenetrate: {
                        val: false
                    }
                }
            }
            patchScript(string) {
                const patches = new Map()
                    .set("inView", [/if\((!\w+\['\w+'])\)continue;/, "if($1&&void 0 !== window.utilities.nameTags)continue;"])
                    .set("inputs", [/(\w+\['tmpInpts']\[\w+\['tmpInpts']\['\w+']\?'\w+':'push']\()(\w+)/, `$1window.utilities.onInput($2)`])
                    .set("onRender", [/\w+\['render']=function\((\w+,\w+,\w+,\w+,\w+,\w+,\w+,\w+)\){/, `$&window.utilities.onRender($1);`])
                for (let [name, arr] of patches) {
                    let found = arr[0].exec(string);
                    if (found) { 
                        const patched = string.substr(0, found.index) + String.prototype.replace.call(string.substr(found.index, string.length), arr[0], arr[1]);
                        if (string === patched) {
                            alert(`Failed to patch ${name}`);
                            continue;
                        } else {
                            string = patched;
                        }
                    } else {
                        alert("Failed to find " + name);
                    }
                }
                return string;
            }
    
            deObfuscate(string) {
                const obfu = {
                    pchObjc: {
                        regex: /0x0,this\['(\w+)']=new \w+\['Object3D']\(\),this/,
                        pos: 1
                    },
                    didShoot: {
                        regex: /--,\w+\['(\w+)']=!0x0/,
                        pos: 1
                    },
                    nAuto: {
                        regex: /'Single\\x20Fire','varN':'(\w+)'/,
                        pos: 1
                    },
                    crouchVal: {
                        regex: /this\['(\w+)']\+=\w\['\w+']\*\w+,0x1<=this\['\w+']/,
                        pos: 1
                    },
                    recoilAnimY: {
                        regex: /this\['(\w+)']=0x0,this\['recoilForce']=0x0/,
                        pos: 1
                    },
                    isYou: {
                        regex: /0x0,this\['(\w+)']=\w+,this\['\w+']=!0x0,this\['inputs']/,
                        pos: 1
                    },
                    objInstances: {
                        regex: /\w+\['genObj3D']\(0x0,0x0,0x0\);if\(\w+\['(\w+)']=\w+\['genObj3D']/,
                        pos: 1
                    },
                };
                for (let key in obfu) {
                    let result = obfu[key].regex.exec(string);
                    if (result) {
                        window.utilities.vars[key] = result[obfu[key].pos];
                    } else {
                        const str = "Failed to find " + key;
                        alert(str);
                        window.utilities.vars[key] = null;
                    }
                }
            }
            
            getAngleDst(a, b) {
                return Math.atan2(Math.sin(b - a), Math.cos(a - b));
            };
    
            getD3D(x1, y1, z1, x2, y2, z2) {
                let dx = x1 - x2;
                let dy = y1 - y2;
                let dz = z1 - z2;
                return Math.sqrt(dx * dx + dy * dy + dz * dz);
            }
    
            getAngleDst(a, b) {
                return Math.atan2(Math.sin(b - a), Math.cos(a - b));
            }
    
            getXDire(x1, y1, z1, x2, y2, z2) {
                let h = Math.abs(y1 - y2);
                let dst = this.getD3D(x1, y1, z1, x2, y2, z2);
                return (Math.asin(h / dst) * ((y1 > y2) ? -1 : 1));
            }
    
            getDir(x1, y1, x2, y2) {
                return Math.atan2(y1 - y2, x1 - x2);
            }
    
            getDistance(x1, y1, x2, y2) {
                return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
            }
    
            getCanSee(from, toX, toY, toZ, boxSize) {
                if (!from) return 0;
                boxSize = boxSize || 0;
                for (let obj, dist = this.getD3D(from.x, from.y, from.z, toX, toY, toZ), xDr = this.getDir(from.z, from.x, toZ, toX), yDr = this.getDir(this.getDistance(from.x, from.z, toX, toZ), toY, 0, from.y), dx = 1 / (dist * Math.sin(xDr - Math.PI) * Math.cos(yDr)), dz = 1 / (dist * Math.cos(xDr - Math.PI) * Math.cos(yDr)), dy = 1 / (dist * Math.sin(yDr)), yOffset = from.y + (from.height || 0) - this.consts.cameraHeight, aa = 0; aa < this.game.map.manager.objects.length; ++aa) {
                    if (!(obj = this.game.map.manager.objects[aa]).noShoot && obj.active && !obj.transparent && (!this.settings.wallPenetrate.val || (!obj.penetrable || !this.me.weapon.pierce))) {
                        let tmpDst = this.lineInRect(from.x, from.z, yOffset, dx, dz, dy, obj.x - Math.max(0, obj.width - boxSize), obj.z - Math.max(0, obj.length - boxSize), obj.y - Math.max(0, obj.height - boxSize), obj.x + Math.max(0, obj.width - boxSize), obj.z + Math.max(0, obj.length - boxSize), obj.y + Math.max(0, obj.height - boxSize));
                        if (tmpDst && 1 > tmpDst) return tmpDst;
                    }
                }
                return null;
            }
    
            lineInRect(lx1, lz1, ly1, dx, dz, dy, x1, z1, y1, x2, z2, y2) {
                let t1 = (x1 - lx1) * dx;
                let t2 = (x2 - lx1) * dx;
                let t3 = (y1 - ly1) * dy;
                let t4 = (y2 - ly1) * dy;
                let t5 = (z1 - lz1) * dz;
                let t6 = (z2 - lz1) * dz;
                let tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
                let tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));
                if (tmax < 0) return false;
                if (tmin > tmax) return false;
                return tmin;
            }
    
            lookDir(xDire, yDire) {
                this.controls.object.rotation.y = yDire
                this.controls[this.vars.pchObjc].rotation.x = xDire;
                this.controls[this.vars.pchObjc].rotation.x = Math.max(-this.consts.halfPI, Math.min(this.consts.halfPI, this.controls[this.vars.pchObjc].rotation.x));
                this.controls.yDr = (this.controls[this.vars.pchObjc].rotation.x % Math.PI).round(3);
                this.controls.xDr = (this.controls.object.rotation.y % Math.PI).round(3);
                this.renderer.camera.updateProjectionMatrix();
                this.renderer.updateFrustum();
            }
    
            resetLookAt() {
                this.controls.yDr = this.controls[this.vars.pchObjc].rotation.x;
                this.controls.xDr = this.controls.object.rotation.y;
                this.renderer.camera.updateProjectionMatrix();
                this.renderer.updateFrustum();
            }
    
            getInView(entity) {
                return null == this.getCanSee(this.me, entity.x, entity.y, entity.z);
            }
    
            getIsFriendly(entity) {
                return (this.me && this.me.team ? this.me.team : this.me.spectating ? 0x1 : 0x0) == entity.team
            }
    
            onInput(input) {
                const key = {
                    frame: 0,
                    delta: 1,
                    ydir: 2,
                    xdir: 3,
                    moveDir: 4,
                    shoot: 5,
                    scope: 6,
                    jump: 7,
                    crouch: 8,
                    reload: 9,
                    weaponScroll: 10,
                    weaponSwap: 11,
                    moveLock: 12
                }
                if (!this.me) return input;
                let target = this.game.players.list.filter(enemy => {
                    return undefined !== enemy[this.vars.objInstances] && enemy[this.vars.objInstances] && !enemy[this.vars.isYou] && !this.getIsFriendly(enemy) && enemy.health > 0 && this.getInView(enemy)
                }).sort((p1, p2) => this.getD3D(this.me.x, this.me.z, p1.x, p1.z) - this.getD3D(this.me.x, this.me.z, p2.x, p2.z)).shift();
                if (target) {
                    let canSee = this.renderer.frustum.containsPoint(target[this.vars.objInstances].position);
                    let yDire = (this.getDir(this.me.z, this.me.x, target.z, target.x) || 0)
                    let xDire = ((this.getXDire(this.me.x, this.me.y, this.me.z, target.x, target.y + target.jumpBobY * this.consts.jumpVel - target[this.vars.crouchVal] * this.consts.crouchDst + this.me[this.vars.crouchVal] * this.consts.crouchDst, target.z) || 0) - this.consts.recoilMlt * this.me[this.vars.recoilAnimY])
                    if (this.me.weapon[this.vars.nAuto] && this.me[this.vars.didShoot]) {
                        input[key.shoot] = 0;
                        input[key.scope] = 0;
                        this.me.inspecting = false;
                        this.me.inspectX = 0;
                    } else {
                        if (input[key.scope]) {
                            if (!this.me.aimDir && canSee) {
                                input[key.ydir] = yDire * 1e3
                                input[key.xdir] = xDire * 1e3
                                this.lookDir(xDire, yDire);
                            }
                        }
                    }
                } else {
                    this.resetLookAt();
                }
                return input;
            }
    
            onRender(scale, game, controls, renderer, me) {
                this.scale = scale;
                this.game = game;
                this.controls = controls;
                this.renderer = renderer;
                this.me = me;
            }
        }
    
        observer = new MutationObserver(mutations => {
            for (let mutation of mutations) {
                for (let node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT' && node.type === "text/javascript" && node.innerHTML.startsWith("*!", 1)) {
                        node.innerHTML = `!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t){var n={onRuntimeInitialized:function(){function e(e){instructionHolder.style.display="block",instructions.innerHTML="<div style='color: rgba(255, 255, 255, 0.6)'>"+e+"</div><div style='margin-top:10px;font-size:20px;color:rgba(255,255,255,0.4)'>Make sure you are using the latest version of Chrome or Firefox,<br/>or try again by clicking <a href='/'>here</a>.</div>",instructionHolder.style.pointerEvents="all"}(async function(){"undefined"!=typeof TextEncoder&&"undefined"!=typeof TextDecoder?await n.initialize(n):e("Your browser is not supported.")})().catch(t=>{e("Failed to load game.")})}};window._debugTimeStart=Date.now(),fetch("/pkg/maindemo.wasm",{cache:"no-store"}).then(e=>e.arrayBuffer()).then(e=>{n.wasmBinary=e,fetch("/pkg/maindemo.js",{cache:"no-store"}).then(e=>e.text()).then(e=>{new Function(e)(),initWASM(n)})})}]);`
                    }
                }
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        })
    
        injector.wait(() => document).then(document => {
            iframe = document.createElement('iframe');
            iframe.setAttribute('style', 'display:none');
            iframe.src = location.origin;
            document.documentElement.appendChild(iframe);
            iframe.contentWindow.fetch = new Proxy(fetch, {
                apply(target, that, [url, opt]) {
                    const script = function(module) {
                        if (!module) location.assign(location.hostname);
                        Object.defineProperty(window, 'initWASM', {
                            value: function() {},
                            writable: false
                        });
                        module.onRuntimeInitialized();
                    }
                    if (url.startsWith("/pkg/maindemo.js")) return new Promise(resolve => resolve({
                        text: _ => `window.initWASM = ${script.toString()}`
                    }))
                    if (!url.startsWith("seek-game", 30)) return Function.prototype.apply.apply(target, [that, [url, opt]]);
                }
            })
    
            Function = new Proxy(Function, {
                construct(target, args) {
                    const that = new target(...args);
                    if (args.length) {
                        let string = args[args.length - 1];
                        if (string.length > 38e5) {
                            window.utilities = new Utilities();
                            window.utilities.deObfuscate(string);
                            string = window.utilities.patchScript(string);
                        }
                        if (args[args.length - 1] !== string) {
                            args[args.length - 1] = string;
                            let patched = new target(...args);
                            patched.toString = () => that.toString();
                            return patched;
                        }
                    }
                    return that;
                }
            })
        })
    },
}
module.exports = Object.create(injector);
