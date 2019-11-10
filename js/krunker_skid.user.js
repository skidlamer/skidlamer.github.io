// ==UserScript==
// @name                Krunker.io Skid
// @namespace           https://github.com/skidlamer
// @author              SkidLamer
// @version             1.8.8
// @description         A cheat for krunker.io
// @downloadURL         https://skidlamer.github.io/js/krunker_skid.user.js
// @supportURL          https://github.com/skidlamer/skidlamer.github.io
// @icon                https://krunker.io/img/favicon.png
// @match               *://krunker.io/*
// @require             https://skidlamer.github.io/js/FileSaver.js
// @run-at              document-start
// @grant               none
// ==/UserScript==
// Please Do not copy and paste this script to greasy fork and pretend you made it its lame/r I can and will give you the hose again
// Discord Krunker Heros - https://discord.gg/Emkf5by
// hook - credit to @lemons - https://github.com/Lemons1337
// esp - credit to @techy - https://www.gitmemory.com/Tehchy
// game - credit to @sidney - https://twitter.com/sidney_de_vries?lang=en
// other excellent krunker cheat script developers:
// @lemons - https://github.com/Lemons1337
// @funk - https://github.com/funk
// @masterP - https://github.com/MasterP-kr
// @Nathan - for Krunkers Failed Anti cheat I hear McDonalds Is Hiring.
class Utilities {
    constructor() {
        this.exports;
        this.ui;
        this.me;
        this.world;
        this.inputs;
        this.socket;
        this.server;
        this.downKeys = new Set();
        this.upKeys = new Set();
        this.menus = new Map();
        this.features = [];
        this.colors = {
                    aqua: '#7fdbff',
                    blue: '#0074d9',
                    lime: '#01ff70',
                    navy: '#001f3f',
                    teal: '#39cccc',
                    olive: '#3d9970',
                    green: '#2ecc40',
                    red: '#ff4136',
                    maroon: '#85144b',
                    orange: '#ff851b',
                    purple: '#b10dc9',
                    yellow: '#ffdc00',
                    fuchsia: '#f012be',
                    greyDark: '#808080',
                    greyMed: '#a9a9a9',
                    greyLight: '#d3d3d3',
                    white: '#ffffff',
                    black: '#000000',
                    silver: '#dddddd',
                    hostile: '#eb5656',
                    friendly: '#9eeb56',
                };
        this.settings = {
            showMenu: true,
            autoAimWalls: 0,
            aimOffset: -0.6,
            espMode: 4,
            espFontSize: 100,
            canShoot: true,
            scopingOut: false,
            isSliding: false,
            delta:1,
        }
        this.activeMenuIndex = 0;
        this.activeLineIndex = 0;
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
        this.menus
        .set('Krunker Skid', [this.newFeature('Self', []), this.newFeature('Weapon', []), this.newFeature('Visual', []), this.newFeature('Settings', [])])
        .set('Self', [this.newFeature('AutoBhop', ['Off', 'Auto Jump', 'Key Jump', 'Auto Slide', 'Key Slide']), this.newFeature('SkidSettings', ['Off', 'On'])])
        .set('Weapon', [this.newFeature('AutoAim', ['Off', 'Aim Assist', 'Aim Bot', 'Trigger Bot']), this.newFeature('AutoReload', ['Off', 'On']), this.newFeature('Aim Through Walls', ['Off', 'On']), this.newFeature('UseDeltaForce', ['Off', 'On'])])
        .set('Visual', [this.newFeature('EspMode', ['Off', 'Full', '2d', 'Walls']), this.newFeature('Tracers', ['Off', 'On'])])
        .set('Settings', [this.newFeature('Reset', [], this.resetSettings), this.newFeature('Save game.js', [], _=>{self.saveAs(new Blob([self.GameScript], {type: "text/plain;charset=utf-8"}), `game.js`)})])
        // EventListeners and Hooks ...
        addEventListener("keydown", e => {
            if ("INPUT" == window.document.activeElement.tagName) return;
            const key = e.key.toUpperCase();
            const code = e.code;
			if (!this.downKeys.has(code)) this.downKeys.add(code);
        });
        addEventListener("keyup", e => {
			const key = e.key.toUpperCase();
            const code = e.code;
            if (this.downKeys.has(code)) this.downKeys.delete(code);
            if (!this.upKeys.has(code)) this.upKeys.add(code);

            if (key === "L") {
                console.dir(self);
                console.dir(this.me);
                console.dir(this.world);
                console.dir(this.server);
                this.server.serverConfig[23].def === "false" ? this.server.serverConfig[23].def = "true" : this.server.serverConfig[23].def = "false";
            }
        })
        window.$.Vector3 = (x, y, z) => { this.x = x || 0; this.y = y || 0; this.z = z || 0; return this; }
    }

