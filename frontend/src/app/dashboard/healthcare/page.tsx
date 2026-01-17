"use client";

import { useEffect, useState } from "react";
import { Activity, Award, Briefcase, TrendingUp, Target } from "lucide-react";
import Link from "next/link";

interface HealthcareStats {
    totalSkills: number;
    verifiedSkills: number;
    activeCertifications: number;
    completedProjects: number;
    competencyScore: number;
    averageProficiency: string;
}

export default function HealthcareDashboard() {
    const [stats, setStats] = useState<HealthcareStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHealthcareStats();
    }, []);

    const fetchHealthcareStats = async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/healthcare/assessment');
            // const data = await response.json();

            // Mock data for now
            setStats({
                totalSkills: 0,
                verifiedSkills: 0,
                activeCertifications: 0,
                completedProjects: 0,
                competencyScore: 0,
                averageProficiency: "N/A",
            });
        } catch (error) {
            console.error("Error fetching healthcare stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Loading healthcare data...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-healthcare/10 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-healthcare" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Healthcare Informatics</h1>
                    <p className="text-muted-foreground">
                        Track your healthcare IT skills and career progress
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Total Skills</span>
                        <Target className="h-4 w-4 text-healthcare" />
                    </div>
                    <div className="text-3xl font-bold">{stats?.totalSkills || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {stats?.verifiedSkills || 0} verified
                    </p>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Certifications</span>
                        <Award className="h-4 w-4 text-healthcare" />
                    </div>
                    <div className="text-3xl font-bold">{stats?.activeCertifications || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Active credentials</p>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Projects</span>
                        <Briefcase className="h-4 w-4 text-healthcare" />
                    </div>
                    <div className="text-3xl font-bold">{stats?.completedProjects || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Completed</p>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Competency Score</span>
                        <TrendingUp className="h-4 w-4 text-healthcare" />
                    </div>
                    <div className="text-3xl font-bold">{stats?.competencyScore || 0}%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Avg proficiency: {stats?.averageProficiency || "0"}/5
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
                <Link
                    href="/dashboard/skills?sector=HEALTHCARE"
                    className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-healthcare/10 flex items-center justify-center">
                            <Target className="h-5 w-5 text-healthcare" />
                        </div>
                        <h3 className="font-semibold">Skills Tracker</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Manage your healthcare IT skills and proficiency levels
                    </p>
                </Link>

                <Link
                    href="/dashboard/certifications?sector=HEALTHCARE"
                    className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-healthcare/10 flex items-center justify-center">
                            <Award className="h-5 w-5 text-healthcare" />
                        </div>
                        <h3 className="font-semibold">Certifications</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Track CPHIMS, CAHIMS, and other healthcare certifications
                    </p>
                </Link>

                <Link
                    href="/dashboard/projects?sector=HEALTHCARE"
                    className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-healthcare/10 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-healthcare" />
                        </div>
                        <h3 className="font-semibold">Projects</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Showcase your healthcare informatics projects
                    </p>
                </Link>
            </div>

            {/* Career Pathways Section */}
            <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="text-xl font-semibold mb-4">Recommended Career Pathways</h2>
                <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">Clinical Informatics Specialist</h3>
                            <span className="text-sm font-medium text-healthcare">85% Match</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                            Bridge clinical practice and IT systems
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>💰 $70,000 - $110,000</span>
                            <span>•</span>
                            <span>📈 High Demand</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">Health Data Analyst</h3>
                            <span className="text-sm font-medium text-healthcare">78% Match</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                            Analyze healthcare data for insights and improvements
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>💰 $60,000 - $95,000</span>
                            <span>•</span>
                            <span>📈 Very High Demand</span>
                        </div>
                    </div>
                </div>
                <Link
                    href="/dashboard/healthcare/career-pathways"
                    className="mt-4 inline-block text-sm text-healthcare hover:underline"
                >
                    View all career pathways →
                </Link>
            </div>

            {/* Competency Assessment */}
            <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="text-xl font-semibold mb-4">Competency Assessment</h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Overall Competency</span>
                            <span className="text-sm font-medium">{stats?.competencyScore || 0}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-healthcare transition-all"
                                style={{ width: `${stats?.competencyScore || 0}%` }}
                            />
                        </div>
                    </div>
                    <Link
                        href="/dashboard/healthcare/assessment"
                        className="inline-block text-sm text-healthcare hover:underline"
                    >
                        View detailed assessment →
                    </Link>
                </div>
            </div>
        </div>
    );
}
