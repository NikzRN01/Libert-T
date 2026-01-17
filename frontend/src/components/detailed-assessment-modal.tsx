"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Search, TrendingUp } from "lucide-react";

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
    sector?: string;
    issuingOrganization?: string;
    organization?: string;
};

interface DetailedAssessmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    sector?: string; // Optional sector filter (HEALTHCARE, AGRICULTURE, URBAN)
}

export function DetailedAssessmentModal({ isOpen, onClose, sector }: DetailedAssessmentModalProps) {
    const [assessmentData, setAssessmentData] = useState<AssessmentItem[]>([]);
    const [filteredData, setFilteredData] = useState<AssessmentItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<"all" | "skill" | "project" | "certification">("all");

    const fetchAssessmentData = useCallback(async () => {
        try {
            setLoading(true);

            // Get authentication token
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            };

            // Fetch skills from specified sector or all sectors
            const sectors = sector ? [sector] : ["HEALTHCARE", "AGRICULTURE", "URBAN"];
            const allItems: AssessmentItem[] = [];

            // Define weights for contribution calculation
            const WEIGHTS = {
                skill: {
                    base: 50, // Base weight for a skill
                    proficiencyMultiplier: 1.5, // Multiplier based on proficiency (1-10)
                    verifiedBonus: 20, // Bonus for verified skills
                },
                project: {
                    base: 80, // Base weight for a project (higher impact)
                    completedMultiplier: 1.5, // Multiplier for completed projects
                    inProgressMultiplier: 0.8, // Multiplier for in-progress projects
                    publicBonus: 15, // Bonus for public projects
                },
                certification: {
                    base: 100, // Base weight for certification (highest impact)
                    activeMultiplier: 1.2, // Multiplier for active certifications
                },
            };

            // Fetch skills from each sector
            for (const currentSector of sectors) {
                try {
                    const skillRes = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/skills?sector=${currentSector}`,
                        {
                            method: "GET",
                            headers,
                        }
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
                            // Calculate skill contribution: base + (proficiency * multiplier) + verified bonus
                            const proficiencyScore = skill.proficiencyLevel * WEIGHTS.skill.proficiencyMultiplier;
                            const verifiedBonus = skill.verified ? WEIGHTS.skill.verifiedBonus : 0;
                            const rawScore = WEIGHTS.skill.base + proficiencyScore + verifiedBonus;

                            allItems.push({
                                type: "skill",
                                name: skill.name,
                                percentage: rawScore,
                                sector: currentSector,
                                category: skill.category,
                            });
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching skills for ${currentSector}:`, error);
                }
            }

            // Fetch projects from all sectors
            for (const currentSector of sectors) {
                try {
                    const projectRes = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/projects?sector=${currentSector}`,
                        {
                            method: "GET",
                            headers,
                        }
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
                            // Calculate project contribution based on status
                            let statusMultiplier = 0.5; // Default for PLANNED
                            if (project.status === "COMPLETED") {
                                statusMultiplier = WEIGHTS.project.completedMultiplier;
                            } else if (project.status === "IN_PROGRESS") {
                                statusMultiplier = WEIGHTS.project.inProgressMultiplier;
                            }

                            const publicBonus = project.isPublic ? WEIGHTS.project.publicBonus : 0;
                            const rawScore = (WEIGHTS.project.base * statusMultiplier) + publicBonus;

                            allItems.push({
                                type: "project",
                                name: project.title,
                                percentage: rawScore,
                                sector: currentSector,
                                category: project.category,
                            });
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching projects for ${currentSector}:`, error);
                }
            }

            // Fetch certifications (from sector-specific or general endpoint)
            try {
                const certEndpoint = sector
                    ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/certifications?sector=${sector}`
                    : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/certifications`;

                const certRes = await fetch(certEndpoint, {
                    method: "GET",
                    headers,
                });

                if (certRes.ok) {
                    const certData: unknown = await certRes.json();

                    const certificationsArray = (
                        Array.isArray(certData)
                            ? certData
                            : typeof certData === "object" && certData !== null && (certData as { success?: unknown }).success && (certData as { data?: unknown }).data
                                ? Array.isArray((certData as { data?: unknown }).data)
                                    ? (certData as { data: unknown[] }).data
                                    : [(certData as { data: unknown }).data]
                                : typeof certData === "object" && certData !== null && Array.isArray((certData as { data?: unknown }).data)
                                    ? (certData as { data: unknown[] }).data
                                    : typeof certData === "object" && certData !== null && Array.isArray((certData as { certifications?: unknown }).certifications)
                                        ? (certData as { certifications: unknown[] }).certifications
                                        : []
                    ) as CertificationLike[];

                    certificationsArray.forEach((cert) => {
                        // Calculate certification contribution
                        const isActive =
                            cert.status === "ACTIVE" ||
                            !cert.expiryDate ||
                            new Date(cert.expiryDate) > new Date();
                        const activeMultiplier = isActive ? WEIGHTS.certification.activeMultiplier : 0.7;
                        const rawScore = WEIGHTS.certification.base * activeMultiplier;

                        allItems.push({
                            type: "certification",
                            name: cert.name || cert.title || "Certification",
                            percentage: rawScore,
                            sector: cert.sector || sector || "GENERAL",
                            category: cert.issuingOrganization || cert.organization || "Certification",
                        });
                    });
                }
            } catch (error) {
                console.error("Error fetching certifications:", error);
            }

            // Calculate total raw score and normalize to percentages
            const totalRawScore = allItems.reduce((sum, item) => sum + item.percentage, 0);
            if (totalRawScore > 0) {
                allItems.forEach((item) => {
                    // Convert raw score to percentage contribution
                    item.percentage = Math.round((item.percentage / totalRawScore) * 100 * 10) / 10;
                });
            }

            setAssessmentData(allItems);
        } catch (error) {
            console.error("Error fetching assessment data:", error);
        } finally {
            setLoading(false);
        }
    }, [sector]);

    // Fetch assessment data from all sectors
    useEffect(() => {
        if (isOpen) {
            fetchAssessmentData();
        }
    }, [isOpen, fetchAssessmentData]);

    // Filter data based on search and type
    useEffect(() => {
        let filtered = assessmentData;

        // Apply type filter
        if (filter !== "all") {
            filtered = filtered.filter((item) => item.type === filter);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.sector?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort by percentage descending
        filtered.sort((a, b) => b.percentage - a.percentage);

        setFilteredData(filtered);
    }, [searchTerm, assessmentData, filter]);

    if (!isOpen) return null;

    const skillsCount = filteredData.filter((item) => item.type === "skill").length;
    const projectsCount = filteredData.filter((item) => item.type === "project").length;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Detailed Assessment</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Your comprehensive skill & project breakdown</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                {/* Filters */}
                <div className="border-b border-slate-200 dark:border-slate-700 p-6 space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search skills, projects, or categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        />
                    </div>

                    {/* Filter buttons */}
                    <div className="flex gap-2 flex-wrap">
                        {["all", "skill", "project", "certification"].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type as typeof filter)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    filter === type
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400">Total Items</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{filteredData.length}</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400">Skills</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{skillsCount}</p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400">Projects</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{projectsCount}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                <p className="text-slate-600 dark:text-slate-400">Loading assessment data...</p>
                            </div>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="text-center py-12">
                            <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4 opacity-50" />
                            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">No items found</p>
                            <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">Try adjusting your search or filter criteria</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredData.map((item, index) => (
                                <div
                                    key={`${item.type}-${item.name}-${index}`}
                                    className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span
                                                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        item.type === "skill"
                                                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                            : item.type === "project"
                                                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                                                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                                    }`}
                                                >
                                                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                                </span>
                                                {item.sector && (
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        • {item.sector}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">{item.name}</h3>
                                            {item.category && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                    Category: {item.category.replace(/_/g, " ")}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {item.percentage}%
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${
                                                item.type === "skill"
                                                    ? "bg-green-500"
                                                    : item.type === "project"
                                                    ? "bg-purple-500"
                                                    : "bg-blue-500"
                                            }`}
                                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Showing {filteredData.length} out of {assessmentData.length} items
                    </p>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
