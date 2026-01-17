"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { clearAuthStorage, useStoredToken, useStoredUser } from "@/lib/auth";

export default function DashboardPage() {
    const router = useRouter();
    const user = useStoredUser();
    const token = useStoredToken();

    useEffect(() => {
        if (!token || !user) {
            router.replace("/login");
        }
    }, [router, token, user]);

    const handleLogout = () => {
        clearAuthStorage();
        router.replace("/login");
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-300 via-blue-100 to-slate-200">
           
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-slate-300">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        Welcome, {user.name}!!!
                    </h2>
                    <div className="flex gap-4">

                        <span className="px-4 py-2 bg-green-100 text-green-900 rounded-xl text-sm font-bold shadow-md border-2 border-green-300">
                            Status: <span className="font-bold">Active</span>
                        </span>
                    </div>
                </div>

                {/* Dashboard Navigation Grid */}
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Your Dashboards</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Healthcare */}
                    <div
                        onClick={() => router.push('/dashboard/healthcare')}
                        className="bg-white p-8 rounded-2xl shadow-lg border-2 border-slate-200 hover:border-slate-400 hover:shadow-2xl transition-all cursor-pointer group transform hover:-translate-y-1"
                    >
                        <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">Healthcare</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Manage medical coding, EHR skills, and clinical informatics certifications.
                        </p>
                    </div>

                    {/* Agriculture */}
                    <div
                        onClick={() => router.push('/dashboard/agriculture')}
                        className="bg-white p-8 rounded-2xl shadow-lg border-2 border-slate-200 hover:border-slate-400 hover:shadow-2xl transition-all cursor-pointer group transform hover:-translate-y-1"
                    >
                        <div className="w-16 h-16 bg-slate-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">Agriculture</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Track precision farming, IoT sensor knowledge, and agritech projects.
                        </p>
                    </div>

                    {/* Urban */}
                    <div
                        onClick={() => router.push('/dashboard/urban')}
                        className="bg-white p-8 rounded-2xl shadow-lg border-2 border-slate-200 hover:border-slate-400 hover:shadow-2xl transition-all cursor-pointer group transform hover:-translate-y-1"
                    >
                        <div className="w-16 h-16 bg-slate-500 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">Urban</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Monitor GIS, smart city infrastructure, and urban planning competencies.
                        </p>
                    </div>

                    {/* Analytics */}
                    <div
                        onClick={() => router.push('/dashboard/analytics')}
                        className="bg-white p-8 rounded-2xl shadow-lg border-2 border-slate-200 hover:border-slate-400 hover:shadow-2xl transition-all cursor-pointer group transform hover:-translate-y-1"
                    >
                        <div className="w-16 h-16 bg-slate-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">Analytics</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            View skill gap analysis, career readiness scores, and AI recommendations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
