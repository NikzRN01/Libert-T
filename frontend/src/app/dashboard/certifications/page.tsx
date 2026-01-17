"use client";

import { useSearchParams } from "next/navigation";
import { Award, Plus } from "lucide-react";

export default function CertificationsPage() {
    const searchParams = useSearchParams();
    const sector = searchParams.get("sector") || "All Sectors";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Certifications
                    </h1>
                    <p className="text-muted-foreground">
                        Viewing certifications for: <span className="font-semibold text-primary">{sector}</span>
                    </p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Plus className="h-4 w-4" />
                    <span>Add Certification</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center border border-dashed border-gray-300 dark:border-gray-700">
                <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Certifications Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto mb-6">
                    You haven't added any {sector.toLowerCase()} certifications yet. Add your credentials to boost your profile.
                </p>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Add Your First Certification
                </button>
            </div>
        </div>
    );
}
