function a() {
    this.size = 1,
    this.data = [],
    this.data[0] = 0
}

function o(e) {
    var t = e.indexOf(";");
    if (t < 0)
        return null;
    var n = e.substr(0, t)
      , r = e.substr(t + 1)
      , o = n.indexOf("=");
    if (o < 0)
        return null;
    var i = n.substr(o + 1);
    if ((o = r.indexOf("=")) < 0)
        return null;
    var l = r.substr(o + 1)
      , c = new Object;
    return c.n = function(e) {
        var t, n, r = Math.ceil(e.length / 4), o = new a;
        for (o.size = r,
        t = 0; t < r; t++)
            n = e.substr(4 * t, 4),
            o.data[r - 1 - t] = parseInt(n, 16);
        return o
    }(l),
    c.e = parseInt(i, 16),
    c
}

function s(e, t) {
    if (t > 4096)
        return null;
    var n = e.slice(0)
      , r = n.length;
    n[r++] = 0,
    n[r++] = 0,
    n[r++] = 0,
    n[r] = 0;
    for (var o = 0, i = []; i.length < t; )
        n[r] = o++,
        i = i.concat(p(n));
    return i.slice(0, t)
}

function g(e, t) {
    return (e & (1 << 32 - t) - 1) << t | e >>> 32 - t
}

function d(e, t, n) {
    var r, o, i, a, l = [], c = e.A, s = e.B, u = e.C, p = e.D, f = e.E;
    for (o = 0,
    i = n; o < 16; o++,
    i += 4)
        l[o] = t[i] << 24 | t[i + 1] << 16 | t[i + 2] << 8 | t[i + 3] << 0;
    for (o = 16; o < 80; o++)
        l[o] = g(l[o - 3] ^ l[o - 8] ^ l[o - 14] ^ l[o - 16], 1);
    for (r = 0; r < 20; r++)
        a = g(c, 5) + (s & u | ~s & p) + f + l[r] + 1518500249 & 4294967295,
        f = p,
        p = u,
        u = g(s, 30),
        s = c,
        c = a;
    for (r = 20; r < 40; r++)
        a = g(c, 5) + (s ^ u ^ p) + f + l[r] + 1859775393 & 4294967295,
        f = p,
        p = u,
        u = g(s, 30),
        s = c,
        c = a;
    for (r = 40; r < 60; r++)
        a = g(c, 5) + (s & u | s & p | u & p) + f + l[r] + 2400959708 & 4294967295,
        f = p,
        p = u,
        u = g(s, 30),
        s = c,
        c = a;
    for (r = 60; r < 80; r++)
        a = g(c, 5) + (s ^ u ^ p) + f + l[r] + 3395469782 & 4294967295,
        f = p,
        p = u,
        u = g(s, 30),
        s = c,
        c = a;
    e.A = e.A + c & 4294967295,
    e.B = e.B + s & 4294967295,
    e.C = e.C + u & 4294967295,
    e.D = e.D + p & 4294967295,
    e.E = e.E + f & 4294967295
}

function f(e, t, n) {
    var r;
    for (r = 3; r >= 0; r--)
        t[n + r] = 255 & e,
        e >>>= 8
}

function p(e) {
    var t, n = e.slice(0);
    !function(e) {
        var t, n = e.length, r = n, o = n % 64, i = o < 55 ? 56 : 120;
        for (e[r++] = 128,
        t = o + 1; t < i; t++)
            e[r++] = 0;
        var a = 8 * n;
        for (t = 1; t < 8; t++)
            e[r + 8 - t] = 255 & a,
            a >>>= 8
    }(n);
    var r = {
        A: 1732584193,
        B: 4023233417,
        C: 2562383102,
        D: 271733878,
        E: 3285377520
    };
    for (t = 0; t < n.length; t += 64)
        d(r, n, t);
    var o = [];
    return f(r.A, o, 0),
    f(r.B, o, 4),
    f(r.C, o, 8),
    f(r.D, o, 12),
    f(r.E, o, 16),
    o
}

function u(e, t) {
    if (e.length != t.length)
        return null;
    for (var n = [], r = e.length, o = 0; o < r; o++)
        n[o] = e[o] ^ t[o];
    return n
}

function c(e, t, n, r) {
    var o, i = e.data.slice(0), a = 0, l = e.data;
    for (o = 0; o < n.size; o++) {
        var c = a + n.data[o] * t;
        (c -= 65536 * (a = c >>> 16)) > l[o + r] ? (l[o + r] += 65536 - c,
        a++) : l[o + r] -= c
    }
    return a > 0 && (l[o + r] -= a),
    l[o + r] < 0 ? (e.data = i.slice(0),
    -1) : 1
}

