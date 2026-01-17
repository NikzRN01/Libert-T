"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
            router.push("/login");
            return;
        }

        setUser(JSON.parse(userData));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 shadow">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        SkillXIntell Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Welcome, {user.name}!
                    </h2>
                    <div className="flex gap-4 text-gray-600 dark:text-gray-400">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            Role: {user.role}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            Status: Active
                        </span>
                    </div>
                </div>

                {/* Dashboard Navigation Grid */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Dashboards</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Healthcare */}
                    <div
                        onClick={() => router.push('/dashboard/healthcare')}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-transparent hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
                    >
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Healthcare</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Manage medical coding, EHR skills, and clinical informatics certifications.
                        </p>
                    </div>

                    {/* Agriculture */}
                    <div
                        onClick={() => router.push('/dashboard/agriculture')}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-transparent hover:border-green-500 hover:shadow-lg transition-all cursor-pointer group"
                    >
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors text-green-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Agriculture</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Track precision farming, IoT sensor knowledge, and agritech projects.
                        </p>
                    </div>

                    {/* Urban */}
                    <div
                        onClick={() => router.push('/dashboard/urban')}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-transparent hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer group"
                    >
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors text-purple-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Urban</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Monitor GIS, smart city infrastructure, and urban planning competencies.
                        </p>
                    </div>

                    {/* Analytics */}
                    <div
                        onClick={() => router.push('/dashboard/analytics')}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-transparent hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer group"
                    >
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors text-orange-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            View skill gap analysis, career readiness scores, and AI recommendations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
