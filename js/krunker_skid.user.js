// ==UserScript==
// @name                Krunker.io Skid
// @namespace           https://github.com/skidlamer
// @author              SkidLamer
// @description         A cheat for krunker.io
// @downloadURL         https://skidlamer.github.io/js/krunker_skid.user.js
// @supportURL          https://github.com/skidlamer/skidlamer.github.io
// @match               *://krunker.io/*
// @run-at              document-start
// @grant               none
// ==/UserScript==
// Please Do not copy and paste this script to greasy fork and pretend you made it its lame/r I can and will give you the hose again
// Discord Krunker Heros - https://discord.gg/Emkf5by
// hook - credit to @hrt - https://github.com/hrt/KrunkerBypass
// esp - credit to @techy - https://www.gitmemory.com/Tehchy
// game - credit to @sidney - https://twitter.com/sidney_de_vries?lang=en
// other excellent krunker cheat script developers:
// @lemons - https://github.com/Lemons1337
// @funk - https://github.com/funk
// @masterP - https://github.com/MasterP-kr

class Utilities {
    constructor() {
        this.exports;
        this.ui;
        this.me;
        this.world;
        this.inputs;
        this.control;
        this.socket;
        this.server;
        this.keys = new Set();
        this.features = [];
        this.colors = ['Green', 'Orange', 'DodgerBlue', 'Black', 'Red'];
        this.settings = {
            showMenu: true,
            espMode: 4,
            espColor: 0,
            espFontSize: 14,
            tracers: true,
            canShoot: true,
            scopingOut: false,
            isSliding: false,
        }
        this.canvas = null;
        this.ctx = null;
		let interval_ui = setInterval(() => {
            if (document.getElementById("inGameUI") !== null) {
                clearInterval(interval_ui);
                this.onLoad();
            }
        }, 100);
    }

    onLoad() {
        addEventListener("keydown", e => {
            if ("INPUT" == window.document.activeElement.tagName) return;
			//if (event.shiftKey) {
			//	alert("The SHIFT key was pressed!");
			//}
			//if (event.ctrlKey) {
				//alert("The CTRL key was pressed!");
			//}
			const key = e.key.toUpperCase();
			if (!this.keys.has(key)) this.keys.add(key);
        });
        addEventListener("keyup", e => {
			const key = e.key.toUpperCase();
            if (this.keys.has(key)) this.keys.delete(key);
            for (const feature of this.features) {
                if (feature.hotkey.toUpperCase() === key) {
                    this.onUpdated(feature);
                }
            }
            if (key === "DELETE") this.resetSettings();
            if (key === "M") this.settings.showMenu ^=1;
        })

        this.newFeature('AutoAim', "1", ['Off', 'Aim Assist', 'Aim Bot', 'Trigger Bot']);
        this.newFeature('AutoBhop', "2", ['Off', 'Auto Jump', 'Auto Slide']);
        this.newFeature('EspMode', "3", ['Off', 'Full', '2d', 'Walls']);
        this.newFeature('AutoReload', "4", []);
        this.newFeature('NoDeathDelay', "5", []);
        this.newFeature('SkidSettings', "6", []);
        this.server.voiceChatMaxLength = 4;
    }

	keyDown(key) {
		return this.keys.has(key);
	}

    byte2Hex(n) {
        var chars = "0123456789ABCDEF";
        return String(chars.substr((n >> 4) & 0x0F,1)) + chars.substr(n & 0x0F,1);
    }

    rgb2hex(r,g,b) {
        return '#' + this.byte2Hex(r) + this.byte2Hex(g) + this.byte2Hex(b);
    }

    colorText(str, rgb, options) {
        return String( '<font style="color:' + this.rgb2hex(rgb[0],rgb[1],rgb[2]) + '"' + options + '>' + str + '</font>');
    }

