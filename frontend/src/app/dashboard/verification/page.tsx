"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { verificationApi } from "@/lib/api";
import { clearAuthStorage, useStoredUser, useStoredToken } from "@/lib/auth";

type VerificationRequest = {
    id: string;
    status: string;
    message?: string | null;
    evidenceUrl?: string | null;
    decisionNote?: string | null;
    createdAt: string;
    requester: { id: string; name: string; email?: string | null; role?: string | null };
    skill: { id: string; name: string; sector: string; category: string; proficiencyLevel: number };
};

type ListReceivedResponse = {
    requests: VerificationRequest[];
    count: number;
};

export default function VerificationInboxPage() {
    const router = useRouter();
    const user = useStoredUser();
    const token = useStoredToken();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [requests, setRequests] = useState<VerificationRequest[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("PENDING");

    const canView = useMemo(() => {
        return user?.role === "EDUCATOR" || user?.role === "ADMIN";
    }, [user?.role]);

    useEffect(() => {
        if (!token || !user) router.replace("/login");
    }, [router, token, user]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!canView) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");
            try {
                const data = await verificationApi.listReceived(statusFilter);
                const items = (data as ListReceivedResponse).requests;
                if (!cancelled) setRequests(items || []);
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load requests");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        void load();
        return () => {
            cancelled = true;
        };
    }, [canView, statusFilter]);

    const decide = async (requestId: string, decision: "APPROVED" | "REJECTED") => {
        const decisionNote = window.prompt(
            decision === "APPROVED" ? "Approval note (optional):" : "Rejection reason (optional):"
        );
        try {
            await verificationApi.decide(requestId, { decision, decisionNote: decisionNote || undefined });
            const data = await verificationApi.listReceived(statusFilter);
            setRequests((data as ListReceivedResponse).requests || []);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to submit decision");
        }
    };

    if (!user) return null;

    if (!canView) {
        return (
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verification Inbox</h1>
                <p className="mt-3 text-slate-700 font-medium">
                    This page is only available to educators/admins.
                </p>
                <div className="mt-6">
                    <Link href="/dashboard" className="text-blue-700 hover:text-blue-900 font-semibold">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verification Inbox</h1>
                    <p className="mt-2 text-slate-700 font-medium">
                        Review and approve/reject student skill verification requests.
                    </p>
                </div>
            </div>

            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            <div className="mt-6 flex items-center gap-3">
                <label className="text-sm font-bold text-slate-900">Status</label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-blue-200 rounded-xl bg-white text-slate-900 font-semibold"
                >
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="CANCELLED">CANCELLED</option>
                </select>
            </div>

            <div className="mt-6 rounded-2xl border-2 border-blue-200/70 bg-white/80 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-200/60">
                    <h2 className="text-xl font-black text-slate-900">Requests</h2>
                    <p className="text-sm text-slate-600 font-medium">{requests.length} total</p>
                </div>

                {loading ? (
                    <div className="p-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-center text-slate-600 font-medium">Loading…</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="p-8 text-center text-slate-600 font-medium">No requests found.</div>
                ) : (
                    <div className="divide-y divide-slate-200/60">
                        {requests.map((r) => (
                            <div key={r.id} className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-lg font-black text-slate-900">{r.skill.name}</span>
                                            <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                                                {r.skill.sector}
                                            </span>
                                            <span className="px-2 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold">
                                                {r.status}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-slate-700 font-medium">
                                            From: <span className="font-bold">{r.requester.name}</span>
                                            {r.requester.email ? ` (${r.requester.email})` : ""}
                                        </p>
                                        {r.message ? (
                                            <p className="mt-3 text-slate-700">{r.message}</p>
                                        ) : null}
                                        {r.evidenceUrl ? (
                                            <p className="mt-2 text-sm">
                                                <a
                                                    href={r.evidenceUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-700 hover:text-blue-900 font-semibold"
                                                >
                                                    Evidence link
                                                </a>
                                            </p>
                                        ) : null}
                                        {r.decisionNote ? (
                                            <p className="mt-3 text-sm text-slate-600">
                                                <span className="font-bold">Note:</span> {r.decisionNote}
                                            </p>
                                        ) : null}
                                    </div>

                                    {r.status === "PENDING" ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => void decide(r.id, "APPROVED")}
                                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => void decide(r.id, "REJECTED")}
                                                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
