"use client";

import { useSearchParams } from "next/navigation";
import { Briefcase, Plus } from "lucide-react";

export default function ProjectsPage() {
    const searchParams = useSearchParams();
    const sector = searchParams.get("sector") || "All Sectors";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Projects
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Viewing projects for: <span className="font-bold text-secondary">{sector}</span>
                    </p>
                </div>
                <button className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-secondary to-secondary/80 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                    <Plus className="h-5 w-5" />
                    <span>Add Project</span>
                </button>
            </div>

            <div className="bg-card rounded-2xl shadow-xl p-16 text-center border-2 border-dashed border-border">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-secondary to-secondary/70 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Briefcase className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                    No Projects Found
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto mb-8 leading-relaxed">
                    You haven&apos;t added any {sector.toLowerCase()} projects yet. Showcase your practical experience.
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-secondary to-secondary/80 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                    Add Your First Project
                </button>
            </div>
        </div>
    );
}
