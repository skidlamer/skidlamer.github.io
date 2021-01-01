// ==UserScript==
// @name         Krunker Object.defineProperties
// @namespace    https://skidlamer.github.io/
// @version      0.1
// @description  try to take over the world!
// @author       SkidLamer
// @match        *krunker.io/*
// @exclude      *krunker.io/social*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/* eslint-disable no-undef, no-caller */

// Your code here...
Object.assign(this, {GG:{
    onScript: function(script) {
        console.log(script)
    },
    onRender: function() {
        //Draw Shit
    },
    onInput: function(input) {
        //inputs
    }
}});
Object.defineProperties(Object.prototype, {
    drawMinimap: {
        set: async function(val) {
            GG.overlay = this;
            await this.render;
            this.render = new Proxy(this.render, {
                apply(target, that, [scale, game, controls, renderer, me]) {
                    Reflect.apply(...arguments);
                    if (me) {
                        Object.assign(GG, {scale:scale, game:game, controls:controls, renderer:renderer, me:me})
                        GG.ctx = GG.overlay.canvas.getContext('2d');
                        GG.ctx.save();
                        GG.ctx.scale(scale, scale);
                        GG.onRender();
                        GG.ctx.restore();
                    }
                }
            })
        }
    },
    recon: {
        set: function(val) {
            let me = this;
            for(let name in me) {
                if (typeof(me[name]) == "function" && me[name].toString().match(/\(\w+,\w+,\w+,\w+\){this\['recon']/)) {
                    return hook(name);
                }
            }
            function hook(procInputs) {
                console.log(procInputs)
                me[procInputs] = new Proxy(me[procInputs], {
                    apply(target, that, [input, game, recon, lock]) {
                        if (that) {
                            GG.onInput(input);
                        }
                        Reflect.apply(...arguments);
                    }
                })
            }
        },
    },
    dx724: {
        set: function(val) {
            GG.onScript(arguments.callee.caller.toString());
        }
    }
});

