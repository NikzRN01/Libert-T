"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Calendar, Edit, Phone, Linkedin, Github, Link2 } from "lucide-react";
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
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6">
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
                                <div className="h-20 w-20 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                    {(profile?.name || user?.name)?.charAt(0).toUpperCase()}
                                </div>
                            )}

                            {/* User Info */}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {profile?.name || user?.name}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 capitalize">
                                    {(profile?.role || user?.role)?.toLowerCase()}
                                </p>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <Link
                            href="/dashboard/profile/edit"
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            <Edit className="h-4 w-4" />
                            <span>Edit Profile</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Profile Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Profile Information
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                            <Mail className="h-5 w-5" />
                            <span>{profile?.email || user?.email}</span>
                        </div>

                        {profile?.profile?.phone && (
                            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                                <Phone className="h-5 w-5" />
                                <span>{profile.profile.phone}</span>
                            </div>
                        )}

                        {profile?.profile?.location && (
                            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                                <MapPin className="h-5 w-5" />
                                <span>{profile.profile.location}</span>
                            </div>
                        )}

                        {(profile?.createdAt || user?.createdAt) && (
                            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                                <Calendar className="h-5 w-5" />
                                <span>
                                    Joined {new Date((profile?.createdAt || user?.createdAt) as string).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>

                    {profile?.profile?.bio && (
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Bio
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {profile.profile.bio}
                            </p>
                        </div>
                    )}

                    {profile?.profile?.interests &&
                        profile.profile.interests.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Interests
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.profile.interests.map((interest: string, index: number) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
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
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Target Sectors
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.profile.targetSectors.map(
                                        (sector: string, index: number) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
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
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Social Links
                            </h3>
                            <div className="space-y-2">
                                {profile?.profile?.linkedIn && (
                                    <a
                                        href={profile.profile.linkedIn}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:underline"
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
                                        className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:underline"
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
                                        className="flex items-center gap-2 text-purple-700 dark:text-purple-300 hover:underline"
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
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {profile.stats.totalSkills || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Skills
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                            {profile.stats.totalProjects || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Projects
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                            {profile.stats.totalCertifications || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Certifications
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
