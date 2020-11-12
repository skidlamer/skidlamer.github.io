(function (cheat, object, array, string, proxy, reflect) {
    const RandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const RandomString = (l, a = Math.random()) => [...array(l)].map(e => string.fromCharCode((a * 2 | 0 ? 65 : 97, Math.random() * (a + 25 - a + 1) | 0 + a))).join('')
    const GenerateVars = (s) => [...array(s)].map(e => RandomString(RandomNumber(4,16)))
    const defineObject = (str, prop, func, config = true) => { object.defineProperty(globalThis, prop, { [str]: func, configurable: config})}
    const binaryString = (str) => { str = str.replace(/\s+/g, ''); str = str.match(/.{1,8}/g).join(" "); return str.split(" ").map( (elem) => string.fromCharCode(parseInt(elem, 2))).join("")}
    const stringBinary = (str, spaces) => { return str.replace(/[\s\S]/g, function(str) { let num = str.charCodeAt().toString(2); str = "00000000".slice(string(num).length) + num; return !1 == spaces ? str : str + " "})};
    const [main, settings, vars, onStart, onRender, onInput] = GenerateVars(6);
    const isProxy = Symbol("isProxy");
    const twoPI = Math.PI * 2;
    const halfPI = Math.PI / 2;
    window[main] = new function() {
        cheat = this;
        this[vars] = {};
        this[settings] = {
            ESP: true,
            assist: true,
        };

        this[onStart] = function (data) {
            const obfu = {
                inView: { regex: /if\(!\w+\['(\w+)']\)continue/, pos: 1 },
                render: { regex: /\['team']:window\['(\w+)']/, pos: 1 },
                procInputs: { regex: /this\['(\w+)']=function\((\w+),(\w+),\w+,\w+\){(this)\['recon']/, pos: 1 },
                //aimVal: { regex: /this\['(\w+)']-=0x1\/\(this\['weapon']\['\w+']\/\w+\)/, pos: 1 },
                pchObjc: { regex: /0x0,this\['(\w+)']=new \w+\['Object3D']\(\),this/, pos: 1 },
                //didShoot: { regex: /--,\w+\['(\w+)']=!0x0/, pos: 1 },
                //nAuto: { regex: /'Single\\x20Fire','varN':'(\w+)'/, pos: 1 },
                crouchVal: { regex: /this\['(\w+)']\+=\w\['\w+']\*\w+,0x1<=this\['\w+']/, pos: 1 },
                recoilAnimY: { regex: /this\['(\w+)']=0x0,this\['recoilForce']=0x0/, pos: 1 },
                //ammos: { regex: /\['length'];for\(\w+=0x0;\w+<\w+\['(\w+)']\['length']/, pos: 1 },
                //weaponIndex: { regex: /\['weaponConfig']\[\w+]\['secondary']&&\(\w+\['(\w+)']==\w+/, pos: 1 },
                isYou: { regex: /0x0,this\['(\w+)']=\w+,this\['\w+']=!0x0,this\['inputs']/, pos: 1 },
                //objInstances: { regex: /\w+\['genObj3D']\(0x0,0x0,0x0\);if\(\w+\['(\w+)']=\w+\['genObj3D']/, pos: 1 },
                //getWorldPosition: { regex: /{\w+=\w+\['camera']\['(\w+)']\(\);/, pos: 1 },
                mouseDownL: { regex: /this\['\w+'\]=function\(\){this\['(\w+)'\]=\w*0,this\['(\w+)'\]=\w*0,this\['\w+'\]={}/, pos: 1 },
                mouseDownR: { regex: /this\['(\w+)']=0x0,this\['keys']=/, pos: 1 },
                //reloadTimer: { regex:  /this\['(\w+)']-=\w+,\w+\['reloadUIAnim']/, pos: 1 },///this\['(\w+)']&&\(this\['noMovTimer']=0x0/, pos: 1 },
                //maxHealth: { regex: /this\['health']\/this\['(\w+)']\?/, pos: 1 },
                //xVel: { regex: /this\['x']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedX']/, pos: 1 },
                //yVel: { regex: /this\['y']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedY']/, pos: 1 },
                //zVel: { regex: /this\['z']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedZ']/, pos: 1 },
            };
            console.groupCollapsed("DEOBFUSCATE");
            for (let key in obfu) {
                let result = obfu[key].regex.exec(data);
                if (result) {
                    this[vars][key] = result[obfu[key].pos];
                    console.log("found: ", key, " at ", result.index, " value: ", this[vars][key]);
                } else {
                    const str = "Failed to find " + key;
                    console.error(str);
                    alert(str);
                    this[vars][key] = null;
                }
            }
            console.groupEnd();

            defineObject('get', this[vars].render, function () {
                let caller = arguments.callee.caller;
                if (caller && caller.arguments && caller.arguments.length == 8) {
                    cheat[onRender](...caller.arguments);
                }
            })

            document.addEventListener('keydown', (e) => {
                if ("INPUT" !== document.activeElement.tagName) {
                    switch (e.key) {
                        case "c": cheat[settings].ESP ^= 1; break;
                        case "x": cheat[settings].assist ^= 1; break;
                    }
                }
            })
        }

        this[onRender] = function (scale, game, controls, rendering, me) {
            if (me) {
                for (let player of game.players.list) {
                    if (player.id == me.id) {
                    } else {
                        let canSee = null == this.getCanSee(game, me, player.x, player.y, player.z);
                        let friend = (me.team ? me.team : me.spectating ? 0x1 : 0x0) == player.team;
                        object.defineProperty(player, cheat[vars].inView, {
                            value: friend || canSee || cheat[settings].ESP,
                            writable: true, configurable: true
                        });
                    }
                }

                if (!me[this[vars].procInputs][isProxy]) {
                    me[this[vars].procInputs] = new proxy(me[this[vars].procInputs], {
                        apply: function(target, that, [input, game, recon, lock]) {
                            if (that) cheat[onInput](that, input, game, recon, lock);
                            return target.apply(that, [input, game, recon, lock]);
                        },
                        get: function(target, key) {
                            const value = reflect.get(target, key)
                            return key === isProxy ? true : value;
                        },
                    })
                }
            }
        }

        this[onInput] = function (me, input, game, recon, lock) {
            const key = {
                frame : 0,
                delta : 1,
                xdir : 2,
                ydir : 3,
                moveDir : 4,
                shoot : 5,
                scope : 6,
                jump : 7,
                crouch : 8,
                reload : 9,
                weaponScroll : 10,
                weaponSwap : 11,
                moveLock : 12
            };
            let getIsFriendly = (entity) => (me && me.team ? me.team : me.spectating ? 0x1 : 0x0) == entity.team
            let getInView = (entity) => null == this.getCanSee(game, me, entity.x, entity.y, entity.z);
            let target = game.players.list.filter((entity) => entity.active && !entity[this[vars].isYou] && !getIsFriendly(entity) && getInView(entity)).sort((p1, p2) => this.getD3D(me.x, me.y, me.z, p1.x, p1.y, p1.z) - this.getD3D(me.x, me.y, me.z, p2.x, p2.y, p2.z)).shift();
            if (target) {
                let yVal = target.y + 1.5 - target[this[vars].crouchVal] * 0x3;
                let yDire = this.getDir(me.z||game.controls.object.position.z, me.x||game.controls.object.position.x, target.z, target.x);
                let xDire = this.getXDire(me.x||game.controls.object.position.x, me.y||game.controls.object.position.y, me.z||game.controls.object.position.z, target.x, yVal, target.z);
                if (this[settings].assist && game.controls[this[vars].mouseDownR]) {
                    game.controls.object.rotation.y = yDire;
                    game.controls[this[vars].pchObjc].rotation.x = Math.max(-halfPI, Math.min(halfPI, xDire - me[this[vars].recoilAnimY] * 0.27 ));
                    game.controls.yDr = (game.controls[this[vars].pchObjc].rotation.x % twoPI).round(3);
                    game.controls.xDr = (game.controls.object.rotation.y % twoPI).round(3);
                    input[key.scope] = 1;
                }
            }
        }

        // Various utility functions...
        this.getD3D = function(x1, y1, z1, x2, y2, z2) {
            let dx = x1 - x2;
            let dy = y1 - y2;
            let dz = z1 - z2;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        };

        this.getAngleDst = function (a, b) {
            return Math.atan2(Math.sin(b - a), Math.cos(a - b));
        };

        this.getXDire = function(x1, y1, z1, x2, y2, z2) {
            let h = Math.abs(y1 - y2);
            let dst = this.getD3D(x1, y1, z1, x2, y2, z2);
            return (Math.asin(h / dst) * ((y1 > y2)?-1:1));
        };

        this.getDir = function (x1, y1, x2, y2) {
            return Math.atan2(y1 - y2, x1 - x2);
        };

        this.getDistance = function(x1, y1, x2, y2) {
            return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
        };

        this.lineInRect = function(lx1, lz1, ly1, dx, dz, dy, x1, z1, y1, x2, z2, y2) {
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
        };

        this.getCanSee = function(game, from, toX, toY, toZ, boxSize) {
            if (!game || !from) return 0;
            boxSize = boxSize||0;
            const cameraHeight = game.config.cameraHeight||1.5;
            for (let obj, dist = this.getD3D(from.x, from.y, from.z, toX, toY, toZ), xDr = this.getDir(from.z, from.x, toZ, toX), yDr = this.getDir(this.getDistance(from.x, from.z, toX, toZ), toY, 0, from.y), dx = 1 / (dist * Math.sin(xDr - Math.PI) * Math.cos(yDr)), dz = 1 / (dist * Math.cos(xDr - Math.PI) * Math.cos(yDr)), dy = 1 / (dist * Math.sin(yDr)), yOffset = from.y + (from.height || 0) - cameraHeight, aa = 0; aa < game.map.manager.objects.length; ++aa) {
                if (!(obj = game.map.manager.objects[aa]).noShoot && obj.active && !obj.transparent) {
                    let tmpDst = this.lineInRect(from.x, from.z, yOffset, dx, dz, dy, obj.x - Math.max(0, obj.width - boxSize), obj.z - Math.max(0, obj.length - boxSize), obj.y - Math.max(0, obj.height - boxSize), obj.x + Math.max(0, obj.width - boxSize), obj.z + Math.max(0, obj.length - boxSize), obj.y + Math.max(0, obj.height - boxSize));
                    if (tmpDst && 1 > tmpDst) return tmpDst;
                }
            }
            let terrain = game.map.terrain;
            if (terrain) {
                let terrainRaycast = terrain.raycast(from.x, -from.z, yOffset, 1 / dx, -1 / dz, 1 / dy);
                if (terrainRaycast) return this.getD3D(from.x, from.y, from.z, terrainRaycast.x, terrainRaycast.z, -terrainRaycast.y);
            }
            return null;
        }
    };

    defineObject('set', binaryString("01100100 01111000 00110111 00110010 00110100"), function() {
        let caller = arguments.callee.caller;
        if (caller) {
            cheat[onStart](caller.toString());
        }
    })
})(null, Object, Object.freeze(Array), Object.freeze(String), Object.freeze(Proxy), Object.freeze(Reflect));