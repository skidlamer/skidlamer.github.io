// ==UserScript==
// @name EggFest - OP Shell Shockers shellshock.io Aimbot - ESP - Modmenu - By The Gaming Gurus 2021
// @namespace The Gaming Gurus Has Cracked It Again EggFest For The Win
// @version 0.2
// @description A Full Featured Shell Shockers Cheat with all the sauce
// @author SkidLamer - The Gaming Gurus
// @homepage https://skidlamer.github.io/wp
// @supportURL https://skidlamer.github.io/wp
// @match https://shellshock.io/*
// @iconURL https://i.imgur.com/PYnAlDq.png
// @run-at document-start
// @grant none
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
            let colour = [];
            switch(level) {
                case 'info':colour=["#07a1d5", "#6e07d5"];break;
                case 'error':colour=["#d50707", "#d53a07"];break;
                case 'warn':colour=["#d56e07", "#d5d507"];break;
            }
            console.log('%c '.concat('[ ', level.toUpperCase(), ' ] '), [
                `background: linear-gradient(${colour[0]}, ${colour[1]})`
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
                "Line Of Sight": true,
                "Aim Offset": -0.2,
                "Auto Reload": false,
                "Auto Swap": false,
                "Auto BHop": "off",
                "BHop Interval": 100,
                "Egg Reveal": true,
                "3d Boxes": true,
                "Enemy Colour":'#ff0000',
                "Friend Colour":'#0000ff',
                "Names Tags": true,
                "Chams": 0,
                "forceWireframe": false,
                "forcePointsCloud": false,
                "forceShowBoundingBoxes": false,
                "particlesEnabled": true,
                "shadowsEnabled": true,
                "spritesEnabled": true,
            });
            this.swapOrReload = "reload";
            this.downKeys = new Set();
            this.mouse = {
                left:0,middle:0,right:0
            }
            this.mainPatches = {
                playerList: {regex: /(\w+)\[\w+.id\]=\w+,\w+\(\)/, patch: `$&;${eggStr}.playerList=$1`},
                renderer: {regex: /this.canvas=document/, patch: `${eggStr}.renderer=this;$&`},
               // onRender: {regex: /(render\(\))(}\)\)}var.*?document.createElement\("DIV"\))/, patch: `$1,${eggStr}.onRender()$2`},
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

            this.playerList = [];
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
                folder.addInput(this.config, "Line Of Sight");
                folder.addInput(this.config, "Aim Offset", {
                    min: -1.0,
                    max: 1.0,
                    step: 0.1,
                });
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
                folder.addInput(this.config, "Enemy Colour");
                folder.addInput(this.config, "Friend Colour");
            })(pane.addFolder({
                title: 'Rendering',
                expanded: true,
            }));

            // Developer
            (folder => {
                ["forceWireframe", "forcePointsCloud", "forceShowBoundingBoxes", "particlesEnabled", "shadowsEnabled", "spritesEnabled"].map(val=>{
                    folder.addInput(this.config, val);
                });

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
                this.waitFor(_=>ext.inGame).then(_=>{
                    log.info("Game Started");
                    this.waitFor(_=>this.playerList).then(_=>{
                        this.waitFor(_=>this.me, Infinity, _=> { this.me = this.playerList.filter(player =>("ws" in player))[0] }).then(me=>{
                            this.me.scene.onBeforeRenderObservable.add(this.render);

                           // this.waitFor(_=> this.eggShell, Infinity, _=> { this.eggShell = this.me.scene.getMaterialByID("eggShell") }).then(eggShell=>{
                            //   eggShell.disableDepthWrite = true;
                           // });

                            //if (this.me.scene.getMeshByID("eggShell")) alert()

                            //this.me.scene.getMeshByName("eggShell");
                            //this.me.scene.debugLayer.show();
                            //let foo = this.me.scene.getBoundingBoxRenderer();
                            //console.dir(foo)
                           // alert()
                           // let alternate = true;
                           // foo.onBeforeBoxRenderingObservable.add(() => {
                             //   foo.frontColor = alternate ? new window.BABYLON.Color3(255,0, 0) : new window.BABYLON.Color3(0, 255, 0);
                             //   alternate = !alternate;
                            //})


                            const tickRate = 1000 / 60; let then = Date.now();
                            const tick = _=> {
                                window.requestAnimationFrame(tick);
                                if (this.me && !this.me.isDead()) {
                                    if (!this.isDefined(this.cam)) this.cam = this.getCameraByID("camera");
                                    this.players = this.playerList.filter(entity => entity.uniqueId != this.me.uniqueId && !entity.isDead() && entity.actor);
                                    const target = this.players.filter(entity => !this.me.team || this.me.team != entity.team).sort((p1, p2) => window.BABYLON.Vector3.Distance(this.me, p1) - window.BABYLON.Vector3.Distance(this.me, p2)).shift();
                                    if (this.config.Aimbot != "off" && target) {
                                        let boxInfo = target.actor.bodyMesh.getBoundingInfo();
                                        if (boxInfo && boxInfo.isCompletelyInFrustum(this.me.scene.frustumPlanes)) {
                                            let hitPos = this.rayCollidesWithPlayer(this.me.actor.eye.getAbsolutePosition(), this.cam.forwardRay.direction.scaleInPlace(window.BABYLON.Vector3.Distance(this.me, target)), target)
                                            if (hitPos) this.aimBot(target);
                                        }
                                    }
                                    if (this.config["Auto BHop"] != "off") this.autoBhop();
                                    if (this.config["Auto Reload"]) this.autoReload();
                                    if (this.config["Auto Swap"]) this.autoSwap();
                                    let now = Date.now();
                                    let elapsed = now - then;
                                    if (elapsed > tickRate) {
                                        then = now - (elapsed % tickRate);
                                       // this.render(players);
                                        //this.me.update();
                                    }
                                }
                            }; tick();
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
                        })
                    })
                })
            })
        }

        render() {
            for (let i = 0, l = egg.players.length; i < l; i++) {
                let actor, player = egg.players[i];
                if (actor = player.actor) {
                    //if (!actor.eggMesh) {
                       // actor.eggMesh = actor.bodyMesh.clone("eggMesh");
                        //actor.eggMesh.position.z += 10;
                    //}
                    let hostile = !egg.me.team || egg.me.team != player.team;
                    let boxInfo = actor.bodyMesh.getBoundingInfo();
                    let boxRender = egg.me.scene.getBoundingBoxRenderer();
                    let enemyColour = window.BABYLON.Color3.FromHexString(egg.config["Enemy Colour"]);
                    let friendColour = window.BABYLON.Color3.FromHexString(egg.config["Friend Colour"]);
                    let renderingGroupId = egg.config["Egg Reveal"] && hostile ? 1 : 0;
                    for (let meshes = actor.mesh.getChildMeshes(), i = 0; i < meshes.length; i++) {
                        meshes[i].setRenderingGroupId(renderingGroupId);
                        meshes[i].disableDepthWrite = true;
                        meshes[i]._fogEnabled = false;
                    }
                    actor.bodyMesh.outlineColor = hostile ? enemyColour.toColor4() : friendColour.toColor4();
                    actor.bodyMesh.renderOutline = true;
                    if (actor.bodyMesh.material) {
                        Object.defineProperties(actor.bodyMesh.material, {
                            fogEnabled: {
                                value:false, configurable: false
                            },
                            disableDepthWrite: {
                                value:false, configurable: false
                            },
                            fillMode: {
                                value: egg.config.Chams, configurable: true
                            }
                        })
                    }

                    // Show 3d Box for enemies
                    boxRender.backColor = enemyColour
                    boxRender.frontColor = enemyColour
                    actor.bodyMesh.showBoundingBox = egg.config["3d Boxes"] && hostile;
                    actor.bodyMesh.renderingGroupId = egg.config["Egg Reveal"] && hostile ? 1 : 0;
                }
            }

            if (egg.isDefined(egg.me.scene)) {
                ["forceWireframe", "forcePointsCloud", "forceShowBoundingBoxes", "particlesEnabled", "shadowsEnabled", "spritesEnabled"].map(val => {
                    egg.me.scene[val] = egg.config[val]
                });
            }
        }

        autoBhop() {
            setTimeout(() => {
                if (this.config["Auto BHop"] == "autojump" || this.isKeyDown("Space")) this.me.jump();
            }, this.config["BHop Interval"]||0);
        }

        autoSwap() {
            if (0 == this.me.weapon.ammo.rounds) {
                let thisSlot = this.me.weaponIdx;
                let otherSlot = thisSlot ? 0 : 1;
                if (1 < this.me.weapons[otherSlot].ammo.rounds) {
                    this.me.swapWeapon(otherSlot);
                    //this.me.weapons[thisSlot].actor.reload();
                }
            }
        }

        autoReload() {
             if (0 == this.me.weapon.ammo.rounds && 0 != this.me.weapon.ammo.store) this.me.reload();
        }

        aimBot(target) {
            switch(this.config.Aimbot) {
                case "onKeyDown":
                    if (this.me.actor.scope) {
                        this.setPitchYaw(target);
                    }
                    break;
                case "autoAim":
                    this.setPitchYaw(target);
                    break;
                case "autoShoot":
                    this.setPitchYaw(target);
                    this.me.actor.scopeIn();
                    this.me.pullTrigger();
                    this.me.actor.scopeOut();
                    break;
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
                            window.vueApp.ui.showScreen = window.vueApp.ui.screens.game;
                            window.vueApp.game.isGameOwner = true;
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

        once(func) {
            let ran = false, memo;
            return function() {
                if (ran) return memo;
                ran = true;
                memo = func.apply(this, arguments);
                func = null;
                return memo;
            };
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

        rayCollidesWithPlayer(startPos, direction, player) {
            if (!this.config["Line Of Sight"]) return !0x0;
            else {
                if (this.utils.ray.origin.copyFrom(startPos), this.utils.ray.direction.copyFrom(direction), this.utils.ray.length = Infinity, player.actor) {
                    let hitPos = this.utils.rayCollidesWithPlayerHelper(this.utils.ray, player);

                    if (hitPos) {
                        //if (!this.isDefined(this.utils.rayHelper)) {
                            //this.utils.rayHelper = new window.BABYLON.RayHelper(this.utils.ray);
                        //} else {
                            //this.utils.rayHelper.attachToMesh(this.me.actor.eye, direction, startPos, 1e3);
                            //this.utils.rayHelper.show(this.me.scene);
                        //}

                        return hitPos//this.utils.pointCollidesWithMap(hitPos, !0)
                        //&& !this.utils.meshCollidesWithMap(this.utils.playerCollisionMesh, hitPos)
                    }
                }
            }
            return null;
        }

        setPitchYaw(target) {
            let coord = new window.BABYLON.Vector3(target.x, target.y + this.config["Aim Offset"], target.z)
            let delta = new window.BABYLON.Vector3(this.me.x, this.me.y, this.me.z).subtract(coord);
            let hypot = Math.sqrt(delta.x * delta.x + delta.z * delta.z);
            let angle = -Math.PI/2 - Math.atan2(delta.z, delta.x);
            if (angle < 0) angle += Math.PI * 2;
            else if (angle - Math.PI * 2 > 0) angle -= Math.PI * 2;
            this.me.pitch = Math.atan2(delta.y, hypot);
            this.me.yaw = angle;
        }
    }
    window[eggStr] = new Egg();
})(null,[...Array(8)].map(_ => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[~~(Math.random()*52)]).join(''));
