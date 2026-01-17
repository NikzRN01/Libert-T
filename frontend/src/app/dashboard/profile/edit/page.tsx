"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Calendar, Edit } from "lucide-react";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }

        // Fetch full profile from API
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/users/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProfile(data.profile);
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    };

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
                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>

                            {/* User Info */}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {user?.name}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 capitalize">
                                    {user?.role?.toLowerCase()}
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
                            <span>{user?.email}</span>
                        </div>

                        {profile?.profile?.location && (
                            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                                <MapPin className="h-5 w-5" />
                                <span>{profile.profile.location}</span>
                            </div>
                        )}

                        {user?.createdAt && (
                            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                                <Calendar className="h-5 w-5" />
                                <span>
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
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
