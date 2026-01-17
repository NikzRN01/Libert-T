"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Search, Trash2, Pencil, X } from "lucide-react";

interface Skill {
    id: string;
    name: string;
    category: string;
    sector: string;
    proficiencyLevel: number;
    verified: boolean;
    tags: string[];
    description?: string;
}

interface SkillForm {
    name: string;
    category: string;
    customCategory?: string;
    proficiencyLevel: number;
    tags: string[];
    description: string;
}

const SECTOR = "URBAN";

const URBAN_CATEGORIES = [
    "SUSTAINABLE_DEVELOPMENT",
    "SMART_CITY_TECHNOLOGY",
    "URBAN_PLANNING",
    "COMMUNITY_DEVELOPMENT",
    "TRANSPORTATION_SYSTEMS",
    "INFRASTRUCTURE_MANAGEMENT",
    "ENVIRONMENTAL_SUSTAINABILITY",
    "URBAN_GOVERNANCE",
];

export default function UrbanSkillsPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<SkillForm>({
        name: "",
        category: "",
        customCategory: "",
        proficiencyLevel: 1,
        tags: [],
        description: "",
    });
    const [tagInput, setTagInput] = useState("");

    const fetchSkills = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const params = new URLSearchParams();
            params.append("sector", SECTOR);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/skills?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setSkills(data.skills);
            }
        } catch (error) {
            console.error("Failed to fetch skills:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSkills();
    }, [fetchSkills]);

    const handleDeleteSkill = async (skillId: string) => {
        if (!confirm("Are you sure you want to delete this skill?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/skills/${skillId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                setSkills(skills.filter((s) => s.id !== skillId));
            } else {
                console.error("Failed to delete skill");
            }
        } catch (error) {
            console.error("Error deleting skill:", error);
        }
    };

    const handleEditSkill = (skill: Skill) => {
        setEditingSkill(skill);
        setFormData({
            name: skill.name,
            category: skill.category,
            proficiencyLevel: skill.proficiencyLevel,
            tags: skill.tags || [],
            description: skill.description || "",
        });
        setShowEditModal(true);
    };

    const handleUpdateSkill = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSkill) return;

        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/skills/${editingSkill.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...formData,
                        category: formData.category === "OTHER" ? formData.customCategory : formData.category,
                    }),
                }
            );

            if (response.ok) {
                setShowEditModal(false);
                setEditingSkill(null);
                setFormData({
                    name: "",
                    category: "",
                    customCategory: "",
                    proficiencyLevel: 1,
                    tags: [],
                    description: "",
                });
                fetchSkills();
            }
        } catch (error) {
            console.error("Failed to update skill:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddSkill = async (e: React.FormEvent) => {
        e.preventDefault();

        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/skills`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...formData,
                        sector: SECTOR,
                        category: formData.category === "OTHER" ? formData.customCategory : formData.category,
                    }),
                }
            );

            if (response.ok) {
                setShowAddModal(false);
                setFormData({
                    name: "",
                    category: "",
                    customCategory: "",
                    proficiencyLevel: 1,
                    tags: [],
                    description: "",
                });
                fetchSkills();
            }
        } catch (error) {
            console.error("Failed to add skill:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((t) => t !== tagToRemove),
        });
    };

    const filteredSkills = skills.filter((skill) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getProficiencyLabel = (level: number) => {
        const labels = ["", "Beginner", "Intermediate", "Advanced", "Expert", "Master"];
        return labels[level] || "Unknown";
    };

    const getProficiencyColor = (level: number) => {
        const colors = [
            "",
            "bg-gray-200 text-gray-700",
            "bg-blue-200 text-blue-700",
            "bg-green-200 text-green-700",
            "bg-purple-200 text-purple-700",
            "bg-yellow-200 text-yellow-700",
        ];
        return colors[level] || colors[0];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground font-medium">Loading skills...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">
                    Urban Skills
                </h1>
                {skills.length > 0 && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add Skill</span>
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="bg-card rounded-2xl shadow-lg p-6 border-2 border-border">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search skills..."
                        className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground font-medium"
                    />
                </div>
            </div>

            {/* Skills Grid */}
            {filteredSkills.length === 0 ? (
                <div className="bg-card rounded-2xl shadow-xl p-16 text-center border-2 border-dashed border-border">
                    <p className="text-muted-foreground mb-6 text-lg">
                        {searchTerm ? "No skills found matching your search" : "You haven't added any skills yet"}
                    </p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add Your First Skill</span>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSkills.map((skill) => (
                        <div
                            key={skill.id}
                            className="bg-card rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1 border-2 border-border"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-lg font-bold text-foreground">{skill.name}</h3>
                                <div className="flex items-center gap-2">
                                    {skill.verified && (
                                        <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs rounded-xl font-semibold border border-secondary/30">
                                            Verified
                                        </span>
                                    )}
                                    <button
                                        onClick={() => handleEditSkill(skill)}
                                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        title="Edit skill"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSkill(skill.id)}
                                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete skill"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <p className="text-sm text-muted-foreground font-medium">{skill.category.replace(/_/g, " ")}</p>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground font-semibold">Proficiency</span>
                                    <span className={`px-3 py-1 text-xs rounded-xl font-semibold ${getProficiencyColor(skill.proficiencyLevel)}`}>
                                        {getProficiencyLabel(skill.proficiencyLevel)}
                                    </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-3 shadow-inner">
                                    <div
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all shadow-md"
                                        style={{ width: `${(skill.proficiencyLevel / 5) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {skill.description && (
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{skill.description}</p>
                            )}

                            {skill.tags && skill.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {skill.tags.slice(0, 3).map((tag, index) => (
                                        <span key={index} className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-lg font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                    {skill.tags.length > 3 && (
                                        <span className="px-3 py-1 text-muted-foreground text-xs font-medium">+{skill.tags.length - 3} more</span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Skill Modal */}
            {showEditModal && editingSkill && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-primary/10 to-accent/10">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Skill</h2>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingSkill(null);
                                }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSkill} className="p-6 space-y-4 bg-white dark:bg-gray-900">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Skill Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    placeholder="e.g., Python Programming"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Category *</label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value, customCategory: "" })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                    <option value="">Select a category</option>
                                    {URBAN_CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.replace(/_/g, " ")}
                                        </option>
                                    ))}
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            {formData.category === "OTHER" && (
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Custom Category *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter custom category"
                                        value={formData.customCategory || ""}
                                        onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">
                                    Proficiency Level: {getProficiencyLabel(formData.proficiencyLevel)}
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={formData.proficiencyLevel}
                                    onChange={(e) => setFormData({ ...formData, proficiencyLevel: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                />
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span>Beginner</span>
                                    <span>Intermediate</span>
                                    <span>Advanced</span>
                                    <span>Expert</span>
                                    <span>Master</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                                    placeholder="Describe your experience with this skill..."
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Tags</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                        className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                                        placeholder="Add a tag"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg text-sm border border-gray-300 dark:border-gray-700"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="hover:text-red-600 dark:hover:text-red-400"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingSkill(null);
                                    }}
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium disabled:opacity-50 hover:bg-primary/90"
                                >
                                    {submitting ? "Updating..." : "Update Skill"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Skill Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Skill</h2>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setFormData({
                                        name: "",
                                        category: "",
                                        customCategory: "",
                                        proficiencyLevel: 1,
                                        tags: [],
                                        description: "",
                                    });
                                }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleAddSkill} className="p-6 space-y-4 bg-white dark:bg-gray-900">
                            {/* Skill Name */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Skill Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    placeholder="e.g., Python Programming"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Category *</label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value, customCategory: "" })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                    <option value="">Select a category</option>
                                    {URBAN_CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.replace(/_/g, " ")}
                                        </option>
                                    ))}
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            {/* Custom Category (if "Other" selected) */}
                            {formData.category === "OTHER" && (
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Custom Category *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter custom category"
                                        value={formData.customCategory || ""}
                                        onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                                        required
                                    />
                                </div>
                            )}

                            {/* Proficiency Level */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">
                                    Proficiency Level: {getProficiencyLabel(formData.proficiencyLevel)}
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={formData.proficiencyLevel}
                                    onChange={(e) => setFormData({ ...formData, proficiencyLevel: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                />
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span>Beginner</span>
                                    <span>Intermediate</span>
                                    <span>Advanced</span>
                                    <span>Expert</span>
                                    <span>Master</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[80px]"
                                    placeholder="Describe your proficiency..."
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Tags</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                        placeholder="Add a tag and press Enter"
                                        className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
                                    >
                                        Add
                                    </button>
                                </div>
                                {formData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="text-primary hover:text-primary/80"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setFormData({
                                            name: "",
                                            category: "",
                                            customCategory: "",
                                            proficiencyLevel: 1,
                                            tags: [],
                                            description: "",
                                        });
                                    }}
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium disabled:opacity-50 hover:bg-primary/90"
                                >
                                    {submitting ? "Adding..." : "Add Skill"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