function l(e, t, n) {
    var r = function(e, t) {
        var n, r, o = new a;
        for (o.size = e.size + t.size,
        n = 0; n < o.size; n++)
            o.data[n] = 0;
        var i = e.data
          , l = t.data
          , c = o.data;
        if (e == t) {
            for (n = 0; n < e.size; n++)
                c[2 * n] += i[n] * i[n];
            for (n = 1; n < e.size; n++)
                for (r = 0; r < n; r++)
                    c[n + r] += 2 * i[n] * i[r]
        } else
            for (n = 0; n < e.size; n++)
                for (r = 0; r < t.size; r++)
                    c[n + r] += i[n] * l[r];
        return function(e) {
            var t, n, r, o;
            for (r = e.size,
            n = 0,
            t = 0; t < r; t++)
                o = e.data[t],
                o += n,
                o -= 65536 * (n = Math.floor(o / 65536)),
                e.data[t] = o
        }(o),
        o
    }(e, t);
    return function(e, t) {
        var n = e.size
          , r = t.size
          , o = t.data[r - 1]
          , i = t.data[r - 1] + t.data[r - 2] / 65536
          , l = new a;
        l.size = n - r + 1,
        e.data[n] = 0;
        for (var s = n - 1; s >= r - 1; s--) {
            var u = s - r + 1
              , p = Math.floor((65536 * e.data[s + 1] + e.data[s]) / i);
            if (p > 0) {
                var f = c(e, p, t, u);
                for (f < 0 && c(e, --p, t, u); f > 0 && e.data[s] >= o; )
                    (f = c(e, 1, t, u)) > 0 && p++
            }
            l.data[u] = p
        }
        return function(e) {
            var t = e.size - 1;
            for (; t > 0 && 0 == e.data[t--]; )
                e.size--
        }(e),
        {
            q: l,
            r: e
        }
    }(r, n).r
}

function i(e, t, n) {
    var r = t.n
      , o = t.e
      , i = e.length
      , c = 2 * r.size;
    if (i + 42 > c)
        return null;
    !function(e, t, n) {
        var r, o = e.length, i = [218, 57, 163, 238, 94, 107, 75, 13, 50, 85, 191, 239, 149, 96, 24, 144, 175, 216, 7, 9], a = t - o - 40 - 2, l = [];
        for (r = 0; r < a; r++)
            l[r] = 0;
        l[a] = 1;
        var c = i.concat(l, e)
          , f = [];
        for (r = 0; r < 20; r++)
            f[r] = Math.floor(256 * Math.random());
        var d = s(f = p(f.concat(n)), t - 21)
          , g = u(c, d)
          , m = s(g, 20)
          , h = u(f, m)
          , b = [];
        for (b[0] = 0,
        b = b.concat(h, g),
        r = 0; r < b.length; r++)
            e[r] = b[r]
    }(e, c, n);
    var f = function(e, t, n) {
        var r = []
          , o = 0;
        for (; t > 0; )
            r[o] = 1 & t,
            t >>>= 1,
            o++;
        for (var i = (s = e,
        u = void 0,
        u = new a,
        u.size = s.size,
        u.data = s.data.slice(0),
        u), c = o - 2; c >= 0; c--)
            i = l(i, i, n),
            1 == r[c] && (i = l(i, e, n));
        var s, u;
        return i
    }(function(e) {
        var t = new a
          , n = 0
          , r = e.length
          , o = r >> 1;
        for (n = 0; n < o; n++)
            t.data[n] = e[2 * n] + (e[1 + 2 * n] << 8);
        r % 2 && (t.data[n++] = e[r - 1]);
        return t.size = n,
        t
    }(e = e.reverse()), o, r);
    f.size = r.size;
    var d = function(e) {
        var t = []
          , n = 0
          , r = e.size;
        for (n = 0; n < r; n++) {
            t[2 * n] = 255 & e.data[n];
            var o = e.data[n] >>> 8;
            t[2 * n + 1] = o
        }
        return t
    }(f);
    return d = d.reverse()
}

function r(e, t) {
    var n, r, o = "";
    for (n = t; n < 4; n++)
        e >>= 6;
    for (n = 0; n < t; n++)
        o = ((r = 63 & e) >= 0 && r < 26 ? String.fromCharCode(65 + r) : r >= 26 && r < 52 ? String.fromCharCode(97 + r - 26) : r >= 52 && r < 62 ? String.fromCharCode(48 + r - 52) : 62 == r ? "+" : "/") + o,
        e >>= 6;
    return o
}


Encrypt = function(Key, randomNum, password) {
    var c = [];

    if (null == password)
        return null;
    c = function(e) {
        var t, n = [], r = 0;
        n[r++] = 1,
        n[r++] = 1;
        var o = e.length;
        for (n[r++] = o,
        t = 0; t < o; t++)
            n[r++] = 127 & e.charCodeAt(t);
        return n[r++] = 0,
        n[r++] = 0,
        n
    }(password)

    if (null == c || void 0 === c)
        return c;
    if ("undefined" != typeof Key && void 0 !== o)
        var s = o(Key);
    var u = function(e, t, o, a) {
        var l, c;
        for (var s = [], u = 42, p = 2 * t.n.size - u, f = 0; f < e.length; f += p) {
            var d;
            if (f + p >= e.length)
                (d = i(e.slice(f), t, a)) && (s = d.concat(s));
            else
                (d = i(e.slice(f, f + p), t, a)) && (s = d.concat(s))
        }
        return function(e) {
            var t, n, o = e.length, i = "";
            for (t = o - 3; t >= 0; t -= 3)
                i += r(n = e[t] | e[t + 1] << 8 | e[t + 2] << 16, 4);
            var a = o % 3;
            for (n = 0,
            t += 2; t >= 0; t--)
                n = n << 8 | e[t];
            1 == a ? i = i + r(n << 16, 2) + "==" : 2 == a && (i = i + r(n << 8, 3) + "=");
            return i
        }(s)
    }(c, s, randomNum);
    return u
}