    onTick(me, world, inputs) {
        this.me = me;
        this.world = world;
        this.inputs = inputs;
        this.server=this.exports.c[7].exports;

        for (let i = 0, sz = this.features.length; i < sz; i++) {
            const feature = this.features[i];
            switch (feature.name) {
                case 'AutoAim':
                    this.autoAim(feature.value);
                    break;
                case 'AutoReload':
                    if (feature.value) this.wpnReload();
                    break;
                case 'AutoBhop':
                    this.autoBhop(feature.value);
                    break;
                case 'NoDeathDelay':
                    if (feature.value && this.me && this.me.health === 0) {
                        this.server.deathDelay = 0;
                    }
                    break;
                case 'EspMode':
                    this.settings.espMode = feature.value;
                    break;
                case 'SkidSettings':
                        if (feature.value) new Map([ ["fov", 85], ["fpsFOV", 85], ["weaponBob", 3], ["weaponLean", 6], ["weaponOffX", 2], ["weaponOffY", 2], ["weaponOffZ", 2] ]).forEach(function(value, key, map) { window.setSetting(key, value) });
                        break;
            }
        }
    }

    resetSettings() {
        if (confirm("Are you sure you want to reset all your skid settings? This will also refresh the page")) {
            Object.keys(window.localStorage).filter(x => x.includes("utilities_")).forEach(x => window.localStorage.removeItem(x));
            window.location.reload();
        }
    }

    newFeature(name, key, array) {
        const cStruct = (...keys) => ((...v) => keys.reduce((o, k, i) => {
            o[k] = v[i];
            return o
        }, {}));
        const feature = cStruct('name', 'hotkey', 'value', 'valueStr', 'container')
        const value = parseInt(window.getSavedVal("utilities_" + name) || 0);
        this.features.push(feature(name, key, value, array.length ? array[value] : value ? "On" : "Off", array));
    }

    getFeature(name) {
        for (const feature of this.features) {
            if (feature.name.toLowerCase() === name.toLowerCase()) {
                return feature;
            }
        }
        return null;
    }

    featureColor(valueStr) {
        switch(valueStr) {
            case "On": return [178,242,82];
            case "Off": return [235,86,86];
            default: return [32,146,236];
        }
    }

    onUpdated(feature) {
        if (feature.container.length) {
            feature.value += 1;
            if (feature.value > feature.container.length - 1) {
                feature.value = 0;
            }
            feature.valueStr = feature.container[feature.value];
        } else {
            feature.value ^= 1;
            feature.valueStr = feature.value ? "On" : "Off";
        }
        window.saveVal("utilities_" + feature.name, feature.value);
    }

    getDistance3D(fromX, fromY, fromZ, toX, toY, toZ) {
        var distX = fromX - toX,
            distY = fromY - toY,
            distZ = fromZ - toZ;
        return Math.sqrt(distX * distX + distY * distY + distZ * distZ);
    }

    getDistance(player1, player2) {
        return this.getDistance3D(player1.x, player1.y, player1.z, player2.x, player2.y, player2.z);
    }

    getDirection(fromZ, fromX, toZ, toX) {
        return Math.atan2(fromX - toX, fromZ - toZ);
    }

    getXDir(fromX, fromY, fromZ, toX, toY, toZ) {
        var dirY = Math.abs(fromY - toY),
            dist = this.getDistance3D(fromX, fromY, fromZ, toX, toY, toZ);
        return Math.asin(dirY / dist) * (fromY > toY ? -1 : 1);
    }

    getAngleDist(start, end) {
        return Math.atan2(Math.sin(end - start), Math.cos(start - end));
    }

    camLookAt(X, Y, Z) {
        var xdir = this.getXDir(this.control.object.position.x, this.control.object.position.y, this.control.object.position.z, X, Y, Z),
            ydir = this.getDirection(this.control.object.position.z, this.control.object.position.x, Z, X),
            camChaseDst = this.server.camChaseDst;
        this.control.target = {
            xD: xdir,
            yD: ydir,
            x: X + camChaseDst * Math.sin(ydir) * Math.cos(xdir),
            y: Y - camChaseDst * Math.sin(xdir),
            z: Z + camChaseDst * Math.cos(ydir) * Math.cos(xdir)
        }
    }

    lookAt(target) {
        this.camLookAt(target.x2, target.y2 + target.height - target.headScale / 2 - this.server.crouchDst * target.crouchVal - this.me.recoilAnimY * this.server.recoilMlt * 25, target.z2);
    }

