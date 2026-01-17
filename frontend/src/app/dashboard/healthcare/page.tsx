"use client";

import { useCallback, useEffect, useState } from "react";
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

interface CareerPathway {
    role: string;
    description: string;
    matchScore: number;
    salaryRange: string;
    demand: string;
}

export default function HealthcareDashboard() {
    const [stats, setStats] = useState<HealthcareStats | null>(null);
    const [pathways, setPathways] = useState<CareerPathway[]>([]);
    const [loading, setLoading] = useState(true);

<<<<<<< HEAD
    useEffect(() => {
        fetchHealthcareData();
    }, []);

    const fetchHealthcareData = async () => {
=======
    const fetchHealthcareStats = useCallback(async () => {
>>>>>>> fc34d720d476cf4400b3b08e82807125f23a1b1d
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            // Fetch assessment data
            const assessmentRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/healthcare/assessment`,
                { headers }
            );

            if (assessmentRes.ok) {
                const assessmentData = await assessmentRes.json();
                if (assessmentData.success) {
                    setStats({
                        totalSkills: assessmentData.data.totalSkills || 0,
                        verifiedSkills: assessmentData.data.verifiedSkills || 0,
                        activeCertifications: assessmentData.data.activeCertifications || 0,
                        completedProjects: assessmentData.data.completedProjects || 0,
                        competencyScore: assessmentData.data.competencyScore || 0,
                        averageProficiency: assessmentData.data.averageProficiency || "0",
                    });
                }
            }

            // Fetch career pathways
            const pathwaysRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/healthcare/career-pathways`,
                { headers }
            );

            if (pathwaysRes.ok) {
                const pathwaysData = await pathwaysRes.json();
                if (pathwaysData.success && pathwaysData.data.pathways) {
                    setPathways(pathwaysData.data.pathways.slice(0, 2));
                }
            }
        } catch (error) {
            console.error("Error fetching healthcare data:", error);
            // Set default values on error
            setStats({
                totalSkills: 0,
                verifiedSkills: 0,
                activeCertifications: 0,
                completedProjects: 0,
                competencyScore: 0,
                averageProficiency: "0",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHealthcareStats();
    }, [fetchHealthcareStats]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="text-muted-foreground">Loading healthcare data...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 bg-linear-to-r from-primary/10 to-primary/5 p-6 rounded-2xl border-2 border-border shadow-lg">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                    <Activity className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Healthcare Informatics</h1>
                    <p className="text-muted-foreground font-medium">
                        Track your healthcare IT skills and career progress
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl border-2 border-border bg-card hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground font-semibold">Total Skills</span>
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Target className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-foreground">{stats?.totalSkills || 0}</div>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">
                        {stats?.verifiedSkills || 0} verified
                    </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-border bg-card hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground font-semibold">Certifications</span>
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                            <Award className="h-5 w-5 text-secondary" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-foreground">{stats?.activeCertifications || 0}</div>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">Active credentials</p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-border bg-card hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground font-semibold">Projects</span>
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-accent" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-foreground">{stats?.completedProjects || 0}</div>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">Completed</p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-border bg-card hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground font-semibold">Competency Score</span>
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-foreground">{stats?.competencyScore || 0}%</div>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">
                        Avg proficiency: {stats?.averageProficiency || "0"}/5
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
                <Link
                    href="/dashboard/skills?sector=HEALTHCARE"
                    className="p-8 rounded-2xl border-2 border-border bg-card hover:shadow-2xl hover:border-primary/50 transition-all transform hover:-translate-y-1 group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Target className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">Skills Tracker</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Manage your healthcare IT skills and proficiency levels
                    </p>
                </Link>

                <Link
                    href="/dashboard/certifications?sector=HEALTHCARE"
                    className="p-8 rounded-2xl border-2 border-border bg-card hover:shadow-2xl hover:border-secondary/50 transition-all transform hover:-translate-y-1 group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Award className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">Certifications</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Track CPHIMS, CAHIMS, and other healthcare certifications
                    </p>
                </Link>

                <Link
                    href="/dashboard/projects?sector=HEALTHCARE"
                    className="p-8 rounded-2xl border-2 border-border bg-card hover:shadow-2xl hover:border-accent/50 transition-all transform hover:-translate-y-1 group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Briefcase className="h-6 w-6 text-white" />
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
