var global = typeof window === 'object' && window.window === window
  ? window : typeof self === 'object' && self.self === self
  ? self
  : this

var utils = {
    (function() {
        keyboardMap = ["", "", "", "CANCEL", "", "", "HELP", "", "BACK_SPACE", "TAB", "", "", "CLEAR", "ENTER", "ENTER_SPECIAL", "", "SHIFT", "CONTROL", "ALT", "PAUSE", "CAPS_LOCK", "KANA", "EISU", "JUNJA", "FINAL", "HANJA", "", "ESCAPE", "CONVERT", "NONCONVERT", "ACCEPT", "MODECHANGE", "SPACE", "PAGE_UP", "PAGE_DOWN", "END", "HOME", "LEFT", "UP", "RIGHT", "DOWN", "SELECT", "PRINT", "EXECUTE", "PRINTSCREEN", "INSERT", "DELETE", "", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "COLON", "SEMICOLON", "LESS_THAN", "EQUALS", "GREATER_THAN", "QUESTION_MARK", "AT", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "OS_KEY", "", "CONTEXT_MENU", "", "SLEEP", "NUMPAD0", "NUMPAD1", "NUMPAD2", "NUMPAD3", "NUMPAD4", "NUMPAD5", "NUMPAD6", "NUMPAD7", "NUMPAD8", "NUMPAD9", "MULTIPLY", "ADD", "SEPARATOR", "SUBTRACT", "DECIMAL", "DIVIDE", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24", "", "", "", "", "", "", "", "", "NUM_LOCK", "SCROLL_LOCK", "WIN_OEM_FJ_JISHO", "WIN_OEM_FJ_MASSHOU", "WIN_OEM_FJ_TOUROKU", "WIN_OEM_FJ_LOYA", "WIN_OEM_FJ_ROYA", "", "", "", "", "", "", "", "", "", "CIRCUMFLEX", "EXCLAMATION", "DOUBLE_QUOTE", "HASH", "DOLLAR", "PERCENT", "AMPERSAND", "UNDERSCORE", "OPEN_PAREN", "CLOSE_PAREN", "ASTERISK", "PLUS", "PIPE", "HYPHEN_MINUS", "OPEN_CURLY_BRACKET", "CLOSE_CURLY_BRACKET", "TILDE", "", "", "", "", "VOLUME_MUTE", "VOLUME_DOWN", "VOLUME_UP", "", "", "SEMICOLON", "EQUALS", "COMMA", "MINUS", "PERIOD", "SLASH", "BACK_QUOTE", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "OPEN_BRACKET", "BACK_SLASH", "CLOSE_BRACKET", "QUOTE", "", "META", "ALTGR", "", "WIN_ICO_HELP", "WIN_ICO_00", "", "WIN_ICO_CLEAR", "", "", "WIN_OEM_RESET", "WIN_OEM_JUMP", "WIN_OEM_PA1", "WIN_OEM_PA2", "WIN_OEM_PA3", "WIN_OEM_WSCTRL", "WIN_OEM_CUSEL", "WIN_OEM_ATTN", "WIN_OEM_FINISH", "WIN_OEM_COPY", "WIN_OEM_AUTO", "WIN_OEM_ENLW", "WIN_OEM_BACKTAB", "ATTN", "CRSEL", "EXSEL", "EREOF", "PLAY", "ZOOM", "", "PA1", "WIN_OEM_CLEAR", ""], getB64Size = function() {}, Number.prototype.round = function(t) {
            return +this.toFixed(t)
        }, String.prototype.escape = function() {
            return (this + "").replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0")
        }, Number.prototype.roundToNearest = function(t) {
            return 0 < this ? Math.ceil(this / t) * t : 0 > this ? Math.floor(this / t) * t : this
        }, isURL = function(t) {
            try {
                return /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%@_.~+&:]*)*(\?[;&a-z\d%@_.,~+&:=-]*)?(\#[-a-z\d_]*)?$/i.test(t)
            } catch (t) {}
            return !1
        }, arrayAverage = function(t) {
            for (var e = 0, i = 0; i < t.length; i++) e += t[i];
            return e / t.length
        }, countInArray = function(t, e) {
            for (var i = 0, n = 0; n < t.length; n++) t[n] === e && i++;
            return i
        }, formatNum = function(t) {
            var e = Math.floor(Math.log(Math.abs(t)) / Math.log(1e3)),
                i = "kmb" [e - 1];
            return i ? (t / Math.pow(1e3, e)).toFixed(1) + i : "" + t
        }, randInt = function(t, e) {
            return Math.floor(Math.random() * (e - t + 1)) + t
        }, randFloat = function(t, e) {
            return Math.random() * (e - t) + t
        }, getRandom = function(e) {
            return e[randInt(0, e.length - 1)]
        }, getDistance = function(t, e, i, n) {
            return Math.sqrt((i -= t) * i + (n -= e) * n)
        }, getDistance3D = function(t, e, i, n, r, s) {
            var o = t - n,
                a = e - r,
                c = i - s;
            return Math.sqrt(o * o + a * a + c * c)
        }, getAnglesSSS = function(t, e, i) {
            var n = Math.acos((e * e + i * i - t * t) / (2 * e * i)),
                r = Math.acos((i * i + t * t - e * e) / (2 * i * t)),
                s = Math.PI - n - r;
            return [-n - Math.PI / 2, r, s]
        }, getXDir = function(e, i, n, r, s, o) {
            var a = Math.abs(i - s),
                c = getDistance3D(e, i, n, r, s, o);
            return Math.asin(a / c) * (i > s ? -1 : 1)
        }, getAngleDist = function(t, e) {
            return Math.atan2(Math.sin(e - t), Math.cos(t - e))
        }, getAngleDist2 = function(t, e) {
            var i = Math.abs(e - t) % (2 * Math.PI);
            return i > Math.PI ? 2 * Math.PI - i : i
        }, toRad = function(t) {
            return t * (Math.PI / 180)
        }, getDirection = function(t, e, i, n) {
            return Math.atan2(e - n, t - i)
        }, lerp = function(t, e, i) {
            return t + (e - t) * i
        }, orderByScore = function(t, e) {
            return e.score - t.score
        }, orderByKills = function(t, e) {
            return e.kills - t.kills
        }, orderByDst = function(t, e) {
            return t.dst - e.dst
        }, orderByNum = function(t, e) {
            return t - e
        }, capFirst = function(t) {
            return t.charAt(0).toUpperCase() + t.slice(1)
        }, truncateText = function(t, e) {
            return t.length > e ? t.substring(0, e) + "..." : t
        }, randomString = function(t) {
            for (var e = "", i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", n = 0; n < t; n++) e += i.charAt(Math.floor(Math.random() * i.length));
            return e
        }, formatNumCash = function(t) {
            return parseFloat(Math.round(100 * t) / 100).toFixed(2)
        }, getKeyName = function(e) {
            return keyboardMap[e]
        }, getTime = function(t, e) {
            var i = parseInt(t % 1e3 / 100),
                n = parseInt(t / 1e3 % 60),
                r = parseInt(t / 6e4 % 60);
            return (r = 10 > r ? "0" + r : r) + ":" + (n = 10 > n ? "0" + n : n) + (e ? "." + i : "")
        }, getReadableTime = function(t) {
            var e = t / 1e3 / 60,
                i = parseInt(e % 60);
            e /= 60;
            var n = parseInt(e % 24);
            e /= 24;
            var r = parseInt(e);
            return (r ? r + "d " : "") + (n ? n + "h " : "") + (i || 0) + "m "
        }, getTimeH = function(t) {
            parseInt(t % 1e3 / 100);
            var e = Math.floor(t / 1e3 % 60),
                i = Math.floor(t / 6e4 % 60),
                n = Math.floor(t / 36e5 % 24);
            return (n = 10 > n ? "0" + n : n) + ":" + (i = 10 > i ? "0" + i : i) + ":" + (e = 10 > e ? "0" + e : e)
        }, scrambleS = function(t) {
            return t && t.replace ? t.replace(/.(.)?/g, "$1") + ("d" + t).replace(/.(.)?/g, "$1") : t
        }, fixTo = function(t, e) {
            return parseFloat(t.toFixed(e))
        }, limit = function(t, e) {
            return t < -e ? -e : t > e ? e : t
        }, limitMM = function(t, e, i) {
            return t < e ? e : t > i ? i : t
        }, cropVal = function(t, e) {
            return t <= e && t >= -e ? 0 : t
        }, isNumber = function(t) {
            return null != t && "number" == typeof t && !isNaN(t) && isFinite(t)
        }, arrayInts = function(e) {
            for (var i = 0; i < e.length; ++i)
                if (!isNumber(e[i])) return !1;
            return !0
        }, isArray = function(t) {
            return !!t && t.constructor === Array
        }, isString = function(t) {
            return t && "string" == typeof t
        };
        lineInRect = function(t, e, i, n, r, s, o, a, c, l, p, h) {
            var u = (o - t) * n,
                d = (l - t) * n,
                f = (c - i) * s,
                m = (h - i) * s,
                g = (a - e) * r,
                v = (p - e) * r,
                y = Math.max(Math.max(Math.min(u, d), Math.min(f, m)), Math.min(g, v)),
                x = Math.min(Math.min(Math.max(u, d), Math.max(f, m)), Math.max(g, v));
            return !(0 > x) && !(y > x) && y
        }, pointInBox3D = function(t, e, i, n, r) {
            return r = r || 0, t >= n.x - n.width - r && t <= n.x + n.width + r && e >= n.y - n.height - r && e <= n.y + n.height + r && i >= n.z - n.length - r && i <= n.z + n.length + r
        }, similar = function(t, e, i) {
            return i = i || 0, Math.abs(t - e) <= i
        }, pointInBox = function(t, e, i, n, r, s, o) {
            return o ? t >= i && t <= r && e >= n && e <= s : t > i && t < r && e > n && e < s
        }, sharePos = function(t, e, i) {
            return i = i || 0, Math.abs(t.x - e.x) <= i && Math.abs(t.y - e.y) <= i && Math.abs(t.z - e.z) <= i && Math.abs(t.d - e.d) <= i
        }, cdv = {
            x: "width",
            y: "height",
            z: "length"
        }, boxIntersection = function(e, i, n, r, s) {
            var o = cdv[n],
                a = cdv[r],
                c = e[n] - e[o] - .1,
                l = i[n] - i[o] - .1,
                p = e[n] + e[o] + .1,
                h = i[n] + i[o] + .1,
                u = e[r] - e[a] - .1,
                d = i[r] - i[a] - .1,
                f = e[r] + e[a] + .1,
                m = i[r] + i[a] + .1,
                g = Math.max(c, l),
                v = Math.min(p, h);
            if (v >= g) {
                var y = Math.max(u, d),
                    x = Math.min(f, m);
                if (x >= y) {
                    for (var w = [{
                            [n]: g,
                            [r]: y,
                            d: s[0]
                        }, {
                            [n]: v,
                            [r]: x,
                            d: s[1]
                        }, {
                            [n]: g,
                            [r]: x,
                            d: s[2]
                        }, {
                            [n]: v,
                            [r]: y,
                            d: s[3]
                        }], b = w.length - 1; 0 <= b; --b)(w[b][n] == p && w[b][n] == h || w[b][n] == c && w[b][n] == l || w[b][r] == f && w[b][r] == m || w[b][r] == u && w[b][r] == d || pointInBox(w[b][n], w[b][r], c, u, p, f) || pointInBox(w[b][n], w[b][r], l, d, h, m)) && (w[b].dontUse = !0);
                    return w
                }
            }
            return null
        }, boxCornerIntersection = function(e, i, n, r) {
            for (var s = cdv[n], o = cdv[r], a = e[n] - e[s], c = i[n] - i[s], l = e[n] + e[s], p = i[n] + i[s], h = e[r] - e[o], u = i[r] - i[o], d = e[r] + e[o], f = i[r] + i[o], m = [{
                    [n]: a,
                    [r]: h,
                    d: Math.PI / 2
                }, {
                    [n]: a,
                    [r]: d,
                    d: Math.PI
                }, {
                    [n]: l,
                    [r]: h,
                    d: 0
                }, {
                    [n]: l,
                    [r]: d,
                    d: -Math.PI / 2
                }], g = m.length - 1; 0 <= g; --g) m[g].i = g, pointInBox(m[g][n], m[g][r], c, u, p, f, !0) || m.splice(g, 1);
            return m.length ? m : null
        }, getIntersection = function(e, i, n) {
            var r = cdv[n],
                s = e[n] - e[r],
                o = i[n] - i[r],
                a = e[n] + e[r],
                c = i[n] + i[r],
                l = Math.max(s, o),
                p = Math.min(a, c);
            if (p >= l) {
                var h = (p - l) / 2;
                return {
                    [n]: l + h,
                    [r]: h
                }
            }
            return null
        }, limitRectVal = function(e, i, n) {
            var r = cdv[n];
            if (e[n] - e[r] < i[n] - i[r]) {
                var s = (i[n] - i[r] - (e[n] - e[r])) / 2;
                e[r] -= s, e[n] += s
            }
            if (e[n] + e[r] > i[n] + i[r]) {
                s = (e[n] + e[r] - (i[n] + i[r])) / 2;
                e[r] -= s, e[n] -= s
            }
        }, getMaxRect = function(e, i, n) {
            for (var r, s, o, a, c = cdv[i], l = cdv[n], p = 0; p < e.length; ++p) r = null == r ? e[p][i] - e[p][c] : Math.min(e[p][i] - e[p][c], r), o = null == o ? e[p][i] + e[p][c] : Math.max(e[p][i] + e[p][c], o), s = null == s ? e[p][n] - e[p][l] : Math.min(e[p][n] - e[p][l], s), a = null == a ? e[p][n] + e[p][l] : Math.max(e[p][n] + e[p][l], a);
            return {
                [i]: (r + o) / 2,
                [n]: (s + a) / 2,
                [c]: Math.abs(o - r) / 2,
                [l]: Math.abs(a - s) / 2
            }
        }, limitRect = function(e, i, n, r, s, o, a, c) {
            var l = getMaxRect(o, a, c),
                p = cdv[a],
                h = cdv[c],
                u = {};
            if (u[a] = e, u[c] = i, u[p] = n, u[h] = r, limitRectVal(u, l, a), limitRectVal(u, l, c), 0 == s || s == Math.PI) {
                var d = u[p];
                u[p] = u[h], u[h] = d
            }
            return u
        }, progressOnLine = function(t, e, i, n, r, s) {
            var o = i - t,
                a = n - e,
                c = Math.sqrt(o * o + a * a);
            return ((o /= c) * (r - t) + (a /= c) * (s - e)) / Math.sqrt(Math.pow(i - t, 2) + Math.pow(n - e, 2))
        }, generateSID = function(t) {
            for (var e = 0, i = !0; i;) {
                i = !1, e++;
                for (var n = 0; n < t.length; ++n)
                    if (t[n].sid == e) {
                        i = !0;
                        break
                    }
            }
            return e
        }, levelIconId = function(t) {
            return Math.max(Math.min(n.maxLevel - 2, t.roundToNearest(3) - 2), 0)
        }, copyToClipboard = function(t) {
            const e = document.createElement("textarea");
            e.value = t, e.setAttribute("readonly", ""), e.style.position = "absolute", e.style.left = "-9999px", document.body.appendChild(e);
            const i = !!(0 < document.getSelection().rangeCount) && document.getSelection().getRangeAt(0);
            e.select(), document.execCommand("copy"), document.body.removeChild(e), i && (document.getSelection().removeAllRanges(), document.getSelection().addRange(i))
        };
        var r = function(t, e) {
            return t.concat(e)
        };
        Array.prototype.flatMap = function(t) {
            return function(t, e) {
                return e.map(t).reduce(r, [])
            }(t, this)
        };
        var s = i(25);
        encodeNetworkMessage = function(e, i) {
            let n = s.encode(e),
                r = new Uint8Array(n.length + 2);
            return r.set(encodeShort(i), 0), r.set(n, 2), r
        }, decodeNetworkMessage = function(e) {
            e = new Uint8Array(e);
            let i = decodeShort(e[0], e[1]),
                n = e.slice(2);
            return [s.decode(n), i]
        }, rotateNumber = function(t, e) {
            return 255 & t + e
        }, encodeShort = function(t) {
            return [15 & t >> 4, 15 & t]
        }, decodeShort = function(t, e) {
            return (t << 4) + e
        }
    }).call(this)
} global.utils = utils;
