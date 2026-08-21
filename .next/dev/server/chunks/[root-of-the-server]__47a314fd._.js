module.exports = [
"[externals]/node:tty [external] (node:tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:tty", () => require("node:tty"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[project]/node_modules/obug/dist/core.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

//#region src/utils.ts
/**
* Coerce `value`.
*/ __turbopack_context__.s([
    "a",
    ()=>namespaces,
    "i",
    ()=>enabled,
    "n",
    ()=>disable,
    "o",
    ()=>humanize,
    "r",
    ()=>enable,
    "s",
    ()=>selectColor,
    "t",
    ()=>createDebug
]);
function coerce(value) {
    if (value instanceof Error) return value.stack || value.message;
    return value;
}
/**
* Selects a color for a debug namespace
* @return An ANSI color code for the given namespace
*/ function selectColor(colors, namespace) {
    let hash = 0;
    for(let i = 0; i < namespace.length; i++){
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
    }
    return colors[Math.abs(hash) % colors.length];
}
/**
* Checks if the given string matches a namespace template, honoring
* asterisks as wildcards.
*/ function matchesTemplate(search, template) {
    let searchIndex = 0;
    let templateIndex = 0;
    let starIndex = -1;
    let matchIndex = 0;
    while(searchIndex < search.length)if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) if (template[templateIndex] === "*") {
        starIndex = templateIndex;
        matchIndex = searchIndex;
        templateIndex++;
    } else {
        searchIndex++;
        templateIndex++;
    }
    else if (starIndex !== -1) {
        templateIndex = starIndex + 1;
        matchIndex++;
        searchIndex = matchIndex;
    } else return false;
    while(templateIndex < template.length && template[templateIndex] === "*")templateIndex++;
    return templateIndex === template.length;
}
function humanize(value) {
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}s`;
    return `${value}ms`;
}
//#endregion
//#region src/core.ts
let globalNamespaces = "";
/**
* Returns a string of the currently enabled debug namespaces.
*/ function namespaces() {
    return globalNamespaces;
}
function createDebug(namespace, options) {
    let prevTime;
    let enableOverride;
    let namespacesCache;
    let enabledCache;
    const debug = (...args)=>{
        if (!debug.enabled) return;
        const curr = Date.now();
        const diff = curr - (prevTime || curr);
        prevTime = curr;
        args[0] = coerce(args[0]);
        if (typeof args[0] !== "string") args.unshift("%O");
        let index = 0;
        args[0] = args[0].replace(/%([a-z%])/gi, (match, format)=>{
            if (match === "%%") return "%";
            index++;
            const formatter = options.formatters[format];
            if (typeof formatter === "function") {
                const value = args[index];
                match = formatter.call(debug, value);
                args.splice(index, 1);
                index--;
            }
            return match;
        });
        options.formatArgs.call(debug, diff, args);
        debug.log(...args);
    };
    debug.extend = function(namespace, delimiter = ":") {
        return createDebug(this.namespace + delimiter + namespace, {
            useColors: this.useColors,
            color: this.color,
            formatArgs: this.formatArgs,
            formatters: this.formatters,
            inspectOpts: this.inspectOpts,
            log: this.log,
            humanize: this.humanize
        });
    };
    Object.assign(debug, options);
    debug.namespace = namespace;
    Object.defineProperty(debug, "enabled", {
        enumerable: true,
        configurable: false,
        get: ()=>{
            if (enableOverride != null) return enableOverride;
            if (namespacesCache !== globalNamespaces) {
                namespacesCache = globalNamespaces;
                enabledCache = enabled(namespace);
            }
            return enabledCache;
        },
        set: (v)=>{
            enableOverride = v;
        }
    });
    return debug;
}
let names = [];
let skips = [];
function enable(namespaces) {
    globalNamespaces = namespaces;
    names = [];
    skips = [];
    const split = globalNamespaces.trim().replace(/\s+/g, ",").split(",").filter(Boolean);
    for (const ns of split)if (ns[0] === "-") skips.push(ns.slice(1));
    else names.push(ns);
}
/**
* Disable debug output.
*/ function disable() {
    const namespaces = [
        ...names,
        ...skips.map((namespace)=>`-${namespace}`)
    ].join(",");
    enable("");
    return namespaces;
}
/**
* Returns true if the given mode name is enabled, false otherwise.
*/ function enabled(name) {
    for (const skip of skips)if (matchesTemplate(name, skip)) return false;
    for (const ns of names)if (matchesTemplate(name, ns)) return true;
    return false;
}
;
}),
"[project]/node_modules/obug/dist/node.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createDebug",
    ()=>createDebug,
    "enable",
    ()=>enable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$obug$2f$dist$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/obug/dist/core.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$tty__$5b$external$5d$__$28$node$3a$tty$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:tty [external] (node:tty, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:util [external] (node:util, cjs)");
;
;
;
//#region src/node.ts
let env = {};
try {
    process.env.DEBUG;
    env = process.env;
} catch (_unused) {}
const colors = process.stderr.getColorDepth && process.stderr.getColorDepth(env) > 2 ? [
    20,
    21,
    26,
    27,
    32,
    33,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    56,
    57,
    62,
    63,
    68,
    69,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    92,
    93,
    98,
    99,
    112,
    113,
    128,
    129,
    134,
    135,
    148,
    149,
    160,
    161,
    162,
    163,
    164,
    165,
    166,
    167,
    168,
    169,
    170,
    171,
    172,
    173,
    178,
    179,
    184,
    185,
    196,
    197,
    198,
    199,
    200,
    201,
    202,
    203,
    204,
    205,
    206,
    207,
    208,
    209,
    214,
    215,
    220,
    221
] : [
    6,
    2,
    3,
    4,
    5,
    1
];
const inspectOpts = Object.keys(env).filter((key)=>/^debug_/i.test(key)).reduce((obj, key)=>{
    const prop = key.slice(6).toLowerCase().replace(/_([a-z])/g, (_, k)=>k.toUpperCase());
    let value = env[key];
    const lowerCase = typeof value === "string" && value.toLowerCase();
    if (value === "null") value = null;
    else if (lowerCase === "yes" || lowerCase === "on" || lowerCase === "true" || lowerCase === "enabled") value = true;
    else if (lowerCase === "no" || lowerCase === "off" || lowerCase === "false" || lowerCase === "disabled") value = false;
    else value = Number(value);
    obj[prop] = value;
    return obj;
}, Object.create(null));
/**
* Is stdout a TTY? Colored output is enabled when `true`.
*/ function useColors() {
    return "colors" in inspectOpts ? Boolean(inspectOpts.colors) : (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$tty__$5b$external$5d$__$28$node$3a$tty$2c$__cjs$29$__["isatty"])(process.stderr.fd);
}
function getDate() {
    if (inspectOpts.hideDate) return "";
    return `${/* @__PURE__ */ new Date().toISOString()} `;
}
/**
* Adds ANSI color escape codes if enabled.
*/ function formatArgs(diff, args) {
    const { namespace: name, useColors } = this;
    if (useColors) {
        const c = this.color;
        const colorCode = `\u001B[3${c < 8 ? c : `8;5;${c}`}`;
        const prefix = `  ${colorCode};1m${name} \u001B[0m`;
        args[0] = prefix + args[0].split("\n").join(`\n${prefix}`);
        args.push(`${colorCode}m+${this.humanize(diff)}\u001B[0m`);
    } else args[0] = `${getDate()}${name} ${args[0]}`;
}
function log(...args) {
    process.stderr.write(`${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__["formatWithOptions"])(this.inspectOpts, ...args)}\n`);
}
const defaultOptions = {
    useColors: useColors(),
    formatArgs,
    formatters: {
        /**
		* Map %o to `util.inspect()`, all on a single line.
		*/ o (v) {
            this.inspectOpts.colors = this.useColors;
            return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__["inspect"])(v, this.inspectOpts).split("\n").map((str)=>str.trim()).join(" ");
        },
        /**
		* Map %O to `util.inspect()`, allowing multiple lines if needed.
		*/ O (v) {
            this.inspectOpts.colors = this.useColors;
            return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__["inspect"])(v, this.inspectOpts);
        }
    },
    inspectOpts,
    log,
    humanize: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$obug$2f$dist$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["o"]
};
function createDebug(namespace, options) {
    var _ref;
    const color = (_ref = options && options.color) !== null && _ref !== void 0 ? _ref : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$obug$2f$dist$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(colors, namespace);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$obug$2f$dist$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["t"])(namespace, Object.assign(defaultOptions, {
        color
    }, options));
}
function save(namespaces) {
    if (namespaces) env.DEBUG = namespaces;
    else delete env.DEBUG;
}
/**
* Enables a debug mode by namespaces. This can include modes
* separated by a colon and wildcards.
*/ function enable(namespaces) {
    save(namespaces);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$obug$2f$dist$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["r"])(namespaces);
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$obug$2f$dist$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["r"])(env.DEBUG || "");
;
}),
"[project]/node_modules/@sanity/client/dist/browserUpload-CwpNx7Vl.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "uploadWithProgress",
    ()=>uploadWithProgress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sanity$2f$client$2f$dist$2f$request$2d$BhMuKj0D$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@sanity/client/dist/request-BhMuKj0D.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/rxjs/dist/cjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$obug$2f$dist$2f$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/obug/dist/node.js [app-route] (ecmascript) <locals>");
;
;
;
const log = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$obug$2f$dist$2f$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createDebug"])("sanity:client");
let nextRequestId = 1;
/**
* Run an asset upload through `XMLHttpRequest` so we can surface per-chunk
* upload progress events. get-it v9 / fetch has no equivalent hook in the
* browser, so the observable asset-upload API falls back to this path when
* `XMLHttpRequest` is available.
*
* @internal
*/ function uploadWithProgress(options) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Observable"]((subscriber)=>{
        let xhr = new XMLHttpRequest(), requestId = nextRequestId++, { url, method, headers, body, withCredentials, timeout, signal } = options;
        log("[%d] %s %s (XHR upload with progress)", requestId, method, url), xhr.open(method, url), xhr.withCredentials = withCredentials, typeof timeout == "number" && timeout > 0 && (xhr.timeout = timeout);
        for (let [key, value] of Object.entries(headers))xhr.setRequestHeader(key, value);
        xhr.upload.onprogress = (e)=>{
            subscriber.next({
                type: "progress",
                stage: "upload",
                percent: e.lengthComputable ? Math.round(e.loaded / e.total * 100) : 0,
                total: e.total || void 0,
                loaded: e.loaded,
                lengthComputable: e.lengthComputable
            });
        }, xhr.onload = ()=>{
            if (log("[%d] %s %s — %d", requestId, method, url, xhr.status), xhr.status >= 400) {
                let errorHeaders = parseXhrResponseHeaders(xhr.getAllResponseHeaders()), canonical = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sanity$2f$client$2f$dist$2f$request$2d$BhMuKj0D$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])({
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: errorHeaders,
                    body: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sanity$2f$client$2f$dist$2f$request$2d$BhMuKj0D$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["n"])(xhr.responseText, errorHeaders),
                    url: xhr.responseURL
                }, url, method);
                subscriber.error(xhr.status >= 500 ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sanity$2f$client$2f$dist$2f$request$2d$BhMuKj0D$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["a"](canonical) : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sanity$2f$client$2f$dist$2f$request$2d$BhMuKj0D$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["r"](canonical));
                return;
            }
            let responseBody;
            try {
                responseBody = JSON.parse(xhr.responseText);
            } catch  {
                subscriber.error(/* @__PURE__ */ Error("Failed to parse upload response as JSON"));
                return;
            }
            subscriber.next({
                type: "response",
                body: responseBody
            }), subscriber.complete();
        }, xhr.onerror = ()=>{
            log("[%d] %s %s — network error", requestId, method, url), subscriber.error(/* @__PURE__ */ Error("XHR upload network error"));
        }, xhr.ontimeout = ()=>{
            log("[%d] %s %s — timed out after %dms", requestId, method, url, timeout), subscriber.error(new DOMException(`The operation timed out after ${timeout}ms while attempting to reach ${url}`, "TimeoutError"));
        }, xhr.onabort = ()=>{
            subscriber.error(new DOMException("Upload aborted", "AbortError"));
        };
        let onSignalAbort = ()=>xhr.abort();
        if (signal) {
            if (signal.aborted) {
                subscriber.error(new DOMException("Upload aborted", "AbortError"));
                return;
            }
            signal.addEventListener("abort", onSignalAbort, {
                once: !0
            });
        }
        return xhr.send(body), ()=>{
            signal?.removeEventListener("abort", onSignalAbort), xhr.abort();
        };
    });
}
/**
* Parse `XMLHttpRequest.getAllResponseHeaders()` output (CRLF-separated
* `name: value` lines) into a `Headers` instance.
*/ function parseXhrResponseHeaders(raw) {
    let headers = new Headers();
    for (let line of raw.split("\r\n")){
        let separator = line.indexOf(":");
        if (!(separator <= 0)) try {
            headers.append(line.slice(0, separator).trim(), line.slice(separator + 1).trim());
        } catch  {}
    }
    return headers;
}
;
 //# sourceMappingURL=browserUpload-CwpNx7Vl.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__47a314fd._.js.map