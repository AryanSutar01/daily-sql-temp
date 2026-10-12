"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const STORAGE_KEY = "rzp_test_admin_auth";

declare global {
    interface Window {
        Razorpay?: any;
    }
}

interface Config {
    key_id: string;
    mode: "test" | "live" | "unset";
    max_amount: Record<Currency, number>;
    ip_allowlist: boolean;
    key_secret_set: boolean;
    webhook_secret_set: boolean;
    webhook_url: string;
}

type Currency = "INR" | "USD";
const SYMBOL: Record<Currency, string> = { INR: "₹", USD: "$" };
const PRESETS: Record<Currency, string[]> = { INR: ["1", "899", "1499", "4999"], USD: ["1", "5", "10", "20"] };

interface LogEvent {
    id: number;
    created_at: string;
    kind: string;
    ok: boolean | null;
    order_id: string | null;
    payment_id: string | null;
    message: string | null;
    payload: any;
}

function loadCheckoutScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
    });
}

export default function RazorpayTestClient() {
    const [auth, setAuth] = useState("");
    const [authInput, setAuthInput] = useState("");
    const [config, setConfig] = useState<Config | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [amount, setAmount] = useState("1");
    const [currency, setCurrency] = useState<Currency>("INR");
    const [busy, setBusy] = useState(false);
    const [lastOrderId, setLastOrderId] = useState<string | null>(null);
    const [lastResult, setLastResult] = useState<any>(null);

    const [logs, setLogs] = useState<LogEvent[]>([]);
    const [filterOrder, setFilterOrder] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [expanded, setExpanded] = useState<number | null>(null);
    const authRef = useRef(auth);
    authRef.current = auth;

    useEffect(() => {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            if (saved) setAuth(saved);
        } catch {}
    }, []);

    const api = useCallback(async (path: string, init: RequestInit = {}) => {
        const a = authRef.current;
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        // A staff JWT has two dots; anything else is treated as the ADMIN_SECRET.
        if (a.split(".").length === 3) headers["Authorization"] = `Bearer ${a}`;
        else headers["X-Admin-Secret"] = a;
        const res = await fetch(`${API_URL}/api/rzp-test${path}`, { ...init, headers: { ...headers, ...(init.headers || {}) } });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.detail ? String(body.detail) : `HTTP ${res.status}`);
        return body;
    }, []);

    const logClient = (kind: string, extra: Record<string, any> = {}) =>
        api("/client-event", { method: "POST", body: JSON.stringify({ kind, ...extra }) }).catch(() => {});

    const refreshLogs = useCallback(async () => {
        if (!authRef.current) return;
        try {
            const q = filterOrder && lastOrderId ? `?order_id=${encodeURIComponent(lastOrderId)}` : "";
            setLogs(await api(`/logs${q}`));
        } catch {}
    }, [api, filterOrder, lastOrderId]);

    useEffect(() => {
        if (!auth) return;
        api("/config")
            .then((c) => { setConfig(c); setError(null); })
            .catch((e) => {
                setError(e.message === "Not Found"
                    ? "Not Found — wrong admin secret / not an admin, IP not in RAZORPAY_HARNESS_ALLOWED_IPS, or RAZORPAY_TEST_HARNESS is off on the backend."
                    : e.message);
                setConfig(null);
            });
        refreshLogs();
    }, [auth, api, refreshLogs]);

    useEffect(() => {
        if (!auth || !autoRefresh) return;
        const t = setInterval(refreshLogs, 2000);
        return () => clearInterval(t);
    }, [auth, autoRefresh, refreshLogs]);

    const saveAuth = () => {
        try { sessionStorage.setItem(STORAGE_KEY, authInput); } catch {}
        setAuth(authInput);
    };

    const pay = async () => {
        setBusy(true);
        setLastResult(null);
        setError(null);
        try {
            if (!(await loadCheckoutScript())) throw new Error("Could not load checkout.js");
            const order = await api("/create-order", {
                method: "POST",
                body: JSON.stringify({ amount: Number(amount), currency }),
            });
            setLastOrderId(order.order_id);

            const rzp = new window.Razorpay({
                key: order.key_id,
                order_id: order.order_id,
                amount: order.amount,
                currency: order.currency,
                name: "DailySQL",
                description: "Razorpay test harness",
                prefill: { name: "Test User", email: "test@example.com", contact: "9999999999" },
                theme: { color: "#4DD4C4" },
                handler: async (resp: any) => {
                    await logClient("checkout_success", {
                        order_id: resp.razorpay_order_id,
                        payment_id: resp.razorpay_payment_id,
                        payload: resp,
                    });
                    const v = await api("/verify", { method: "POST", body: JSON.stringify(resp) });
                    setLastResult({ outcome: "success", ...resp, ...v });
                    setBusy(false);
                },
                modal: {
                    ondismiss: () => {
                        logClient("checkout_dismissed", { order_id: order.order_id });
                        setBusy(false);
                    },
                },
            });
            rzp.on("payment.failed", (resp: any) => {
                const e = resp.error || {};
                logClient("checkout_failed", {
                    order_id: order.order_id,
                    payment_id: e.metadata?.payment_id,
                    message: `${e.code}: ${e.description} (${e.reason})`,
                    payload: e,
                });
                setLastResult({ outcome: "failed", ...e });
            });
            logClient("checkout_opened", { order_id: order.order_id });
            rzp.open();
        } catch (e: any) {
            setError(e.message);
            setBusy(false);
        }
    };

    const serverVerify = async () => {
        if (!lastOrderId) return;
        try {
            setLastResult({ outcome: "server_verify", ...(await api(`/order/${lastOrderId}`)) });
        } catch (e: any) { setError(e.message); }
        refreshLogs();
    };

    const simulate = async (event: string, bad = false) => {
        try {
            const r = await api("/simulate-webhook", {
                method: "POST",
                body: JSON.stringify({ event, order_id: lastOrderId, bad_signature: bad }),
            });
            setLastResult({ outcome: "simulated_webhook", ...r });
        } catch (e: any) { setError(e.message); }
        refreshLogs();
    };

    const refund = async (paymentId: string) => {
        if (!confirm(`Fully refund ${paymentId}?`)) return;
        try {
            setLastResult({ outcome: "refund", ...(await api(`/refund/${paymentId}`, { method: "POST" })) });
        } catch (e: any) { setError(e.message); }
        refreshLogs();
    };

    const clearLogs = async () => {
        if (!confirm("Clear all harness logs?")) return;
        await api("/logs", { method: "DELETE" }).catch(() => {});
        refreshLogs();
    };

    const lastWebhook = logs.find((l) => l.kind.startsWith("webhook"));

    if (!auth) {
        return (
            <div className="min-h-screen bg-[#0B0F17] text-zinc-200 flex items-center justify-center p-4">
                <div className="w-full max-w-sm bg-[#131924] border border-[#202736] rounded-lg p-6 space-y-3">
                    <h1 className="text-lg font-bold text-white">Razorpay test harness</h1>
                    <p className="text-xs text-zinc-400">Enter the backend ADMIN_SECRET (or a staff JWT). Stored for this tab only.</p>
                    <input
                        type="password"
                        value={authInput}
                        onChange={(e) => setAuthInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveAuth()}
                        className="w-full bg-[#0B0F17] border border-[#202736] rounded px-3 py-2 text-sm"
                        placeholder="ADMIN_SECRET"
                    />
                    <button onClick={saveAuth} className="w-full bg-[#4DD4C4] text-black font-semibold rounded py-2 text-sm">Continue</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0F17] text-zinc-200 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <header className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-white">Razorpay test harness</h1>
                        <p className="text-xs text-zinc-500">Isolated from live payments — never grants a plan.</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        {config && (
                            <span className={`px-2 py-1 rounded font-mono ${config.mode === "test" ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                                {config.mode.toUpperCase()} · {config.key_id}
                            </span>
                        )}
                        <button
                            onClick={() => { try { sessionStorage.removeItem(STORAGE_KEY); } catch {} setAuth(""); }}
                            className="px-2 py-1 border border-[#202736] rounded hover:bg-[#131924]"
                        >Sign out</button>
                    </div>
                </header>

                {config?.mode === "live" && (
                    <div className="bg-red-500/10 border border-red-500/40 text-red-200 text-sm rounded p-3">
                        LIVE keys — payments move real money. Amount capped at ₹{config.max_amount.INR} / ${config.max_amount.USD}. Refund test payments from the log (↩ refund).
                    </div>
                )}

                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded p-3">{error}</div>}

                <div className="grid md:grid-cols-2 gap-6">
                    {/* 1. Payment */}
                    <section className="bg-[#131924] border border-[#202736] rounded-lg p-5 space-y-4">
                        <h2 className="font-semibold text-white">1. Payment</h2>
                        <div className="flex gap-2">
                            <div className="flex border border-[#202736] rounded overflow-hidden text-xs">
                                {(["INR", "USD"] as Currency[]).map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => { setCurrency(c); setAmount("1"); }}
                                        className={`px-3 ${currency === c ? "bg-[#4DD4C4] text-black font-semibold" : "hover:bg-[#0B0F17]"}`}
                                    >{c}</button>
                                ))}
                            </div>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">{SYMBOL[currency]}</span>
                                <input
                                    type="number" min="1" step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-[#0B0F17] border border-[#202736] rounded pl-7 pr-3 py-2 text-sm"
                                />
                            </div>
                            <button
                                onClick={pay}
                                disabled={busy || !config || Number(amount) < 1 || Number(amount) > (config?.max_amount[currency] ?? 0)}
                                className="bg-[#4DD4C4] text-black font-semibold rounded px-5 py-2 text-sm disabled:opacity-40"
                            >{busy ? "Processing…" : "Pay"}</button>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                            {PRESETS[currency].filter((v) => !config || Number(v) <= config.max_amount[currency]).map((v) => (
                                <button key={v} onClick={() => setAmount(v)} className="px-2 py-1 border border-[#202736] rounded hover:bg-[#0B0F17]">{SYMBOL[currency]}{v}</button>
                            ))}
                        </div>
                        {currency === "USD" && (
                            <p className="text-xs text-amber-300">USD needs International Payments enabled on the Razorpay account, and is paid with an international test card.</p>
                        )}
                        {lastOrderId && (
                            <div className="text-xs space-y-2">
                                <div>Last order: <span className="font-mono text-[#4DD4C4]">{lastOrderId}</span></div>
                                <button onClick={serverVerify} className="px-3 py-1.5 border border-[#202736] rounded hover:bg-[#0B0F17]">
                                    Re-verify on server (fetch order from Razorpay)
                                </button>
                            </div>
                        )}
                        {lastResult && (
                            <pre className="bg-[#0B0F17] border border-[#202736] rounded p-3 text-[11px] overflow-x-auto max-h-64">
                                {JSON.stringify(lastResult, null, 2)}
                            </pre>
                        )}
                    </section>

                    {/* 2. Webhook */}
                    <section className="bg-[#131924] border border-[#202736] rounded-lg p-5 space-y-4">
                        <h2 className="font-semibold text-white">2. Webhook</h2>
                        {config && (
                            <div className="text-xs space-y-2">
                                <div className="text-zinc-400">Webhook URL (paste in Razorpay Dashboard → Test mode → Webhooks):</div>
                                <div className="flex gap-2">
                                    <code className="flex-1 bg-[#0B0F17] border border-[#202736] rounded px-2 py-1.5 font-mono break-all">{config.webhook_url}</code>
                                    <button onClick={() => navigator.clipboard.writeText(config.webhook_url)} className="px-2 border border-[#202736] rounded">Copy</button>
                                </div>
                                {config.webhook_url.includes("localhost") && (
                                    <div className="text-amber-300">Razorpay can't reach localhost — use a tunnel (cloudflared / ngrok) and set BACKEND_URL to it.</div>
                                )}
                                <div>Key secret: <Status ok={config.key_secret_set} /> · Webhook secret: <Status ok={config.webhook_secret_set} /></div>
                                <div className="text-zinc-400">Events to enable: payment.captured, payment.failed, order.paid</div>
                            </div>
                        )}
                        <div className="text-xs">
                            <div className="text-zinc-400 mb-1">Last webhook received:</div>
                            {lastWebhook ? (
                                <div className="bg-[#0B0F17] border border-[#202736] rounded p-2 font-mono">
                                    <Status ok={lastWebhook.ok} /> {lastWebhook.kind} · {new Date(lastWebhook.created_at).toLocaleTimeString()}
                                    <div className="text-zinc-500">{lastWebhook.message}</div>
                                </div>
                            ) : <div className="text-zinc-500">none yet</div>}
                        </div>
                        <div className="text-xs space-y-2">
                            <div className="text-zinc-400">Simulate (signs a fake event with your secret, runs the real handler — no tunnel needed):</div>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => simulate("payment.captured")} className="px-2 py-1 border border-[#202736] rounded hover:bg-[#0B0F17]">payment.captured</button>
                                <button onClick={() => simulate("payment.failed")} className="px-2 py-1 border border-[#202736] rounded hover:bg-[#0B0F17]">payment.failed</button>
                                <button onClick={() => simulate("order.paid")} className="px-2 py-1 border border-[#202736] rounded hover:bg-[#0B0F17]">order.paid</button>
                                <button onClick={() => simulate("payment.captured", true)} className="px-2 py-1 border border-red-500/40 text-red-300 rounded hover:bg-[#0B0F17]">bad signature</button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* 3. Logs */}
                <section className="bg-[#131924] border border-[#202736] rounded-lg p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="font-semibold text-white">3. Logs</h2>
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                            <label className="flex items-center gap-1"><input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} /> Auto-refresh</label>
                            <label className="flex items-center gap-1"><input type="checkbox" checked={filterOrder} disabled={!lastOrderId} onChange={(e) => setFilterOrder(e.target.checked)} /> Last order only</label>
                            <button onClick={refreshLogs} className="px-2 py-1 border border-[#202736] rounded">Refresh</button>
                            <button onClick={clearLogs} className="px-2 py-1 border border-red-500/40 text-red-300 rounded">Clear</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="text-zinc-500 text-left border-b border-[#202736]">
                                <tr><th className="py-2 pr-3">Time</th><th className="pr-3"></th><th className="pr-3">Event</th><th className="pr-3">Order</th><th className="pr-3">Payment</th><th>Message</th></tr>
                            </thead>
                            <tbody>
                                {logs.length === 0 && <tr><td colSpan={6} className="py-4 text-zinc-500">No events yet.</td></tr>}
                                {logs.map((l) => (
                                    <Fragment key={l.id}>
                                        <tr onClick={() => setExpanded(expanded === l.id ? null : l.id)} className="border-b border-[#202736]/50 cursor-pointer hover:bg-[#0B0F17]">
                                            <td className="py-1.5 pr-3 whitespace-nowrap text-zinc-500">{new Date(l.created_at).toLocaleTimeString()}</td>
                                            <td className="pr-3"><Status ok={l.ok} /></td>
                                            <td className="pr-3 font-mono whitespace-nowrap">{l.kind}</td>
                                            <td className="pr-3 font-mono text-zinc-400">{l.order_id}</td>
                                            <td className="pr-3 font-mono text-zinc-400 whitespace-nowrap">
                                                {l.payment_id}
                                                {l.payment_id?.startsWith("pay_") && !l.payment_id.startsWith("pay_SIM") && (l.kind === "checkout_signature_ok" || l.kind === "webhook:payment.captured") && (
                                                    <button onClick={(e) => { e.stopPropagation(); refund(l.payment_id!); }} className="ml-2 text-amber-300 hover:underline">↩ refund</button>
                                                )}
                                            </td>
                                            <td className="text-zinc-400">{l.message}</td>
                                        </tr>
                                        {expanded === l.id && (
                                            <tr><td colSpan={6}>
                                                <pre className="bg-[#0B0F17] border border-[#202736] rounded p-3 my-1 text-[11px] overflow-x-auto max-h-80">{JSON.stringify(l.payload, null, 2)}</pre>
                                            </td></tr>
                                        )}
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}

function Status({ ok }: { ok: boolean | null }) {
    if (ok === true) return <span className="text-emerald-400">●</span>;
    if (ok === false) return <span className="text-red-400">●</span>;
    return <span className="text-zinc-500">●</span>;
}
