"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Calendar, Edit, Phone, Linkedin, Github, Link2, User } from "lucide-react";
import { setAuthUser, useStoredToken, useStoredUser, type StoredUser } from "@/lib/auth";

type ApiProfileDetails = {
    bio?: string | null;
    location?: string | null;
    phone?: string | null;
    linkedIn?: string | null;
    github?: string | null;
    portfolio?: string | null;
    interests?: string[];
    targetSectors?: string[];
};

type ApiStats = {
    totalSkills?: number;
    totalProjects?: number;
    totalCertifications?: number;
};

type ApiUserProfile = {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
    createdAt?: string;
    profile?: ApiProfileDetails | null;
    stats?: ApiStats;
};

type GetProfileResponse = {
    profile: ApiUserProfile;
};

export default function ProfilePage() {
    const user = useStoredUser();
    const token = useStoredToken();
    const [profile, setProfile] = useState<ApiUserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        try {
            if (!token) return;
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data: unknown = await response.json();
                const payload = data as GetProfileResponse;
                setProfile(payload.profile);

                // Keep local stored user in sync (e.g., avatar/name changes)
                const nextUser: StoredUser = {
                    ...(user ?? { name: payload.profile.name }),
                    id: payload.profile.id,
                    name: payload.profile.name,
                    email: payload.profile.email,
                    role: payload.profile.role,
                    avatar: payload.profile.avatar ?? undefined,
                    createdAt: payload.profile.createdAt,
                };
                setAuthUser(nextUser);
            }
        } catch (error: unknown) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    }, [token, user]);

    useEffect(() => {
        // Fetch full profile from API
        fetchProfile();
    }, [fetchProfile]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Profile Header */}
            <div className="relative overflow-hidden rounded-2xl border border-blue-200/80 bg-white/80 shadow-2xl backdrop-blur-xl">
                {/* Lively background overlays */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden>
                    <div
                        className="absolute inset-0 opacity-70"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.12), transparent 38%), radial-gradient(circle at 80% 0%, rgba(168,85,247,0.12), transparent 36%), radial-gradient(circle at 45% 110%, rgba(16,185,129,0.14), transparent 40%)",
                        }}
                    ></div>
                    <div
                        className="absolute inset-0 opacity-35"
                        style={{
                            backgroundImage:
                                "linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(180deg, rgba(15,23,42,0.05) 1px, transparent 1px)",
                            backgroundSize: "22px 22px",
                        }}
                    ></div>
                </div>
                <div className="relative p-8">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Avatar */}
                            {(profile?.avatar || user?.avatar) ? (
                                <Image
                                    src={profile?.avatar || user?.avatar || ""}
                                    alt="User avatar"
                                    width={80}
                                    height={80}
                                    unoptimized
                                    className="h-20 w-20 rounded-full object-cover border border-slate-200 dark:border-gray-700"
                                />
                            ) : (
                                <div className="h-20 w-20 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                                    <User className="h-10 w-10" aria-hidden="true" />
                                </div>
                            )}

                            {/* User Info */}
                            <div>
                                <h1 className="text-3xl font-black text-slate-900">
                                    {profile?.name || user?.name}
                                </h1>
                                <p className="text-blue-700 capitalize font-semibold">
                                    {(profile?.role || user?.role)?.toLowerCase()}
                                </p>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <Link
                            href="/dashboard/profile/edit"
                            className="flex items-center space-x-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-colors"
                        >
                            <Edit className="h-4 w-4" />
                            <span>Edit Profile</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Profile Details */}
            <div className="relative rounded-2xl border border-blue-100 bg-white/80 backdrop-blur-xl shadow-xl overflow-hidden">
                {/* Lively background overlays */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden>
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 80% 80%, rgba(168,85,247,0.10), transparent 45%)",
                        }}
                    ></div>
                </div>
                <div className="relative p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                        Profile Information
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-slate-700">
                            <Mail className="h-5 w-5" />
                            <span>{profile?.email || user?.email}</span>
                        </div>

                        {profile?.profile?.phone && (
                            <div className="flex items-center space-x-3 text-slate-700">
                                <Phone className="h-5 w-5" />
                                <span>{profile.profile.phone}</span>
                            </div>
                        )}

                        {profile?.profile?.location && (
                            <div className="flex items-center space-x-3 text-slate-700">
                                <MapPin className="h-5 w-5" />
                                <span>{profile.profile.location}</span>
                            </div>
                        )}

                        {(profile?.createdAt || user?.createdAt) && (
                            <div className="flex items-center space-x-3 text-slate-700">
                                <Calendar className="h-5 w-5" />
                                <span>
                                    Joined {new Date((profile?.createdAt || user?.createdAt) as string).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>

                    {profile?.profile?.bio && (
                        <div className="mt-6">
                            <h3 className="text-sm font-bold text-blue-800 mb-2">
                                Bio
                            </h3>
                            <p className="text-slate-700">
                                {profile.profile.bio}
                            </p>
                        </div>
                    )}

                    {profile?.profile?.interests &&
                        profile.profile.interests.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-bold text-blue-800 mb-2">
                                    Interests
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.profile.interests.map((interest: string, index: number) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold"
                                        >
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                    {profile?.profile?.targetSectors &&
                        profile.profile.targetSectors.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-bold text-purple-800 mb-2">
                                    Target Sectors
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.profile.targetSectors.map(
                                        (sector: string, index: number) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold"
                                            >
                                                {sector}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                    {(profile?.profile?.linkedIn || profile?.profile?.github || profile?.profile?.portfolio) && (
                        <div className="mt-6">
                            <h3 className="text-sm font-bold text-blue-800 mb-2">
                                Social Links
                            </h3>
                            <div className="space-y-2">
                                {profile?.profile?.linkedIn && (
                                    <a
                                        href={profile.profile.linkedIn}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-blue-700 hover:underline font-semibold"
                                    >
                                        <Linkedin className="h-4 w-4" />
                                        <span>LinkedIn</span>
                                    </a>
                                )}
                                {profile?.profile?.github && (
                                    <a
                                        href={profile.profile.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-slate-900 hover:underline font-semibold"
                                    >
                                        <Github className="h-4 w-4" />
                                        <span>GitHub</span>
                                    </a>
                                )}
                                {profile?.profile?.portfolio && (
                                    <a
                                        href={profile.profile.portfolio}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-purple-700 hover:underline font-semibold"
                                    >
                                        <Link2 className="h-4 w-4" />
                                        <span>Portfolio</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats */}
            {profile?.stats && (
                <div className="grid grid-cols-3 gap-6">
                    <div className="relative rounded-2xl border border-blue-100 bg-white/80 backdrop-blur-lg shadow-lg p-8 text-center overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <div className="absolute inset-x-0 top-0 h-1" style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.65), rgba(139,92,246,0.65))" }}></div>
                        <div className="text-4xl font-black text-blue-600">
                            {profile.stats.totalSkills || 0}
                        </div>
                        <div className="text-base text-slate-700 mt-2 font-semibold">
                            Skills
                        </div>
                    </div>
                    <div className="relative rounded-2xl border border-emerald-100 bg-white/80 backdrop-blur-lg shadow-lg p-8 text-center overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <div className="absolute inset-x-0 top-0 h-1" style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.65), rgba(34,197,94,0.65))" }}></div>
                        <div className="text-4xl font-black text-emerald-600">
                            {profile.stats.totalProjects || 0}
                        </div>
                        <div className="text-base text-slate-700 mt-2 font-semibold">
                            Projects
                        </div>
                    </div>
                    <div className="relative rounded-2xl border border-purple-100 bg-white/80 backdrop-blur-lg shadow-lg p-8 text-center overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <div className="absolute inset-x-0 top-0 h-1" style={{ background: "linear-gradient(90deg, rgba(168,85,247,0.65), rgba(139,92,246,0.65))" }}></div>
                        <div className="text-4xl font-black text-purple-600">
                            {profile.stats.totalCertifications || 0}
                        </div>
                        <div className="text-base text-slate-700 mt-2 font-semibold">
                            Certifications
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
