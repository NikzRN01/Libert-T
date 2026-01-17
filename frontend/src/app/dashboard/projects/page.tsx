"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Briefcase, Plus, Calendar, ExternalLink, Trash2, Github, Globe, X, Users } from "lucide-react";

interface Project {
    id: string;
    title: string;
    description: string;
    sector: string;
    category: string;
    skillsUsed: string[];
    technologies: string[];
    outcomes: string;
    impact?: string;
    startDate: string;
    endDate?: string;
    status: string;
    teamSize?: number;
    role?: string;
    repositoryUrl?: string;
    liveUrl?: string;
    isPublic: boolean;
}

interface AddProjectForm {
    title: string;
    description: string;
    category: string;
    skillsUsed: string[];
    technologies: string[];
    outcomes: string;
    impact: string;
    startDate: string;
    endDate: string;
    status: string;
    teamSize: number;
    role: string;
    repositoryUrl: string;
    liveUrl: string;
    isPublic: boolean;
}

export default function ProjectsPage() {
    const searchParams = useSearchParams();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [sectorFilter, setSectorFilter] = useState(searchParams.get("sector") || "");
    const [showAddModal, setShowAddModal] = useState(false);
    const [formSector, setFormSector] = useState(searchParams.get("sector") || "HEALTHCARE");
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<AddProjectForm>({
        title: "",
        description: "",
        category: "",
        skillsUsed: [],
        technologies: [],
        outcomes: "",
        impact: "",
        startDate: "",
        endDate: "",
        status: "IN_PROGRESS",
        teamSize: 1,
        role: "",
        repositoryUrl: "",
        liveUrl: "",
        isPublic: true,
    });
    const [skillInput, setSkillInput] = useState("");
    const [techInput, setTechInput] = useState("");

    const categories = {
        HEALTHCARE: [
            "CLINICAL_INFORMATICS",
            "HEALTH_DATA_ANALYTICS",
            "EHR_SYSTEMS",
            "TELEMEDICINE",
            "MEDICAL_CODING",
        ],
        AGRICULTURE: [
            "PRECISION_AGRICULTURE",
            "FARM_MANAGEMENT_SOFTWARE",
            "AGRICULTURAL_IOT",
            "CROP_MONITORING",
            "SUSTAINABLE_FARMING",
        ],
        URBAN: [
            "URBAN_PLANNING",
            "GIS_MAPPING",
            "SMART_INFRASTRUCTURE",
            "IOT_SENSORS",
            "SUSTAINABLE_URBAN_DESIGN",
        ],
    };

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            // Fetch from all sectors or specific sector
            const sectors = sectorFilter ? [sectorFilter] : ["HEALTHCARE", "AGRICULTURE", "URBAN"];
            const allProjects: Project[] = [];

            for (const sector of sectors) {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/${sector.toLowerCase()}/projects`,
                    { headers }
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data) {
                        allProjects.push(...data.data.map((p: Project) => ({ ...p, sector })));
                    }
                }
            }

            setProjects(allProjects);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setLoading(false);
        }
    }, [sectorFilter]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/${formSector.toLowerCase()}/projects`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (response.ok) {
                setShowAddModal(false);
                setFormData({
                    title: "",
                    description: "",
                    category: "",
                    skillsUsed: [],
                    technologies: [],
                    outcomes: "",
                    impact: "",
                    startDate: "",
                    endDate: "",
                    status: "IN_PROGRESS",
                    teamSize: 1,
                    role: "",
                    repositoryUrl: "",
                    liveUrl: "",
                    isPublic: true,
                });
                fetchProjects();
            }
        } catch (error) {
            console.error("Failed to add project:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteProject = async (id: string, sector: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/${sector.toLowerCase()}/projects/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                fetchProjects();
            }
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    const addSkill = () => {
        if (skillInput.trim() && !formData.skillsUsed.includes(skillInput.trim())) {
            setFormData({
                ...formData,
                skillsUsed: [...formData.skillsUsed, skillInput.trim()],
            });
            setSkillInput("");
        }
    };

    const removeSkill = (skill: string) => {
        setFormData({
            ...formData,
            skillsUsed: formData.skillsUsed.filter((s) => s !== skill),
        });
    };

    const addTech = () => {
        if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
            setFormData({
                ...formData,
                technologies: [...formData.technologies, techInput.trim()],
            });
            setTechInput("");
        }
    };

    const removeTech = (tech: string) => {
        setFormData({
            ...formData,
            technologies: formData.technologies.filter((t) => t !== tech),
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-100 text-green-700 border-green-300";
            case "IN_PROGRESS":
                return "bg-blue-100 text-blue-700 border-blue-300";
            case "ON_HOLD":
                return "bg-yellow-100 text-yellow-700 border-yellow-300";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    const getSectorColor = (sector: string) => {
        switch (sector) {
            case "HEALTHCARE":
                return "bg-primary/20 text-primary border-primary/30";
            case "AGRICULTURE":
                return "bg-secondary/20 text-secondary border-secondary/30";
            case "URBAN":
                return "bg-accent/20 text-accent border-accent/30";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground font-medium">Loading projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Projects</h1>
                    <p className="text-muted-foreground font-medium">
                        {sectorFilter
                            ? `Viewing ${sectorFilter.toLowerCase()} projects`
                            : "All your professional projects"}
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-secondary to-secondary/80 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Project</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-card rounded-2xl shadow-lg p-6 border-2 border-border">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-48">
                        <select
                            value={sectorFilter}
                            onChange={(e) => setSectorFilter(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground font-medium"
                        >
                            <option value="">All Sectors</option>
                            <option value="HEALTHCARE">Healthcare</option>
                            <option value="AGRICULTURE">Agriculture</option>
                            <option value="URBAN">Urban</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
                <div className="bg-card rounded-2xl shadow-xl p-16 text-center border-2 border-dashed border-border">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-secondary to-secondary/70 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                        <Briefcase className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                        No Projects Found
                    </h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mb-8 leading-relaxed">
                        You haven&apos;t added any projects yet. Showcase your practical experience.
                    </p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-secondary to-secondary/80 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                        Add Your First Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-card rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all border-2 border-border"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-foreground mb-1">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {project.description}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteProject(project.id, project.sector)}
                                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span
                                    className={`inline-block px-3 py-1 text-xs rounded-xl font-semibold border ${getSectorColor(
                                        project.sector
                                    )}`}
                                >
                                    {project.sector}
                                </span>
                                <span
                                    className={`inline-block px-3 py-1 text-xs rounded-xl font-semibold border ${getStatusColor(
                                        project.status
                                    )}`}
                                >
                                    {project.status.replace("_", " ")}
                                </span>
                                {project.teamSize && project.teamSize > 1 && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground text-xs rounded-xl font-semibold">
                                        <Users className="h-3 w-3" />
                                        Team of {project.teamSize}
                                    </span>
                                )}
                            </div>

                            {/* Dates */}
                            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(project.startDate).toLocaleDateString()}</span>
                                </div>
                                {project.endDate && (
                                    <>
                                        <span>→</span>
                                        <span>{new Date(project.endDate).toLocaleDateString()}</span>
                                    </>
                                )}
                            </div>

                            {/* Outcomes */}
                            {project.outcomes && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold mb-1">Outcomes</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {project.outcomes}
                                    </p>
                                </div>
                            )}

                            {/* Links */}
                            <div className="flex gap-3 mb-4">
                                {project.repositoryUrl && (
                                    <a
                                        href={project.repositoryUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                                    >
                                        <Github className="h-4 w-4" />
                                        Repository
                                    </a>
                                )}
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                                    >
                                        <Globe className="h-4 w-4" />
                                        Live Demo
                                    </a>
                                )}
                            </div>

                            {/* Technologies */}
                            {project.technologies && project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.slice(0, 4).map((tech, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-lg font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies.length > 4 && (
                                        <span className="px-3 py-1 text-muted-foreground text-xs font-medium">
                                            +{project.technologies.length - 4} more
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Project Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
                            <h2 className="text-xl font-bold">Add Project</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddProject} className="p-6 space-y-4">
                            {/* Sector */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Sector *</label>
                                <select
                                    value={formSector}
                                    onChange={(e) => {
                                        setFormSector(e.target.value);
                                        setFormData({ ...formData, category: "" });
                                    }}
                                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                    required
                                >
                                    <option value="HEALTHCARE">Healthcare</option>
                                    <option value="AGRICULTURE">Agriculture</option>
                                    <option value="URBAN">Urban</option>
                                </select>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Project Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                    placeholder="e.g., Patient Data Analytics Dashboard"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background min-h-[100px]"
                                    placeholder="Describe your project..."
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories[formSector as keyof typeof categories]?.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.replace(/_/g, " ")}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Start Date */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Start Date *</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                        required
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">End Date</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Status *</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                        required
                                    >
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="ON_HOLD">On Hold</option>
                                    </select>
                                </div>

                                {/* Team Size */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Team Size</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.teamSize}
                                        onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 1 })}
                                        className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Your Role</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                    placeholder="e.g., Lead Developer, Data Analyst"
                                />
                            </div>

                            {/* Outcomes */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Outcomes *</label>
                                <textarea
                                    value={formData.outcomes}
                                    onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                    placeholder="What were the results of this project?"
                                    required
                                />
                            </div>

                            {/* Technologies */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Technologies Used</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                                        className="flex-1 px-4 py-2 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                        placeholder="Add technology"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTech}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.technologies.map((tech, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground rounded-lg text-sm"
                                        >
                                            {tech}
                                            <button
                                                type="button"
                                                onClick={() => removeTech(tech)}
                                                className="hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Skills Used */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Skills Used</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                                        className="flex-1 px-4 py-2 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                        placeholder="Add skill"
                                    />
                                    <button
                                        type="button"
                                        onClick={addSkill}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.skillsUsed.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground rounded-lg text-sm"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* URLs */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Repository URL</label>
                                    <input
                                        type="url"
                                        value={formData.repositoryUrl}
                                        onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Live URL</label>
                                    <input
                                        type="url"
                                        value={formData.liveUrl}
                                        onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            {/* Public */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={formData.isPublic}
                                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                    className="h-4 w-4"
                                />
                                <label htmlFor="isPublic" className="text-sm font-medium">
                                    Make this project publicly visible
                                </label>
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-3 border-2 border-border rounded-xl font-medium hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50"
                                >
                                    {submitting ? "Adding..." : "Add Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
