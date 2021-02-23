// ==UserScript==
// @name         [NEWEST 2021] EggFest - OP Shell Shockers Aimbot - ESP - Modmenu - By The Gaming Gurus (shellshock.io)
// @namespace    The Gaming Gurus Has Cracked It Again EggFest For The Win
// @version      0.1
// @description  A Full Featured Shell Shockers Cheat with all the sauce
// @author       SkidLamer - The Gaming Gurus
// @homepage     https://skidlamer.github.io/wp
// @supportURL   https://skidlamer.github.io/wp
// @match        https://shellshock.io/*
// @iconURL      https://i.imgur.com/PYnAlDq.png
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
  Disclaimer - Any Attempt to copy this script and discredit the owner Skid Lamer will result in a report from Greasy Fork
  If you the user violates Shockers's TOS, greasyfork and this script and creator Skid Lamer provide no legal responsibility.
  You can find me at my discord server an invite to said server is always available at : https://skidlamer.github.io/wp
*/

/* eslint-disable no-sequences */

(function(egg, eggStr) {
    'use strict';

    function Log() {
        this.info = (str, args = []) => this.log('info', str, args);
        this.warn = (str, args = []) => this.log('warn', str, args);
        this.error = (str, args = []) => this.log('error', str, args);
        this.log = (level, str, args) => {
            let color = [];
            switch(level) {
                case 'info':color=["#07a1d5", "#6e07d5"];break;
                case 'error':color=["#d50707", "#d53a07"];break;
                case 'warn':color=["#d56e07", "#d5d507"];break;
            }
            console.log('%c '.concat('[ ', level.toUpperCase(), ' ] '), [
                `background: linear-gradient(${color[0]}, ${color[1]})`
                , 'border: 1px solid #3E0E02'
                , 'color: white'
                , 'display: block'
                , 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
                , 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
                , 'line-height: 12px'
                , 'text-align: center'
                , 'font-weight: bold'
            ].join(';'))
            if (args.length) console.log(str, args);
            else console.log(str);
        }
    } var log = new Log();

    class Egg {

        constructor() {
            egg = this;
            this.config = Object.assign({}, {
                "Fake Streak": false,
                "Unlock Skins": true,
                "Aimbot": "off",
                "Is On Screen": true,
                "Line Of Sight": true,
                "Auto Reload": false,
                "Auto Swap": false,
                "Auto BHop": "off",
                "BHop Interval": 100,
                "Egg Reveal": true,
                "3d Boxes": true,
                "Enemy Color":'#ff0000ff',
                "Friend Color":'#0000ffff',
                "Names Tags": true,
                "Chams": 0,
            });
            this.downKeys = new Set();
            this.mouse = {
                left:0,middle:0,right:0
            }
            this.mainPatches = {
                players: {regex: /(\w+)\[\w+.id\]=\w+,\w+\(\)/, patch: `$&;${eggStr}.players=$1`},
                renderer: {regex: /this.canvas=document/, patch: `${eggStr}.renderer=this;$&`},
                onTick: {regex: /(render\(\))(}\)\)}var.*?document.createElement\("DIV"\))/, patch: `$1,${eggStr}.onTick()$2`},
                utils: {regex: /(init:function\(\w+\){)(.+?playerCollisionMesh)/, patch: `$1${eggStr}.utils=this;$2`},
                codec: {regex: /(idx:0,init:function\(\w+\){)/, patch: `$&${eggStr}.codec=this;`},
                buffer: {regex: /var \w+=this\.bufferPool\.retrieve\(\);/, patch: `${eggStr}.buffer=this;$&`},
                parsedUrl: {regex: /const \w+=parsedUrl.query.debug;/, patch: `var parsedUrl=parsedUrl||{query:{degug:true}};$&`},
            }

            this.css = {
                tweakPaneTheme: `:root { ${[
                    '--tp-font-family: Roboto+Mono;',
                    '.tp-rotv { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px)',
                    '--tp-base-background-color: hsla(0, 0%, 10%, 0.8)',
                    '--tp-base-shadow-color: hsla(0, 0%, 0%, 0.2)',
                    '--tp-button-background-color: hsla(0, 0%, 100%, 0.5)',
                    '--tp-button-background-color-active: hsla(0, 0%, 100%, 0.8)',
                    '--tp-button-background-color-focus: hsla(0, 0%, 100%, 0.7)',
                    '--tp-button-background-color-hover: hsla(0, 0%, 100%, 0.6)',
                    '--tp-button-foreground-color: hsla(0, 0%, 0%, 0.8)',
                    '--tp-folder-background-color: hsla(0, 0%, 0%, 0.3)',
                    '--tp-folder-background-color-active: hsla(0, 0%, 0%, 0.6)',
                    '--tp-folder-background-color-focus: hsla(0, 0%, 0%, 0.5)',
                    '--tp-folder-background-color-hover: hsla(0, 0%, 0%, 0.4)',
                    '--tp-folder-foreground-color: hsla(0, 0%, 100%, 0.5)',
                    '--tp-input-background-color: hsla(0, 0%, 0%, 0.3)',
                    '--tp-input-background-color-active: hsla(0, 0%, 0%, 0.6)',
                    '--tp-input-background-color-focus: hsla(0, 0%, 0%, 0.5)',
                    '--tp-input-background-color-hover: hsla(0, 0%, 0%, 0.4)',
                    '--tp-input-foreground-color: hsla(0, 0%, 100%, 0.5)',
                    '--tp-input-guide-color: hsla(0, 0%, 100%, 0.1)',
                    '--tp-monitor-background-color: hsla(0, 0%, 0%, 0.3)',
                    '--tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.3)',
                    '--tp-label-foreground-color: hsla(0, 0%, 100%, 0.5)',
                    '--tp-separator-color: hsla(0, 0%, 0%, 0.2)',
                ].join(';')} }`,
            };

            this.players = [];
            this.renderer = null;
            this.utils = null;
            this.codec = null;
            try {
                this.onLoad();
            }
            catch(e) {
                log.error(e);
                //document.open()
                //document.write(e.stack);
                //document.close();
                console.trace(e.stack);
            }
        }
        onLoad() {
            this.createObservers();
            this.request("/src/shellshock.js", "text", {cache: "no-store"}).then((data)=>{this.script = data; this.scriptInject(this.patchData(data, this.mainPatches))});
            //this.request("https://preview.babylonjs.com/inspector/babylon.inspector.bundle.js", "text", {cache: "no-store"}).then((data)=>this.scriptInject(data));
            this.request("https://cdn.jsdelivr.net/npm/tweakpane", "text", {cache: "no-store"}).then((data)=>this.scriptInject(data));
            this.request("https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js", "text", {cache: "no-store"}).then((data)=>this.scriptInject(data));
            this.waitFor(_=>window.WebFont).then(webfont=>{ webfont.load({ google: { families: ['Roboto+Mono:400,500,700'] } }) });

            // Add CSS
            window.onload = () => {
                Object.entries(egg.css).forEach(([name, rule]) => {
                    let css = document.createElement('style');
                    css.type = 'text/css';
                    if (css.styleSheet) css.styleSheet.cssText = rule; // Support for IE
                    else css.appendChild(document.createTextNode(rule)); // Support for the rest
                    rule = css;
                    document.getElementsByTagName("head")[0].appendChild(css);
                })
            };

            // GUI
            this.waitFor(_=>document.getElementById("pausePopup")).then(ui=>{
                this.guiDiv = this.createElement("div",{"style":`float:right; width:20%; margin-left:66%; margin-top:auto; position:absolute; opacity:1.0; z-index:100`});
                this.waitFor(_=>ui.parentNode).then(node=>{
                    node.insertBefore(this.guiDiv, ui.nextSibling);
                    this. initMenu();
                    log.info(this);
                })
            })

            this.hooking();
        }

        initMenu() {
            // Create pane
            const pane = new window.Tweakpane({
                title: 'EGGFEST - SkidLamer - Gaming Gurus',
                container: this.guiDiv
            });

            localStorage.eggFest ? Object.assign(this.config, JSON.parse(localStorage.eggFest)) : localStorage.eggFest = JSON.stringify(this.config);

            pane.addSeparator();

            // Player
            (folder => {
                folder.addInput(this.config, "Unlock Skins");
                folder.addInput(this.config, "Fake Streak");
                folder.addInput(this.config, "Auto BHop", {
                    options: {
                        "Off": 'off',
                        "Auto Jump": 'autojump',
                        "Key Jump": 'keyjump',
                    },
                });
                folder.addInput(this.config, "BHop Interval", {
                    step: 1,
                    min: 0,
                    max: 1000,
                });
            })(pane.addFolder({
                title: 'Player',
                expanded: true,
            }));

            // Weapon
            (folder => {
                folder.addInput(this.config, "Aimbot", {
                    options: {
                        "Off": 'off',
                        "Key Down": 'onKeyDown',
                        "Auto Aim": 'autoAim',
                        "Auto Shoot": 'autoShoot',
                    },
                });
                folder.addInput(this.config, "Is On Screen");
                folder.addInput(this.config, "Line Of Sight");
                folder.addInput(this.config, "Auto Reload");
                folder.addInput(this.config, "Auto Swap");

            })(pane.addFolder({
                title: 'Weapon',
                expanded: true,
            }));
            // Rendering
            (folder => {
                folder.addInput(this.config, "Egg Reveal");
                folder.addInput(this.config, "3d Boxes");
                folder.addInput(this.config, "Chams", {
                    options: {
                        "Outline": 0,
                        "Solid": 3,
                        "Wire": 1,
                    },
                });
                folder.addInput(this.config, "Enemy Color");
                folder.addInput(this.config, "Friend Color");
            })(pane.addFolder({
                title: 'Rendering',
                expanded: true,
            }));

            // Developer
            (folder => {
                folder.addButton({
                    title: 'Save Game Script',
                }).on('click', () => {
                    let blob = new Blob([this.script], {type: 'text/plain'});
                    let el = document.createElement("a");
                    el.href = URL.createObjectURL(blob);
                    el.download = "shellshock_" + window.version + ".js";
                    document.body.appendChild(el);
                    el.click();
                    document.body.removeChild(el);
                });
                folder.addButton({
                    title: 'Gaming Guru Discord',
                }).on('click', () => {
                    window.open('https://skidlamer.github.io/wp/index.html')
                });

            })(pane.addFolder({
                title: 'Developer',
                expanded: false,
            }));

            // Save Settings
            pane.on('change', (value) => {
                localStorage.eggFest = JSON.stringify(this.config);
            });
        }

        hooking() {
            //this.waitFor(_=>window.BABYLON).then(babylon=>{this.babylon=babylon});
            this.waitFor(_=>window.extern).then(ext=>{
                log.info(ext)
                let values = {};
                Object.defineProperties(ext, {
                    isItemOwned: {
                        get(){return egg.config["Unlock Skins"]?_=>true:values.isItemOwned;},
                        set(value){values.isItemOwned=value;return true;}
                    },
                })
                this.waitFor(_=>ext.account).then(acc=>{
                    Object.defineProperties(acc, {
                        hideAds: {
                            value: true,
                            writable: false
                        },
                        isItemOwned: {
                            get(){return egg.config["Unlock Skins"]?_=>true:values.isItemOwned;},
                            //set(value){vars.isItemOwned=value;return true;}
                        },
                        isUpgraded: {
                            get(){return egg.config["Unlock Skins"]?_=>true:values.isUpgraded;},
                            set(value){values.isUpgraded=value;return true;}
                        },
                    })
                })
            })
        }

        onTick() {
            if (!this.isDefined(this.me)) {
                this.me = this.players.filter(player =>("ws" in player))[0];

                this.me.scoreKill = new Proxy(this.me.scoreKill, {
                    apply(target, that, args) {
                        let value = Reflect.apply(...arguments);
                        if (egg.config["Fake Streak"]) {
                            for (let i = 0; i < 3; i++) that.beginShellStreak(i);
                        }
                        return value;
                    }
                })

                this.me.die = new Proxy(this.me.die, {
                    apply(target, that, args) {
                        that.score = 0;
                        if (!egg.config["Fake Streak"]) that.streak = 0;
                        that.deaths++;
                        that.totalDeaths++;
                        that.hp = 0;
                        that.playing = false;
                        that.removeFromPlay();
                    }
                })

            } else {

                // Auto Reload
                if (this.config["Auto Reload"] && 0 == this.me.weapon.ammo.rounds && 0 != this.me.weapon.ammo.store) this.me.reload();

                // Auto Swap
                if (this.config["Auto Swap"] && 0 == this.me.weapon.ammo.rounds) this.me.reload(), this.me.swapWeapon(0 == this.me.weaponIdx ? 1 : 0);

                // Auto bHop
                 if (this.config["Auto BHop"] != "off" && this.me.canJump()) {
                    setTimeout(() => {
                        if (this.config["Auto BHop"] == "autojump" || this.isKeyDown("Space")) this.me.jump();
                    }, this.config["BHop Interval"]||0);
                }

                // Player List
                if (!this.isDefined(this.cam)) this.cam = this.getCameraByID("camera");
                var target = this.players.filter(player => {

                    var boxInfo = player.actor.bodyMesh.getBoundingInfo();
                    var isNotMe = player.uniqueId != this.me.uniqueId;
                    var isHostile = !this.me.team || this.me.team != player.team;
                    var canSee = boxInfo && boxInfo.isCompletelyInFrustum(this.me.scene.frustumPlanes);

                    // Rendering Stuff
                    if (player && isNotMe && !player.isDead()) {

                        let ecl = this.config["Enemy Color"].length;
                        let enemyColor = ecl == 9 ? window.BABYLON.Color4.FromHexString(this.config["Enemy Color"]) : window.BABYLON.Color4();
                        let friendColor = ecl == 9 ? window.BABYLON.Color4.FromHexString(this.config["Friend Color"]) : window.BABYLON.Color4();
                        let enemyColor3 = window.BABYLON.Color3.FromHexString(ecl == 9 ? this.config["Enemy Color"].slice(0, -2) : ecl == 7 ? this.config["Enemy Color"] : "#FFFFFF");
                        let friendColor3 = window.BABYLON.Color3.FromHexString(ecl == 9 ? this.config["Friend Color"].slice(0, -2) : ecl == 7 ? this.config["Friend Color"] : "#FFFFFF");
                        let boundingBoxRenderer = this.me.scene.getBoundingBoxRenderer();
                        boundingBoxRenderer.frontColor = enemyColor3
                        boundingBoxRenderer.backColor = enemyColor3
                        player.actor.bodyMesh.showBoundingBox = this.config["3d Boxes"] && isHostile;

                        // See the Eggs mesh through walls
                        const value = { value:this.config["Egg Reveal"] && isHostile ? 1 : 0, configurable: true }
                        this.define(player.actor.bodyMesh, "renderOutline", { value:true, configurable: true });
                        this.define(player.actor.bodyMesh, "outlineColor", { value: isHostile ? enemyColor : friendColor, configurable: true });
                        this.define(player.actor.mesh, "renderingGroupId", value);
                        this.define(player.actor.bodyMesh, "renderingGroupId", value);
                        this.define(player.actor.eye, "renderingGroupId", value);
                        this.define(player.actor.foreBone, "renderingGroupId", value);
                        this.define(player.actor.gripBone, "renderingGroupId", value);
                        this.define(player.actor.gunContainer, "renderingGroupId", value);
                        this.define(player.actor.hands, "renderingGroupId", value);
                        this.define(player.actor.hat, "renderingGroupId", value);
                        this.define(player.actor.head, "renderingGroupId", value);

                        if (player.actor.bodyMesh.material) {
                            Object.defineProperties(player.actor.bodyMesh.material, {
                                fogEnabled: {
                                    value:!this.config["Egg Reveal"], configurable: true
                                },
                                disableDepthWrite: {
                                    value:true, configurable: true
                                },
                                fillMode: {
                                    value: this.config.Chams, configurable: true
                                }
                            })
                        }
                    }

                    return player && isNotMe && isHostile && !player.isDead() && (this.config["Is On Screen"] && canSee || !this.config["Is On Screen"])
                }).sort((p1, p2) => window.BABYLON.Vector3.Distance(this.me, p1) - window.BABYLON.Vector3.Distance(this.me, p2)).shift()
                // Auto Aim
                if (target) {

                    if (this.config.Aimbot != "off") {
                        if (this.cam) {
                            if (this.utils.ray.origin.copyFrom(this.me.actor.eye.getAbsolutePosition()), this.utils.ray.direction.copyFrom(this.cam.forwardRay.direction.scaleInPlace(1e3)), this.utils.ray.length = Infinity, target.actor) {
                                let hitPos = this.utils.rayCollidesWithPlayerHelper(this.utils.ray, target);
                                let didHit = (this.config["Line Of Sight"]&&hitPos||!this.config["Line Of Sight"] && !this.me.reloadCountdown && this.me.weapon.ammo.rounds);
                                switch(this.config.Aimbot) {
                                    case "onKeyDown":
                                        if (didHit && this.me.actor.scope) {
                                            this.setPitchYaw(target);
                                        }
                                        break;
                                    case "autoAim":
                                        if (didHit) this.setPitchYaw(target);
                                        break;
                                    case "autoShoot":
                                        if (didHit) {
                                            this.setPitchYaw(target);
                                            this.me.actor.scopeIn();
                                            this.me.pullTrigger();
                                            this.me.actor.scopeOut();
                                        }
                                        break;
                                }
                            }
                        }
                    }
                }
            }
        }

        createElement(element, attribute, inner) {
            if (!this.isDefined(element)) {
                return null;
            }
            if (!this.isDefined(inner)) {
                inner = "";
            }
            let el = document.createElement(element);
            if (this.isType(attribute, 'object')) {
                for (let key in attribute) {
                    el.setAttribute(key, attribute[key]);
                }
            }
            if (!Array.isArray(inner)) {
                inner = [inner];
            }
            for (let i = 0; i < inner.length; i++) {
                if (inner[i].tagName) {
                    el.appendChild(inner[i]);
                } else {
                    el.appendChild(document.createTextNode(inner[i]));
                }
            }
            return el;
        }

        createObservers() {
            var observer = new MutationObserver(mutations => {
                for (let mutation of mutations) {
                    for (let node of mutation.addedNodes) {
                        if (node.tagName === "SCRIPT") {
                            if (node.integrity||node.src.includes("https://shellshock.io/src/shellshock")) {
                                log.info("Blocking Script Load")
                                if (node.parentNode) {
                                    node.parentNode.removeChild(node);
                                } else {
                                    node.removeAttribute("textContent");
                                    node.removeAttribute("integrity");
                                    node.removeAttribute("src");
                                }
                            }
                        }
                    }
                }
            });
            observer.observe(document, {
                childList: true,
                subtree: true
            });
            addEventListener('keyup', event =>{
                if (this.downKeys.has(event.code)) this.downKeys.delete(event.code)
            });
            addEventListener('keydown', event =>{
                if ('INPUT' == document.activeElement.tagName) return;
                switch (event.code) {
                    case 'F1':
                        event.preventDefault();
                        window.BAWK.play('ui_reset');
                        if (egg.guiDiv.style.display=="inherit") {
                            egg.guiDiv.style.display="none";
                            window.canvas.requestPointerLock();
                        }
                        else if (egg.guiDiv.style.display=="none") {
                            egg.guiDiv.style.display="inherit";
                            document.exitPointerLock();
                        }
                        break;

                    case 'NumpadSubtract':
                        document.exitPointerLock();
                        log.info(window)
                        log.info(this)
                        break;
                    case 'NumpadAdd':
                        if (this.isDefined(this.me.scene)) {
                            console.dir(this.me.scene.debugLayer)
                            if (this.me.scene.debugLayer.isVisible()) this.me.scene.debugLayer.hide();
                            else this.me.scene.debugLayer.show();
                        }
                        break;
                    default:
                        if (!this.downKeys.has(event.code)) this.downKeys.add(event.code);
                        break;
                }
            });
            addEventListener("mouseup", event => {
                switch (event.button) {
                    case 0:
                        this.mouse.left = 0;
                        if (this.me) this.me.releaseTrigger();
                        break;
                    case 1:
                        this.mouse.middle = 0;
                        break;
                    case 2:
                        this.mouse.right = 0;
                        if (this.me && this.isDefined(this.me.actor) && this.me.actor.scope) this.me.actor.scopeOut();
                        break;
                    default:
                        break;
                }
            })

            addEventListener("mousedown", event => {
                switch (event.button) {
                    case 0:
                        this.mouse.left = 1;
                        if (this.me) this.me.pullTrigger();
                        break;
                    case 1:
                        this.mouse.middle = 1;
                        break;
                    case 2:
                        this.mouse.right = 1;
                        if (this.me && this.isDefined(this.me.actor)) this.me.actor.scopeIn();
                        break;
                    default:
                        break;
                }
            })

            if ("onpointerlockchange" in document) {
                document.addEventListener('pointerlockchange', lockChangeAlert, false);
            } else if ("onmozpointerlockchange" in document) {
                document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
            }

            function lockChangeAlert() {
                if(document.pointerLockElement&&document.pointerLockElement.id === "canvas" ||
                   document.mozPointerLockElement&&document.mozPointerLockElement.id === "canvas") {
                    log.info('The pointer lock status is now locked');
                    egg.guiDiv.style.display="none";
                } else {
                    log.info('The pointer lock status is now unlocked');
                    egg.guiDiv.style.display="inherit";
                }
            }

            document.onreadystatechange = () => {
                if (document.readyState == "complete") {
                    observer.disconnect();
                }
            }
        }

        scriptInject(data) {
            try {
                var script = document.createElement("script");
                script.appendChild(document.createTextNode(data));
                (document.head || document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script);
            } catch (ex) {}
            if (script) {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
                script.textContent = "";
            }
        }

        patchData(data, patches) {
            for(let name in patches) {
                let object = patches[name];
                let found = object.regex.exec(data);
                if (found) {
                    data = data.replace(object.regex, object.patch);
                    log.info("Patched ", name);
                } else alert("Failed to Patch " + name);
            }
            return data;
        }

        async request(url, type, opt = {}) {
            const res = await fetch(url, opt);
            if (res.ok) return res[type]();
            return this.request(url, type, opt);
        }

        async waitFor(test, timeout_ms = Infinity, doWhile = null) {
            let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            return new Promise(async (resolve, reject) => {
                if (typeof timeout_ms != "number") reject("Timeout argument not a number in waitFor(selector, timeout_ms)");
                let result, freq = 100;
                while (result === undefined || result === false || result === null || result.length === 0) {
                    if (doWhile && doWhile instanceof Function) doWhile();
                    if (timeout_ms % 1e4 < freq) log.warn("waiting for: ", test);
                    if ((timeout_ms -= freq) < 0) {
                        log.error( "Timeout : ", test );
                        resolve(false);
                        return;
                    }
                    await sleep(freq);
                    result = typeof test === "string" ? Function(test)() : test();
                }
                log.info("Passed : ", test);
                resolve(result);
            });
        };

        isType(item, type) {
            return typeof item === type;
        }

        isDefined(item) {
            return !this.isType(item, "undefined") && item !== null;
        }

        define(target, key, object) {
            if(target && this.isType(target, "object")) {
                return Object.defineProperty(target, key, object);
            }
            return null;
        }

        isKeyDown(key) {
            return this.downKeys.has(key);
        }

        getCameraByID(id) {
            let cam = this.me.scene.activeCamera;
            if (cam && cam.id == id) return cam;
            else {
                let arr = this.me.scene.activeCameras;
                if (!arr.length) {
                    arr = this.me.scene.cameras;
                    if (!arr.length) return null;
                } else {
                    for (const cam of arr){
                        if (cam && cam.id == id) return cam;
                    }
                }
            }
        }

        setPitchYaw(target, yOffset = 0) {
            let delta = new window.BABYLON.Vector3((this.me.x - target.x), (this.me.y - target.y + yOffset), (this.me.z - target.z));
            let angle = -Math.PI/2 - Math.atan2(delta.z, delta.x);
            if (angle < 0) angle += Math.PI * 2;
            else if (angle - Math.PI * 2 > 0) angle -= Math.PI * 2;
            this.me.yaw = angle;
            this.me.pitch = Math.atan2(delta.y, Math.sqrt(delta.x * delta.x + delta.z * delta.z));
        }
    }
    window[eggStr] = new Egg();
})(null,[...Array(8)].map(_ => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[~~(Math.random()*52)]).join(''));
