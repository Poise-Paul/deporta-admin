module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/sanity/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sanityClient",
    ()=>sanityClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sanity$2f$client$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@sanity/client/dist/index.js [app-route] (ecmascript) <locals>");
;
;
const sanityClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sanity$2f$client$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET || "production",
    apiVersion: "2026-08-20",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false
});
}),
"[project]/lib/tawk/normalize.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractEventName",
    ()=>extractEventName,
    "normalizeChat",
    ()=>normalizeChat,
    "normalizeTicket",
    ()=>normalizeTicket
]);
/**
 * tawk.io's exact webhook payload shape isn't confirmed for this property yet.
 * These extractors try several plausible field names and return null when the
 * required ID is missing, so an unrecognized shape just skips normalization
 * instead of throwing — the raw event is always stored separately either way.
 * Once real payloads land (see tawkEvent docs), tighten these to the real keys.
 */ function get(obj, path) {
    return path.split(".").reduce((acc, key)=>{
        if (acc && typeof acc === "object") return acc[key];
        return undefined;
    }, obj);
}
function pickString(obj, paths) {
    for (const path of paths){
        const value = get(obj, path);
        if (typeof value === "string" && value.trim()) return value;
    }
    return undefined;
}
function extractEventName(body) {
    return pickString(body, [
        "event",
        "type",
        "eventType"
    ]) ?? "unknown";
}
function normalizeChat(body, event) {
    if (!event.toLowerCase().includes("chat")) return null;
    const chat = get(body, "chat") ?? get(body, "data.chat") ?? body;
    const chatId = pickString(chat, [
        "id",
        "chatId",
        "sessionId"
    ]);
    if (!chatId) return null;
    const lower = event.toLowerCase();
    const status = lower.includes("missed") ? "missed" : lower.includes("end") ? "ended" : "active";
    const now = new Date().toISOString();
    return {
        _id: `tawk-chat-${chatId}`,
        _type: "tawkChat",
        chatId,
        status,
        visitorName: pickString(chat, [
            "visitor.name",
            "sender.name",
            "name"
        ]),
        visitorEmail: pickString(chat, [
            "visitor.email",
            "sender.email",
            "email"
        ]),
        department: pickString(chat, [
            "department.name",
            "department"
        ]),
        startedAt: pickString(chat, [
            "startedAt",
            "createdAt",
            "time"
        ]) ?? (status === "active" ? now : undefined),
        endedAt: status === "ended" ? pickString(chat, [
            "endedAt",
            "time"
        ]) ?? now : undefined,
        lastEventAt: now
    };
}
function normalizeTicket(body, event) {
    if (!event.toLowerCase().includes("ticket")) return null;
    const ticket = get(body, "ticket") ?? get(body, "data.ticket") ?? body;
    const ticketId = pickString(ticket, [
        "id",
        "ticketId",
        "number"
    ]);
    if (!ticketId) return null;
    const rawStatus = pickString(ticket, [
        "status"
    ])?.toLowerCase();
    const status = rawStatus === "open" || rawStatus === "pending" || rawStatus === "closed" ? rawStatus : "unknown";
    const now = new Date().toISOString();
    return {
        _id: `tawk-ticket-${ticketId}`,
        _type: "tawkTicket",
        ticketId,
        subject: pickString(ticket, [
            "subject",
            "title"
        ]),
        status,
        priority: pickString(ticket, [
            "priority"
        ]),
        requesterName: pickString(ticket, [
            "requester.name",
            "requestedBy.name",
            "sender.name"
        ]),
        requesterEmail: pickString(ticket, [
            "requester.email",
            "requestedBy.email",
            "sender.email"
        ]),
        createdAt: pickString(ticket, [
            "createdAt",
            "time"
        ]) ?? now,
        updatedAt: now
    };
}
}),
"[project]/app/api/tawk/webhook/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sanity$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sanity/client.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tawk$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/tawk/normalize.ts [app-route] (ecmascript)");
;
;
;
;
const runtime = "nodejs";
// Verified against tawk.io's own docs once a real signed payload is seen —
// header name and algorithm are a best guess until then (see comment below).
function verifySignature(rawBody, signature, secret) {
    if (!secret || !signature) return false;
    const expected = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["default"].createHmac("sha256", secret).update(rawBody).digest("hex");
    const expectedBuf = Buffer.from(expected);
    const signatureBuf = Buffer.from(signature);
    if (expectedBuf.length !== signatureBuf.length) return false;
    return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["default"].timingSafeEqual(expectedBuf, signatureBuf);
}
async function POST(req) {
    const rawBody = await req.text();
    const signature = req.headers.get("x-tawk-signature") ?? req.headers.get("x-tawk-webhook-signature");
    const secret = process.env.TAWK_WEBHOOK_SECRET;
    const signatureValid = verifySignature(rawBody, signature, secret);
    // Reject unsigned/invalid requests by default. Set TAWK_WEBHOOK_ALLOW_UNSIGNED=true
    // locally while calibrating against a real tawk.io test event (see setup notes).
    const allowUnsigned = ("TURBOPACK compile-time value", "development") !== "production" || process.env.TAWK_WEBHOOK_ALLOW_UNSIGNED === "true";
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    let body;
    try {
        body = JSON.parse(rawBody);
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Invalid JSON"
        }, {
            status: 400
        });
    }
    const event = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tawk$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractEventName"])(body);
    const headers = {};
    req.headers.forEach((value, key)=>{
        headers[key] = value;
    });
    const tx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sanity$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanityClient"].transaction();
    tx.create({
        _type: "tawkEvent",
        event,
        receivedAt: new Date().toISOString(),
        signatureValid,
        headers,
        body
    });
    const chat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tawk$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeChat"])(body, event);
    if (chat) tx.createOrReplace(chat);
    const ticket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tawk$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeTicket"])(body, event);
    if (ticket) tx.createOrReplace(ticket);
    try {
        await tx.commit();
    } catch (error) {
        console.error("Failed to persist tawk webhook event:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Storage failed"
        }, {
            status: 500
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        received: true,
        event,
        signatureValid
    });
}
async function GET() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        status: "ok"
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9426ea4e._.js.map