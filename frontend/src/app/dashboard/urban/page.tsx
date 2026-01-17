"use client";

import { useEffect, useState } from "react";
import { Building2, Award, Briefcase, Target, TrendingUp } from "lucide-react";
import Link from "next/link";

interface UrbanStats {
    totalSkills: number;
    certifications: number;
    completedProjects: number;
    readinessScore: number;
    averageProficiency: string;
}

export default function UrbanDashboard() {
    const [stats, setStats] = useState<UrbanStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUrbanStats();
    }, []);

    const fetchUrbanStats = async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/urban/assessment');
            // const data = await response.json();

            // Mock data
            setStats({
                totalSkills: 0,
                certifications: 0,
                completedProjects: 0,
                readinessScore: 0,
                averageProficiency: "N/A",
            });
        } catch (error) {
            console.error("Error fetching urban stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Loading urban development data...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-urban/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-urban" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Urban & Smart Cities</h1>
                    <p className="text-muted-foreground">
                        Track your smart city and urban planning expertise
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Total Skills</span>
                        <Target className="h-4 w-4 text-urban" />
                    </div>
                    <div className="text-3xl font-bold">{stats?.totalSkills || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Urban tech skills</p>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Certifications</span>
                        <Award className="h-4 w-4 text-urban" />
                    </div>
                    <div className="text-3xl font-bold">{stats?.certifications || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Active credentials</p>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Projects</span>
                        <Briefcase className="h-4 w-4 text-urban" />
                    </div>
                    <div className="text-3xl font-bold">{stats?.completedProjects || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Completed</p>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Readiness Score</span>
                        <TrendingUp className="h-4 w-4 text-urban" />
                    </div>
                    <div className="text-3xl font-bold">{stats?.readinessScore || 0}%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Avg proficiency: {stats?.averageProficiency || "0"}/5
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
                <Link
                    href="/dashboard/skills?sector=URBAN"
                    className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-urban/10 flex items-center justify-center">
                            <Target className="h-5 w-5 text-urban" />
                        </div>
                        <h3 className="font-semibold">Skills Tracker</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Manage your smart city and urban planning skills
                    </p>
                </Link>

                <Link
                    href="/dashboard/certifications?sector=URBAN"
                    className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-urban/10 flex items-center justify-center">
                            <Award className="h-5 w-5 text-urban" />
                        </div>
                        <h3 className="font-semibold">Certifications</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Track GIS and urban development certifications
                    </p>
                </Link>

                <Link
                    href="/dashboard/projects?sector=URBAN"
                    className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-urban/10 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-urban" />
                        </div>
                        <h3 className="font-semibold">Projects</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Showcase your urban planning and smart city projects
                    </p>
                </Link>
            </div>

            {/* Career Pathways */}
            <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="text-xl font-semibold mb-4">Recommended Career Pathways</h2>
                <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">Smart City Planner</h3>
                            <span className="text-sm font-medium text-urban">88% Match</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                            Design and implement smart city initiatives
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>💰 $65,000 - $100,000</span>
                            <span>•</span>
                            <span>📈 Very High Demand</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">GIS Specialist</h3>
                            <span className="text-sm font-medium text-urban">85% Match</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                            Analyze spatial data for urban development
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>💰 $55,000 - $85,000</span>
                            <span>•</span>
                            <span>📈 High Demand</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">Smart Transportation Engineer</h3>
                            <span className="text-sm font-medium text-urban">80% Match</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                            Develop intelligent transportation systems
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>💰 $70,000 - $105,000</span>
                            <span>•</span>
                            <span>📈 High Demand</span>
                        </div>
                    </div>
                </div>
                <Link
                    href="/dashboard/urban/career-pathways"
                    className="mt-4 inline-block text-sm text-urban hover:underline"
                >
                    View all career pathways →
                </Link>
            </div>

            {/* Transformation Readiness */}
            <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="text-xl font-semibold mb-4">Urban Transformation Readiness</h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Overall Readiness</span>
                            <span className="text-sm font-medium">{stats?.readinessScore || 0}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-urban transition-all"
                                style={{ width: `${stats?.readinessScore || 0}%` }}
                            />
                        </div>
                    </div>
                    <Link
                        href="/dashboard/urban/assessment"
                        className="inline-block text-sm text-urban hover:underline"
                    >
                        View detailed assessment →
                    </Link>
                </div>
            </div>
        </div>
    );
}
