"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { mentorApi, skillsApi, verificationApi } from "@/lib/api";
import { useStoredToken, useStoredUser } from "@/lib/auth";

type Skill = {
    id: string;
    name: string;
    sector: string;
    category: string;
    proficiencyLevel: number;
    verified: boolean;
};

type Mentor = {
    userId: string;
    sectors: string[];
    isApproved: boolean;
    user: { id: string; name: string; email: string; role: string };
};

type SkillGetResponse = {
    skill: Skill;
};

type MentorListResponse = {
    mentors: Mentor[];
    count: number;
};

export default function RequestSkillVerificationPage() {
    const params = useParams();
    const router = useRouter();
    const token = useStoredToken();
    const user = useStoredUser();

    const skillIdParam = params.id;
    const skillId = Array.isArray(skillIdParam) ? skillIdParam[0] : skillIdParam;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [skill, setSkill] = useState<Skill | null>(null);
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [reviewerId, setReviewerId] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [evidenceUrl, setEvidenceUrl] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);

    const canRequest = useMemo(() => {
        // Students and employees can request; educators/admins could too, but keep simple.
        return user?.role === "STUDENT" || user?.role === "EMPLOYEE";
    }, [user?.role]);

    useEffect(() => {
        if (!token || !user) router.replace("/login");
    }, [router, token, user]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!skillId) {
                setLoading(false);
                setError("Missing skill id");
                return;
            }
            setLoading(true);
            setError("");
            try {
                const skillResp = (await skillsApi.getById(skillId)) as SkillGetResponse;
                const s = skillResp.skill;

                const mentorResp = await mentorApi.listApproved(s.sector);
                const m = ((mentorResp as MentorListResponse).mentors as Mentor[]) || [];

                if (!cancelled) {
                    setSkill(s);
                    setMentors(m);
                    setReviewerId(m[0]?.userId || "");
                }
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load verification page");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        void load();
        return () => {
            cancelled = true;
        };
    }, [skillId]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!skill) return;

        setSubmitting(true);
        setError("");
        try {
            await verificationApi.createRequest(skill.id, {
                reviewerId,
                message: message || undefined,
                evidenceUrl: evidenceUrl || undefined,
            });
            router.push("/dashboard/skills");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create request");
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/dashboard/skills"
                    className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold mb-4 transition-colors"
                >
                    <span>←</span>
                    <span>Back to Skills</span>
                </Link>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">Request Verification</h1>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600 font-medium">Loading…</p>
                </div>
            ) : !skill ? (
                <div className="p-6 rounded-2xl border border-slate-200 bg-white">
                    <p className="text-slate-700 font-medium">Skill not found.</p>
                </div>
            ) : !canRequest ? (
                <div className="p-6 rounded-2xl border border-slate-200 bg-white">
                    <p className="text-slate-700 font-medium">This action is only available for students/employees.</p>
                </div>
            ) : skill.verified ? (
                <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50">
                    <p className="text-emerald-700 font-semibold">This skill is already verified.</p>
                </div>
            ) : (
                <form onSubmit={submit} className="rounded-2xl border-2 border-blue-200/70 bg-white/80 backdrop-blur-xl shadow-2xl">
                    <div className="p-8 space-y-6">
                        <div>
                            <p className="text-sm font-bold text-slate-900">Skill</p>
                            <p className="text-lg font-black text-slate-900">{skill.name}</p>
                            <p className="text-sm text-slate-600 font-medium">
                                Sector: {skill.sector} · Category: {skill.category.replace(/_/g, " ")}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Choose Mentor</label>
                            <select
                                value={reviewerId}
                                onChange={(e) => setReviewerId(e.target.value)}
                                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white text-slate-900"
                                required
                            >
                                {mentors.length === 0 ? (
                                    <option value="">No approved mentors available for this sector</option>
                                ) : (
                                    mentors.map((m) => (
                                        <option key={m.userId} value={m.userId}>
                                            {m.user.name} ({m.user.email})
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Message (optional)</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white text-slate-900"
                                placeholder="Add context, e.g., where you used this skill, project links, etc."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Evidence URL (optional)</label>
                            <input
                                type="url"
                                value={evidenceUrl}
                                onChange={(e) => setEvidenceUrl(e.target.value)}
                                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white text-slate-900"
                                placeholder="https://github.com/... or https://drive.google.com/..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || mentors.length === 0}
                            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black shadow-lg hover:from-blue-700 hover:to-indigo-800 disabled:opacity-60"
                        >
                            {submitting ? "Submitting…" : "Submit Verification Request"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
