"use client";

import { useState, useEffect } from "react";
import { Search, TrendingUp, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface AssessmentItem {
    type: "skill" | "project" | "certification";
    name: string;
    percentage: number;
    sector?: string;
    category?: string;
}

type SkillLike = {
    name: string;
    proficiencyLevel: number;
    verified?: boolean;
    category?: string;
};

type ProjectLike = {
    title: string;
    status?: string;
    isPublic?: boolean;
    category?: string;
};

type CertificationLike = {
    status?: string;
    expiryDate?: string;
    name?: string;
    title?: string;
    certificationName?: string;
    issuingOrganization?: string;
    organization?: string;
    issuer?: string;
};

export default function AgricultureAssessmentPage() {
    const router = useRouter();
    const [assessmentData, setAssessmentData] = useState<AssessmentItem[]>([]);
    const [filteredData, setFilteredData] = useState<AssessmentItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<"all" | "skill" | "project" | "certification">("all");

    const sector = "AGRICULTURE";

    useEffect(() => {
        fetchAssessmentData();
    }, []);

    useEffect(() => {
        let filtered = assessmentData;

        if (filter !== "all") {
            filtered = filtered.filter((item) => item.type === filter);
        }

        if (searchTerm) {
            filtered = filtered.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.sector?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        filtered.sort((a, b) => b.percentage - a.percentage);
        setFilteredData(filtered);
    }, [searchTerm, assessmentData, filter]);

    const fetchAssessmentData = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            };

            const allItems: AssessmentItem[] = [];

            const WEIGHTS = {
                skill: { base: 50, proficiencyMultiplier: 1.5, verifiedBonus: 20 },
                project: { base: 80, completedMultiplier: 1.5, inProgressMultiplier: 0.8, publicBonus: 15 },
                certification: { base: 100, activeMultiplier: 1.2 },
            };

            // Fetch skills
            try {
                const skillRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/skills?sector=${sector}`,
                    { method: "GET", headers }
                );

                if (skillRes.ok) {
                    const skillData: unknown = await skillRes.json();
                    const skillsArray = (
                        Array.isArray(skillData)
                            ? skillData
                            : typeof skillData === "object" && skillData !== null && Array.isArray((skillData as { data?: unknown }).data)
                                ? (skillData as { data: unknown[] }).data
                                : typeof skillData === "object" && skillData !== null && Array.isArray((skillData as { skills?: unknown }).skills)
                                    ? (skillData as { skills: unknown[] }).skills
                                    : []
                    ) as SkillLike[];

                    skillsArray.forEach((skill) => {
                        const proficiencyScore = skill.proficiencyLevel * WEIGHTS.skill.proficiencyMultiplier;
                        const verifiedBonus = skill.verified ? WEIGHTS.skill.verifiedBonus : 0;
                        const rawScore = WEIGHTS.skill.base + proficiencyScore + verifiedBonus;

                        allItems.push({
                            type: "skill",
                            name: skill.name,
                            percentage: rawScore,
                            sector: sector,
                            category: skill.category,
                        });
                    });
                }
            } catch (error) {
                console.error("Error fetching skills:", error);
            }

            // Fetch projects
            try {
                const projectRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/${sector.toLowerCase()}/projects`,
                    { method: "GET", headers }
                );

                if (projectRes.ok) {
                    const projectData: unknown = await projectRes.json();
                    const projectsArray = (
                        Array.isArray(projectData)
                            ? projectData
                            : typeof projectData === "object" && projectData !== null && Array.isArray((projectData as { data?: unknown }).data)
                                ? (projectData as { data: unknown[] }).data
                                : typeof projectData === "object" && projectData !== null && Array.isArray((projectData as { projects?: unknown }).projects)
                                    ? (projectData as { projects: unknown[] }).projects
                                    : []
                    ) as ProjectLike[];

                    projectsArray.forEach((project) => {
                        let statusMultiplier = 0.5;
                        if (project.status === "COMPLETED") statusMultiplier = WEIGHTS.project.completedMultiplier;
                        else if (project.status === "IN_PROGRESS") statusMultiplier = WEIGHTS.project.inProgressMultiplier;

                        const publicBonus = project.isPublic ? WEIGHTS.project.publicBonus : 0;
                        const rawScore = (WEIGHTS.project.base * statusMultiplier) + publicBonus;

                        allItems.push({
                            type: "project",
                            name: project.title,
                            percentage: rawScore,
                            sector: sector,
                            category: project.category,
                        });
                    });
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }

            // Fetch certifications
            try {
                const certRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/agriculture/certifications`,
                    { method: "GET", headers }
                );

                console.log("Certification response status:", certRes.status);

                if (certRes.ok) {
                    const certData: unknown = await certRes.json();
                    console.log("Raw certification data:", certData);

                    const certificationsArray = (
                        Array.isArray(certData)
                            ? certData
                            : typeof certData === "object" && certData !== null && Array.isArray((certData as { certifications?: unknown }).certifications)
                                ? (certData as { certifications: unknown[] }).certifications
                                : typeof certData === "object" && certData !== null && Array.isArray((certData as { data?: unknown }).data)
                                    ? (certData as { data: unknown[] }).data
                                    : []
                    ) as CertificationLike[];

                    console.log("Parsed certifications array:", certificationsArray);

                    certificationsArray.forEach((cert) => {
                        const isActive = cert.status === "ACTIVE" || !cert.expiryDate || new Date(cert.expiryDate) > new Date();
                        const activeMultiplier = isActive ? WEIGHTS.certification.activeMultiplier : 0.7;
                        const rawScore = WEIGHTS.certification.base * activeMultiplier;

                        allItems.push({
                            type: "certification",
                            name: cert.name || cert.title || cert.certificationName || "Certification",
                            percentage: rawScore,
                            sector: sector,
                            category: cert.issuingOrganization || cert.organization || cert.issuer || "Certification",
                        });
                    });

                    console.log("Total certifications added:", certificationsArray.length);
                } else {
                    console.error("Certification fetch failed with status:", certRes.status);
                }
            } catch (error) {
                console.error("Error fetching certifications:", error);
            }

            const totalRawScore = allItems.reduce((sum, item) => sum + item.percentage, 0);
            if (totalRawScore > 0) {
                allItems.forEach((item) => {
                    item.percentage = Math.round((item.percentage / totalRawScore) * 100 * 10) / 10;
                });
            }

            setAssessmentData(allItems);
        } catch (error) {
            console.error("Error fetching assessment data:", error);
        } finally {
            setLoading(false);
        }
    };

    const skillsCount = filteredData.filter((item) => item.type === "skill").length;
    const projectsCount = filteredData.filter((item) => item.type === "project").length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Agriculture Assessment</h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Your comprehensive skill & project breakdown</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search skills, projects, or categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    {["all", "skill", "project", "certification"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type as typeof filter)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === type
                                    ? "bg-green-600 text-white shadow-lg"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Items</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{filteredData.length}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Skills</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{skillsCount}</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Projects</p>
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{projectsCount}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-slate-600 dark:text-slate-400">Loading assessment data...</p>
                        </div>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="text-center py-16">
                        <TrendingUp className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
                        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">No items found</p>
                        <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredData.map((item, index) => (
                            <div
                                key={`${item.type}-${item.name}-${index}`}
                                className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${item.type === "skill"
                                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                        : item.type === "project"
                                                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                                                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                                    }`}
                                            >
                                                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{item.name}</h3>
                                        {item.category && (
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                {item.category.replace(/_/g, " ")}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                            {item.percentage}%
                                        </p>
                                    </div>
                                </div>

                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className={`h-full transition-all ${item.type === "skill"
                                                ? "bg-gradient-to-r from-green-500 to-green-600"
                                                : item.type === "project"
                                                    ? "bg-gradient-to-r from-purple-500 to-purple-600"
                                                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                                            }`}
                                        style={{ width: `${Math.min(item.percentage, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
