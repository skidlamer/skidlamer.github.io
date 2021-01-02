(function(krStr = [...Array(8)].map(_ => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[~~(Math.random()*52)]).join(''), kr = null){

            class Krunker {
                constructor() {
                    this.vars = {};
                    this.settings = {
                        autoReload: true,
                        autoBhop: "keySlide",
                        nametags: true,
                        wallbangs: true,
                        skinUnlock: true,
                    };
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
                        recoilMlt: 0.3,
                        nameOffset: 0.6,
                        nameOffsetHat: 0.8,
                    };
                    this.isProxy = Symbol("isProxy");
                    this.downKeys = new Set();
                    this.listeners();
                    this.onLoad();
                }
        
                isType(item, type) {
                    return typeof item === type;
                }
        
                isDefined(object) {
                    return !this.isType(object, "undefined") && object !== null;
                }
        
                isNative(fn) {
                    return (/^function\s*[a-z0-9_\$]*\s*\([^)]*\)\s*\{\s*\[native code\]\s*\}/i).test('' + fn)
                }
        
                objectHas(obj, arr) {
                     return arr.some(prop => obj.hasOwnProperty(prop));
                }
        
                isKeyDown(key) { // Using Event.Code => https://keycode.info/
                    return this.downKeys.has(key);
                }
        
                canStore() {
                    return this.isDefined(Storage);
                }
        
                saveVal(name, val) {
                    if (this.canStore()) localStorage.setItem("kro_custom_" + name, val);
                }
        
                deleteVal(name) {
                    if (this.canStore()) localStorage.removeItem("kro_custom_" + name);
                }
        
                getSavedVal(name) {
                    if (this.canStore()) return localStorage.getItem("kro_custom_" + name);
                    return null;
                }
        
                getVersion() {
                    const elems = document.getElementsByClassName('terms');
                    const version = elems[elems.length - 1].innerText;
                    return version;
                }
        
                saveAs(name, data) {
                    let blob = new Blob([data], {type: 'text/plain'});
                    let el = window.document.createElement("a");
                    el.href = window.URL.createObjectURL(blob);
                    el.download = name;
                    window.document.body.appendChild(el);
                    el.click();
                    window.document.body.removeChild(el);
                }
        
                saveScript() {
                    this.fetchScript().then(script => {
                        this.saveAs("game_" + this.getVersion() + ".js", script)
                    })
                }
        
                async request(url, type, opt = {}) {
                    return fetch(url, opt).then(response => {
                        if (!response.ok) {
                            throw new Error("Network response from " + url + " was not ok")
                        }
                        return response[type]()
                    })
                }
        
                async fetchScript() {
                    const data = await this.request("https://krunker.io/social.html", "text");
                    const buffer = await this.request("https://krunker.io/pkg/krunker." + /\w.exports="(\w+)"/.exec(data)[1] + ".vries", "arrayBuffer");
                    const array = Array.from(new Uint8Array(buffer));
                    const xor = array[0] ^ '!'.charCodeAt(0);
                    return array.map((code) => String.fromCharCode(code ^ xor)).join('');
                }
        
                async waitFor(test, timeout_ms = 20000, doWhile = null) {
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
                };
        
                async onLoad() {
        
                    // Fetch and Load Game Script
                    const script = await this.fetchScript();
                    const loader = new Function("__LOADER__mmTokenPromise", "Module", this.gameJS(script));
                    loader(this.request("https://cli.sys32.dev/token", "json").then(json => { console.log("Token: ", json.token); return json.token }), { csv: async () => 0 });
        
                    // Find And Use Objects From Exports
                    await this.waitFor(_=>this.isDefined(this.exports))
                    console.dir(this.exports); // So you can look through it to find Object keys to search for;
                    let toFind = {
                        overlay: ["render", "canvas"],
                        config: ["accAnnounce", "availableRegions", "assetCat"],
                        three: ["ACESFilmicToneMapping", "TextureLoader", "ObjectLoader"],
                        ws: ["socketReady", "ingressPacketCount", "ingressPacketCount", "egressDataSize"],
                    }
                    for (let rootKey in this.exports) {
                        let exp = this.exports[rootKey].exports;
                        for (let name in toFind) {
                            if (this.objectHas(exp, toFind[name])) {
                                console.log("Found Export ", name);
                                delete toFind[name];
                                kr[name] = exp;
                            }
                        }
                    }
                    if (!(Object.keys(toFind).length === 0 && toFind.constructor === Object)) {
                        for (let name in toFind) {
                            alert("Failed To Find Export " + name);
                        }
                    } else {
                        await this.waitFor(_=>this.isDefined(this.overlay.render))
                        this.overlay.render = new Proxy(this.overlay.render, {
                            apply(target, that, args) {
                                ["scale", "game", "controls", "renderer", "me"].forEach((item, index)=>{
                                    kr[item] = args[index];
                                }); if (kr.me) {
                                    kr.ctx = kr.overlay.canvas.getContext('2d');
                                    kr.ctx.save();
                                    kr.ctx.scale(kr.scale, kr.scale);
                                    let width = kr.overlay.canvas.width / kr.scale;
                                    let height = kr.overlay.canvas.height / kr.scale;
                                    //kr.ctx.clearRect(0, 0, width, height); //this will clear your drawing so leave commented
                                    kr.onRender();
                                    kr.ctx.restore();
                                }
                                return Reflect.apply(...arguments);
                            }
                        })
        
                        await this.waitFor(_=>this.isDefined(this.ws))
                        await this.waitFor(_=>this.ws.connected === true)
                        this.wsEvent = this.ws._dispatchEvent.bind(this.ws);
                        this.wsSend = this.ws.send.bind(this.ws);
                        this.ws.send = new Proxy(this.ws.send, {
                            apply(target, that, args) {
                                if (args[0] === "en") {
                                    that.skinCache = {
                                        main: args[1][2][0],
                                        secondary: args[1][2][1],
                                        hat: args[1][3],
                                        body: args[1][4],
                                        knife: args[1][9],
                                        dye: args[1][14],
                                        waist: args[1][17],
                                    }
                                }
                                return Reflect.apply(...arguments);
                            }
                        })
                        this.ws._dispatchEvent = new Proxy(this.ws._dispatchEvent, {
                            apply(target, that, args) {
                                if (kr.settings.skinUnlock && that.skinCache && args[0] === "0") {
                                    let pInfo = args[1][0];
                                    let pSize = 38;
                                    while (pInfo.length % pSize !== 0) pSize++;
                                    for(let i = 0; i < pInfo.length; i += pSize) {
                                        if (pInfo[i] === that.socketId||0) {
                                            pInfo[i + 12] = [that.skinCache.main, that.skinCache.secondary];
                                            pInfo[i + 13] = that.skinCache.hat;
                                            pInfo[i + 14] = that.skinCache.body;
                                            pInfo[i + 19] = that.skinCache.knife;
                                            pInfo[i + 24] = that.skinCache.dye;
                                            pInfo[i + 33] = that.skinCache.waist;
                                        }
                                    }
                                }
        
                                return target.apply(that, args);
                            }
                        })
                        // Skins
                        const $origSkins = Symbol("origSkins");
                        const $localSkins = Symbol("localSkins");
                        Object.defineProperty(Object.prototype, "skins", {
                            set: function(fn) {
                                this[$origSkins] = fn;
                                if (void 0 == this.localSkins || !this.localSkins.length) {
                                    this[$localSkins] = Array.apply(null, Array(5e3)).map((x, i) => {
                                        return {
                                            ind: i,
                                            cnt: 0x1,
                                        }
                                    })
                                }
                                return fn;
                            },
                            get: function() {
                                return kr.settings.skinUnlock && this.stats ? this[$localSkins] : this[$origSkins];
                            }
                        })
        
                    }
                }
        
                gameJS(script) {
                    let entries = {
                        inView: {
                            regex: /(\w+\['(\w+)']\){if\(\(\w+=\w+\['\w+']\['position']\['clone']\(\))/,
                            index: 2
                        },
                        procInputs: {
                            regex: /this\['(\w+)']=function\((\w+),(\w+),\w+,\w+\){(this)\['recon']/,
                            index: 1
                        },
                        aimVal: {
                            regex: /this\['(\w+)']-=0x1\/\(this\['weapon']\['\w+']\/\w+\)/,
                            index: 1
                        },
                        didShoot: {
                            regex: /--,\w+\['(\w+)']=!0x0/,
                            index: 1
                        },
                        nAuto: {
                            regex: /'Single\\x20Fire','varN':'(\w+)'/,
                            index: 1
                        },
                        crouchVal: {
                            regex: /this\['(\w+)']\+=\w\['\w+']\*\w+,0x1<=this\['\w+']/,
                            index: 1
                        },
                        ammos: {
                            regex: /\['length'];for\(\w+=0x0;\w+<\w+\['(\w+)']\['length']/,
                            index: 1
                        },
                        weaponIndex: {
                            regex: /\['weaponConfig']\[\w+]\['secondary']&&\(\w+\['(\w+)']==\w+/,
                            index: 1
                        },
                        objInstances: {
                            regex: /\(\w+=\w+\['players']\['list']\[\w+]\)\['active']&&\w+\['(\w+)']\)/,
                            index: 1
                        },
                        reloadTimer: {
                            regex: /this\['(\w+)']&&\(\w+\['\w+']\(this\),\w+\['\w+']\(this\)/,
                            index: 1
                        },
                        recoilAnimY: {
                            regex: /this\['(\w+)']\+=this\['\w+']\*\(/,
                            index: 1
                        },
                        maxHealth: {
                            regex: /this\['health']\/this\['(\w+)']\?/,
                            index: 1
                        },
                        // Patches
                        frustum: {
                            regex: /(;const (\w+)=this\['frustum']\['containsPoint'];.*?return)!0x1/,
                            patch: "$1 $2"
                        },
                        videoAds: {
                            regex: /!function\(\){var \w+=document\['createElement']\('script'\);.*?}\(\);/,
                            patch: ""
                        },
                        anticheat1: {
                            regex: /(\[]instanceof Array;).*?(var)/,
                            patch: "$1 $2"
                        },
                        anticheat2: {
                            regex: /windows\['length'\]>\d+.*?0x25/,
                            patch: "0x25"
                        },
                        writeable: {
                            regex: /'writeable':!0x1/g,
                            patch: "writeable:true"
                        },
                        configurable: {
                            regex: /'configurable':!0x1/g,
                            patch: "configurable:true"
                        },
                        typeError: {
                            regex: /throw new TypeError/g,
                            patch: "console.error"
                        },
                        error: {
                            regex: /throw new Error/g,
                            patch: "console.error"
                        },
                        exports: {
                            regex: /(this\['\w+']\['\w+']\(this\);};},function\(\w+,\w+,(\w+)\){)/,
                            patch: `$1 ${krStr}.exports=$2.c; ${krStr}.modules=$2.m;`
                        },
                        inputs: {
                            regex: /(\w+\['\w+']\[\w+\['\w+']\['\w+']\?'\w+':'push']\()(\w+)\),/,
                            patch: `$1${krStr}.onInput($2)),`
                        },
                        nametags: {
                            regex: /&&(\w+\['\w+'])\){(if\(\(\w+=\w+\['\w+']\['\w+']\['\w+'])/,
                            patch: `){if(!$1&&!${kr.settings.nametags})continue;$2`
                        },
                        wallbangs: {
                            regex: /!(\w+)\['transparent']/,
                            patch: `${kr.settings.wallbangs}?!$1.penetrable : !$1.transparent`
                        }
                    }
        
                    for(let name in entries) {
                        let object = entries[name];
                        let found = object.regex.exec(script);
                        if (object.hasOwnProperty('index')) {
                            if (!found) {
                                object.val = null;
                                alert("Failed to Find " + name);
                            } else {
                                object.val = found[object.index];
                                console.log ("Found ", name, ":", object.val);
                            }
                            Object.defineProperty(kr.vars, name, {
                                configurable: false,
                                value: object.val
                            });
                        } else if (found) {
                            script = script.replace(object.regex, object.patch);
                            console.log ("Patched ", name);
                        } else alert("Failed to Patch " + name);
                    }
        
                    return script;
                }
        
                listeners() {
                    document.addEventListener("keydown", event => {
                        if (event.code == "F1") {
                            event.preventDefault();
                            //this.toggleMenu();
                        }
                        if ('INPUT' == document.activeElement.tagName || !window.endUI && window.endUI.style.display) return;
                        switch (event.code) {
                            case 'NumpadSubtract':
                                document.exitPointerLock();
                                console.dirxml(this)
                                break;
                            case 'NumpadAdd':
                                document.exitPointerLock();
                                this.saveScript();
                                break;
                            default:
                                if (!this.downKeys.has(event.code)) this.downKeys.add(event.code);
                                break;
                        }
                    });
                    document.addEventListener("keyup", event => {
                        if (this.downKeys.has(event.code)) this.downKeys.delete(event.code)
                    });
                    document.addEventListener("mouseup", event => {
                        switch (event.button) {
                            case 1:
                                event.preventDefault();
                                break;
                            default:
                                break;
                        }
                    });
                }
        
                getDistance(x1, y1, x2, y2) {
                    return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
                }
        
                getDistance3D(x1, y1, z1, x2, y2, z2) {
                    let dx = x1 - x2;
                    let dy = y1 - y2;
                    let dz = z1 - z2;
                    return Math.sqrt(dx * dx + dy * dy + dz * dz);
                }
        
                getXDir(x1, y1, z1, x2, y2, z2) {
                    let h = Math.abs(y1 - y2);
                    let dst = this.getDistance3D(x1, y1, z1, x2, y2, z2);
                    return (Math.asin(h / dst) * ((y1 > y2)?-1:1));
                }
        
                getDir(x1, y1, x2, y2) {
                    return Math.atan2(y1 - y2, x1 - x2);
                }
        
                getAngleDist(a, b) {
                    return Math.atan2(Math.sin(b - a), Math.cos(a - b));
                }
        
                onRender() {
                    //Draw Your Shit Here
                }
        
                onInput(input) {
                    if (!this.isDefined(this.me)) return input;
                    if (this.isDefined(this.config) && this.config.aimAnimMlt) this.config.aimAnimMlt = 1;
                    const key = { frame: 0, delta:1,xdir:2,ydir:3,moveDir:4,shoot:5,scope:6,jump:7,reload:8,crouch:9,weaponScroll:10,weaponSwap:11, moveLock:12}
                    let isMelee = this.isDefined(this.me.weapon.melee)&&this.me.weapon.melee||this.isDefined(this.me.weapon.canThrow)&&this.me.weapon.canThrow;
        
                    // autoReload
                    if (this.settings.autoReload) {
                        let ammoLeft = this.me[this.vars.ammos][this.me[this.vars.weaponIndex]];
                        if (!isMelee && !ammoLeft) {
                            this.game.players.reload(this.me);
                            input[key.reload] = 1;
                            this.me[this.vars.reload] = 0;
                        }
                    }
        
                    //Auto Bhop
                    let autoBhop = this.settings.autoBhop;
                    if (autoBhop !== "off") {
                        if (this.isKeyDown("Space") || autoBhop == "autoJump" || autoBhop == "autoSlide") {
                            this.controls.keys[this.controls.binds.jumpKey.val] ^= 1;
                            if (this.controls.keys[this.controls.binds.jumpKey.val]) {
                                this.controls.didPressed[this.controls.binds.jumpKey.val] = 1;
                            }
                            if (this.isKeyDown("Space") || autoBhop == "autoSlide") {
                                if (this.me[this.vars.yVel] < -0.03 && this.me.canSlide) {
                                    setTimeout(() => {
                                        this.controls.keys[this.controls.binds.crouchKey.val] = 0;
                                    }, this.me.slideTimer||325);
                                    this.controls.keys[this.controls.binds.crouchKey.val] = 1;
                                    this.controls.didPressed[this.controls.binds.crouchKey.val] = 1;
                                }
                            }
                        }
                    }
        
                    let target = this.game.players.list.filter(enemy => {
                        return !enemy.isYTMP && (this.me.team === null || enemy.team !== this.me.team) && enemy.health > 0 && enemy[this.vars.inView]
                    }).sort((p1, p2) => this.getDistance(this.me.x, this.me.z, p1.x, p1.z) - this.getDistance(this.me.x, this.me.z, p2.x, p2.z)).shift();
                    if (target) {
                        let canSee = this.renderer.frustum.containsPoint(target[this.vars.objInstances].position);
                        let yDire = (this.getDir(this.me.z, this.me.x, target.z, target.x) || 0)
                        let xDire = ((this.getXDir(this.me.x, this.me.y, this.me.z, target.x, target.y - target[this.vars.crouchVal] * this.consts.crouchDst + this.me[this.vars.crouchVal] * this.consts.crouchDst, target.z) || 0) - this.consts.recoilMlt * this.me[this.vars.recoilAnimY])
                        if (this.me.weapon[this.vars.nAuto] && this.me[this.vars.didShoot]) {
                            input[key.shoot] = 0;
                            input[key.scope] = 0;
                            this.me.inspecting = false;
                            this.me.inspectX = 0;
                        }
                        else {
                            input[key.scope] = 1;
                            if (!this.me[this.vars.aimVal]) {
                                if (!this.me.canThrow||!isMelee) input[key.shoot] = 1;
                            } else input[key.scope] = 1;
                            input[key.ydir] = yDire * 1e3
                            input[key.xdir] = xDire * 1e3
                        }
                    }
        
                    return input; // You must Return here as Im Hooked into the array push.
                }
        
            }; 
            
            kr = window[krStr] = new Krunker();
            
        })();