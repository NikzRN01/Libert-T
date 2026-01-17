"use client";

import { useCallback, useEffect, useState } from "react";
import { TrendingUp, Award, Briefcase, Target, Sprout } from "lucide-react";
import Link from "next/link";

interface AgricultureStats {
    totalSkills: number;
    certifications: number;
    completedProjects: number;
    innovationScore: number;
    averageProficiency: string;
}

interface CareerPathway {
    role: string;
    description: string;
    matchScore: number;
    salaryRange: string;
    demand: string;
}

export default function AgricultureDashboard() {
    const [stats, setStats] = useState<AgricultureStats | null>(null);
    const [pathways, setPathways] = useState<CareerPathway[]>([]);
    const [loading, setLoading] = useState(true);

<<<<<<< HEAD
    useEffect(() => {
        fetchAgricultureData();
    }, []);

    const fetchAgricultureData = async () => {
=======
    const fetchAgricultureStats = useCallback(async () => {
>>>>>>> fc34d720d476cf4400b3b08e82807125f23a1b1d
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            // Fetch assessment data
            const assessmentRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/agriculture/assessment`,
                { headers }
            );

            if (assessmentRes.ok) {
                const assessmentData = await assessmentRes.json();
                if (assessmentData.success) {
                    setStats({
                        totalSkills: assessmentData.data.totalSkills || 0,
                        certifications: assessmentData.data.certifications || 0,
                        completedProjects: assessmentData.data.completedProjects || 0,
                        innovationScore: assessmentData.data.innovationScore || 0,
                        averageProficiency: assessmentData.data.averageProficiency || "0",
                    });
                }
            }

            // Fetch career pathways
            const pathwaysRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/agriculture/career-pathways`,
                { headers }
            );

            if (pathwaysRes.ok) {
                const pathwaysData = await pathwaysRes.json();
                if (pathwaysData.success && pathwaysData.data.pathways) {
                    setPathways(pathwaysData.data.pathways.slice(0, 2));
                }
            }
        } catch (error) {
            console.error("Error fetching agriculture data:", error);
            // Set default values on error
            setStats({
                totalSkills: 0,
                certifications: 0,
                completedProjects: 0,
                innovationScore: 0,
                averageProficiency: "0",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAgricultureStats();
    }, [fetchAgricultureStats]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="text-muted-foreground">Loading agriculture data...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 bg-linear-to-r from-secondary/10 to-secondary/5 p-6 rounded-2xl border-2 border-border shadow-lg">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg">
                    <Sprout className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Agricultural Technology</h1>
                    <p className="text-muted-foreground font-medium">
                        Track your agritech skills and innovation readiness
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl border-2 border-border bg-card hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground font-semibold">Total Skills</span>
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                            <Target className="h-5 w-5 text-secondary" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-foreground">{stats?.totalSkills || 0}</div>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">AgriTech competencies</p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-border bg-card hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground font-semibold">Certifications</span>
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Award className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-foreground">{stats?.certifications || 0}</div>
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
                        <span className="text-sm text-muted-foreground font-semibold">Innovation Score</span>
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-secondary" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-foreground">{stats?.innovationScore || 0}%</div>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">
                        Avg proficiency: {stats?.averageProficiency || "0"}/5
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
                <Link
                    href="/dashboard/skills?sector=AGRICULTURE"
                    className="p-8 rounded-2xl border-2 border-border bg-card hover:shadow-2xl hover:border-secondary/50 transition-all transform hover:-translate-y-1 group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Target className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">Skills Tracker</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Manage your agritech skills and proficiency levels
                    </p>
                </Link>

                <Link
                    href="/dashboard/certifications?sector=AGRICULTURE"
                    className="p-8 rounded-2xl border-2 border-border bg-card hover:shadow-2xl hover:border-primary/50 transition-all transform hover:-translate-y-1 group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Award className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">Certifications</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Track precision farming and sustainability certs
                    </p>
                </Link>

                <Link
                    href="/dashboard/projects?sector=AGRICULTURE"
                    className="p-8 rounded-2xl border-2 border-border bg-card hover:shadow-2xl hover:border-accent/50 transition-all transform hover:-translate-y-1 group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Briefcase className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">Projects</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Showcase your agricultural technology projects
                    </p>
                </Link>
            </div>

            {/* Career Pathways */}
            <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="text-xl font-semibold mb-4">Recommended Career Pathways</h2>
                <div className="space-y-3">
                    {pathways.length > 0 ? (
                        pathways.map((pathway, index) => (
                            <div key={index} className="p-4 rounded-lg bg-muted/50">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">{pathway.role}</h3>
                                    <span className="text-sm font-medium text-secondary">{pathway.matchScore}% Match</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    {pathway.description}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>💰 {pathway.salaryRange}</span>
                                    <span>•</span>
                                    <span>📈 {pathway.demand}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <>
                            <div className="p-4 rounded-lg bg-muted/50">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">Precision Agriculture Specialist</h3>
                                    <span className="text-sm font-medium text-secondary">-- Match</span>
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
                                    <span className="text-sm font-medium text-secondary">-- Match</span>
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
                        </>
                    )}
                </div>
                <Link
                    href="/dashboard/agriculture/career-pathways"
                    className="mt-4 inline-block text-sm text-secondary hover:underline"
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