	keyDown(code) {
		return this.downKeys.has(code);
	}

    keyUp(code) {
        if (this.upKeys.has(code)) {
            this.upKeys.delete(code);
            return true;
        }
		return false;
	}

    byte2Hex(n) {
        var chars = "0123456789ABCDEF";
        return String(chars.substr((n >> 4) & 0x0F,1)) + chars.substr(n & 0x0F,1);
    }

    rgba2hex(r,g,b,a = 255) {
        return ("#").concat(this.byte2Hex(r),this.byte2Hex(g),this.byte2Hex(b),this.byte2Hex(a));
    }

    onTick(player, world) {
        if (world && player && player.isYou && player.active) {
        this.world = world;
            this.me = player;
        this.server=this.exports.c[7].exports;
            this.me.weapon.range = Infinity;
            this.me.weapon.pierce = Infinity;

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
                    case 'EspMode':
                    this.settings.espMode = feature.value;
                    break;
                case 'SkidSettings':
                    if (feature.value) new Map([ ["fov", 85], ["fpsFOV", 85], ["weaponBob", 3], ["weaponLean", 6], ["weaponOffX", 2], ["weaponOffY", 2], ["weaponOffZ", 2] ]).forEach(function(value, key, map) { window.setSetting(key, value) });
                    break;
                case 'UseDeltaForce':
                    this.settings.delta = feature.value ? 5 : 1;
                    break;
                }
            }
        }
    }

    resetSettings() {
        if (confirm("Are you sure you want to reset all your skid settings? This will also refresh the page")) {
            Object.keys(window.localStorage).filter(x => x.includes("utilities_")).forEach(x => window.localStorage.removeItem(x));
            window.location.reload();
        }
    }

    newFeature(name, array, myFunction = null) {
        const cStruct = (...keys) => ((...v) => keys.reduce((o, k, i) => {
            o[k] = v[i];
            return o
        }, {}));
        var item = [];
        const myStruct = cStruct('name', 'value', 'valueStr', 'container', 'myFunction')
        const value = parseInt(window.getSavedVal("utilities_" + name) || 0);
        const feature = myStruct(name, value, array.length ? array[value] : '', array, myFunction);
        if (array.length||myFunction) this.features.push(feature);
        item.push(feature);
        return item;
    }

    getFeature(name) {
        for (const feature of this.features) {
            if (feature.name.toLowerCase() === name.toLowerCase()) {
                return feature;
            }
        }
        return null;
    }

    onUpdated(feature) {
        if (feature.container.length) {
            feature.value += 1;
            if (feature.value > feature.container.length - 1) {
                feature.value = 0;
            }
            feature.valueStr = feature.container[feature.value];
            window.saveVal("utilities_" + feature.name, feature.value);
        }
        if (feature.container.length == 2 && feature.container[0] == 'Off' && feature.container[1] == 'On') {
            console.log(feature.name, " is now ", feature.valueStr);
            switch (feature.name) {
                case 'Aim Through Walls': this.settings.autoAimWalls = feature.value;
                    break;
            }
        }
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

    camLookAt(pos) {
        const camChaseDst = this.server.camChaseDst;
        var xdir = this.getXDir(this.world.controls.object.position.x, this.world.controls.object.position.y, this.world.controls.object.position.z, pos.x, pos.y, pos.z),
            ydir = this.getDirection(this.world.controls.object.position.z, this.world.controls.object.position.x, pos.z, pos.x);
        this.world.controls.target = {
            xD: xdir,
            yD: ydir,
            x: pos.x + camChaseDst * Math.sin(ydir) * Math.cos(xdir),
            y: pos.y - camChaseDst * Math.sin(xdir),
            z: pos.z + camChaseDst * Math.cos(ydir) * Math.cos(xdir)
        }
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

    autoAim(value) {
        if (!value) return;
        if (this.me.didShoot) {
            this.inputs[5] = 0;
            this.settings.canShoot = false;
            setTimeout(()=>{ this.settings.canShoot = true; }, this.me.weapon.rate / 1.75);
        } else if (!this.me.aimVal) {
            this.inputs[6] = this.world.controls.mouseDownL;
            this.inputs[5] = this.world.controls.mouseDownR;
        } else {
            this.inputs[6] = this.world.controls.mouseDownR;
        }

        const enemies = this.world.players.list.filter(x => { return x.active && x.cnBSeen && !x.isYou && (!x.team || x.team !== this.me.team); }).sort((p1, p2) => this.getDistance(this.me, p1) - this.getDistance(this.me, p2));
        const target = enemies.shift();
        if (target !== undefined) {
            switch (value) {
                case 1:
                    /*Aim Assist*/
                    if (this.world.controls.mouseDownR > 0) {
						this.world.config.deltaMlt = this.settings.delta;
                        this.camLookAt(target.x2, target.y2 + target.height + this.settings.aimOffset - this.server.cameraHeight - this.server.crouchDst * target.crouchVal - this.server.recoilMlt * this.me.recoilAnimY * this.me.recoilForce, target.z2);
						this.world.config.deltaMlt = 1;
                    }
                    break;
                case 2:
                    /*Aim Bot*/
					this.Aimbot(target, false);
                    break;
                case 3:
                    /*Trigger Bot*/
					this.Aimbot(target, true);
                    break;
                default: break;
            }
        }
        else {
            this.world.controls.target = null;
            this.world.config.deltaMlt = 1;
            if (this.world.controls.mouseDownR > 1) this.world.controls.mouseDownR = 0;
        }
    }

    Aimbot(target, autoShoot) {

        if (this.world.controls.mouseDownL > 0) {
            this.world.controls.mouseDownL = 0;
            this.world.controls.mouseDownR = 0;
            this.settings.scopingOut = true;
        }

        if (this.me.aimVal === 1) {
            this.settings.scopingOut = false;
        }

        if (this.me.recoilForce > 0) {
            this.me.recoilTween = new self.TWEEN.Tween(this.me).to({ recoilTweenY: 0, recoilTweenYM: 0, recoilTweenZ: 0 });
        }

        if (this.settings.scopingOut || !this.settings.canShoot) {
            return;
        }

        this.world.config.deltaMlt = this.settings.delta;

        let pos = self.$.Vector3(target.x2, target.y2 + this.server.playerHeight - this.server.headScale / 2 - target.crouchVal * this.server.crouchDst, target.z2);
        let xDr = this.getXDir(this.world.controls.object.position.x, this.world.controls.object.position.y, this.world.controls.object.position.z, target.x2, pos.y, target.z2);
        let yDr = this.getDirection(this.world.controls.object.position.z, this.world.controls.object.position.x, target.z2, target.x2);
        this.inputs[2] = yDr;
        this.inputs[3] = xDr;
        if (autoShoot) {
            this.camLookAt(pos);
            this.world.controls.mouseDownR = 2;
            if (this.me.aimVal < 0.2) {
                this.world.controls.mouseDownL ^= 1;
            }
        }
        else {
            this.world.config.deltaMlt = this.settings.delta;
            this.camLookAt(pos);
            if (target.cnBSeen) this.world.controls.mouseDownR = 2;
        }

        this.world.config.deltaMlt = 1;
    }

    autoBhop(value) {
        if (!value) return;
        if (this.keyDown("Space") || value == 1 || value == 3) {
            this.world.controls.keys[this.world.controls.jumpKey] = !this.world.controls.keys[this.world.controls.jumpKey];
            if (value > 2) {
                if (this.settings.isSliding) {
                    this.world.controls.keys[this.world.controls.crouchKey] = 1;
                    return;
                }
                if (this.me.yVel < -0.04 && this.me.canSlide) {
                    this.settings.isSliding = true;
                    setTimeout(() => {
                    this.settings.isSliding = false;
                        this.world.controls.keys[this.world.controls.crouchKey] = 0;
                    }, 350);
                    this.world.controls.keys[this.world.controls.crouchKey] = 1;
                }
            }
        }
    }

    wpnReload(force = false) {
        //(inputs[9] = me.ammos[me.weaponIndex] === 0);
        const ammoLeft = this.me.ammos[this.me.weaponIndex];
        if (force || ammoLeft === 0) {
            this.world.players.reload(this.me);
            if (ammoLeft) this.world.players.endReload(this.me.weapon);
        }
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

    roundRect(x, y, width, height, radius, fill, stroke, color) {
        var cornerRadius = {
            upperLeft: 0,
            upperRight: 0,
            lowerLeft: 0,
            lowerRight: 0
        };
        if (typeof stroke == "undefined") {
            stroke = true;
        }
        if (typeof radius === "object") {
            for (var side in radius) {
                cornerRadius[side] = radius[side];
            }
        }
        this.ctx.save();
        this.pixelTranslate(this.ctx, x, y);
        this.ctx.beginPath();
        this.ctx.moveTo(x + cornerRadius.upperLeft, y);
        this.ctx.lineTo(x + width - cornerRadius.upperRight, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
        this.ctx.lineTo(x + width, y + height - cornerRadius.lowerRight);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
        this.ctx.lineTo(x + cornerRadius.lowerLeft, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
        this.ctx.lineTo(x, y + cornerRadius.upperLeft);
        this.ctx.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
        this.ctx.closePath();
        if (stroke) {
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        }
        if (fill) {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }
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
        const font = this.settings.espFontSize + 'px Sans-serif';
        const setting = this.getFeature('EspMode').container[this.settings.espMode];
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

				if (setting !== 'Walls') {
                    /*healthBar*/
                    let health = entity.health;
                    this.rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, 0, 0, 4, hDiff + 2, this.colors.black, false);
                    this.rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, 0, 0, 4, hDiff + 2, health > 75 ? this.colors.green : health > 50 ? this.colors.orange : this.colors.red, true);
                    this.rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, 0, 0, 4, ~~((entity.maxHealth - entity.health) / entity.maxHealth * (hDiff + 2)), this.colors.black, true);
					/*2d*/
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
					if (setting === 'Full') {
                        /*healthBar*/
						let playerDist = parseInt(this.getDistance3D(me.x, me.y, me.z, target.x, target.y, target.z) / 10);
						this.ctx.save();
						//this.ctx.font = font;
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
						this.text(entity.name, font, entity.team === null ? '#FFCDB4' : myself.team === entity.team ? '#B4E6FF' : '#FFCDB4', (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 1)
						if (entity.clan) this.text('['+entity.clan+']', font, '#AAAAAA', (screenH.x + bWidth / 2) + 8 + meas[5], screenH.y + meas[4] * 1)
						this.text(entity.health+' HP', font, "#33FF33", (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 2)
						this.text(entity.weapon.name, font, "#DDDDDD", (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 3)
						this.text("[", font, "#AAAAAA", (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 4)
						this.text(playerDist, font, "#DDDDDD", (screenH.x + bWidth / 2) + 4 + meas[0], screenH.y + meas[4] * 4)
						this.text("m]", font, "#AAAAAA", (screenH.x + bWidth / 2) + 4 + meas[0] + meas[1], screenH.y + meas[4] * 4)
					}
				}
        const tracers = this.getFeature('Tracers');
				if (tracers && tracers.value) if (this.settings.espMode === 1 || this.settings.espMode === 2) this.line(innerWidth / 2, innerHeight - 1, screenR.x, screenR.y, 2, entity.team === null ? '#FF4444' : myself.team === entity.team ? '#44AAFF' : '#FF4444');
			}
		}
    }

    drawMenuLine(item, lineWidth, lineHeight, lineTop, lineLeft, textLeft, active, title, rescaleText = true)
    {
        // default values
        let text_col = [255, 255, 255, 255],
            rect_col = [0, 0, 0, 120],
            text_scale = 20,
            font = 'px sans-serif';

        // active line values
        if (active) {
            text_col[0] = 0;
            text_col[1] = 0;
            text_col[2] = 0;
            rect_col[0] = 231;
            rect_col[1] = 231;
            rect_col[2] = 231;
            if (rescaleText) text_scale = 21;
        }

        // title values
        if (title)
        {
            rect_col[0] = 70;
            rect_col[1] = 90;
            rect_col[2] = 90;
            rect_col[3] = 255;
            if (rescaleText) text_scale = 20;
            font = 'px GameFont';
            textLeft = lineWidth / 2 - this.getTextMeasurements([item.name]);
        }

        // rect
        this.rect(lineLeft, lineTop, 0, 0, lineWidth, (lineHeight * 2), this.rgba2hex(rect_col[0],rect_col[1],rect_col[2],rect_col[3]), true);

        // text
        this.text(item.name, text_scale+font, this.rgba2hex(text_col[0],text_col[1],text_col[2]), textLeft, lineTop + lineHeight + lineHeight/2);

        // value
        this.text(item.valueStr, text_scale+font, item.valueStr == "On" ? "#B2F252" : item.valueStr == "Off" ? "#FF4444" : active ? "#333333" : "#999EA5", lineWidth - textLeft * 1.5 - this.getTextMeasurements([item.valueStr]), lineTop + lineHeight + lineHeight/2);
    }

    drawMenuItem(caption) {
        const top = 280;
        const left = 20;
        const lineWidth = 320;
        const items = this.menus.get(caption);
        if (!items.length) return;
        if (this.activeLineIndex > items.length -1) this.activeLineIndex = 0;

        // draw menu
        this.drawMenuLine({name:caption,valueStr:''}, lineWidth, 22, top + 18, left, left + 5, false, true);
        for (var i = 0; i < items.length; i++) {
            if (i != this.activeLineIndex) this.drawMenuLine(items[i][0], lineWidth, 19, top + 60 + i * 36, left, left + 9, false, false);
            this.drawMenuLine(items[this.activeLineIndex][0], lineWidth, 19, top + 60 + this.activeLineIndex * 36, left, left + 9, true, false);
        }

        // process buttons
        if (this.keyUp("Numpad5")||this.keyUp("ArrowRight")) {
            self.SOUND.play('tick_0',0.1)
            const feature = items[this.activeLineIndex][0];
            if (feature) {
                if (feature.container.length) this.onUpdated(feature);
                else if (typeof feature.myFunction === "function") feature.myFunction();
                else this.activeMenuIndex = this.activeLineIndex + 1;
            }
        } else if (this.keyUp("Numpad0")||this.keyUp("ArrowLeft")) {
            self.SOUND.play('tick_0',0.1);
            if (this.activeMenuIndex > 0) this.activeMenuIndex = 0;
            else this.settings.showMenu = false;
            return;
        } else if (this.keyUp("Numpad8")||this.keyUp("ArrowUp")) {
            self.SOUND.play('tick_0',0.1)
            if (this.activeLineIndex == 0) this.activeLineIndex = items.length;
                this.activeLineIndex--;
        } else if (this.keyUp("Numpad2")||this.keyUp("ArrowDown")) {
            self.SOUND.play('tick_0',0.1)
            this.activeLineIndex++;
            if (this.activeLineIndex == items.length) this.activeLineIndex = 0;
        }
    }

    drawMenu() {
        if (this.settings.showMenu) {
            switch(this.activeMenuIndex) {
                case 0: this.drawMenuItem('Krunker Skid'); break;
                case 1: this.drawMenuItem('Self'); break;
                case 2: this.drawMenuItem('Weapon'); break;
                case 3: this.drawMenuItem('Visual'); break;
                case 4: this.drawMenuItem('Settings'); break;
                default: break;
            }
        }
        else if (this.keyUp("Numpad0")||this.keyUp("ArrowLeft")) {
            self.SOUND.play('tick_0',0.1)
            this.settings.showMenu = true;
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
                    if (this.settings.espMode > 0) this.drawEsp(ui, world, me);
                    this.drawMenu();
                }
			}
			this.ctx.restore();
		}
	}
}

function patchGame(source) {
    window.GameScript = source;
    source = Utilities.toString().concat(source);
    const patches = new Map()
    // replace obfuscated strings
    .set("procInputs", [/igKRxJyx/gm, 'procInputs'])
    .set("objInstances", [/eKoEYKcC/gm, 'objInstances'])
    .set("isYou", [/OFnPTTpe/gm, 'isYou'])
    .set("cnBSeen", [/lhYWIWew/gm, 'cnBSeen'])
    .set("canSee", [/BwftfwWS/gm, 'canSee'])
    //.set("playerHeight", [/CRMPwyVw/gm, 'playerHeight'])
    //.set("playerScale", [/playerScale/gm, 'playerScale'])
    .set("getD3D", [/OmPMwAzs/gm, 'getD3D'])
    .set("getDistance", [/kwpNBTcj/gm, 'getDistance'])
    .set("getXDire", [/SbPUccYE/gm, 'getXDire'])
    .set("getDir", [/ujHYahTl/gm, 'getDir'])
    .set("socket", [/eXZfoTjts/gm, 'socket'])
    .set("mouseDownR", [/hhLaRzBY/gm, 'mouseDownR'])
    .set("mouseDownL", [/sMTFGWrl/gm, 'mouseDownL'])
    .set("pitchObject", [/vKPtJVFI/gm, 'pitchObject'])
    .set("recoilAnimY", [/psKrGopm/gm, 'recoilAnimY'])

    .set("exports", [/(\['__CANCEL__']=.*?\(\w+,\w+,(\w+)\){)(let)/, '$1window.utilities=new Utilities();utilities.exports=$2;$3'])
    .set("controlView", [/(if\(this\['target']\){)/, '$1this.object.rotation.y=this.target.yD;this.pitchObject.rotation.x=this.target.xD;const half=Math.PI/2;this.yDr=Math.max(-half,Math.min(half,this.target.xD))%Math.PI;this.xDr=this.target.yD%Math.PI;'])
    .set("Update", [/(this\['update']=function\((\w+),(\w+)\){if\(this\['active']\){)/, '$1utilities.onTick(this,$2);'])
    .set("ui", [/(this,\w+={};this\['frustum'])/, 'utilities.ui=$1'])
    .set("fixHowler", [/(Howler\['orientation'](.+?)\)\),)/, ``])
    .set("clearRec", [/(if\(\w+\['save']\(\),\w+\['scale']\(\w+,\w+\),)\w+\['clearRect']\(0x0,0x0,\w+,\w+\),(\w+\['showDMG']\))/, '$1$2'])
    .set("onRender", [/((\w+)\['render']=function\((\w+,\w+,\w+,\w+,\w+)\){)/, '$1utilities.onRender($2,$3);'])
    .set("Inputs", [/(!\w+\['moveLock']&&\w+\['tmpInpts']\['push']\((\w+)\))/, "utilities.inputs=$2,$1"])
    .set("pInfo", [/(if\((\w+)\['isYou']\|\|!\w+\['objInstances']\)continue;)/, 'if(utilities.settings.espMode==1||utilities.settings.espMode==0)continue;$1'])
    .set("wallhack", [/(\(((\w+))=this\['map']\['manager']\['objects']\[(\w+)]\))(.+?)\)/, '$1.penetrable&&$2.active&&!utilities.settings.autoAimWalls)'])
    .set("Nathan Is A Fag", [/\['send']\('rt'\)/, ""])

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

// Hook - Lemons1337 - Nathan Is NOT 1337
const decode = TextDecoder.prototype.decode;
TextDecoder.prototype.decode = function() {
    var code = decode.apply(this, arguments);

    if (code.length > /*Lemons*/1337 && code[0] === '!') {
        code = patchGame(code);
        TextDecoder.prototype.decode = decode;
    }

    return code;
}
