// ==UserScript==
// @name Krunker Dogeware - by The Gaming Gurus
// @description The most advanced krunker cheat
// @version 2.04
// @author SkidLamer - From The Gaming Gurus
// @supportURL https://discord.gg/upA3nap6Ug
// @homepage https://skidlamer.github.io/
// @iconURL https://i.imgur.com/MqW6Ufx.png
// @match *.krunker.io/*
// @exclude *krunker.io/social*
// @run-at document-start
// @grant none
// @noframes
// @namespace https://greasyfork.org/users/704479
// ==/UserScript==

/* eslint-env es6 */
/* eslint-disable curly, no-undef, no-loop-func, no-return-assign, no-sequences */

/* Ip Dip Dog Shit Chonker Stood In It */

(function(){
    // requestAnimationFrame - if there's an error, alert it
    window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
        apply(target, thisArg, argArray) {
            const cb = argArray[0];
            argArray[0] = function () {
                try {
                    return cb.apply(this, arguments)
                } catch (e) {
                    alert("FATAL ERROR:\n"+e+"\n"+e.stack)
                }
            }
            return target.apply(thisArg, argArray)
        }
    })

    window.cheat = {
        // default settings
        settings: {
            aimbot: 1,
            superSilent: true,
            AImbot: true,
            frustumCheck: false,
            staticWeaponZoom: false,
            wallbangs: true,
            alwaysAim: false,
            pitchHack: 0,
            thirdPerson: false,
            autoReload: false,
            speedHack: false,
            rangeCheck: false,
            alwaysTrail: false,
            spinAimFrames: 10,
            animatedBillboards: false,
            esp: 1,
            espFontSize: 10,
            tracers: false,
            showGuiButton: true,
            awtv: false,
            uwtv: false,
            forceUnsilent: false,
            bhop: 0,
            spinBot: false,
            markTarget: true,
            skinHack: false,
            aimOffset: 0,
            aimNoise: 0,
            keybinds: true,
            antikick: true,
            fovbox: false,
            drawFovbox: true,
            fovBoxSize: 1,
            guiOnMMB: false,
            chams: false,
            wireframe: false,
            chamsc: 0,
            customCss: "",
            selfChams: false,
            autoNuke: false,
            chamsInterval: 500,
            preventMeleeThrowing: false,
            //autoSwap: false,
            forceNametagsOn: false,
            aimbotRange: 0,
        },
        state: {
            bindAimbotOn: true,
            quickscopeCanShoot: true,
            spinFrame: 0,
            pressedKeys: new Set(),
            shouldCrouch: false,
            spinCounter: 0,
            activeTab: 0,
            frame: 0
            // check if exist before accessing:
            // me, game, players, controls, three, config, renderer, canvasScale, ctx
        },
        gui: {},
        math: {
            getDir: function(x1, y1, x2, y2) {
                return Math.atan2(y1 - y2, x1 - x2)
            },
            getDistance: function(x1, y1, x2, y2) {
                return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2)
            },
            getD3D: function(x1, y1, z1, x2, y2, z2) {
                const dx = x1 - x2, dy = y1 - y2, dz = z1 - z2
                return Math.sqrt(dx * dx + dy * dy + dz * dz)
            },
            // getAngleDst: function(a, b) {k
            //     return Math.atan2(Math.sin(b - a), Math.cos(a - b))
            // },
            getXDire: function(x1, y1, z1, x2, y2, z2) {
                const h = Math.abs(y1 - y2), dst = this.getD3D(x1, y1, z1, x2, y2, z2)
                return (Math.asin(h / dst) * ((y1 > y2) ? -1 : 1))
            },
            lineInRect: function(lx1, lz1, ly1, dx, dz, dy, x1, z1, y1, x2, z2, y2) {
                const t1 = (x1 - lx1) * dx, t2 = (x2 - lx1) * dx, t3 = (y1 - ly1) * dy
                const t4 = (y2 - ly1) * dy, t5 = (z1 - lz1) * dz, t6 = (z2 - lz1) * dz
                const tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6))
                const tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6))
                return (tmax < 0 || tmin > tmax) ? false : tmin
            },
        },
        isClient: !!window.doge_work
    }

    localStorage.kro_setngss_json ? Object.assign(window.cheat.settings, JSON.parse(localStorage.kro_setngss_json)) : localStorage.kro_setngss_json = JSON.stringify(window.cheat.settings)

    // disable audioparam errors
    Object.keys(AudioParam.prototype).forEach(name => {
        if (Object.getOwnPropertyDescriptor(AudioParam.prototype, name).get)
            return
        const old = AudioParam.prototype[name]
        AudioParam.prototype[name] = function() {
            try {
                return old.apply(this, arguments)
            } catch (e) {
                console.log("AudioParam error:\n"+e)
                return false
            }
        }
    })


    // object.prototype defines

    Object.defineProperties(Object.prototype, {
        thirdPerson: {
            get() {return cheat.settings.thirdPerson}
        },
        renderer: { // Get renderer, mostly for stuff like frustum or camera
            enumerable: false, get() {
                if (this.camera) {
                    cheat.state.renderer = this
                }
                return this._renderer
            }, set(v) {
                this._renderer = v
            }
        },
        OBJLoader: { // THREE
            enumerable: false, get() {
                return this._OBJLoader
            }, set(v) {
                cheat.state.three = this
                this._OBJLoader = v
            }
        },
        useLooseClient: {
            enumerable: false, get() {
                return this._ulc
            }, set(v) {
                cheat.state.config = this
                // Increase the rate in which inView is updated to every frame, making aimbot way more responsive
                Object.defineProperty(this, "nameVisRate", {
                    value: 0,
                    writable: false,
                    configurable: true,
                })
                this._ulc = v
            }
        },
        trail: { // All weapon tracers
            enumerable: false,
            get() { return cheat.settings.alwaysTrail || this._trail },
            set(v) { this._trail = v }
        },
        showTracers: {
            enumerable: false,
            get() { return cheat.settings.alwaysTrail || this._showTracers },
            set(v) { this._showTracers = v }
        },
        shaderId: { // Animated billboards
            enumerable: false,
            get() {
                if (this.src && this.src.startsWith("pubs/")) return cheat.settings.animatedBillboards ? 1 : this.rshaderId;
                else return this.rshaderId
            },
            set(v) {
                this.rshaderId = v
            }
        },
        // Clientside prevention of inactivity kick
        idleTimer: {
            enumerable: false, get() {
                return cheat.settings.antikick ? 0 : this._idleTimer
            }, set(v) {
                this._idleTimer = v
            }
        },
        kickTimer: {
            enumerable: false, get() {
                return cheat.settings.antikick ? Infinity : this._kickTimer
            }, set(v) {
                this._kickTimer = v
            }
        }

    });

    function initCheatCanvas(inGameUI) {
        cheat.canvas = document.createElement("canvas")
        cheat.canvas.width = innerWidth
        cheat.canvas.height = innerHeight
        window.addEventListener("resize", () => {
            const scale = cheat.state.canvasScale || 1
            cheat.canvas.width = innerWidth/scale
            cheat.canvas.height = innerHeight/scale
        })
        inGameUI.insertAdjacentElement("beforeend", cheat.canvas)
        cheat.state.ctx = cheat.canvas.getContext("2d")
    }
    const itv = setInterval(() => {
        if (document.getElementById("inGameUI")) {
            clearInterval(itv)
            initCheatCanvas(document.getElementById("inGameUI"))
        }
    }, 100)
    function renderHook() {
        if (!cheat.state.renderHookArgs) return
        const [_, game, controls, renderer, me, delta] = cheat.state.renderHookArgs
        cheat.state.canvasScale = parseFloat(document.getElementById("uiBase").style.transform.match(/\((.+)\)/)[1])
        cheat.state.players = game.players
        cheat.state.game = game
        cheat.state.controls = controls
        cheat.state.renderer = renderer
        cheat.state.me = me

        if (!cheat.state.renderer.frustum) return

        if (me && me.weapon && !me.weapon.zoomHooked) {
            me.weapon.zoomHooked = true
            me.weapon._zoom = me.weapon.zoom
            Object.defineProperty(me.weapon, "zoom", {
                get() {return cheat.settings.staticWeaponZoom ? 1 : this._zoom }
            })
        }

        const ctx = cheat.state.ctx
        const scale = parseFloat(document.getElementById("uiBase").style.transform.match(/\((.+)\)/)[1])
        const width = innerWidth/scale, height = innerHeight/scale
        cheat.canvas.width = width
        cheat.canvas.height = height

        if (!ctx) return

        function world2Screen(pos, yOffset = 0) {
            pos.y += yOffset
            pos.project(cheat.state.renderer.camera)
            pos.x = (pos.x + 1) / 2
            pos.y = (-pos.y + 1) / 2
            pos.x *= width
            pos.y *= height
            return pos
        }
        function line(x1, y1, x2, y2, lW, sS) {
            ctx.save()
            ctx.lineWidth = lW + 2
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.strokeStyle = "rgba(0, 0, 0, 0.25)"
            ctx.stroke()
            ctx.lineWidth = lW
            ctx.strokeStyle = sS
            ctx.stroke()
            ctx.restore()
        }
        function rect(x, y, ox, oy, w, h, color, fill) {
            ctx.save()
            ctx.translate(~~x, ~~y)
            ctx.beginPath()
            fill ? ctx.fillStyle = color : ctx.strokeStyle = color
            ctx.rect(ox, oy, w, h)
            fill ? ctx.fill() : ctx.stroke()
            ctx.closePath()
            ctx.restore()
        }
        function getTextMeasurements(arr) {
            for (let i = 0; i < arr.length; i++) {
                arr[i] = ~~ctx.measureText(arr[i]).width
            }
            return arr
        }
        function gradient(x, y, w, h, colors) {
            const grad = ctx.createLinearGradient(x, y, w, h)
            for (let i = 0; i < colors.length; i++) {
                grad.addColorStop(i, colors[i])
            }
            return grad
        }
        function text(txt, font, color, x, y) {
            ctx.save()
            ctx.translate(~~x, ~~y)
            ctx.fillStyle = color
            ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
            ctx.font = font
            ctx.lineWidth = 1
            ctx.strokeText(txt, 0, 0)
            ctx.fillText(txt, 0, 0)
            ctx.restore()
        }

        const padding = 2

        ctx.clearRect(0, 0, width, height)
        // tecchhchy (with some stuff by me)
        if (cheat.settings.esp > 1) {
            for(const player of cheat.state.players.list.filter(v => (!v.isYTMP && v.active && (v.pos = {x: v.x, y: v.y, z: v.z})))) {
                const pos = new cheat.state.three.Vector3(player.pos.x, player.pos.y, player.pos.z)
                const screenR = world2Screen(pos.clone())
                const screenH = world2Screen(pos.clone(), player.height)
                const hDiff = ~~(screenR.y - screenH.y)
                const bWidth = ~~(hDiff * 0.6)
                const font = cheat.settings.espFontSize+"px GameFont"

                if (!cheat.state.renderer.frustum.containsPoint(player.pos)) {
                    continue
                }

                if (cheat.settings.tracers) {
                    line(width / 2, (cheat.settings.tracers === 2 ? height / 2 : height - 1), screenR.x, screenR.y, 2, player.team === null ? "#FF4444" : player.team === cheat.state.me.team ? "#44AAFF" : "#FF4444")
                }


                if (player.isTarget) {
                    ctx.save()
                    const meas = getTextMeasurements(["TARGET"])
                    text("TARGET", font, "#FFFFFF", screenH.x-meas[0]/2, screenH.y-cheat.settings.espFontSize*1.5)

                    ctx.beginPath()

                    ctx.translate(screenH.x, screenH.y+Math.abs(hDiff/2))
                    ctx.arc(0, 0, Math.abs(hDiff/2)+10, 0, Math.PI*2)

                    ctx.strokeStyle = "#FFFFFF"
                    ctx.stroke()
                    ctx.closePath()
                    ctx.restore()
                }

                if (cheat.settings.esp === 2) {
                    ctx.save()
                    ctx.strokeStyle = (me.team === null || player.team !== me.team) ? "#FF4444" : "#44AAFF"
                    ctx.strokeRect(screenH.x-bWidth/2, screenH.y, bWidth, hDiff)
                    ctx.restore()
                    continue
                }

                rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, 0, 0, 4, hDiff + 2, "#000000", false)
                rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, 0, 0, 4, hDiff + 2, "#44FF44", true)
                rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, 0, 0, 4, ~~((player[cheat.vars.maxHealth] - player.health) / player[cheat.vars.maxHealth] * (hDiff + 2)), "#000000", true)
                ctx.save()
                ctx.lineWidth = 4
                ctx.translate(~~(screenH.x - bWidth / 2), ~~screenH.y)
                ctx.beginPath()
                ctx.rect(0, 0, bWidth, hDiff)
                ctx.strokeStyle = "rgba(0, 0, 0, 0.25)"
                ctx.stroke()
                ctx.lineWidth = 2
                ctx.strokeStyle = player.team === null ? '#FF4444' : cheat.state.me.team === player.team ? '#44AAFF' : '#FF4444'
                ctx.stroke()
                ctx.closePath()
                ctx.restore()


                const playerDist = ~~(cheat.math.getD3D(me.x, me.y, me.z, player.pos.x, player.pos.y, player.pos.z) / 10)
                ctx.save()
                ctx.font = font
                const meas = getTextMeasurements(["[", playerDist, "m]", player.level, "©", player.name])
                ctx.restore()
                const grad2 = gradient(0, 0, meas[4] * 5, 0, ["rgba(0, 0, 0, 0.25)", "rgba(0, 0, 0, 0)"])
                if (player.level) {
                    const grad = gradient(0, 0, (meas[4] * 2) + meas[3] + (padding * 3), 0, ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.25)"])
                    rect(~~(screenH.x - bWidth / 2) - 12 - (meas[4] * 2) - meas[3] - (padding * 3), ~~screenH.y - padding, 0, 0, (meas[4] * 2) + meas[3] + (padding * 3), meas[4] + (padding * 2), grad, true)
                    text(""+player.level, font, '#FFFFFF', ~~(screenH.x - bWidth / 2) - 16 - meas[3], ~~screenH.y + meas[4] * 1)
                }
                rect(~~(screenH.x + bWidth / 2) + padding, ~~screenH.y - padding, 0, 0, (meas[4] * 5), (meas[4] * 4) + (padding * 2), grad2, true)
                text(player.name, font, player.team === null ? '#FFCDB4' : me.team === player.team ? '#B4E6FF' : '#FFCDB4', (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 1)
                if (player.clan) text("["+player.clan+"]", font, "#AAAAAA", (screenH.x + bWidth / 2) + 8 + meas[5], screenH.y + meas[4] * 1)
                text(player.health+" HP", font, "#33FF33", (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 2)
                text(player.weapon.name, font, "#DDDDDD", (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 3)
                text("[", font, "#AAAAAA", (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 4)
                text(""+playerDist, font, "#DDDDDD", (screenH.x + bWidth / 2) + 4 + meas[0], screenH.y + meas[4] * 4)
                text("m]", font, "#AAAAAA", (screenH.x + bWidth / 2) + 4 + meas[0] + meas[1], screenH.y + meas[4] * 4)
            }
        }
        // Chams
        if (cheat.settings.chams && cheat.state.players) {
            for (const player of cheat.state.players.list.filter(v => ((cheat.settings.selfChams || !v.isYTMP) && v.active && (v.pos = {x: v.x, y: v.y, z: v.z})))) {
                const o = player[cheat.vars.objInstances]
                if (!o) {
                    continue
                }
                // Reflect.defineProperty doesnt throw errors
                if (!o.visible) {
                    Reflect.defineProperty(o, "visible", {
                        get() {
                            return cheat.settings.chams || this._visible
                        },
                        set(v){
                            this._visible = v
                        }
                    })
                }

                o.traverse(e => {
                    if (e.type === "Mesh") {
                        Reflect.defineProperty(e.material, "wireframe", {
                            get() {
                                return cheat.settings.wireframe || this._wf
                            },
                            set(v){
                                this._wf = v
                            }
                        })
                        e.visible = true
                        e.material.visible = true
                        e.material.depthTest = false
                        e.material.transparent = true
                        e.material.fog = false

                        const modes = [
                            null,
                            {r: 1},
                            {g: 1},
                            {b: 1},
                            {g: 1, b: 1},
                            {r: 1, b: 1},
                            {r: 1, g: 1}
                        ]
                        if (cheat.settings.chamsc === 7) {
                            // epilepsy
                            e.material.emissive = modes[1+Math.floor(Math.random()*6)]
                        } else if (cheat.settings.chamsc === 8) {
                            // rgb
                            const cur = ~~((Date.now()%(cheat.settings.chamsInterval*6))/cheat.settings.chamsInterval)
                            e.material.emissive = modes[cur+1]
                        } else {
                            e.material.emissive = modes[cheat.settings.chamsc]
                        }
                    }
                })
            }
        }

        if (cheat.settings.fovbox && cheat.settings.drawFovbox) {
            let fovBox = [width/3, height/4, width*(1/3), height/2]
            switch (cheat.settings.fovBoxSize) {
                    // medium
                case 2:
                    fovBox = [width*0.4, height/3, width*0.2, height/3]
                    break
                    // small
                case 3:
                    fovBox = [width*0.45, height*0.4, width*0.1, height*0.2]
                    break
            }
            ctx.save()
            ctx.strokeStyle = "red"
            ctx.strokeRect(...fovBox)
            ctx.restore()
        }
    }

    const isDefined = (x) => typeof x !== "undefined" && x !== null
    // Hook render and run renderHook
    Object.defineProperty(Object.prototype, "render", {
        enumerable: false, get() {
            return this._render
        }, set(v) {
            if (isDefined(this.showHits)) {
                this._render = new Proxy(v, {
                    apply(target, thisArg, argArray) {
                        const ret = target.apply(thisArg, argArray)
                        cheat.state.renderHookArgs = argArray
                        renderHook()
                        return ret
                    }
                })
            } else {
                this._render = v
            }
        }
    })



    // skin hack

    let skinConfig = {}

    function s(c) {
        window.dispatchWsEvent = c._dispatchEvent.bind(c)
        window.sendWsMessage = c.send.bind(c)

        c.send = new Proxy(c.send, {
            apply(target, thisArg, msg) {
                // Captures the skins selected from the "en" (enter game) message
                if (msg[0] === "en")
                    skinConfig = {
                        main: msg[1][2][0],
                        secondary: msg[1][2][1],
                        hat: msg[1][3],
                        body: msg[1][4],
                        knife: msg[1][9],
                        dye: msg[1][14],
                        waist: msg[1][17],
                    }

                return target.apply(thisArg, msg)
            }
        })
        c._dispatchEvent = new Proxy(c._dispatchEvent, {
            apply(target, thisArg, [type, msg]) {
                // Modifies the skins in the incoming "0" message
                if (skinConfig && type === "0" && cheat.settings.skinHack) {
                    const playersInfo = msg[0]
                    let perPlayerSize = 38
                    while (playersInfo.length % perPlayerSize !== 0) {
                        perPlayerSize++
                    }

                    for(let i = 0; i < playersInfo.length; i += perPlayerSize) {
                        if (playersInfo[i] === c.socketId) {
                            playersInfo[i + 12] = [skinConfig.main, skinConfig.secondary]
                            playersInfo[i + 13] = skinConfig.hat
                            playersInfo[i + 14] = skinConfig.body
                            playersInfo[i + 19] = skinConfig.knife
                            playersInfo[i + 25] = skinConfig.dye
                            playersInfo[i + 33] = skinConfig.waist
                        }
                    }
                }
                return target.apply(thisArg, arguments[2])
            }
        })
    }

    const events = Symbol("kpal")
    // `events` is a property in the ws object
    Object.defineProperty(Object.prototype, "events", {enumerable:!1,get(){return this[events]},set(v){if(this.ahNum===0){s(this)}this[events]=v}})
    const skins = Symbol("lol anticheat")
    // modifies the "skins" property to show the skins in GUI
    Object.defineProperty(Object.prototype, "skins", {
        enumerable: false,
        get() {
            if (this.stats && cheat.settings.skinHack) {
                return this.fakeSkins
            }
            return this[skins]
        },
        set(v) {
            if ("stats" in this) {
                this.fakeSkins = []
                for (let i = 0; i < 5000; i++) {
                    if (v[i]) {
                        this.fakeSkins.push({ind: i, cnt: v[i].cnt})
                    } else {
                        this.fakeSkins.push({ind: i, cnt: "SH"})
                    }
                }
            }
            this[skins] = v
        }
    })


    // gui
    let initGUI;

    function getGuiHtml() {
        // name - Visible setting name
        // settingName - name of the property in cheat.settings
        // needsRestart - shows this red asterisk next to the setting name
        // description - the description on mouse hover
        const builder = {
            checkbox: (name, settingName, description = "", needsRestart = false) =>
            `<div class="settName" title="${description}">${name} ${needsRestart ? "<span style=\"color: #eb5656\">*</span>" : ""}<label class="switch" style="margin-left:10px"><input type="checkbox" onclick='cheat.gui.setSetting("${settingName}", this.checked)' ${cheat.settings[settingName]?"checked":""}><span class="slider"></span></label></div>`,
            client_setting: (name, settingName, description = "", needsRestart = true) =>
            `<div class="settName" title="${description}">${name} ${needsRestart ? "<span style=\"color: #eb5656\">*</span>" : ""}<label class="switch" style="margin-left:10px"><input type="checkbox" onclick='doge_setsetting("${settingName}", this.checked?"1":"0")' ${cheat.settings[settingName]?"checked":""}><span class="slider"></span></label></div>`,
    select: (name, settingName, options, description = "", needsRestart = false) => {
        let built = `<div class="settName" title="${description}">${name} ${needsRestart ? "<span style=\"color: #eb5656\">*</span>" : ""}<select onchange='cheat.gui.setSetting("${settingName}", parseInt(this.value))' class="inputGrey2">`
        for (const option in options) {
            if (options.hasOwnProperty(option))
                built += `<option value="${options[option]}" ${cheat.settings[settingName] == options[option]?"selected":""}>${option}</option>,`
        }
        return built + "</select></div>"
    },
        slider: (name, settingName, min, max, step, description = "") =>
        `<div class="settName" title="${description}">${name} <input type="number" class="sliderVal" id="slid_input_${settingName}" min="${min}" max="${max}" value="${cheat.settings[settingName]}" onkeypress="cheat.gui.setSetting('${settingName}', parseFloat(this.value.replace(',', '.')));document.querySelector('#slid_input_${settingName}').value=this.value" style="margin-right:0;border-width:0"><div class="slidecontainer" style=""><input type="range" id="slid_${settingName}" min="${min}" max="${max}" step="${step}" value="${cheat.settings[settingName]}" class="sliderM" oninput="cheat.gui.setSetting('${settingName}', parseFloat(this.value));document.querySelector('#slid_input_${settingName}').value=this.value"></div></div>`,
            input: (name, settingName, type, description, extra) =>
            `<div class="settName" title="${description}">${name} <input type="${type}" name="${type}" id="slid_utilities_${settingName}"\n${'color' == type ? 'style="float:right;margin-top:5px"' : `class="inputGrey2" placeholder="${extra}"`}\nvalue="${cheat.settings[settingName]}" oninput="cheat.gui.setSetting(\x27${settingName}\x27, this.value)"/></div>`,
                label: (name, description) =>
                "<br><span style='color: black; font-size: 20px; margin: 20px 0'>"+name+"</span> <span style='color: dimgrey; font-size: 15px'>"+(description||"")+"</span><br>",
                    nobrlabel: (name, description) =>
                    "<span style='color: black; font-size: 20px; margin: 20px 0'>"+name+"</span> <span style='color: dimgrey; font-size: 15px'>"+(description||"")+"</span><br>",
                        br: () => "<br>",

                            style: content => `<style>${content}</style>`,
}

                            let built = `<div id="settHolder">
<h3 style="margin-bottom: 10px">Dogeware v3</h3>
<h5 style="margin: 15px 0">Made by The Gaming Gurus, Join <a href="https://skidlamer.github.io/wp/index.html">The Gaming Gurus discord server</a> for more hacks.<br></h5>`

                            // fix ugly looking 'built +=' before every builder call
                            Object.keys(builder).forEach(name => {
                                const o = builder[name]
                                builder[name] = function () {
                                    return built += o.apply(this, arguments), ""
                                }
                            })

    // Tabs stuff
    const tabNames = ["Weapon", "Wallhack", "Visual", "Tweaks", "Movement", "Other"]
    if (cheat.isClient) {
        tabNames.push("Client")
    }
    builder.style(`
.cheatTabButton {
color: black;
background: #ddd;
padding: 2px 7px;
font-size: 15px;
cursor: pointer;
text-align: center;
}
.cheatTabActive {
background: #bbb;
}
`)
    cheat.gui.changeTab = function (tabbtn) {
        const tn = tabbtn.innerText
        document.getElementById("cheat-tabbtn-"+tabNames[cheat.state.activeTab]).classList.remove("cheatTabActive")
        document.getElementById("cheat-tab-"+tabNames[cheat.state.activeTab]).style.display = "none"
        tabbtn.classList.add("cheatTabActive")
        document.getElementById("cheat-tab-"+tn).style.display = "block"
        cheat.state.activeTab = tabNames.indexOf(tn)
    }
    built += `<table style="width: 100%; margin-bottom: 30px"><tr>`
    for (let i = 0; i < tabNames.length; i++) {
        const tab = tabNames[i]
        built += `<td id="cheat-tabbtn-${tab}" onclick="cheat.gui.changeTab(this)" class="cheatTabButton ${tabNames[cheat.state.activeTab] === tab ? 'cheatTabActive' : ''}">`
        built += tab
        built += `</td>`
    }
    built += `</table></tr>`
    function tab(i, cb) {
        built += `<div style="display: ${cheat.state.activeTab === i ? 'block' : 'none'}" class="cheat-tab" id="cheat-tab-${tabNames[i]}">`
        cb()
        built += `</div>`
    }

    // build gui
    tab(0, () => {
        builder.select("Aimbot [Y]", "aimbot", {
            "None": 0,
            "Quickscope / Auto pick": 1,
            "Silent aimbot": 2,
            //"Spin aimbot": 3,
            "Aim assist": 4,
            "Easy aim assist": 11,
            "SP Trigger bot": 12,
            "Silent on aim": 6,
            "Smooth": 7,
            "Unsilent": 10,
            "Unsilent on aim": 5,
            "Aim correction": 9,
        })
        builder.select("Spin aimbot speed", "spinAimFrames", {
            "1": 30,
            "2": 20,
            "3": 15,
            "4": 10,
            "5": 5,
        })
        builder.slider("Aim range", "aimbotRange", 0, 1000, 10, "Set above 0 to make the aimbot pick enemies only at the selected range")
        builder.slider("Aim offset", "aimOffset", -4, 1, 0.1, "The lower it is, the lower the aimbot will shoot (0 - head, -4 - body)")
        builder.slider("Aim noise", "aimNoise", 0, 2, 0.005, "The higher it is, the lower is the aimbot accuracy")
        builder.checkbox("Supersilent aim", "superSilent", "Only works with quickscope and silent aim, makes it almost invisible that you're looking at somebody when you're shooting at him")
        builder.checkbox("Aim at AIs", "AImbot", "Makes the aimbot shoot at NPCs")
        builder.checkbox("FOV check", "frustumCheck", "Makes you only shoot at enemies that are in your field of view. Prevents 180 flicks")
        builder.checkbox("FOV box", "fovbox", "Creates a box in which enemies can be targetted, enable with FOV check")
        builder.select("FOV box size", "fovBoxSize", {
            "Big": 1,
            "Medium": 2,
            "Small": 3,
        })
        builder.checkbox("Wallbangs", "wallbangs", "Makes the aimbot shoot enemies behind walls")
        builder.checkbox("Aimbot range check", "rangeCheck", "Checks if the enemy is in range of your weapon before shooting it, disable for rocket launcher")
        builder.checkbox("Auto reload", "autoReload", "Automatically reloads your weapon when it's out of ammo")
        builder.checkbox("Prevent melee throwing", "preventMeleeThrowing", "Prevents you from throwing your knife")
        //builder.checkbox("Auto swap", "autoSwap", "Automatically swaps the weapon when you're out of ammo")
    })

    tab(1, () => {
        builder.select("ESP [H]", "esp", {
            "None": 0,
            "Nametags": 1,
            "Box ESP": 2,
            "Full ESP": 3,
        })
        builder.select("ESP Font Size", "espFontSize", {
            "30px": 30,
            "25px": 25,
            "20px": 20,
            "15px": 15,
            "10px": 10,
            "5px": 5,
        })
        builder.select("Tracers", "tracers", {
            "None": 0,
            "Bottom": 1,
            "Middle": 2,
        }, "Draws lines to players")
        builder.checkbox("Mark aimbot target", "markTarget", "Shows who is the aimbot targetting at the time, useful for aim assist/aim correction")
        builder.checkbox("Draw FOV box", "drawFovbox", "Draws the FOV box from aimbot settings")
        builder.checkbox("Chams", "chams")
        builder.select("Chams colour", "chamsc", {
            "None": 0,
            "Red": 1,
            "Green": 2,
            "Blue": 3,
            "Cyan": 4,
            "Pink": 5,
            "Yellow": 6,
            "RGB": 8,
            "Epilepsy": 7,
        })
        builder.checkbox("Self chams", "selfChams", "Makes your weapon affected by chams")
        builder.checkbox("Wireframe", "wireframe")
        builder.slider("RGB interval", "chamsInterval", 50, 1000, 50, "How fast will the RGB chams change colour")
    })

    tab(2, () => {
        builder.checkbox("Skin hack", "skinHack", "Makes you able to use any skin in game, only shows on your side")
        builder.checkbox("Third person mode", "thirdPerson")
        builder.checkbox("No weapon zoom", "staticWeaponZoom", "Removes the distracting weapon zoom animation")
        builder.checkbox("Any weapon trail", "alwaysTrail")
        builder.checkbox("Billboard shaders", "animatedBillboards", "Disable if you get fps drops")
    })

    tab(3, () => {
        builder.checkbox("Always aim", "alwaysAim", "Makes you slower and jump lower, but the aimbot can start shooting at enemies  faster. Only use if ur good at bhopping")
        builder.checkbox("Aim when target visible", "awtv")
        builder.checkbox("Unaim when no target visible", "uwtv")
        builder.checkbox("Force unsilent", "forceUnsilent")
    })

    tab(4, () => {
        builder.select("Auto bhop", "bhop", {
            "None": 0,
            "Auto Jump": 1,
            "Key Jump": 2,
            "Auto Slide": 3,
            "Key Slide": 4,
        })
        builder.label("Only use with silent aim")
        builder.select("Pitch hax", "pitchHack", {
            "Disabled": 0,
            "Downward": 1,
            "Upward": 2,
            "sin(time)": 3,
            "sin(time/5)": 4,
            "double": 5,
            "random": 6,
        }, "Only use with aimbot on")
        builder.checkbox("Spin bot", "spinBot")
    })

    tab(5, () => {
        builder.input("Custom CSS", "customCss", "url", "", "URL to CSS file")
        builder.checkbox("Show GUI button", "showGuiButton", "Disable if you don't want the dog under settings to be visible")
        builder.checkbox("GUI on middle mouse button", "guiOnMMB", "Makes it possible to open this menu by clicking the mouse wheel")
        builder.checkbox("Keybinds", "keybinds", "Turn keybinds on/off, Aimbot - Y, ESP - H")
        builder.checkbox("No inactivity kick", "antikick", "Disables the 'Kicked for inactivity' message (client side, but works)")
        builder.checkbox("Auto nuke", "autoNuke", "Automatically nukes when you are able to")
        builder.checkbox("Force nametags on", "fgno", "Use in custom games with disabled nametags")
    })

    if (cheat.isClient) {
        tab(6, () => {
            builder.nobrlabel("Restart is required after changing any of these settings")
            builder.br()
            builder.client_setting("Uncap FPS", "uncap_fps", "Disables V-Sync")
            builder.client_setting("Adblock", "adblock", "Disables ads")
        })
    }

    built += "</div>"

    return built
}
 initGUI = function() {
    function createButton(name, iconURL, fn) {
        const menu = document.querySelector("#menuItemContainer"),
              menuItem = document.createElement("div"),
              menuItemIcon = document.createElement("div"),
              menuItemTitle = document.createElement("div")

        menuItem.className = "menuItem"
        menuItemIcon.className = "menuItemIcon"
        menuItemTitle.className = "menuItemTitle"

        menuItemTitle.innerHTML = name
        menuItemIcon.style.backgroundImage = `url("https://i.imgur.com/fouuS5M.gif")`

        menuItem.append(menuItemIcon, menuItemTitle)
        menu.append(menuItem)

        menuItem.addEventListener("click", fn)
    }
    cheat.gui.cssElem = document.createElement("link")
    cheat.gui.cssElem.rel = "stylesheet"
    cheat.gui.cssElem.href = cheat.settings.customCss
    try {
        document.head.appendChild(cheat.gui.cssElem)
    } catch (e) {
        alert("Error injecting custom CSS:\n"+e)
        cheat.settings.customCss = ""
    }
    cheat.gui.setSetting = function(setting, value) {
        switch (setting) {
            case "customCss":
                cheat.settings.customCss = value
                break

            default:
                cheat.settings[setting] = value
        }

        localStorage.kro_setngss_json = JSON.stringify(cheat.settings);

    }
    cheat.gui.windowIndex = windows.length+1
    cheat.gui.settings = {
        aimbot: {
            val: cheat.settings.aimbot
        }
    }
    cheat.gui.windowObj = {
        header: "CH33T",
        html: "",
        gen() {
            return getGuiHtml()
        }
    }
    Object.defineProperty(window.windows, windows.length, {
        value: cheat.gui.windowObj
    })

    if (cheat.settings.showGuiButton) {
        createButton("CH33TS", null, () => {
            window.showWindow(cheat.gui.windowIndex)
        })
    }
}
function showGUI() {
    if (document.pointerLockElement || document.mozPointerLockElement) {
        document.exitPointerLock()
    }
    window.showWindow(cheat.gui.windowIndex)
}

// event listeners
// show gui
window.addEventListener("mouseup", (e) => {
    if(e.which === 2 && cheat.settings.guiOnMMB) {
        e.preventDefault()
        showGUI()
    }
})
window.addEventListener("keydown", ev => {
    if (ev.key === "F1") {
        ev.preventDefault()
        showGUI()
    }
})
window.addEventListener("keydown", ev => {
    if (!cheat.state.pressedKeys.has(ev.code)) {
        cheat.state.pressedKeys.add(ev.code)
    }
})
window.addEventListener("keyup", ev => {
    if (cheat.state.pressedKeys.has(ev.code)) {
        cheat.state.pressedKeys.delete(ev.code)
    }
    if (!(document.activeElement.tagName === "INPUT" || !window.endUI && window.endUI.style.display) && cheat.settings.keybinds) {
        switch (ev.code) {
            case "KeyY":
                cheat.state.bindAimbotOn = !cheat.state.bindAimbotOn
                dispatchWsEvent("ch", [null, ("Aimbot "+(cheat.state.bindAimbotOn?"on":"off")), 1])
                break
            case "KeyH":
                cheat.settings.esp = (cheat.settings.esp+1)%4
                dispatchWsEvent("ch", [null, "ESP: "+["disabled", "nametags", "box", "full"][cheat.settings.esp], 1])
                break
        }
    }
})


function procInputs(me, input, game, recon, lock) {
    const key = {
        frame: 0,
        delta: 1,
        xdir: 2,
        ydir: 3,
        moveDir: 4,
        shoot: 5,
        scope: 6,
        jump: 7,
        reload: 8,
        crouch: 9,
        weaponScroll: 10,
        weaponSwap: 11,
        moveLock: 12
    }

    const moveDir = {
        leftStrafe: 0,
        forward: 1,
        rightStrafe: 2,
        right: 3,
        backwardRightStrafe: 4,
        backward: 5,
        backwardLeftStrafe: 6,
        left: 7
    }

    cheat.state.frame = input[key.frame]
    cheat.state.players = game.players
    cheat.state.game = game
    cheat.state.me = me
    cheat.state.controls = game.controls

    // AUTO NUKE
    if (cheat.settings.autoNuke && me && Object.keys(me.streaks).length) {
        sendWsMessage("k", 0)
    }

    // BHOP
    const bhop = cheat.settings.bhop
    if (bhop) {
        if (cheat.state.pressedKeys.has("Space") || [1,3].includes(bhop)) {
            cheat.state.controls.keys[cheat.state.controls.binds.jumpKey.val] ^= 1
            if (cheat.state.controls.keys[cheat.state.controls.binds.jumpKey.val]) {
                cheat.state.controls.didPressed[cheat.state.controls.binds.jumpKey.val] = 1
            }
            if ([3,4].includes(bhop) && ((cheat.state.pressedKeys.has('Space') || bhop === 3) && (cheat.state.me.canSlide))) {
                setTimeout(() => {
                    cheat.state.shouldCrouch = false
                }, 350)
                cheat.state.shouldCrouch = true
            }
        }
    }
    if (cheat.state.shouldCrouch) {
        input[key.crouch] = 1
    }

    // Makes nametags show in custom games, where nametags are disabled
    if (cheat.settings.forceNametagsOn) {
        try {
            Object.defineProperty(game.config, "nameTags", {
                get() {
                    return cheat.settings.forceNametagsOn ? false : game._nametags
                },
                set(v) {
                    game._nametags = v
                }
            })
        } catch (e) {}
    }


    if (cheat.settings.spinBot) {
        const rate = 1
        input[key.moveDir] !== -1 && (input[key.moveDir] = (input[key.moveDir] + cheat.state.spinCounter - Math.round(7 * (input[key.ydir] / (Math.PI * 2000)))) % 7)
        input[key.ydir] = cheat.state.spinCounter/7 * (Math.PI * 2000)
        input[key.frame] % rate === 0 && (cheat.state.spinCounter = (cheat.state.spinCounter + 1) % 7)
    }

    // Auto swap (not working idk why)
    // if (cheat.settings.autoSwap && !me.weapon.secondary && me[cheat.vars.ammos][0] === 0 && me[cheat.vars.ammos][1] > 0 && !me.swapTime && !me[cheat.vars.reloadTimer]) {
    // 	input[key.weaponSwap] = 1
    //}
    // AUTO RELOAD
    if (cheat.settings.autoReload && me[cheat.vars.ammos][me[cheat.vars.weaponIndex]] === 0) {
        input[key.reload] = 1
    }

    // PITCH HACK
    if (cheat.settings.pitchHack) {
        switch (cheat.settings.pitchHack) {
            case 1:
                input[key.xdir] = -Math.PI*500
                break
            case 2:
                input[key.xdir] = Math.PI*500
                break
            case 3:
                input[key.xdir] = Math.sin(Date.now() / 50) * Math.PI * 500
                break
            case 4:
                input[key.xdir] = Math.sin(Date.now() / 250) * Math.PI * 500
                break
            case 5:
                input[key.xdir] = input[key.frame] % 2 ? Math.PI*500 : -Math.PI*500
                break
            case 6:
                input[key.xdir] = (Math.random() * Math.PI - Math.PI/2) * 1000
                break
        }
    }

    // Add the `pos` property to Players and AIs
    const getNoise = () => (Math.random()*2-1)*cheat.settings.aimNoise
    game.players.list.forEach(v=>{v.pos={x:v.x,y:v.y,z:v.z}; v.npos={x:v.x+getNoise(),y:v.y+getNoise(),z:v.z+getNoise()}; v.isTarget=false})
    if (game.AI.ais) {
        game.AI.ais.forEach(v=>v.npos=v.pos={x:v.x,y:v.y,z:v.z})
    }

    // AIMBOT
    if (cheat.state.renderer && cheat.state.renderer.frustum && me.active) {
        game.controls.target = null

        // Finds all the visible enemies
        const targets = game.players.list.filter(enemy =>
                                                 !enemy.isYTMP &&
                                                 enemy.hasOwnProperty('npos') &&
                                                 (!cheat.settings.frustumCheck || cheat.state.renderer.frustum.containsPoint(enemy.npos)) &&
                                                 ((me.team === null || enemy.team !== me.team) && enemy.health > 0 && enemy[cheat.vars.inView])
                                                ).sort((e, e2) => cheat.math.getDistance(me.x, me.z, e.npos.x, e.npos.z) - cheat.math.getDistance(me.x, me.z, e2.npos.x, e2.npos.z))

        let target = targets[0]
        // If there's a fov box, pick an enemy inside it instead (if there is)
        if (cheat.settings.fovbox) {
            // scale - idk why but that's needed to get working width and height
            const scale = parseFloat(document.getElementById("uiBase").style.transform.match(/\((.+)\)/)[1])
            const width = innerWidth/scale, height = innerHeight/scale
            function world2Screen(pos, yOffset = 0) {
                pos.y += yOffset
                pos.project(cheat.state.renderer.camera)
                pos.x = (pos.x + 1) / 2
                pos.y = (-pos.y + 1) / 2
                pos.x *= width
                pos.y *= height
                return pos
            }

            let foundTarget = false
            for (let i = 0; i < targets.length; i++) {
                const t = targets[i]
                const sp = world2Screen(new cheat.state.three.Vector3(t.x, t.y, t.z), t.height/2)
                let fovBox = [width/3, height/4, width*(1/3), height/2]
                switch (cheat.settings.fovBoxSize) {
                        // medium
                    case 2:
                        fovBox = [width*0.4, height/3, width*0.2, height/3]
                        break
                        // small
                    case 3:
                        fovBox = [width*0.45, height*0.4, width*0.1, height*0.2]
                        break
                }
                if (sp.x >= fovBox[0] && sp.x <= (fovBox[0]+fovBox[2]) && sp.y >= fovBox[1] && sp.y < (fovBox[1]+fovBox[3])) {
                    target = targets[i]
                    foundTarget = true
                    break
                }
            }
            if (!foundTarget) {
                target = void "kpal"
            }
        }

        let isAiTarget = false
        if (game.AI.ais && cheat.settings.AImbot) {
            let aiTarget = game.AI.ais.filter(ent => ent.mesh && ent.mesh.visible && ent.health && ent.pos && ent.canBSeen).sort((p1, p2) => cheat.math.getDistance(me.x, me.z, p1.pos.x, p1.pos.z) - cheat.math.getDistance(me.x, me.z, p2.pos.x, p2.pos.z)).shift()
            if (!target || (aiTarget && cheat.math.getDistance(me.x, me.z, aiTarget.pos.x, aiTarget.pos.z) > cheat.math.getDistance(me.x, me.z, target.pos.x, target.pos.z))) {
                target = aiTarget
                isAiTarget = true
            }
        }

        const isShooting = input[key.shoot]
        if (target && cheat.settings.aimbot &&
            cheat.state.bindAimbotOn &&
            (!cheat.settings.aimbotRange || cheat.math.getD3D(me.x, me.y, me.z, target.x, target.y, target.z) < cheat.settings.aimbotRange) &&
            (!cheat.settings.rangeCheck || cheat.math.getD3D(me.x, me.y, me.z, target.x, target.y, target.z) <= me.weapon.range) &&
            !me[cheat.vars.reloadTimer]) {

            if (cheat.settings.awtv) {
                input[key.scope] = 1
            }
            target.isTarget = cheat.settings.markTarget

            const yDire = (cheat.math.getDir(me.z, me.x, target.npos.z, target.npos.x) || 0) * 1000
            const xDire = isAiTarget ?
                  ((cheat.math.getXDire(me.x, me.y, me.z, target.npos.x, target.npos.y - target.dat.mSize/2, target.npos.z) || 0) - (0.3 * me[cheat.vars.recoilAnimY])) * 1000 :
            ((cheat.math.getXDire(me.x, me.y, me.z, target.npos.x, target.npos.y - target[cheat.vars.crouchVal] * 3 + me[cheat.vars.crouchVal] * 3 + cheat.settings.aimOffset, target.npos.z) || 0) - (0.3 * me[cheat.vars.recoilAnimY])) * 1000

            // aimbot tweak
            if (cheat.settings.forceUnsilent) {
                game.controls.target = {
                    xD: xDire/1000,
                    yD: yDire/1000
                }
                game.controls.update(400)
            }

            // Different aimbot modes can share the same code
            switch (cheat.settings.aimbot) {
                    // quickscope, silent, trigger aim, silent on aim, aim correction, unsilent
                case 1: case 2: case 5: case 6: case 9: case 10: {
                    let onAim = [5, 6, 9].includes(cheat.settings.aimbot)
                    if ((cheat.settings.aimbot === 5 && input[key.scope]) || cheat.settings.aimbot === 10) {
                        game.controls.target = {
                            xD: xDire/1000,
                            yD: yDire/1000
                        }
                        game.controls.update(400)
                    }
                    if ([2, 10].includes(cheat.settings.aimbot) || (cheat.settings.aimbot === 1 && cheat.state.me.weapon.id)) {
                        !me.weapon.melee && (input[key.scope] = 1)
                    }
                    if ( /* me.weapon[cheat.vars.nAuto] && */ me[cheat.vars.didShoot]) {
                        input[key.shoot] = 0
                        cheat.state.quickscopeCanShoot = false
                        setTimeout(() => {
                            cheat.state.quickscopeCanShoot = true
                        }, me.weapon.rate)
                    } else if (cheat.state.quickscopeCanShoot && (!onAim || input[key.scope])) {
                        if (!me.weapon.melee) {
                            input[key.scope] = 1
                        }
                        if (!cheat.settings.superSilent && cheat.settings.aimbot !== 9) {
                            input[key.ydir] = yDire
                            input[key.xdir] = xDire
                        }
                        if ((cheat.settings.aimbot !== 9 && (!me[cheat.vars.aimVal] || me.weapon.noAim || me.weapon.melee)) ||
                            (cheat.settings.aimbot === 9 && isShooting)) {
                            input[key.ydir] = yDire
                            input[key.xdir] = xDire
                            input[key.shoot] = 1
                        }
                    }
                } break
                    // spin aim useless rn
                    // case 3: {
                    //     if (me[cheat.vars.didShoot]) {
                    //         input[key.shoot] = 0
                    //         cheat.state.quickscopeCanShoot = false
                    //         setTimeout(() => {
                    //             cheat.state.quickscopeCanShoot = true
                    //         }, me.weapon.rate)
                    //     } else if (cheat.state.quickscopeCanShoot && !cheat.state.spinFrame) {
                    //         cheat.state.spinFrame = input[key.frame]
                    //     } else {
                    //         const fullSpin = Math.PI * 2000
                    //         const spinFrames = cheat.settings.spinAimFrames
                    //         const currentSpinFrame = input[key.frame]-cheat.state.spinFrame
                    //         if (currentSpinFrame < 0) {
                    //             cheat.state.spinFrame = 0
                    //         }
                    //         if (currentSpinFrame > spinFrames) {
                    //             if (!cheat.settings.superSilent) {
                    //                 input[key.ydir] = yDire
                    //                 input[key.xdir] = xDire
                    //             }
                    //             if (!me[cheat.vars.aimVal] || me.weapon.noAim || me.weapon.melee) {
                    //                 input[key.ydir] = yDire
                    //                 input[key.xdir] = xDire
                    //                 input[key.shoot] = 1
                    //                 cheat.state.spinFrame = 0
                    //             }
                    //         } else {
                    //             input[key.ydir] = currentSpinFrame/spinFrames * fullSpin
                    //             if (!me.weapon.melee)
                    //                 input[key.scope] = 1
                    //         }
                    //     }
                    // } break

                    // aim assist, smooth on aim, smoother, easy aim assist
                case 4: case 7: case 8: case 11:
                    if (input[key.scope] || cheat.settings.aimbot === 11) {
                        game.controls.target = {
                            xD: xDire/1000,
                            yD: yDire/1000
                        }
                        game.controls.update(({
                            4: 400,
                            7: 110,
                            8: 70,
                            11: 400
                        })[cheat.settings.aimbot])
                        if ([4,11].includes(cheat.settings.aimbot)) {
                            input[key.xdir] = xDire
                            input[key.ydir] = yDire
                        }
                        if (me[cheat.vars.didShoot]) {
                            input[key.shoot] = 0
                            cheat.state.quickscopeCanShoot = false
                            setTimeout(() => {
                                cheat.state.quickscopeCanShoot = true
                            }, me.weapon.rate)
                        } else if (cheat.state.quickscopeCanShoot) {
                            input[me.weapon.melee ? key.shoot : key.scope] = 1
                        }
                    } else {
                        game.controls.target = null
                    }
                    break
                    // trigger bot
                case 12: {
                    if (!cheat.state.three ||
                        !cheat.state.renderer ||
                        !cheat.state.renderer.camera ||
                        !cheat.state.players ||
                        !cheat.state.players.list.length ||
                        !input[key.scope] ||
                        me[cheat.vars.aimVal]) {
                        break
                    }
                    // Only create these once for performance
                    if (!cheat.state.raycaster) {
                        cheat.state.raycaster = new cheat.state.three.Raycaster()
                        cheat.state.mid = new cheat.state.three.Vector2(0, 0)
                    }
                    const playerMaps = []
                    for (let i = 0; i < cheat.state.players.list.length; i++) {
                        let p = cheat.state.players.list[i]
                        if (!p || !p[cheat.vars.objInstances] || p.isYTMP || !(me.team === null || p.team !== me.team) || !p[cheat.vars.inView]) {
                            continue
                        }
                        playerMaps.push(p[cheat.vars.objInstances])
                    }
                    const raycaster = cheat.state.raycaster
                    raycaster.setFromCamera(cheat.state.mid, cheat.state.renderer.camera)
                    if (raycaster.intersectObjects(playerMaps, true).length) {
                        input[key.shoot] = me[cheat.vars.didShoot] ? 0 : 1
                    }
                } break
            }
        } else {
            if (cheat.settings.uwtv) {
                input[key.scope] = 0
            }
            cheat.state.spinFrame = 0
        }
    }

    if (cheat.settings.alwaysAim) {
        input[key.scope] = 1
    }
    if (cheat.settings.preventMeleeThrowing && me.weapon.melee) {
        input[key.scope] = 0
    }

}

function onVars() {
    Object.defineProperty(Object.prototype, cheat.vars.procInputs, {
        enumerable: false,
        get() {
            return this._procInputs
        },
        set(v) {
            if (typeof v === "function") {
                this._procInputs = new Proxy(v, {
                    apply(target, thisArg, [input, game, recon, lock]) {
                        procInputs.apply(thisArg, [thisArg, input, game, recon, lock])
                        return target.apply(thisArg, [input, game, recon, lock])
                    }
                })
            } else {
                this._procInputs = v
            }
        }
    })
}

function setVars(script) {
    //obfuscation bypass, not needed anymore
    //script = script.replace(/\[(0x[a-zA-Z0-9]+,?)+]\['map']\(\w+=>String\['fromCharCode']\(\w+\)\)\['join']\(''\)/g, a => "'" + eval(a) + "'")
    //-

    cheat.vars = {}
    const regexes = new Map()
    .set("inView", [/&&!\w+\['\w+']&&\w+\['\w+']&&\w+\['(\w+)']\)/, 1])
    //.set("canSee", [/\w+\['(\w+)']\(\w+,\w+\['x'],\w+\['y'],\w+\['z']\)\)&&/, 1])
    .set("procInputs", [/this\['(\w+)']=function\((\w+),(\w+),\w+,\w+\){(this)\['recon']/, 1])
    .set("aimVal", [/this\['(\w+)']-=0x1\/\(this\['weapon']\['\w+']\/\w+\)/, 1])
    //.set("pchObjc", [/0x0,this\['(\w+)']=new \w+\['Object3D']\(\),this/, 1])
    .set("didShoot", [/--,\w+\['(\w+)']=!0x0/, 1])
    .set("nAuto", [/'Single\\x20Fire','varN':'(\w+)'/, 1])
    .set("crouchVal", [/this\['(\w+)']\+=\w\['\w+']\*\w+,0x1<=this\['\w+']/, 1])
    .set("ammos", [/\['length'];for\(\w+=0x0;\w+<\w+\['(\w+)']\['length']/, 1])
    .set("weaponIndex", [/\['weaponConfig']\[\w+]\['secondary']&&\(\w+\['(\w+)']==\w+/, 1])
    .set("objInstances", [/\(\w+=\w+\['players']\['list']\[\w+]\)\['active']&&\w+\['(\w+)']\)/, 1])
    //.set("getWorldPosition", [/{\w+=\w+\['camera']\['(\w+)']\(\);/, 1])
    //.set("mouseDownL", [/this\['\w+']=function\(\){this\['(\w+)']=\w*0,this\['(\w+)']=\w*0,this\['\w+']={}/, 1])
    //.set("mouseDownR", [/this\['(\w+)']=0x0,this\['keys']=/, 1])
    .set("reloadTimer", [/0x0>=this\['(\w+')]&&0x0>=this\['swapTime']/, 1])
    .set("maxHealth", [/this\['health']\/this\['(\w+)']\?/, 1])
    //.set("xVel", [/this\['x']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedX']/, 1])
    //.set("yVel", [/this\['y']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedY']/, 1])
    //.set("zVel", [/this\['z']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedZ']/, 1])
    .set("recoilAnimY", [/this\['(\w+)']\+=this\['\w+']\*\(/, 1])


    for (const [name, arr] of regexes) {
        const found = arr[0].exec(script)
        if (!found) {
            alert("Failed to find " + name)
            cheat.vars[name] = name
        } else {
            cheat.vars[name] = found[arr[1]]
        }
    }
    console.log("VARS:")
    console.table(cheat.vars)
    console.log(JSON.stringify(cheat.vars))

    onVars()
}
function patch(gameCode) {
    // nametags - makes the nametags always show when either nametags or boxesp are enabled, and never show when full esp is enabled
    gameCode = gameCode.replace(/(&&!\w+\['\w+']&&\w+\['\w+'])&&(\w+\['\w+'])\)/, "$1 && ($2 || [1, 2].includes(cheat.settings.esp)) && cheat.settings.esp !== 3)")

    // wallbangs
    gameCode = gameCode.replace(/!(\w+)\['transparent']/, "(cheat.settings.wallbangs ? !$1.penetrable : !$1.transparent)")

    // fix for client
    gameCode = gameCode.replace("navigator['webdriver']", "false")

    // gay prxoy rmeove
    gameCode = gameCode.replace(",this['frustum']['containsPoint']=new Proxy(this['frustum']['containsPoint'],{'apply':function(){return!0x1;}})", "")

    // aimbot (procinputs)
    // moved to a object.defineproperty in the onVars() function
    //gameCode = gameCode.replace(/(this\['\w+']=function\(\w+,\w+,\w+,\w+\){)(this\['recon'])/, "$1{\n"+window.chonkercheats+"};$2")

    return gameCode
}

window.gameCodeInit = function(script) {
    console.log("Initializing cheat")
    return setVars(script), patch(script)
}
function when(fn, cb) {
    if (fn()) {
        return cb()
    }
    const itv = setInterval(() => {
        if (fn()) {
            clearInterval(itv)
            cb()
        }
    }, 100)
    }

when(() => window.windows, initGUI)
})()

async function onLoad() {
    // Fetch and Load Game Script
    const request = (url, type, opt = {}) => fetch(url, opt).then(response => response.ok ? response[type]() : null);
    const data = await request("https://krunker.io/social.html", "text");
    const buffer = await request("https://krunker.io/pkg/krunker." + /\w.exports="(\w+)"/.exec(data)[1] + ".vries", "arrayBuffer");
    const array = Array.from(new Uint8Array(buffer));
    const xor = array[0] ^ '!'.charCodeAt(0);
    const script = array.map((code) => String.fromCharCode(code ^ xor)).join('');
    const loader = new Function("__LOADER__mmTokenPromise", "Module", window.gameCodeInit(script));
    loader(request("https://cli.sys32.dev/token", "json").then(json => json.token), { csv: async () => 0 });
}

let observer = new MutationObserver(mutations => {
    for (let mutation of mutations) {
        for (let node of mutation.addedNodes) {
            if (node.tagName === 'SCRIPT' && node.type === "text/javascript" && node.innerHTML.startsWith("*!", 1)) {
                node.innerHTML = onLoad.toString().concat("\n", "onLoad();");
                observer.disconnect();
            }
        }
    }
});
observer.observe(document, {
    childList: true,
    subtree: true
});
