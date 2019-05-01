// ==UserScript==
// @name         Krunker.io Utilities Pro
// @description  Krunker.io Mod
// @updateURL    https://skidlamer.github.io/js/Kruker.utils.user.js
// @downloadURL  https://skidlamer.github.io/js/Kruker.utils.user.js
// @version      1.23.2
// @author       SkidLamer / Tehchy
// @match        *://krunker.io/*
// @include      /^(https?:\/\/)?(www\.)?(.+)krunker\.io(|\/|\/\?.+)$/
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

const InternalURL = "http://localhost/scripts/game.js";
const ExternalURL = "https://skidlamer.github.io/js/game.js";

let Vector3 = (x, y, z) => {
    this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
    return this;
}

let fmt = (format, ...args) => {
    return format
        .split("%%")
        .reduce((aggregate, chunk, i) =>
                aggregate + chunk + (args[i] || ""), "");
}

class Utilities {
    constructor() {
        this.fps = {
            cur: 0,
            times: [],
            elm: null
        };
        this.canvas = null;
        this.ctx = null;
        this.findingNew = false;
        this.deaths = 0;
        this.windowOpened = false;
        this.lastMenu = '';
        this.customImage = new Image();
        this.defaultSettings = null;
        this.settings = {
            showFPS: false,
            customCrosshair: 0,
            customCrosshairShape: 0,
            customCrosshairColor: '#FFFFFF',
            customCrosshairLength: 14,
            customCrosshairThickness: 2,
            customCrosshairOutline: 0,
            customCrosshairOutlineColor: '#000000',
            customCrosshairAlwaysShow: false,
            customCrosshairImage: '',
            showLeaderboard: true,
            customScope: 'https://krunker.io/textures/recticle.png',
            customScopeHideBoxes: false,
            customFlashOverlay: 'https://krunker.io/img/muzflash.png',
            customBlood: 'https://krunker.io/img/blood.png',
            customAmmo: 'https://krunker.io/textures/ammo_0.png',
            customNameSub: 'https://krunker.io/img/skull.png',
            customKills: 'https://krunker.io/img/skull.png',
            customTimer: 'https://krunker.io/img/timer.png',
            customMainLogo: 'https://krunker.io/img/krunker_logo_0.png',
            autoFindNew: false,
            matchEndMessage: '',
            deathCounter: false,
            forceChallenge: false,
            hideFullMatches: false,
            customADSDot: 'https://krunker.io/textures/dots/dot_0.png',
            esp: 1,
            espColor: 0,
            espFontSize: 14,
            espCounter: 0,
            tracers: false,
            canvasNeedsClean: false,
            bHop: 0,
            isSliding: false,
            fullClip: false,
            noRecoil: false,
            noDeathDelay: false,
            antiAlias: false,
            highPrecision: true,
            logSocketMessages: false,
            moveSpeed: 1.2,
            zoomMulti: 1,
            shotRate: 1000,
            wpnRange: 1000,
            autoAim: 2,
            aimCounter: 0,
            scopingOut: false,
            canShoot: true,
        };
        this.hooks = {
            socket: null,
            //three: null,
            editor: null,
        };
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
            greyMed: '#A9A9A9',
            greyLight: '#D3D3D3',
            white: '#ffffff',
            black: '#111111',
            silver: '#dddddd',
            hostile: '#EB5656',
            friendly: '#9EEB56',
        };
        this.self;
        this.server;
        this.world;
        this.input;
        this.funct;
        this.cam;
        this.ui;
        this.proc;
        this.settingsMenu = [];
        this.onLoad();
    }

    createCanvas() {
        const hookedCanvas = unsafeWindow.document.createElement("canvas");
        hookedCanvas.id = "UtiltiesCanvas";
        hookedCanvas.width = innerWidth;
        hookedCanvas.height = innerHeight;
        function resize() {
            var ws = innerWidth / 1700;
            var hs = innerHeight / 900;
            hookedCanvas.width = innerWidth;
            hookedCanvas.height = innerHeight;
            hookedCanvas.style.width = (hs < ws ? (innerWidth / hs).toFixed(3) : 1700) + "px";
            hookedCanvas.style.height = (ws < hs ? (innerHeight / ws).toFixed(3) : 900) + "px";
        }
        unsafeWindow.addEventListener('resize', resize);
        resize();
        this.canvas = hookedCanvas;
        this.ctx = hookedCanvas.getContext("2d");
        const hookedUI = unsafeWindow.inGameUI;
        hookedUI.insertAdjacentElement("beforeend", hookedCanvas);
        unsafeWindow.requestAnimFrame( ()=>{this.render()})
    }

    createMenu() {
        inviteButton.insertAdjacentHTML("afterend", '\n<div class="button small" onmouseenter="playTick()" onclick="showWindow(window.windows.length-1);">Join</div>');
        const rh = gameNameHolder.lastElementChild;
        rh.insertAdjacentHTML("beforeend", '<div class="button small" onmouseenter="playTick()" onclick="showWindow(window.windows.length);">Pro Utilities</div>');
        let self = this;
        this.settingsMenu = {
            showFPS: {
                name: "Show FPS",
                pre: "<div class='setHed'><center>Utilities Pro</center></div><div class='setHed'>Render</div><hr>",
                val: false,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("showFPS", this.checked)' ${self.settingsMenu.showFPS.val ? "checked" : ""}><span class='slider'></span></label>`;
                },
                set(t) {
                    self.settings.showFPS = t;
                }
            },
            showLeaderboard: {
                name: "Show Leaderboard",
                val: 1,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("showLeaderboard", this.checked)' ${self.settingsMenu.showLeaderboard.val ? "checked" : ""}><span class='slider'></span></label>`;
                },
                set(t) {
                    self.settings.showLeaderboard = t;
                    leaderDisplay.style.display = t ? "block" : "none";
                }
            },
            esp: {
                name: "Player ESP",
                val: 1,
                html() {
                    return `<select class="floatR" onchange="window.utilities.setSetting('esp', this.value)">
                    <option value="0"${self.settingsMenu.esp.val == 0 ? " selected" : ""}>Disabled</option>
                    <option value="1"${self.settingsMenu.esp.val == 1 ? " selected" : ""}>Name In View</option>
                    <option value="2"${self.settingsMenu.esp.val == 2 ? " selected" : ""}>Name WallHack</option>
                    <option value="3"${self.settingsMenu.esp.val == 3 ? " selected" : ""}>Extended WallHack</option>
                    <option value="4"${self.settingsMenu.esp.val == 4 ? " selected" : ""}>Outline Only</option>
                    <option value="5"${self.settingsMenu.esp.val == 5 ? " selected" : ""}>Full ESP</option>
                    </select>`
                },
                set(t) {
                    self.settings.esp = parseInt(t);
                    //unsafeWindow.playerInfos.style.width = self.settings.esp < 3 ? '100%' : '0%';
                }
            },
            /*
            espColor: {
                name: "Player ESP Color",
                val: 0,
                html() {
                    return `<select class="floatR" onchange="window.utilities.setSetting('espColor', this.value)">
                    <option value="0"${self.settingsMenu.espColor.val == 0 ? " selected" : ""}>Aqua</option>
                    <option value="1"${self.settingsMenu.espColor.val == 1 ? " selected" : ""}>Blue</option>
                    <option value="2"${self.settingsMenu.espColor.val == 2 ? " selected" : ""}>Lime</option>
                    <option value="3"${self.settingsMenu.espColor.val == 3 ? " selected" : ""}>Navy</option>
                    <option value="4"${self.settingsMenu.espColor.val == 4 ? " selected" : ""}>Teal</option>
                    <option value="5"${self.settingsMenu.espColor.val == 5 ? " selected" : ""}>Olive</option>
                    <option value="6"${self.settingsMenu.espColor.val == 6 ? " selected" : ""}>Green</option>
                    <option value="7"${self.settingsMenu.espColor.val == 7 ? " selected" : ""}>Red</option>
                    <option value="8"${self.settingsMenu.espColor.val == 8 ? " selected" : ""}>Maroon</option>
                    <option value="9"${self.settingsMenu.espColor.val == 9 ? " selected" : ""}>Orange</option>
					<option value="10"${self.settingsMenu.espColor.val == 10 ? " selected" : ""}>Purple</option>
					<option value="11"${self.settingsMenu.espColor.val == 11 ? " selected" : ""}>Yellow</option>
					<option value="12"${self.settingsMenu.espColor.val == 12 ? " selected" : ""}>Fuchsia</option>
					<option value="13"${self.settingsMenu.espColor.val == 13 ? " selected" : ""}>GreyDark</option>
					<option value="14"${self.settingsMenu.espColor.val == 14 ? " selected" : ""}>GreyMed</option>
					<option value="15"${self.settingsMenu.espColor.val == 15 ? " selected" : ""}>GreyLight</option>
					<option value="16"${self.settingsMenu.espColor.val == 16 ? " selected" : ""}>White</option>
					<option value="17"${self.settingsMenu.espColor.val == 17 ? " selected" : ""}>Black</option>
					<option value="18"${self.settingsMenu.espColor.val == 18 ? " selected" : ""}>Silver</option>
					<option value="19"${self.settingsMenu.espColor.val == 19 ? " selected" : ""}>Hostile</option>
					<option value="20"${self.settingsMenu.espColor.val == 20 ? " selected" : ""}>Friendly</option>
                    </select>`
                },
                set(t) {
                   self.settings.espColor = parseInt(t)
                }
            },*/
            espFontSize: {
                name: "Player ESP Font Size",
                val: 14,
                html() {
                    return `<select class="floatR" onchange="window.utilities.setSetting('espFontSize', this.value)">
                    <option value="10"${self.settingsMenu.espFontSize.val == 10 ? " selected" : ""}>Small</option>
                    <option value="C"${self.settingsMenu.espFontSize.val == 14 ? " selected" : ""}>Medium</option>
                    <option value="20"${self.settingsMenu.espFontSize.val == 24 ? " selected" : ""}>Large</option>
                    <option value="26"${self.settingsMenu.espFontSize.val == 32 ? " selected" : ""}>Giant</option>
                    </select>`
                },
                set(t) {
                    self.settings.espFontSize = parseInt(t + 10);
                }
            },
            hacksTracers: {
                name: "Player Tracers",
                val: 0,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("hacksTracers", this.checked)' ${self.settingsMenu.hacksTracers.val ? "checked" : ""}><span class='slider'></span></label>`;
                },
                set(t) {
                    self.settings.tracers = t;
                }
            },
            autoFindNew: {
                name: "New Lobby Finder",
                pre: "<br><div class='setHed'>Features</div><hr>",
                val: false,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("autoFindNew", this.checked)' ${self.settingsMenu.autoFindNew.val ? "checked" : ""}><span class='slider'></span></label>`;
                },
                set(t) {
                    self.settings.autoFindNew = t;
                }
            },
            matchEndMessage: {
                name: "Match End Message",
                val: '',
                html() {
                    return `<input type='text' id='matchEndMessage' name='text' value='${self.settingsMenu.matchEndMessage.val}' oninput='window.utilities.setSetting("matchEndMessage", this.value)' style='float:right;margin-top:5px'/>`
                },
                set(t) {
                    self.settings.matchEndMessage = t;
                }
            },
            deathCounter: {
                name: "Death Counter",
                val: false,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("deathCounter", this.checked)' ${self.settingsMenu.deathCounter.val ? "checked" : ""}><span class='slider'></span></label>`;
                },
                set(t) {
                    self.settings.deathCounter = t;
                    document.getElementById('deathCounter').style.display = t ? "inline-block" : "none";
                }
            },
            forceChallenge: {
                name: "Force Challenge Mode",
                val: false,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("forceChallenge", this.checked)' ${self.settingsMenu.forceChallenge.val ? "checked" : ""}><span class='slider'></span></label>`;
                },
                set(t) {
                    self.settings.forceChallenge = t;
                    if (t && !challButton.lastElementChild.firstChild.checked) challButton.lastElementChild.firstChild.click();
                }
            },
            hideFullMatches: {
                name: "Hide Full Matches",
                val: false,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("hideFullMatches", this.checked)' ${self.settingsMenu.hideFullMatches.val ? "checked" : ""}><span class='slider'></span></label>`;
                },
                set(t) {
                    self.settings.hideFullMatches = t;
                }
            },
            customCrosshair: {
                name: "Style",
                pre: "<br><div class='setHed'>Crosshair</div><hr>",
                val: 0,
                html() {
                    return `<select class="floatR" onchange="window.utilities.setSetting('customCrosshair', this.value)">
                    <option value="0"${self.settingsMenu.customCrosshair.val == 0 ? " selected" : ""}>Normal</option>
                    <option value="1"${self.settingsMenu.customCrosshair.val == 1 ? " selected" : ""}>Custom</option>
                    <option value="2"${self.settingsMenu.customCrosshair.val == 2 ? " selected" : ""}>Custom & Normal</option>
                    </select>`
                },
                set(t) {
                    self.settings.customCrosshair = parseInt(t);
                    self.ctx.clearRect(0, 0, innerWidth, innerHeight);
                }
            },
            customCrosshairImage: {
                name: "Image",
                val: '',
                html() {
                    return `<input type='url' id='customCrosshairImage' name='text' value='${self.settingsMenu.customCrosshairImage.val}' oninput='window.utilities.setSetting("customCrosshairImage", this.value)' style='float:right;margin-top:5px'/>`
                },
                set(t) {
                    self.settings.customCrosshairImage = t;
                    if (self.customImage.src != t) {
                        if (t.length) {
                            self.customImage.src = t;
                        }
                    }
                }
            },
            customCrosshairShape: {
                name: "Shape",
                val: 0,
                html() {
                    return `<select class="floatR" onchange="window.utilities.setSetting('customCrosshairShape', this.value)">
                    <option value="0"${self.settingsMenu.customCrosshairShape.val == 0 ? " selected" : ""}>Cross</option>
                    <option value="1"${self.settingsMenu.customCrosshairShape.val == 1 ? " selected" : ""}>Hollow Circle</option>
                    <option value="2"${self.settingsMenu.customCrosshairShape.val == 2 ? " selected" : ""}>Filled Circle</option>
                    <option value="3"${self.settingsMenu.customCrosshairShape.val == 3 ? " selected" : ""}>Image</option>
                    </select>`
                },
                set(t) {
                    self.settings.customCrosshairShape = parseInt(t);
                }
            },
            customCrosshairAlwaysShow: {
                name: "Always Show",
                val: false,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("customCrosshairAlwaysShow", this.checked)' ${self.settingsMenu.customCrosshairAlwaysShow.val ? "checked" : ""}><span class='slider'></span></label>`;
                },
                set(t) {
                    self.settings.customCrosshairAlwaysShow = t;
                }
            },
            customCrosshairColor: {
                name: "Color",
                val: "#ffffff",
                html() {
                    return `<input type='color' id='crosshairColor' name='color' value='${self.settingsMenu.customCrosshairColor.val}' oninput='window.utilities.setSetting("customCrosshairColor", this.value)' style='float:right;margin-top:5px'/>`
                },
                set(t) {
                    self.settings.customCrosshairColor = t;
                }
            },
            customCrosshairLength: {
                name: "Length",
                val: 16,
                html() {
                    return `<span class='sliderVal' id='slid_utilities_customCrosshairLength'>${self.settingsMenu.customCrosshairLength.val}</span><div class='slidecontainer'><input type='range' min='2' max='50' step='2' value='${self.settingsMenu.customCrosshairLength.val}' class='sliderM' oninput="window.utilities.setSetting('customCrosshairLength', this.value)"></div>`
                },
                set(t) {
                    self.settings.customCrosshairLength = parseInt(t);
                }
            },
            customCrosshairThickness: {
                name: "Thickness",
                val: 2,
                html() {
                    return `<span class='sliderVal' id='slid_utilities_customCrosshairThickness'>${self.settingsMenu.customCrosshairThickness.val}</span><div class='slidecontainer'><input type='range' min='2' max='20' step='2' value='${self.settingsMenu.customCrosshairThickness.val}' class='sliderM' oninput="window.utilities.setSetting('customCrosshairThickness', this.value)"></div>`
                },
                set(t) {
                    self.settings.customCrosshairThickness = parseInt(t);
                }
            },
            customCrosshairOutline: {
                name: "Outline",
                val: 0,
                html() {
                    return `<span class='sliderVal' id='slid_utilities_customCrosshairOutline'>${self.settingsMenu.customCrosshairOutline.val}</span><div class='slidecontainer'><input type='range' min='0' max='10' step='1' value='${self.settingsMenu.customCrosshairOutline.val}' class='sliderM' oninput="window.utilities.setSetting('customCrosshairOutline', this.value)"></div>`
                },
                set(t) {
                    self.settings.customCrosshairOutline = parseInt(t);
                }
            },
            customCrosshairOutlineColor: {
                name: "Outline Color",
                val: "#000000",
                html() {
                    return `<input type='color' id='crosshairOutlineColor' name='color' value='${self.settingsMenu.customCrosshairOutlineColor.val}' oninput='window.utilities.setSetting("customCrosshairOutlineColor", this.value)' style='float:right;margin-top:5px'/>`
                },
                set(t) {
                    self.settings.customCrosshairOutlineColor = t;
                }
            },
            hacksnoDeathDelay: {
                pre: "<br><div class='setHed'>Hacks</div><hr>",
                name: "No Respawn Delay",
                val: 0,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("hacksnoDeathDelay", this.checked)' ${self.settingsMenu.hacksnoDeathDelay.val ? "checked" : ""}><span class='slider'></span></label>`;
                },
                set(t) {
                    self.settings.noDeathDelay = t;
                }
            },
            hacksFullClip: {
                name: "Full Clip",
                val: 0,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("hacksFullClip", this.checked)' ${self.settingsMenu.hacksFullClip.val ? "checked" : ""}><span class='slider'></span></label>`;
                },
                set(t) {
                    self.settings.fullClip = t;
                }
            },
            hacksNoRecoil: {
                name: "No Recoil",
                val: 0,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("hacksNoRecoil", this.checked)' ${self.settingsMenu.hacksNoRecoil.val ? "checked" : ""}><span class='slider'></span></label>`;
                },
                set(t) {
                    self.settings.noRecoil = t;
                }
            },
            hacksAutoAim: {
                name: "Auto Aim Mode",
                val: 0,
                html() {
                    return `<select class="floatR" onchange="window.utilities.setSetting('hacksAutoAim', this.value)">
                    <option value="0"${self.settingsMenu.hacksAutoAim.val == 0 ? " selected" : ""}>Disabled</option>
                    <option value="1"${self.settingsMenu.hacksAutoAim.val == 1 ? " selected" : ""}>AimBot</option>
                    <option value="2"${self.settingsMenu.hacksAutoAim.val == 2 ? " selected" : ""}>TriggerBot</option>
                    </select>`
                },
                set(t) {
                    self.settings.autoAim = parseInt(t);
                }
            },
            hacksautoBhop: {
                name: "Auto Bhop Mode",
                val: 0,
                html() {
                    return `<select class="floatR" onchange="window.utilities.setSetting('hacksautoBhop', this.value)">
                    <option value="0"${self.settingsMenu.hacksautoBhop.val == 0 ? " selected" : ""}>Disabled</option>
                    <option value="1"${self.settingsMenu.hacksautoBhop.val == 1 ? " selected" : ""}>AutoJump</option>
                    <option value="2"${self.settingsMenu.hacksautoBhop.val == 2 ? " selected" : ""}>AutoSlideJump</option>
                    </select>`
                },
                set(t) {
                    self.settings.bHop = parseInt(t);
                }
            },
            hacksMoveSpeed: {
                name: "Move Speed",
                val: 1.2,
                html() {
                    return `<span class='sliderVal' id='slid_utilities_hacksMoveSpeed'>${self.settingsMenu.hacksMoveSpeed.val}</span><div class='slidecontainer'><input type='range' min='.1' max='5' step='.1' value='${self.settingsMenu.hacksMoveSpeed.val}' class='sliderM' oninput="window.utilities.setSetting('hacksMoveSpeed', this.value)"></div>`
                },
                set(t) {
                    self.settings.moveSpeed = parseInt(t);
                }
            },
            hacksWeapZoomMult: {
                name: "Weapon Zoom",
                val: 1,
                html() {
                    return `<span class='sliderVal' id='slid_utilities_hacksWeapZoomMult'>${self.settingsMenu.hacksWeapZoomMult.val}</span><div class='slidecontainer'><input type='range' min='1' max='10' step='.1' value='${self.settingsMenu.hacksWeapZoomMult.val}' class='sliderM' oninput="window.utilities.setSetting('hacksWeapZoomMult', this.value)"></div>`
                },
                set(t) {
                    self.settings.zoomMulti = parseInt(t);
                }
            },
            hacksWeaponRange: {
                name: "Weapon Range",
                val: 1000,
                html() {
                    return `<span class='sliderVal' id='slid_utilities_hacksWeaponRange'>${self.settingsMenu.hacksWeaponRange.val}</span><div class='slidecontainer'><input type='range' min='0' max='1000' step='1' value='${self.settingsMenu.hacksWeaponRange.val}' class='sliderM' oninput="window.utilities.setSetting('hacksWeaponRange', this.value)"></div>`
                },
                set(t) {
                    self.settings.wpnRange = parseInt(t);
                }
            },
            hacksShotRate: {
                name: "Shot Rate Delay",
                val: 1000,
                html() {
                    return `<span class='sliderVal' id='slid_utilities_hacksShotRate'>${self.settingsMenu.hacksShotRate.val}</span><div class='slidecontainer'><input type='range' min='0' max='1000' step='1' value='${self.settingsMenu.hacksShotRate.val}' class='sliderM' oninput="window.utilities.setSetting('hacksShotRate', this.value)"></div>`
                },
                set(t) {
                    self.settings.shotRate = parseInt(t);
                }
            },
            customMainLogo: {
                name: "Main Logo",
                pre: "<br><div class='setHed'>Customization</div><hr>",
                val: '',
                html() {
                    return `<input type='url' id='customMainLogo' name='text' value='${self.settingsMenu.customMainLogo.val}' oninput='window.utilities.setSetting("customMainLogo", this.value)' style='float:right;margin-top:5px'/>`
                },
                set(t) {
                    self.settings.customMainLogo = t;
                    mainLogo.src = t.length > 1 ? t : 'https://krunker.io/img/krunker_logo_' + (menuRegionLabel.innerText == "Tokyo" ? 1 : 0) + '.png';
                }
            },
            customADSDot: {
                name: "ADS Dot",
                val: '',
                html() {
                    return `<input type='url' id='customADSDot' name='url' value='${self.settingsMenu.customADSDot.val}' oninput='window.utilities.setSetting("customADSDot", this.value)' style='float:right;margin-top:5px'/>`
                },
                set(t) {
                    self.settings.customADSDot = t;
                    aimDot.src = t.length > 1 ? t : 'https://krunker.io/textures/dots/dot_0.png';
                }
            },
            customScope: {
                name: "Scope Image",
                val: '',
                html() {
                    return `<input type='url' id='customScope' name='url' value='${self.settingsMenu.customScope.val}' oninput='window.utilities.setSetting("customScope", this.value)' style='float:right;margin-top:5px'/>`
                },
                set(t) {
                    self.settings.customScope = t;
                    recticleImg.src = t.length > 1 ? t : 'https://krunker.io/textures/recticle.png';
                }
            },
            customScopeHideBoxes: {
                name: "Hide Black Boxes",
                val: false,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("customScopeHideBoxes", this.checked)' ${self.settingsMenu.customScopeHideBoxes.val ? "checked" : ""}><span class='slider'></span></label>`;
                },
                set(t) {
                    self.settings.customScopeHideBoxes = t;
                    [...document.querySelectorAll('.black')].forEach(el => el.style.display = t ? "none" : "block");
                }
            },
            customAmmo: {
                name: "Ammo Icon",
                val: '',
                html() {
                    return `<input type='url' id='customAmmo' name='url' value='${self.settingsMenu.customAmmo.val}' oninput='window.utilities.setSetting("customAmmo", this.value)' style='float:right;margin-top:5px'/>`
                },
                set(t) {
                    self.settings.customAmmo = t;
                    ammoIcon.src = t.length > 1 ? t : 'https://krunker.io/textures/ammo_0.png';
                }
            },
            customFlashOverlay: {
                name: "Muzzle Flash",
                val: '',
                html() {
                    return `<input type='url' id='customFlashOverlay' name='url' value='${self.settingsMenu.customFlashOverlay.val}' oninput='window.utilities.setSetting("customFlashOverlay", this.value)' style='float:right;margin-top:5px'/>`
                },
                set(t) {
                    self.settings.customFlashOverlay = t;
                    flashOverlay.src = t.length > 1 ? t : 'https://krunker.io/img/muzflash.png';
                }
            },
            customKills: {
                name: "Kill Icon",
                val: '',
                html() {
                    return `<input type='url' id='customKills' name='url' value='${self.settingsMenu.customKills.val}' oninput='window.utilities.setSetting("customKills", this.value)' style='float:right;margin-top:5px'/>`
                },
                set(t) {
                    self.settings.customKills = t;
                    killsIcon.src = t.length > 1 ? t : 'https://krunker.io/img/skull.png';
                }
            },
            customBlood: {
                name: "Death Overlay",
                val: '',
                html() {
                    return `<input type='url' id='customBlood' name='url' value='${self.settingsMenu.customBlood.val}' oninput='window.utilities.setSetting("customBlood", this.value)' style='float:right;margin-top:5px'/>`
                },
                set(t) {
                    self.settings.customBlood = t;
                    bloodDisplay.src = t.length > 1 ? t : 'https://krunker.io/img/blood.png';
                }
            },
            customTimer: {
                name: "Timer Icon",
                val: '',
                html() {
                    return `<input type='url' id='customTimer' name='url' value='${self.settingsMenu.customTimer.val}' oninput='window.utilities.setSetting("customTimer", this.value)' style='float:right;margin-top:5px'/>`
                },
                set(t) {
                    self.settings.customTimer = t;
                    timerIcon.src = t.length > 1 ? t : 'https://krunker.io/img/timer.png';
                }
            }
        };
        window.unsafeWindow.windows.push({
            header: "Join",
            gen: () => {
                return `<input id='gameURL' type='text' placeholder='Enter Game URL/Code' class='accountInput' style='margin-top:0' value=''></input>
                <div class='accountButton' onclick='window.utilities.joinGame()', style='width:100%'>Join</div>`;
            }
        });
        window.unsafeWindow.windows.push({
            header: "Utilities",
            gen: () => {
                var tmpHTML = "";
                for (var key in window.unsafeWindow.utilities.settingsMenu) {
                    if (window.unsafeWindow.utilities.settingsMenu[key].noShow) continue;
                    if (window.unsafeWindow.utilities.settingsMenu[key].pre) tmpHTML += window.unsafeWindow.utilities.settingsMenu[key].pre;
                    tmpHTML += "<div class='settName'>" + window.unsafeWindow.utilities.settingsMenu[key].name +
                        " " + window.unsafeWindow.utilities.settingsMenu[key].html() + "</div>";
                }
                tmpHTML += "<br><a onclick='window.utilities.resetSettings()' class='menuLink'>Reset Settings</a>";
                return tmpHTML;
            }
        });
        this.setupSettings();
    }

    setupSettings() {
        this.defaultSettings = JSON.parse(JSON.stringify(this.settings));
        for (const key in this.settingsMenu) {
            if (this.settingsMenu[key].set) {
                const nt = getSavedVal(`kro_set_utilities_${key}`);
                this.settingsMenu[key].val = null !== nt ? nt : this.settingsMenu[key].val;
                "false" === this.settingsMenu[key].val && (this.settingsMenu[key].val = !1)
                this.settingsMenu[key].set(this.settingsMenu[key].val, !0)
            }
        }
    }

    joinGame() {
        let code = gameURL.value || '';
        if (code.match(/^(https?:\/\/)?(www\.)?(.+)krunker\.io(|\/|\/\?(server|party|game)=.+)$/)) {
            location = code;
        } else if (code.match(/^([A-Z]+):(\w+)$/)) {
            location = location.origin + "/?game=" + code;
        }
    }

    changeProfileIcon() {
        let index = getSavedVal('classindex') || 0;
        menuMiniProfilePic.src = `https://krunker.io/textures/classes/icon_${index}.png`;
    }

    createFPSDisplay() {
        const el = document.createElement("div");
        el.id = "fps";
        el.style.position = "absolute";
        el.style.color = "green";
        el.style.top = "0.1em";
        el.style.left = "20px";
        el.style.fontSize = "6pt";
        this.fps.elm = el;
        document.getElementById("gameUI").appendChild(el);
    }

    updateFPS() {
        if (!this.settings.showFPS) return;
        const now = performance.now();
        for (; this.fps.times.length > 0 && this.fps.times[0] <= now - 1e3;) this.fps.times.shift();
        this.fps.times.push(now);
        this.fps.cur = this.fps.times.length;
        this.fps.elm.innerHTML =  this.style("FPS:", this.colors.greyMed, 0) + this.fps.cur;
        this.fps.elm.style.color = this.fps.cur > 50 ? this.colors.lime : (this.fps.cur < 30 ? this.colors.red : this.colors.orange);
    }

    createDeathCounter() {
        killCount.insertAdjacentHTML("afterend", `\n<div id="deathCounter" class="countIcon" style="display: none;"><i class="material-icons" style="color:red;font-size:35px;margin-right:8px">error</i><span id="deaths" style="color: rgba(255, 255, 255, 0.7)">0</span></div>`);
    }

    createObservers() {
        this.newObserver(crosshair, 'style', (target) => {
            if (this.settings.customCrosshair == 0) return;
            crosshair.style.opacity = this.crosshairOpacity(crosshair.style.opacity);
        }, false);

        this.newObserver(windowHolder, 'style', (target) => {
            this.windowOpened = target.firstElementChild.innerText.length ? true : false;
            if (!this.windowOpened) {
                if (['Select Class', 'Change Loadout'].includes(this.lastMenu)) {
                    this.changeProfileIcon();
                }
            }
        }, false);

        this.newObserver(windowHeader, 'childList', (target) => {
            if (!this.windowOpened) return;
            switch (target.innerText) {
                case 'Server Browser':
                    {
                        if (!this.settings.hideFullMatches) return;
                        if (!document.querySelector('.menuSelectorHolder')) return;
                        let pcount;
                        [...document.querySelectorAll('.serverPCount')].filter(el => (pcount = el.innerText.split('/'), pcount[0] == pcount[1])).forEach(el => el.parentElement.remove());
                    }
                    break;
                case 'Change Loadout':
                case 'Select Class':
                    this.changeProfileIcon();
                    break;
                default:
                    //console.log('Unused Window');
                    break;
            }
            this.lastMenu = target.innerText;
        }, false);

        this.newObserver(killCardHolder, 'style', () => {
            this.deaths++;
            document.getElementById('deaths').innerHTML = this.deaths;
        });

        this.newObserver(victorySub, 'src', () => {
            this.deaths = 0;
            document.getElementById('deaths').innerHTML = this.deaths;

            if (this.settings.matchEndMessage.length) {
                this.sendMessage(this.settings.matchEndMessage);
            }
        });

        this.newObserver(instructionHolder, 'style', (target) => {
            if (this.settings.autoFindNew) {
                if (target.innerText.includes('Try seeking a new game') &&
                    !target.innerText.includes('Kicked for inactivity')) {
                        location = document.location.origin;
                    }
            }
        });
    }

    newObserver(elm, check, callback, onshow = true) {
        return new MutationObserver((mutationsList, observer) => {
            if (check == 'src' || onshow && mutationsList[0].target.style.display == 'block' || !onshow) {
                callback(mutationsList[0].target);
            }
        }).observe(elm, check == 'childList' ? {childList: true} : {attributes: true, attributeFilter: [check]});
    }

    sendMessage(msg) {
        chatInput.value = msg;
        chatInput.focus()
        window.pressButton(13);
        chatInput.blur();
    }

    pixelTranslate(ctx, x, y) {
        ctx.translate(~~x, ~~y);
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

    circle(x, y, r, w, color, fill = false) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = w;
        fill ? this.ctx.fillStyle = color : this.ctx.strokeStyle = color;
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        fill ? this.ctx.fill() : this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    image(x, y, img, ox, oy) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.beginPath();
        this.ctx.drawImage(img, ox, oy);
        this.ctx.closePath();
        this.ctx.restore();
        this.drawn = true;
    }

    createWatermark() {
        const el = document.createElement("div");
        el.id = "watermark";
        el.style.position = "absolute";
        el.style.color = "rgba(50,205,50, 0.3)";
        el.style.top = "0.1em";
        el.style.right = "20px";
        el.style.fontSize = "6pt";
        el.innerHTML = "Krunker.io Utilities Mod";
        document.getElementById("gameUI").appendChild(el);
    }

    addStyle(id, css) {
        var head = document.head || document.getElementsByTagName('head')[0];
        if (head) {
            var style = document.createElement("style");
            style.id = id;
            style.type = "text/css";
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
        }
    }

    getTextMeasurements(arr) {
        for (let i = 0; i < arr.length; i++) {
            arr[i] = ~~this.ctx.measureText(arr[i]).width;
        }
        return arr;
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

    gradient(x, y, w, h, colors) {
        let grad = this.ctx.createLinearGradient(x, y, w, h);
        for (let i = 0; i < colors.length; i++) {
            grad.addColorStop(i, colors[i]);
        }
        return grad;
    }

    world2Screen(pos3d, camera) {
       // this.canvas.width / window.innerWidth
       // this.canvas.height / window.innerHeight
        var pos = pos3d.clone();
        var width = this.canvas.width, height = this.canvas.height;
        var widthHalf = width / 2, heightHalf = height / 2;
        pos.project(camera);
        pos.x = ( pos.x * widthHalf ) + widthHalf;
        pos.y = - ( pos.y * heightHalf ) + heightHalf;
        return pos;
    }

    getKey(key) {
        return this.input.keys[key] === 1;
    }

    setKey(key) {
        this.input.keys[key] = 1;
    }

    activeInput() {
        return document.activeElement.tagName == "INPUT";
    }

    style(txt, col, h) {
        return `${h ? "<h"+h+">":""}<span style="color:${col}; text-shadow: 1px 1px 1px ${col === this.colors.black ? this.colors.white : this.colors.black};">${txt}</span>${h ? "</h"+h+">":""}`;
    }

    teamCol(player, secondary) {
        return player.team === null ? secondary ? this.colors.red : this.colors.hostile : this.self.team === player.team ? secondary ? this.colors.green : this.colors.friendly : secondary ? this.colors.red : this.colors.hostile;
    }

    drawFPS() {
        if (!this.settings.fpsCounter) return;
        const now = performance.now();
        for (; this.fps.times.length > 0 && this.fps.times[0] <= now - 1e3;) this.fps.times.shift();
        this.fps.times.push(now);
        this.fps.cur = this.fps.times.length;
        this.text(this.fps.cur, `${this.settings.fpsFontSize}px GameFont`, this.fps.cur > 50 ? 'green' : (this.fps.cur < 30 ? 'red' : 'orange'), 20, 8 + this.settings.fpsFontSize);
        this.text("Krunker Utilities", `7px GameFont`, "rgba(255,255,255, 0.3)", this.canvas.width - 100, 15);
    }

    drawESP()
    {
        let players = this.world.players.list.filter(x => !x.isYou).filter(x => x.active).filter(x => this.cam.frustum.containsPoint(x)).sort((a, b) => this.dist(this.self, a) - this.dist(this.self, b));
        for (const player of players)
        {
            let offset = Vector3(0, this.server.playerHeight + this.server.nameOffset - player.crouchVal * this.server.crouchDst, 0);
            let screenG = this.world2Screen(player.objInstances.position.clone(), this.cam.camera);
            let screenH = this.world2Screen(player.objInstances.position.clone().add(offset), this.cam.camera);
            let hDiff = ~~(screenG.y - screenH.y);
            let bWidth = ~~(hDiff * 0.6);

            if (this.settings.esp > 3)
            {
                let health = this.percentage(player.health, player.maxHealth);
                this.rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, -3, 0, 6, hDiff + 2, this.colors.black, false);
                this.rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, -3, 0, 6, hDiff + 2, health > 75 ? this.colors.green : health > 50 ? this.colors.orange : this.colors.red, true);
                this.rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, -3, 0, 6, ~~((player.maxHealth - player.health) / player.maxHealth * (hDiff + 2)), this.colors.black, true);
                this.ctx.save();
                this.ctx.lineWidth = 4;
                this.pixelTranslate(this.ctx, screenH.x - bWidth / 2, screenH.y);
                this.ctx.beginPath();
                this.ctx.rect(0, 0, bWidth, hDiff);
                this.ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
                this.ctx.stroke();
                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = this.teamCol(player, 0);
                this.ctx.stroke();
                this.ctx.closePath();
                this.ctx.restore();

                if (this.settings.esp ===5)
                {
                    let playerDist = (Math.round( this.dist(this.cam.camera.getWorldPosition(), player) ) /10).toFixed(0);
                    this.ctx.save();
                    this.ctx.font = `${this.settings.espFontSize}px`;
                    let meas = this.getTextMeasurements(["[", `${playerDist}`, "m]", `${player.level}`, "00", player.name, player.weapon.name]);
                    this.ctx.restore();
                    let padding = 2;
                    let grad2 = this.gradient(0, 0, meas[4] * 5, 0, ["rgba(0, 0, 0, 0.25)", "rgba(0, 0, 0, 0)"]);
                    this.rect(~~(screenH.x + bWidth / 2) + padding, ~~screenH.y - padding, 0, 0, (meas[4] * 5), (meas[4] * 4) + (padding * 2), grad2, true);

                    this.text(player.name, `${this.settings.espFontSize}px`, this.colors.white, (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 1)
                    if (player.clan) this.text(`[${player.clan}]`, `${this.settings.espFontSize}px`, '#AAAAAA', (screenH.x + bWidth / 2) + 8 + meas[5], screenH.y + meas[4] * 1)

                    this.text(fmt("Level:%%", player.level ? player.level : 0), `${this.settings.espFontSize}px`, this.colors.yellow, (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 2)

                    this.text(player.weapon.name, `${this.settings.espFontSize}px`, this.colors.greyMed, (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 3)
                    this.text(fmt("[%%/%%]", player.weapon.ammo ? player.ammos[player.weaponIndex] : 0, player.weapon.ammo ? player.weapon.ammo : 0), `${this.settings.espFontSize}px`, this.colors.greyDark, (screenH.x + bWidth / 2) + 8 + meas[6], screenH.y + meas[4] * 3)

                    this.text("[", `${this.settings.espFontSize}px`, this.colors.greyMed, (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 4)
                    this.text(`${playerDist}`, `${this.settings.espFontSize}px`, this.colors.white, (screenH.x + bWidth / 2) + 4 + meas[0], screenH.y + meas[4] * 4)
                    this.text("m]", `${this.settings.espFontSize}px`, this.colors.greyMed, (screenH.x + bWidth / 2) + 4 + meas[0] + meas[1], screenH.y + meas[4] * 4)
                }
            }
            if (this.settings.tracers)
            {
                this.line(innerWidth / 2, innerHeight - 1, screenG.x, screenG.y, 2, this.teamCol(player, 0));
            }
        }

        this.settings.canvasNeedsClean = true;
    }

    drawPinfo() {

        for (let pInfoClass of unsafeWindow.playerInfos.children)
        {
            const player = this.world.players.findBySid(parseInt(pInfoClass.id.replace("pInfo", "")))
            if (player)
            {
                const lvl = (player.level ? this.style(" Lvl:" + player.level + " ", this.colors.yellow, 0) : "");
                const clan = (player.clan ? this.style(' ['+ player.clan + ']', this.colors.blue, 0) : "");
                const name = this.style(player.name + clan + lvl, this.colors.white, 5);
                const dist = this.style((Math.round( this.dist(this.cam.camera.getWorldPosition(), player) ) /10).toFixed(0) + "<small>"+this.style("mt ", this.teamCol(player, 0), 0)+"</small>", this.teamCol(player, 0), 6);
                const wpn = this.style(player.weapon.name + this.style(player.weapon.ammo ? ` ${player.ammos[player.weaponIndex]}/${player.weapon.ammo} ` : "", this.colors.grayDark, 0), this.colors.grayMed, 6);
                pInfoClass.innerHTML = ("<div id='pInfo" + player.sid + "' class='playerInfo'>") +
                    ("<div class='playerRank'id='pInfoR" + player.sid +"'>" + dist + "</div>") +
                    ("<div class='playerHealth' id='pInfoHB" + player.sid + "'><div class='healthBar" + (player.team && player.team == this.self.team ? "" : "E") + "' id='healthBarE" + player.sid + "'> <div></div>") +
                    ("<div class='pInfoH' id='pInfoH" + player.sid + "'>" + name + wpn + "</div>");
            }
        }
    }

    drawCrosshair() {
        if (this.settings.customCrosshair == 0) return;
        if (!this.settings.customCrosshairAlwaysShow && (aimDot.style.opacity != "0" || aimRecticle.style.opacity != "0")) return;

        let thickness = this.settings.customCrosshairThickness;
        let outline = this.settings.customCrosshairOutline;
        let length = this.settings.customCrosshairLength;

        let cx = (this.canvas.width / 2);
        let cy = (this.canvas.height / 2);

        if (this.settings.customCrosshairShape == 0) {
            if (outline > 0) {
                this.rect(cx - length - outline, cy - (thickness / 2) - outline, 0, 0, (length * 2) + (outline * 2), thickness + (outline * 2), this.settings.customCrosshairOutlineColor, true);
                this.rect(cx - (thickness * 0.50) - outline, cy - length - outline, 0, 0, thickness + (outline * 2), (length * 2) + (outline * 2), this.settings.customCrosshairOutlineColor, true);
            }

            this.rect(cx - length, cy - (thickness / 2), 0, 0, (length * 2) , thickness, this.settings.customCrosshairColor, true);
            this.rect(cx - (thickness * 0.50), cy - length, 0, 0, thickness, length * 2, this.settings.customCrosshairColor, true);
        } else if (this.settings.customCrosshairShape == 3) {
            this.image(0, 0, this.customImage, cx - (this.customImage.width / 2), cy - (this.customImage.height / 2));
        } else {
            if (outline > 0) this.circle(cx, cy, length, thickness + (outline * 2), this.settings.customCrosshairOutlineColor);
            this.circle(cx, cy, length, thickness, this.settings.customCrosshairColor, this.settings.customCrosshairShape == 2);
        }
    }

    crosshairOpacity(t) {
        return this.settings.customCrosshair == 1 ? 0 : t;
    }

    render() {
        if (this.settings.customCrosshair != 0) this.ctx.clearRect(0, 0, innerWidth, innerHeight);
        this.updateFPS();
        this.drawCrosshair();
        unsafeWindow.requestAnimFrame( ()=>{this.render()})
    }

    resetSettings() {
        if (confirm("Are you sure you want to reset all your utilties settings? This will also refresh the page")) {
            Object.keys(localStorage).filter(x=>x.includes("kro_set_utilities_")).forEach(x => localStorage.removeItem(x));
            location.reload();
        }
    }

    setSetting(t, e) {
        if (document.getElementById(`slid_utilities_${t}`)) document.getElementById(`slid_utilities_${t}`).innerHTML = e;
        this.settingsMenu[t].set(e);
        this.settingsMenu[t].val = e;
        saveVal(`kro_set_utilities_${t}`, e);
    }

    dist(p1, p2) {
        return this.funct.getDistance3D(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }

    percentage(a, b) {
        return Math.round((a / b) * 100);
    }

    LookAt(pos)
    {
        var xdir = this.funct.getXDir( this.input.object.position.x, this.input.object.position.y, this.input.object.position.z, pos.x, pos.y, pos.z),
            ydir = this.funct.getDirection( this.input.object.position.z, this.input.object.position.x, pos.z, pos.x);
        this.input.target = {
            xD: xdir,
            yD: ydir,
            x: pos.x + this.server.camChaseDst * Math.sin(ydir) * Math.cos(xdir),
            y: pos.y - this.server.camChaseDst * Math.sin(xdir),
            z: pos.z + this.server.camChaseDst * Math.cos(ydir) * Math.cos(xdir)
        }

        const pi = Math.PI / 2;
        this.input.object.rotation.y = this.input.target.yD;
        this.input.pitchObject.rotation.x = this.input.target.xD;
        this.input.pitchObject.rotation.x = Math.max(-pi, Math.min(pi, this.input.pitchObject.rotation.x));
        this.input.yDr = (this.input.pitchObject.rotation.x % Math.PI2).round(3);
        this.input.xDr = (this.input.object.rotation.y % Math.PI2).round(3);
        //let screenG = this.world2Screen(pos, this.cam.fpsCamera);
        //this.line(innerWidth / 2, innerHeight - 1, screenG.x, screenG.y, 2, this.colors.white);
    }

    AutoAim()
    {
        const possibleTargets = this.world.players.list.filter(player => {return player.active && player.inView && !player.isYou && (!player.team || player.team !== this.self.team);}).sort((p1, p2) => this.dist(this.self, p1) - this.dist(this.self, p2));
            let isLockedOn = false;
            if (possibleTargets.length > 0)
            {
                const target = possibleTargets[0];
                switch (this.settings.autoAim % 3)
                {
                    case 1: // aimbot
                        if (target) {
                            var inSight = (null === this.world.canSee(this.cam.camera.getWorldPosition(), target.x, target.y, target.z, 10));
                            if (inSight)
                            {
                                if (this.self.aimVal !== 0) this.input.mouseDownR = 1;
                                this.LookAt(target.objInstances.position.setY(target.y + target.height - 1.5 - 2.5 * target.crouchVal - this.self.recoilAnimY * 0.3 * 25));
                                isLockedOn = true;
                            }
                            else isLockedOn = false;
                        }
                        break;
                    case 2: // triggerbot
                        if (this.self.didShoot) {
                            this.settings.canShoot = false;
                            setTimeout(() => {
                                this.settings.canShoot = true;
                            }, this.self.weapon.rate);
                        }
                        if (this.input.mouseDownL === 1) {
                            this.input.mouseDownL = 0;
                            this.input.mouseDownR = 0;
                            this.settings.scopingOut = true;
                        }
                        if (this.self.aimVal === 1) {
                            this.scopingOut = false;
                        }
                        if (this.settings.scopingOut || !this.settings.canShoot || this.self.recoilForce > 0.01) {
                            isLockedOn = false;
                        }
                        this.LookAt(target.objInstances.position.setY(target.y + target.height - 1.5 - 2.5 * target.crouchVal - this.self.recoilAnimY * 0.3 * 25));
                        if (this.input.mouseDownR === 0) {
                            this.input.mouseDownR = 1;
                        }
                        else if (this.self.aimVal < 0.2) {
                            this.input.mouseDownL = 1 - this.input.mouseDownL;
                        }
                        isLockedOn = true;
                }

            }
        if (!isLockedOn) {
            if (this.settings.aimCounter > 100) {
                if (this.input.mouseDownL === 1) this.input.mouseDownL = 0;
                if (this.input.mouseDownR === 1) this.input.mouseDownR = 0;
                this.settings.aimCounter = 0;
            } this.input.target = null;
            this.settings.aimCounter++;
        }
    }

    loop(world, self, server, input, funct, cam, ui, proc)
    {
        if (!this.world) console.warn("WORLD TRACE", world); this.world = world
        if (!this.self) console.warn("SELF TRACE", self); this.self = self
        if (!this.server) console.warn("SERVER TRACE", server); this.server = server
        if (!this.input) console.warn("INPUT TRACE", input); this.input = input
        if (!this.funct) console.warn("FUNCT TRACE", funct); this.funct = funct
        if (!this.cam) console.warn("CAM TRACE", cam); this.cam = cam
        if (!this.ui) console.warn("UI TRACE", ui); this.ui = ui
        if (!this.proc) console.warn("PROC TRACE", proc); this.proc = proc

        server.kickTimer = window.idleTimer + 60000;
        server.clientSendRate = 100;

        if (self && self.active) {

            if (this.settings.noRecoil) {
                server.recoilMlt = 0;
                server.regenDelay = 0;
                server.regenVal = .5
                self.recoilAnim = 0;
                self.recoilAnimY = 0;
                self.recoilForce = 0;
                self.recoilTweenY = 0;
                self.recoilTweenYM = 0;
                self.recoilTweenZ = 0;
                self.recoilX = 0;
                self.recoilZ = 0;
            }

            proc[1] *= this.settings.moveSpeed;
            if (this.settings.shotRate !== 1000) self.weapon.rate = this.settings.shotRate;
            if (this.settings.fullClip && self.ammos[self.weaponIndex] < self.weapon.ammo)
            {
                self.ammos[self.weaponIndex] = self.weapon.ammo;
                world.players.updatePlayerAmmo(self);
            }

            self.weapon.aimSpeed = 60;

            this.AutoAim();

            if (this.settings.esp < 3 || this.settings.tracers)
            {
                unsafeWindow.requestAnimFrame( ()=>{
                    this.ctx.clearRect(0, 0, innerWidth, innerHeight);
                    this.drawESP();
                });
            }
            else if (this.settings.canvasNeedsClean)
            {
                this.ctx.clearRect(0, 0, innerWidth, innerHeight);
                this.settings.canvasNeedsClean = false;
            }

            if (this.settings.bHop) {
                input.keys[input.jumpKey] = self.onGround;
                if (this.settings.bHop === 2)
                {
                    if (this.settings.isSliding) {
                    proc[8] = 1;
                    }
                    else if (self.yVel < -0.04 && self.canSlide) {
                        this.settings.isSliding = true;
                        setTimeout(() => {
                            this.settings.isSliding = false;
                        }, self.slideTimer);
                        proc[8] = 1;
                    }
                }
            }

            if (this.settings.espCounter > 100 )
            {
                if (this.settings.esp === 3) this.drawPinfo();
                this.settings.espCounter = 0;
            }   this.settings.espCounter ++;

        }
        else if (this.settings.noDeathDelay || self && self.health === 0) //Dead
        {
            server.deathDelay = 0;
            ui.toggleGameUI(1)
            world.players.forcePos();
            world.players.resetAim();
            ui.toggleControlUI(1);
            world.updateUI();
            input.toggle(1);
        }
    }

    onLoad() {
        this.createCanvas();
        this.createFPSDisplay();
        this.createWatermark();
        this.createDeathCounter();
        this.createMenu();
        this.createObservers();
        this.changeProfileIcon();
    }
}

window.unsafeWindow.myInit = () => {
    return new Utilities();
}

if (window.location.hostname === 'krunker.io') {
    (function() {
        'use strict';
        window.stop();
        document.innerHTML = null;
        GM_xmlhttpRequest({
            method: "GET",
            url: document.location.origin,
            onload: load => {
                let body = load.responseText;
                body = body.replace(/<script src="js\/game\.\w+?(?=\.)\.js\?build=.+"><\/script>/g, `<script type="application/javascript" src="` + ExternalURL + `"></script>`)
                    .replace(/libs\/zip-ext\.js\?build=.+?(?=")/g, ``)
                //.replace(/libs\/zip\.js\?build=.+?(?=")/g, ``);
                //console.log(body);
                document.open();
                document.write(body);
                document.close();
            }
        });
    })();
}