    getStatic(s, d) {
        if (typeof s == 'undefined') {
            return d;
        }
        return s;
    }

    teamColor(player) {
        return player.team === null ? '#FF4444' : this.me.team === player.team ? '#44AAFF' : '#FF4444';
    }

    getTarget() {
        const players = this.world.players.list.filter(player => { return player.active && !player.isYou });
        const targets = players.filter(player => {
            return player.inView && (!player.team || player.team !== this.me.team)
        }).sort((p1, p2) => this.getDistance(this.me, p1) - this.getDistance(this.me, p2));
        return targets[0];
    }

    autoAim(value) {
        if (!value) return;
        var lockedOn = false;
        const target = this.getTarget();
        if (this.me.didShoot) {
            this.settings.canShoot = false;
            setTimeout(() => {
                this.settings.canShoot = true;
            }, this.me.weapon.rate / 1.85);
        }
        if (target) {
            let playerDist = (Math.round(this.getDistance(this.me, target)) / 10).toFixed(0);
            const currentXDR = this.control.xDr;
            const currentYDR = this.control.yDr;
            if (isNaN(playerDist)) playerDist = 0;
            switch (value) {
                case 1:
                    /*Aim Assist*/
                    if (this.control.mouseDownR === 1) {
						this.world.config.deltaMlt = 5;
                        this.lookAt(target);
						this.world.config.deltaMlt = 1;
                        lockedOn = true;
                    } else {
						lockedOn = false;
                    }
                    break;
                case 2:
                    /*Aim Bot*/
					if (this.control.mouseDownL === 1) {
						this.control.mouseDownL = 0;
						this.control.mouseDownR = 0;
						this.settings.scopingOut = true;
					}
					if (this.me.aimVal === 1) {
						this.settings.scopingOut = false;
					}
					if (!this.settings.scopingOut && this.settings.canShoot && this.me.recoilForce <= 0.01) {
						this.world.config.deltaMlt = 5;
                    this.lookAt(target);
						if (this.control.mouseDownR !== 2) {
                        this.control.mouseDownR = 2;
						}
                        lockedOn = true;
						this.world.config.deltaMlt = 1;
					}	else lockedOn = false;
                    break;
                case 3:
                    /*Trigger Bot*/
                    lockedOn = this.quickscoper(target);
                    this.control.xDr = currentXDR;
                    this.control.yDr = currentYDR;
                    break;
            }
        }
        if (!lockedOn) {
			this.world.config.deltaMlt = 1;
            this.camLookAt(0, 0, 0);
            this.control.target = null;
            if (this.control.mouseDownR == 2) {
                this.control.mouseDownR = 0;
            }
        }
    }

    quickscoper(target) {
        if (this.control.mouseDownL === 1) {
            this.control.mouseDownL = 0;
            this.control.mouseDownR = 0;
            this.settings.scopingOut = true;
        }

        if (this.me.aimVal === 1) {
            this.settings.scopingOut = false;
        }

        if (this.settings.scopingOut || !this.settings.canShoot) {
            return false;
        }

        if (this.me.recoilForce > 0.01) {
			this.world.config.deltaMlt = 1;
            return false;
        }

		this.world.config.deltaMlt = 5;
		this.lookAt(target);
        if (this.control.mouseDownR !== 2) {
            this.control.mouseDownR = 2;
        }

        if (this.me.aimVal < 0.2) {
			this.world.config.deltaMlt = 5;
            this.control.mouseDownL ^= 1;
			this.world.config.deltaMlt = 1;
        }

        return true;
    }

    autoBhop(value) {
        if (!value) return;
        if (this.keyDown(" ")) { //Space
            this.control.keys[this.control.jumpKey] = !this.control.keys[this.control.jumpKey];
            if (value === 2) {
                if (this.settings.isSliding) {
                    this.inputs[8] = 1;
                    return;
                }
                if (this.me.yVel < -0.04 && this.me.canSlide) {
                    this.settings.isSliding = true;
                    setTimeout(() => {
                        this.settings.isSliding = false;
                    }, this.me.slideTimer);
                    this.inputs[8] = 1;
                }
            }
        }
    }

