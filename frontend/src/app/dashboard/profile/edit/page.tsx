"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStoredToken, useStoredUser, setAuthUser, type StoredUser } from "@/lib/auth";

type ApiProfileDetails = {
    bio?: string | null;
    location?: string | null;
    interests?: string[];
    targetSectors?: string[];
};

type ApiUserProfile = {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
    createdAt?: string;
    profile?: ApiProfileDetails | null;
};

type GetProfileResponse = { profile: ApiUserProfile };

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
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [name, setName] = useState(user?.name || "");
    const [location, setLocation] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [interestsText, setInterestsText] = useState<string>("");
    const [sectorHealthcare, setSectorHealthcare] = useState(false);
    const [sectorAgriculture, setSectorAgriculture] = useState(false);
    const [sectorUrban, setSectorUrban] = useState(false);

    const currentAvatarUrl = apiProfile?.avatar ?? user?.avatar ?? null;

    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [selectedFile]);

    const effectiveAvatar = useMemo(() => previewUrl || currentAvatarUrl, [previewUrl, currentAvatarUrl]);

    const fetchProfile = useCallback(async () => {
        if (!token) return;
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/profile`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) return;

        const data: unknown = await response.json();
        const payload = data as GetProfileResponse;
        setApiProfile(payload.profile);

        setName(payload.profile.name || "");
        setLocation(payload.profile.profile?.location || "");
        setBio(payload.profile.profile?.bio || "");

        const interests = payload.profile.profile?.interests || [];
        setInterestsText(interests.join(", "));

        const sectors = payload.profile.profile?.targetSectors || [];
        setSectorHealthcare(sectors.includes("HEALTHCARE"));
        setSectorAgriculture(sectors.includes("AGRICULTURE"));
        setSectorUrban(sectors.includes("URBAN"));
    }, [token]);

    useEffect(() => {
        fetchProfile().catch(() => {
            // ignore
        });
    }, [fetchProfile]);

    const handleUpload = async () => {
        setError(null);
        setSuccess(null);

        if (!token) {
            setError("You must be logged in to update your avatar.");
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
                createdAt: apiUser.createdAt ?? user?.createdAt,
                avatar: apiUser.avatar ?? undefined,
            };

            setAuthUser(nextUser);
            setSelectedFile(null);
            setSuccess("Avatar updated successfully.");

            // Keep page state in sync
            setApiProfile((prev) => (prev ? { ...prev, avatar: apiUser.avatar ?? null } : prev));
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to update avatar");
        } finally {
            setIsSaving(false);
        }
    };

    const saveName = async () => {
        setError(null);
        setSuccess(null);

        if (!token) {
            setError("You must be logged in to update your profile.");
            return;
        }

        const trimmed = name.trim();
        if (!trimmed) {
            setError("Name cannot be empty.");
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/basic-info`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name: trimmed }),
                }
            );

            const data: unknown = await response.json();
            if (!response.ok) {
                const message = (data as { message?: string })?.message || "Failed to update name";
                throw new Error(message);
            }

            const apiUser = (data as { user?: { id: string; name: string; email: string; avatar?: string | null; role?: string; createdAt?: string } })?.user;
            if (apiUser) {
                const nextUser: StoredUser = {
                    ...(user ?? { name: apiUser.name }),
                    id: apiUser.id,
                    name: apiUser.name,
                    email: apiUser.email,
                    role: apiUser.role ?? user?.role,
                    createdAt: apiUser.createdAt ?? user?.createdAt,
                    avatar: apiUser.avatar ?? user?.avatar,
                };
                setAuthUser(nextUser);
                setApiProfile((prev) => (prev ? { ...prev, name: apiUser.name } : prev));
            }

            setSuccess("Name updated.");
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to update name");
        } finally {
            setIsSaving(false);
        }
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
                        bio: bio || undefined,
                        location: location || undefined,
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
                <Link
                    href="/dashboard/profile"
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
                >
                    Back
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Avatar</h2>

                <div className="flex items-center gap-5">
                    {effectiveAvatar ? (
                        <Image
                            src={effectiveAvatar}
                            alt="Avatar preview"
                            width={80}
                            height={80}
                            unoptimized
                            className="h-20 w-20 rounded-full object-cover border border-slate-200 dark:border-gray-700"
                        />
                    ) : (
                        <div className="h-20 w-20 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <div className="space-y-3">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                            className="block w-full text-sm text-slate-700 dark:text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            disabled={isSaving}
                        />

                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={isSaving || !selectedFile}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? "Uploading…" : "Upload avatar"}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                        {success}
                    </div>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Supported: images up to 5MB.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Info</h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                            disabled={isSaving}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            value={apiProfile?.email || user?.email || ""}
                            readOnly
                            className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={saveName}
                        disabled={isSaving}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        Save name
                    </button>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Role: {(apiProfile?.role || user?.role || "").toLowerCase()}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Details</h2>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                    <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                        placeholder="e.g., Bangalore, IN"
                        disabled={isSaving}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full min-h-24 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                        placeholder="Tell us about yourself"
                        disabled={isSaving}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Interests (comma separated)</label>
                    <input
                        value={interestsText}
                        onChange={(e) => setInterestsText(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                        placeholder="AI, Cloud, Data Science"
                        disabled={isSaving}
                    />
                </div>

                <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Sectors</div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-700 dark:text-gray-200">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={sectorHealthcare} onChange={(e) => setSectorHealthcare(e.target.checked)} />
                            Healthcare
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={sectorAgriculture} onChange={(e) => setSectorAgriculture(e.target.checked)} />
                            Agriculture
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={sectorUrban} onChange={(e) => setSectorUrban(e.target.checked)} />
                            Urban
                        </label>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={saveProfile}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    Save profile
                </button>
            </div>

            {(error || success) && (
                <div className="space-y-2">
                    {error && (
                        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                            {success}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
