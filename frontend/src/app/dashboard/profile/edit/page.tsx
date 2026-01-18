"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStoredToken, useStoredUser, setAuthUser, type StoredUser } from "@/lib/auth";

type ApiProfileDetails = {
    location?: string | null;
    bio?: string | null;
    phone?: string | null;
    linkedIn?: string | null;
    github?: string | null;
    portfolio?: string | null;
    interests?: string[];
    targetSectors?: string[];
};

type ApiUserProfile = {
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
    createdAt?: string;
    profile?: ApiProfileDetails | null;
};


type PatchAvatarResponse = {
    user?: {
        id: string;
        name: string;
        email: string;
        role?: string;
        avatar?: string | null;
        createdAt?: string;
    };
};

export default function ProfileEditPage() {
    const user = useStoredUser();
    const token = useStoredToken();
    const [apiProfile, setApiProfile] = useState<ApiUserProfile | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [bio, setBio] = useState<string>("");

    const [linkedIn, setLinkedIn] = useState<string>("");
    const [github, setGithub] = useState<string>("");
    const [sectorHealthcare, setSectorHealthcare] = useState(false);
    const [sectorAgriculture, setSectorAgriculture] = useState(false);
    const [sectorUrban, setSectorUrban] = useState(false);

    // Add missing state for interestsText
    const [interestsText, setInterestsText] = useState("");
    // Add missing state for portfolio
    const [portfolio, setPortfolio] = useState<string>("");

    // Fetch profile helper
    const fetchProfile = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch profile");
            const data = await res.json();
            setApiProfile(data.profile);
            setName(data.profile?.name || "");
            setPhone(data.profile?.profile?.phone || "");
            setLocation(data.profile?.profile?.location || "");
            setBio(data.profile?.profile?.bio || "");
            setLinkedIn(data.profile?.profile?.linkedIn || "");
            setGithub(data.profile?.profile?.github || "");
            setPortfolio(data.profile?.profile?.portfolio || "");
        } catch {
            // ignore for now
        }
    };

    // effectiveAvatar helper
    const effectiveAvatar = useMemo(() => {
        return previewUrl || apiProfile?.avatar || user?.avatar || null;
    }, [previewUrl, apiProfile, user]);

    const handleUpload = async () => {
        setError(null);
        if (!token) {
            return;
        }

        if (!selectedFile) {
            setError("Please choose an image first.");
            return;
        }

        setIsSaving(true);
        try {
            const form = new FormData();
            form.append("avatar", selectedFile);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/avatar`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: form,
                }
            );

            const data: unknown = await response.json();
            if (!response.ok) {
                const message = (data as { message?: string })?.message || "Failed to update avatar";
                throw new Error(message);
            }
            const apiUser = (data as PatchAvatarResponse)?.user;
            if (!apiUser) throw new Error("Invalid server response");
            const nextUser: StoredUser = {
                ...(user ?? { name: apiUser.name }),
                id: apiUser.id,
                name: apiUser.name,
                email: apiUser.email,
                role: apiUser.role ?? user?.role,
                avatar: apiUser.avatar ?? undefined,
            };

            setAuthUser(nextUser);
            setSelectedFile(null);
            setSuccess("Avatar updated successfully.");

            // Keep page state in sync
            setApiProfile((prev) => (prev ? { ...prev, avatar: apiUser.avatar ?? null } : prev));
        } catch {
            setError("Failed to update avatar");
        } finally {
            setIsSaving(false);
        }
    };


    const toggleSector = (sector: "HEALTHCARE" | "AGRICULTURE" | "URBAN") => {
        if (sector === "HEALTHCARE") setSectorHealthcare((v) => !v);
        if (sector === "AGRICULTURE") setSectorAgriculture((v) => !v);
        if (sector === "URBAN") setSectorUrban((v) => !v);
    };

    const saveProfile = async () => {
        setError(null);
        setSuccess(null);

        if (!token) {
            setError("You must be logged in to update your profile.");
            return;
        }

        const interests = interestsText
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        const targetSectors: string[] = [];
        if (sectorHealthcare) targetSectors.push("HEALTHCARE");
        if (sectorAgriculture) targetSectors.push("AGRICULTURE");
        if (sectorUrban) targetSectors.push("URBAN");

        setIsSaving(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/profile`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        phone: phone || undefined,
                        bio: bio || undefined,
                        location: location || undefined,
                        linkedIn: linkedIn || undefined,
                        github: github || undefined,
                        portfolio: portfolio || undefined,
                        interests,
                        targetSectors,
                    }),
                }
            );

            const data: unknown = await response.json();
            if (!response.ok) {
                const message = (data as { message?: string })?.message || "Failed to update profile";
                throw new Error(message);
            }

            setSuccess("Profile updated.");
            await fetchProfile();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto px-2 md:px-0">
            {/* Header */}
            <div className="relative overflow-hidden rounded-xl border border-blue-200/70 bg-white/90 shadow-lg backdrop-blur-xl">
                {/* Lively background overlays */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden>
                    <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.12), transparent 38%), radial-gradient(circle at 80% 0%, rgba(168,85,247,0.12), transparent 36%), radial-gradient(circle at 45% 110%, rgba(16,185,129,0.14), transparent 40%)" }}></div>
                    <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(180deg, rgba(15,23,42,0.05) 1px, transparent 1px)", backgroundSize: "22px 22px" }}></div>
                </div>
                <div className="relative px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h1 className="text-3xl font-black text-slate-900">Edit Profile</h1>
                    <Link href="/dashboard/profile" className="flex items-center space-x-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-colors"><span>Back</span></Link>
                </div>
            </div>

            {/* Avatar Card */}
            <div className="relative rounded-xl border border-blue-200/70 bg-white/90 shadow-lg backdrop-blur-xl px-6 py-5 space-y-3 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden>
                    <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 80% 0%, rgba(59,130,246,0.10), transparent 45%)" }}></div>
                </div>
                <div className="relative">
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">Avatar</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                        {effectiveAvatar ? (
                            <Image src={effectiveAvatar} alt="Avatar preview" width={80} height={80} unoptimized className="h-20 w-20 rounded-full object-cover border border-slate-200 shadow" />
                        ) : (
                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">{user?.name?.charAt(0).toUpperCase()}</div>
                        )}
                        <div className="flex flex-col gap-2 w-full max-w-xs">
                            <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-slate-700 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700" disabled={isSaving} />
                            <button type="button" onClick={handleUpload} disabled={isSaving || !selectedFile} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{isSaving ? "Uploading…" : "Upload avatar"}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Basic Info Card */}
            <div className="relative rounded-xl border border-blue-100 bg-white/90 backdrop-blur-xl shadow px-6 py-5 space-y-3 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden>
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, rgba(59,130,246,0.10), transparent 45%)" }}></div>
                </div>
                <div className="relative">
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">Basic Info</h2>
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm" disabled={isSaving} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Phone No.</label>
                            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm" placeholder="e.g., +91 98765 43210" disabled={isSaving} />
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input value={apiProfile?.email || user?.email || ""} readOnly className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-gray-700 shadow-sm" />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 mt-3">
                        <button type="button" onClick={saveProfile} disabled={isSaving} className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Save Basic Info</button>
                        <div className="text-xs text-gray-500 sm:ml-3 mt-1 sm:mt-0">Role: {(apiProfile?.role || user?.role || "").toLowerCase()}</div>
                    </div>
                </div>
            </div>

            {/* Profile Details Card */}
            <div className="relative rounded-xl border border-blue-100 bg-white/90 backdrop-blur-xl shadow px-6 py-5 space-y-3 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden>
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 80% 80%, rgba(168,85,247,0.10), transparent 45%)" }}></div>
                </div>
                <div className="relative">
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">Profile Details</h2>
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="flex flex-col gap-1 md:col-span-1">
                            <label className="text-sm font-medium text-gray-700">Bio</label>
                            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full min-h-20 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm" placeholder="Tell us about yourself" disabled={isSaving} />
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-1">
                            <label className="text-sm font-medium text-gray-700">Location</label>
                            <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm" placeholder="e.g., Bangalore, IN" disabled={isSaving} />
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Interests (comma separated)</label>
                            <input value={interestsText} onChange={(e) => setInterestsText(e.target.value)} className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm" placeholder="AI, Cloud, Data Science" disabled={isSaving} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-sm font-medium text-gray-700 mb-1">Target Sectors</div>
                        <div className="flex flex-wrap gap-2 mb-2">
                            <button type="button" onClick={() => toggleSector("HEALTHCARE")} className={`px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-200 transition-colors ${sectorHealthcare ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-blue-100'}`} disabled={isSaving}>Healthcare</button>
                            <button type="button" onClick={() => toggleSector("AGRICULTURE")} className={`px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-200 transition-colors ${sectorAgriculture ? 'bg-green-600 text-white border-green-600' : 'hover:bg-green-100'}`} disabled={isSaving}>Agriculture</button>
                            <button type="button" onClick={() => toggleSector("URBAN")} className={`px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold border border-purple-200 transition-colors ${sectorUrban ? 'bg-purple-600 text-white border-purple-600' : 'hover:bg-purple-100'}`} disabled={isSaving}>Urban</button>
                        </div>
                        <button type="button" onClick={saveProfile} disabled={isSaving} className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Save profile</button>
                    </div>
                </div>
            </div>

            {/* Social Links Card */}
            <div className="relative rounded-xl border border-blue-100 bg-white/90 backdrop-blur-xl shadow px-6 py-5 space-y-3 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden>
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.10), transparent 45%)" }}></div>
                </div>
                <div className="relative">
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">Social Links</h2>
                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">LinkedIn</label>
                            <input value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm" placeholder="https://linkedin.com/in/..." disabled={isSaving} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">GitHub</label>
                            <input value={github} onChange={(e) => setGithub(e.target.value)} className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm" placeholder="https://github.com/..." disabled={isSaving} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Portfolio</label>
                            <input value={portfolio} onChange={(e) => setPortfolio(e.target.value)} className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm" placeholder="https://..." disabled={isSaving} />
                        </div>
                    </div>
                    <button type="button" onClick={saveProfile} disabled={isSaving} className="w-full sm:w-auto mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Save social links</button>
                </div>
            </div>

            {/* Alerts */}
            {(error || success) && (
                <div className="space-y-2 mt-2">
                    {error && (<div className="text-sm text-red-700 bg-red-100 border border-red-200 rounded-md p-3 shadow animate-pulse">{error}</div>)}
                    {success && (<div className="text-sm text-green-700 bg-green-100 border border-green-200 rounded-md p-3 shadow animate-pulse">{success}</div>)}
                </div>
            )}
        </div>
    );
}