    wpnReload(force = false) {
        //(inputs[9] = me.ammos[me.weaponIndex] === 0);
        const ammoLeft = this.me.ammos[this.me.weaponIndex];
        if (force || ammoLeft === 0) this.world.players.reload(this.me);
    }

     world2Screen(camera, pos3d, aY = 0) {
        let pos = pos3d.clone();
        pos.y += aY;
        pos.project(camera);
        pos.x = (pos.x + 1) / 2;
        pos.y = (-pos.y + 1) / 2;
        pos.x *= this.canvas.width || innerWidth;
        pos.y *= this.canvas.height || innerHeight;
        return pos;
    }

    pixelTranslate(ctx, x, y) {
        ctx.translate(~~x, ~~y);
    }

    text(txt, font, color, x, y) {
        this.ctx.save();
        this.pixelTranslate(this.ctx, x, y);
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.font = font;
        this.ctx.lineWidth = 1;
        this.ctx.strokeText(txt, 0, 0);
        this.ctx.fillText(txt, 0, 0);
        this.ctx.restore();
    }

    rect(x, y, ox, oy, w, h, color, fill) {
        this.ctx.save();
        this.pixelTranslate(this.ctx, x, y);
        this.ctx.beginPath();
        fill ? this.ctx.fillStyle = color : this.ctx.strokeStyle = color;
        this.ctx.rect(ox, oy, w, h);
        fill ? this.ctx.fill() : this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    line(x1, y1, x2, y2, lW, sS) {
        this.ctx.save();
        this.ctx.lineWidth = lW + 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
        this.ctx.stroke();
        this.ctx.lineWidth = lW;
        this.ctx.strokeStyle = sS;
        this.ctx.stroke();
        this.ctx.restore();
    }

    image(x, y, img, ox, oy, w, h) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.beginPath();
        this.ctx.drawImage(img, ox, oy, w, h);
        this.ctx.closePath();
        this.ctx.restore();
    }

    gradient(x, y, w, h, colors) {
        let grad = this.ctx.createLinearGradient(x, y, w, h);
        for (let i = 0; i < colors.length; i++) {
            grad.addColorStop(i, colors[i]);
        }
        return grad;
    }

    getTextMeasurements(arr) {
        for (let i = 0; i < arr.length; i++) {
            arr[i] = ~~this.ctx.measureText(arr[i]).width;
        }
        return arr;
    }

