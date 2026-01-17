"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Award, Briefcase, Target, Sprout } from "lucide-react";
import Link from "next/link";

interface AgricultureStats {
    totalSkills: number;
    certifications: number;
    completedProjects: number;
    innovationScore: number;
    averageProficiency: string;
}

export default function AgricultureDashboard() {
    const [stats, setStats] = useState<AgricultureStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAgricultureStats();
    }, []);

    const fetchAgricultureStats = async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/agriculture/assessment');
            // const data = await response.json();

            // Mock data
            setStats({
                totalSkills: 0,
                certifications: 0,
                completedProjects: 0,
                innovationScore: 0,
                averageProficiency: "N/A",
            });
        } catch (error) {
            console.error("Error fetching agriculture stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Loading agriculture data...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-agriculture/10 flex items-center justify-center">
                    <Sprout className="h-6 w-6 text-agriculture" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Agricultural Technology</h1>
                    <p className="text-muted-foreground">
                        Track your agritech skills and innovation readiness
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Total Skills</span>
                        <Target className="h-4 w-4 text-agriculture" />
                    </div>
                    <div className="text-3xl font-bold">{stats?.totalSkills || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">AgriTech competencies</p>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Certifications</span>
                        <Award className="h-4 w-4 text-agriculture" />
                    </div>
                    <div className="text-3xl font-bold">{stats?.certifications || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Active credentials</p>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Projects</span>
                        <Briefcase className="h-4 w-4 text-agriculture" />
                    </div>
                    <div className="text-3xl font-bold">{stats?.completedProjects || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Completed</p>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Innovation Score</span>
                        <TrendingUp className="h-4 w-4 text-agriculture" />
                    </div>
                    <div className="text-3xl font-bold">{stats?.innovationScore || 0}%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Avg proficiency: {stats?.averageProficiency || "0"}/5
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
                <Link
                    href="/dashboard/skills?sector=AGRICULTURE"
                    className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-agriculture/10 flex items-center justify-center">
                            <Target className="h-5 w-5 text-agriculture" />
                        </div>
                        <h3 className="font-semibold">Skills Tracker</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Manage your agritech skills and proficiency levels
                    </p>
                </Link>

                <Link
                    href="/dashboard/certifications?sector=AGRICULTURE"
                    className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-agriculture/10 flex items-center justify-center">
                            <Award className="h-5 w-5 text-agriculture" />
                        </div>
                        <h3 className="font-semibold">Certifications</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Track precision farming and sustainability certs
                    </p>
                </Link>

                <Link
                    href="/dashboard/projects?sector=AGRICULTURE"
                    className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-agriculture/10 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-agriculture" />
                        </div>
                        <h3 className="font-semibold">Projects</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Showcase your agricultural technology projects
                    </p>
                </Link>
            </div>

            {/* Career Pathways */}
            <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="text-xl font-semibold mb-4">Recommended Career Pathways</h2>
                <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">Precision Agriculture Specialist</h3>
                            <span className="text-sm font-medium text-agriculture">82% Match</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                            Implement technology-driven farming solutions
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>💰 $55,000 - $85,000</span>
                            <span>•</span>
                            <span>📈 High Demand</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">Sustainable Farming Consultant</h3>
                            <span className="text-sm font-medium text-agriculture">75% Match</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                            Advise on sustainable agricultural practices
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>💰 $60,000 - $90,000</span>
                            <span>•</span>
                            <span>📈 Very High Demand</span>
                        </div>
                    </div>
                </div>
                <Link
                    href="/dashboard/agriculture/career-pathways"
                    className="mt-4 inline-block text-sm text-agriculture hover:underline"
                >
                    View all career pathways →
                </Link>
            </div>

            {/* Innovation Readiness */}
            <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="text-xl font-semibold mb-4">Innovation Readiness Assessment</h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Overall Innovation Readiness</span>
                            <span className="text-sm font-medium">{stats?.innovationScore || 0}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-agriculture transition-all"
                                style={{ width: `${stats?.innovationScore || 0}%` }}
                            />
                        </div>
                    </div>
                    <Link
                        href="/dashboard/agriculture/assessment"
                        className="inline-block text-sm text-agriculture hover:underline"
                    >
                        View detailed assessment →
                    </Link>
                </div>
            </div>
        </div>
    );
}
