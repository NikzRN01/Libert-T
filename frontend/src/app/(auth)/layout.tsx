import { Brain } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Logo */}
                <div className="flex items-center justify-center mb-8">
                    <Brain className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                    <h1 className="ml-3 text-3xl font-bold text-gray-900 dark:text-white">
                        SkillXIntell
                    </h1>
                </div>

                {/* Auth Content */}
                <div className="flex items-center justify-center">
                    <div className="w-full max-w-md">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>© 2026 SkillXIntell. Built for better education and career outcomes.</p>
                </div>
            </div>
        </div>
    );
}
