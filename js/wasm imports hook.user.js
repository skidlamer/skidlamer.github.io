// ==UserScript==
// @name         wasm imports hook
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://krunker.io/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

let byPlayerMap = []
let currentPlayer

function hideAllHook(playersObj) {
    console.log(playersObj.list)
    byPlayerMap.length = 0
    for (let player of playersObj.list) {
        if (player && player.isYTMP) {
            currentPlayer = player
        } else {
            for (let prop in player) {
                if (player.hasOwnProperty(prop) && player[prop]) {
                    if (player[prop].name && player[prop].name.startsWith("playermap")) {
                        let nr = parseInt(player[prop].name.slice("playermap".length))
                        byPlayerMap[nr] = {plr: player}
                    }
                }
            }
        }
    }
    return true
}

function renderHook(scene, camera, renderer) {
    // Player position
    let playerPosition = camera.position.clone();
    playerPosition.applyMatrix4(camera.matrixWorld);

    // Chams
    for (let obj of scene.children) {
        if (obj.name && obj.traverse && obj.name.startsWith("playermap")) {
            let nr = parseInt(obj.name.slice("playermap".length))
            if (byPlayerMap[nr]) {
                byPlayerMap[nr].pos = Object.assign({}, obj.position)
            }
            obj.visible = true;
            obj.traverse((child) => {
                if (child && child.type === "Mesh") {
                    //child.material.color.setRGB(255, 0, 0);
                    child.material.emissive = {r: 0, g: 255, b: 75}
                    child.material.opacity = 0;
                    child.material.fog = false;
                    child.material.transparent = false;
                    child.material.depthTest = false;
                }
            });
        }
    }

    // Aimgoat



    return true
}

let patchInlineScript = function(script) {
    console.groupCollapsed("PATCHING ");
    const patches = new Map()
        .set("wasm", [/(function \w+\(\w+,\w+\){)(\w+\(\w+,)({name:\w+=\w+\(\w+\),fromWireType:function\(\w+\){var \w+=(\w+)\[\w+].value;return \w+\(\w+\),\w+},toWireType:function\(\w+,\w+\){return \w+\(\w+\)},argPackAdvance:\d+,readValueFromPointer:\w+,destructorFunction:null})\)}/, "$1window.WireTypeObj=$3;$2window.WireTypeObj);window.PublicObjArray=Pg}"])

    for (const [name, item] of patches) {
        const patched = String.prototype.replace.call(script, item[0], item[1]);
        if (script === patched) {
            console.error(`Failed to patch ${name}`);
            continue;
        }
        console.log("Successfully patched ", name);
        script = patched;
    }
    console.log(script);
    console.groupEnd();
    return script;
}

// Hook the page so functions used to read values from pointers will be global
let isDefined = (item) => void 0 !== item && item;
let observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        for (let node of mutation.addedNodes) {
            if (node.tagName === 'SCRIPT' && node.type === "text/javascript" && node.innerHTML.length > 100000) {
                node.innerHTML = patchInlineScript(node.innerHTML);
            }
        }
    }
});
observer.observe(document, {
    childList: true,
    subtree: true
});

// Hook webassembly memory
WebAssembly.Memory = class extends WebAssembly.Memory {
    constructor(s) {
        window.wasmMem = super(s)
    }
}
let KrunkerAscii = ["\u0000", "\u0001", "\u0002", "\u0003", "\u0004", "\u0005", "\u0006", "\u0007", "\b", "\t", "\n", "\u000b", "\f", "\r", "\u000e", "\u000f", "\u0010", "\u0011", "\u0012", "\u0013", "\u0014", "\u0015", "\u0016", "\u0017", "\u0018", "\u0019", "\u001a", "\u001b", "\u001c", "\u001d", "\u001e", "\u001f", " ", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_", "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", " ", "¡", "¢", "£", "¤", "¥", "¦", "§", "¨", "©", "ª", "«", "¬", "­", "®", "¯", "°", "±", "²", "³", "´", "µ", "¶", "·", "¸", "¹", "º", "»", "¼", "½", "¾", "¿", "À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï", "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "×", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "Þ", "ß", "à", "á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð", "ñ", "ò", "ó", "ô", "õ", "ö", "÷", "ø", "ù", "ú", "û", "ü", "ý", "þ", "ÿ"]

function ReadStringFromMemory(startPtr) {
    let mem = new Uint8Array(window.wasmMem.buffer)
    let built = ""
    for (let i = startPtr; mem[i] || built.length === 0; i++)
        built += KrunkerAscii[mem[i]]
    return built
}

// Hook webassembly imports
WebAssembly.instantiate = new Proxy(WebAssembly.instantiate, {
    apply(target, thisArg, argArray) {
        console.log("Instantiating:", argArray)

        if (argArray.length > 1) {
            let imports = argArray[1]
            if (imports.a && imports.a.n) {
                // this import runs when the wasm wants to execute a js function
                let _oldImport = imports.a.n
                imports.a.n = function (runType, objPointer, funcName, argsPointer) {
                    let name = ReadStringFromMemory(funcName)
                    if (name === "render") {
                        let tempScene = window.WireTypeObj.readValueFromPointer(argsPointer),
                            tempCamera = window.WireTypeObj.readValueFromPointer(argsPointer + 8)
                        let tempRenderer = window.PublicObjArray[objPointer].value
                        let doRender = true
                        if (tempScene && tempScene.children) {
                            doRender = renderHook(tempScene, tempCamera, tempRenderer)
                        }
                        if (doRender) {
                            tempRenderer.render(tempScene, tempCamera)
                        }
                    } else if (name === "hideAll") {
                        let playersObj = window.PublicObjArray[objPointer].value
                        if (hideAllHook(playersObj)) {
                            playersObj.hideAll()
                        }
                    } else {
                        _oldImport.apply(this, [runType, objPointer, funcName, argsPointer])
                    }
                }
            }
        }
        let ret = target.apply(thisArg, argArray)
        ret.then(v => {
            window.wasmModulev = v;
            console.log("Instantiated:", v)
        })
        return ret
    }
})