	drawEsp(ui, world, myself) {
		const me = ui.camera.getWorldPosition()
		for (const entity of world.players.list.filter(x => !x.isYou && x.active)) {
			//if (!entity.rankIcon && entity.level > 0) {
			//	let rankVar = entity.level > 0 ? Math.ceil(entity.level / 3) * 3 : entity.level < 0 ? Math.floor(entity.level / 3) * 3 : entity.level;
			//	let rankId = Math.max(Math.min(100, rankVar - 2), 0);
			//	entity.rankIcon = new Image();
			//	entity.rankIcon.src = `./img/levels/${rankId}.png`;
			//}
			const target = entity.objInstances.position.clone();
			if (ui.frustum.containsPoint(target)) {
				let screenR = this.world2Screen(ui.camera, entity.objInstances.position.clone());
				let screenH = this.world2Screen(ui.camera, entity.objInstances.position.clone(), entity.height);
				let hDiff = ~~(screenR.y - screenH.y);
				let bWidth = ~~(hDiff * 0.6);
				const color = this.colors[this.settings.espColor];
				if (this.settings.espMode > 0 && this.settings.espMode != 3) {
					this.rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, 0, 0, 4, hDiff + 2, '#000000', false);
					this.rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, 0, 0, 4, hDiff + 2, '#44FF44', true);
					this.rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, 0, 0, 4, ~~((entity.maxHealth - entity.health) / entity.maxHealth * (hDiff + 2)), '#000000', true);
					this.ctx.save();
					this.ctx.lineWidth = 4;
					this.pixelTranslate(this.ctx, screenH.x - bWidth / 2, screenH.y);
					this.ctx.beginPath();
					this.ctx.rect(0, 0, bWidth, hDiff);
					this.ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
					this.ctx.stroke();
					this.ctx.lineWidth = 2;
					this.ctx.strokeStyle = entity.team === null ? '#FF4444' : myself.team === entity.team ? '#44AAFF' : '#FF4444';
					this.ctx.stroke();
					this.ctx.closePath();
					this.ctx.restore();
					if (this.settings.espMode === 1) {
						let playerDist = parseInt(this.getDistance3D(me.x, me.y, me.z, target.x, target.y, target.z) / 10);
						this.ctx.save();
						this.ctx.font = this.settings.espFontSize + 'px GameFont';
						let meas = this.getTextMeasurements([" ", playerDist, "m ", entity.level, "©", entity.name]);
						this.ctx.restore();
						let grad2 = this.gradient(0, 0, meas[4] * 5, 0, ["rgba(0, 0, 0, 0.25)", "rgba(0, 0, 0, 0)"]);
						let padding = 2;
						//if (entity.rankIcon && entity.rankIcon.complete) {
						//	let grad = this.gradient(0, 0, (meas[4] * 2) + meas[3] + (padding * 3), 0, ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.25)"]);
						//	this.rect(~~(screenH.x - bWidth / 2) - 12 - (meas[4] * 2) - meas[3] - (padding * 3), ~~screenH.y - padding, 0, 0, (meas[4] * 2) + meas[3] + (padding * 3), meas[4] + (padding * 2), grad, true);
						//	this.ctx.drawImage(entity.rankIcon, ~~(screenH.x - bWidth / 2) - 16 - (meas[4] * 2) - meas[3], ~~screenH.y - (meas[4] * 0.5), entity.rankIcon.width * ((meas[4] * 2) / entity.rankIcon.width), entity.rankIcon.height * ((meas[4] * 2) / entity.rankIcon.height));
						//	this.text(`${entity.level}`, `${this.settings.espFontSize}px GameFont`, '#FFFFFF', ~~(screenH.x - bWidth / 2) - 16 - meas[3], ~~screenH.y + meas[4] * 1);
						//}
						this.rect(~~(screenH.x + bWidth / 2) + padding, ~~screenH.y - padding, 0, 0, (meas[4] * 5), (meas[4] * 4) + (padding * 2), grad2, true);
						this.text(entity.name, this.settings.espFontSize+'px GameFont', entity.team === null ? '#FFCDB4' : myself.team === entity.team ? '#B4E6FF' : '#FFCDB4', (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 1)
						if (entity.clan) this.text('['+entity.clan+']', this.settings.espFontSize+'px GameFont', '#AAAAAA', (screenH.x + bWidth / 2) + 8 + meas[5], screenH.y + meas[4] * 1)
						this.text(entity.health+' HP', this.settings.espFontSize+'px GameFont', "#33FF33", (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 2)
						this.text(entity.weapon.name, this.settings.espFontSize+'px GameFont', "#DDDDDD", (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 3)
						this.text("[", this.settings.espFontSize+'px GameFont', "#AAAAAA", (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 4)
						this.text(playerDist, this.settings.espFontSize+'px GameFont', "#DDDDDD", (screenH.x + bWidth / 2) + 4 + meas[0], screenH.y + meas[4] * 4)
						this.text("m]", this.settings.espFontSize+'px GameFont', "#AAAAAA", (screenH.x + bWidth / 2) + 4 + meas[0] + meas[1], screenH.y + meas[4] * 4)
					}
				}
				if (this.settings.espMode === 1 || this.settings.espMode === 2) this.line(innerWidth / 2, innerHeight - 1, screenR.x, screenR.y, 2, entity.team === null ? '#FF4444' : myself.team === entity.team ? '#44AAFF' : '#FF4444');
			}
		}
    }

    drawMenu() {
        let width = 320, height = 280, X = 20, Y = 280;
        this.rect(X, Y, 0, 0, width, height, 'rgba(0,0,0,0.5)', true);
        this.rect(X, Y, 0, 0, width, 50, '#B447FF', true);
        this.text("Krunker Skid", "20px GameFont", "#FFFFFF", width / 2 - this.getTextMeasurements(["Krunker Skid"]) - X / 2, Y + 40);
        this.rect(X + 10, Y + 60, 0, 0, width -20, height -70, '#FFFFFF', false);
        var posX = X + 10, posY = Y + 65;
        for (const feature of this.features) {
            this.text('[ ' + feature.hotkey.toUpperCase() + ' ]', "13px GameFont", "#FFC147", posX + 15, posY += 30);
            this.text(feature.name, "13px GameFont", "#44AAFF", posX + 60, posY);
            this.text(feature.valueStr, "13px GameFont", feature.valueStr == "On" ? "#B2F252" : feature.valueStr == "Off" ? "#FF4444" : "#999EA5", posX + 55 + 140, posY);
        }
    }

	onRender(uiConfig, scale, world, ui, me, scale2) {
		if (uiConfig)
		{
			uiConfig.crosshairAlways = true;
			this.settings.espFontSize = uiConfig.dmgScale * 0.25;
			this.canvas = uiConfig.canvas || document.getElementById("game-overlay");
			this.ctx = this.canvas.getContext("2d");
			this.ctx.save();
			this.ctx.clearRect(0, 0, this.canvas.width || innerWidth, this.canvas.height || innerHeight);
			if (world && ui && me )
			{
				if ('none' == self.menuHolder.style.display && 'none' == self.endUI.style.display) {
                    this.drawEsp(ui, world, me);
                    if (this.settings.showMenu) this.drawMenu();
                }
			}
			this.ctx.restore();
		}
	}
}

function patchGame(source) {
    source = Utilities.toString().concat(source);
    const patches = new Map()
    .set("html_exports", [/(\['__CANCEL__']=.*?\(\w+,\w+,(\w+)\){)(let)/, '$1window.utilities=new Utilities();utilities.exports=$2;$3'])
    .set("html_controlView", [/(if\(this\['target']\){)/, '$1this.object.rotation.y=this.target.yD;this.pitchObject.rotation.x=this.target.xD;const half=Math.PI/2;this.yDr=Math.max(-half,Math.min(half,this.target.xD))%Math.PI;this.xDr=this.target.yD%Math.PI;'])
    .set("html_control", [/(=this;this\['gamepad'])/, '=utilities.control$1'])
    .set("html_procInputs", [/(this\['procInputs']=function\((\w+),(\w+),(\w+)\){)/, '$1utilities.onTick(this,$3,$2);'])
    .set("html_ui", [/(this,\w+={};this\['frustum'])/, 'utilities.ui=$1'])
    .set("html_fixHowler", [/(Howler\['orientation'](.+?)\)\),)/, ``])
    .set("html_clearRec", [/(if\(\w+\['save']\(\),\w+\['scale']\(\w+,\w+\),)\w+\['clearRect']\(0x0,0x0,\w+,\w+\),(\w+\['showDMG']\))/, '$1$2'])
    .set("html_onRender", [/((\w+)\['render']=function\((\w+,\w+,\w+,\w+,\w+)\){)/, '$1utilities.onRender($2,$3);'])
    .set("html_pInfo", [/(if\()(!tmpObj\['inView']\)continue;)/, '$1utilities.settings.espMode==1||utilities.settings.espMode==0&&$2'])
    .set("html_wallhack", [/(\(((\w+))=this\['map']\['manager']\['objects']\[(\w+)]\))(.+?)\)/, '$1.penetrable&&$2.active)'])
    .set("html_socket", [/(new WebSocket)/, 'utilities.socket=$1'])

    for (const [name, item] of patches) {
        const patched = source.replace(item[0], item[1]);
        if (source === patched) {
            alert(`Failed to patch ${name}`);
            continue;
        } else console.log("Successfully patched ", name);
        source = patched;
    }

    return source;
}

(function () {
    var hideHook = (fn, oFn) => { fn.toString = oFn.toString.bind(oFn) };
    const handler = { construct(target, args) { if (args.length == 2 && args[1].length >140000) { args[1] = patchGame(args[1]); } return new target(...args); } };
    const original = self.Function;
    self.Function = new Proxy(Function, handler);
    hideHook(Function, original);
})();