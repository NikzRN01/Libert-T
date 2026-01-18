                            {(() => {
                                if (loadingRecs.HEALTHCARE) {
                                    return (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                        </div>
                                    );
                                }
                                if (healthcareRecs.length === 0) {
                                    return (
                                        <div className="text-center py-12">
                                            <Sparkles className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-600 text-lg font-medium">Fetching AI recommendations...</p>
                                        </div>
                                    );
                                }
                                const news = healthcareRecs.filter(r => r.type === "news").slice(0, 3);
                                const opportunities = healthcareRecs.filter(r => r.type === "opportunity").slice(0, 3);
                                const total = Math.min(news.length + opportunities.length, 5);
                                return (
                                    <>
                                        {news.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Newspaper className="h-5 w-5 text-blue-600" />
                                                    <h3 className="text-sm font-bold text-slate-700">Industry News & Trends</h3>
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{news.length}</span>
                                                </div>
                                                <div className="space-y-3">
                                                    {news.map((rec, index) => (
                                                        <div key={index} className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 shadow-sm hover:shadow-md transition-shadow">
                                                            <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                            <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                            {rec.source && (
                                                                <p className="text-xs text-slate-500 mt-2">{rec.source} {rec.date && `• ${rec.date}`}</p>
                                                            )}
                                                            {rec.url && (
                                                                <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                                                                    Learn more →
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        {opportunities.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Briefcase className="h-5 w-5 text-blue-600" />
                                                    <h3 className="text-sm font-bold text-slate-700">Career Opportunities</h3>
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{opportunities.length}</span>
                                                </div>
                                                <div className="space-y-3">
                                                    {opportunities.map((rec, index) => (
                                                        <div key={index} className="p-4 rounded-xl border border-blue-200 bg-white/80 shadow-sm hover:shadow-md transition-shadow">
                                                            <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                            <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                            {rec.source && (
                                                                <p className="text-xs text-slate-500 mt-2">{rec.source} {rec.date && `• ${rec.date}`}</p>
                                                            )}
                                                            {rec.url && (
                                                                <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                                                                    Learn more →
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        )}
                                        <div className="flex items-center justify-center text-xs text-slate-500 pt-2">
                                            Showing {total} of {Math.min(healthcareRecs.length, 5)} recommendations
                                        </div>
                                    </>
                                );
                            })()}

    const fetchRecommendations = async (sector: string, score: number) => {
        if (score === 0) return [];

        setLoadingRecs(prev => ({ ...prev, [sector]: true }));
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/analytics/${sector}/recommendations?score=${score}`,
                { headers }
            );

            if (response.ok) {
                const data = await response.json();
                return data.recommendations || [];
            }
        } catch (error) {
            console.error(`Error fetching ${sector} recommendations:`, error);
        } finally {
            setLoadingRecs(prev => ({ ...prev, [sector]: false }));
        }
        return [];
    };

    useEffect(() => {
        if (analytics) {
            if (analytics.bySector.HEALTHCARE) {
                fetchRecommendations("HEALTHCARE", analytics.bySector.HEALTHCARE.overallScore).then(setHealthcareRecs);
            }
            if (analytics.bySector.AGRICULTURE) {
                fetchRecommendations("AGRICULTURE", analytics.bySector.AGRICULTURE.overallScore).then(setAgricultureRecs);
            }
            if (analytics.bySector.URBAN) {
                fetchRecommendations("URBAN", analytics.bySector.URBAN.overallScore).then(setUrbanRecs);
            }
        }
    }, [analytics]);

    const generateAllAnalytics = async () => {
        setGenerating(true);
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            // Generate analytics for all sectors
            const sectors = ["HEALTHCARE", "AGRICULTURE", "URBAN"];
            await Promise.all(
                sectors.map((sector) =>
                    fetch(
                        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/analytics/generate/${sector}`,
                        { method: "POST", headers }
                    )
                )
            );

            // Refetch the analytics
                                return (
                                    <>
                                        {news.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Newspaper className="h-5 w-5 text-blue-600" />
                                                    <h3 className="text-sm font-bold text-slate-700">Industry News & Trends</h3>
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{news.length}</span>
                                                </div>
                                                <div className="space-y-3">
                                                    {news.map((rec, index) => (
                                                        <div key={index} className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 shadow-sm hover:shadow-md transition-shadow">
                                                            <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                            <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                            {rec.source && (
                                                                <p className="text-xs text-slate-500 mt-2">{rec.source} {rec.date && `• ${rec.date}`}</p>
                                                            )}
                                                            {rec.url && (
                                                                <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                                                                    Learn more →
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {opportunities.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Briefcase className="h-5 w-5 text-blue-600" />
                                                    <h3 className="text-sm font-bold text-slate-700">Career Opportunities</h3>
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{opportunities.length}</span>
                                                </div>
                                                <div className="space-y-3">
                                                    {opportunities.map((rec, index) => (
                                                        <div key={index} className="p-4 rounded-xl border border-blue-200 bg-white/80 shadow-sm hover:shadow-md transition-shadow">
                                                            <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                            <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                            {rec.source && (
                                                                <p className="text-xs text-slate-500 mt-2">{rec.source} {rec.date && `• ${rec.date}`}</p>
                                                            )}
                                                            {rec.url && (
                                                                <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                                                                    Learn more →
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-center text-xs text-slate-500 pt-2">
                                            Showing {total} of {Math.min(healthcareRecs.length, 5)} recommendations
                                        </div>
                                    </>
                                );
                    </button>
                </div>
            </div>

            {/* Overall Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="rounded-2xl border border-orange-200/70 bg-white/70 backdrop-blur-lg p-6 flex flex-col items-start shadow-lg relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-100/60 rounded-full blur-2xl opacity-60" />
                    <div className="flex items-center justify-between w-full mb-2 z-10">
                        <span className="text-sm text-orange-700 font-semibold">Total Skills</span>
                        <Target className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 z-10">{analytics?.overall.totalSkills || 0}</div>
                    <p className="text-xs text-slate-500 mt-1 z-10">Across all sectors</p>
                </div>
                <div className="rounded-2xl border border-orange-200/70 bg-white/70 backdrop-blur-lg p-6 flex flex-col items-start shadow-lg relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-100/60 rounded-full blur-2xl opacity-60" />
                    <div className="flex items-center justify-between w-full mb-2 z-10">
                        <span className="text-sm text-orange-700 font-semibold">Projects</span>
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 z-10">{analytics?.overall.totalProjects || 0}</div>
                    <p className="text-xs text-slate-500 mt-1 z-10">Completed</p>
                </div>
                <div className="rounded-2xl border border-orange-200/70 bg-white/70 backdrop-blur-lg p-6 flex flex-col items-start shadow-lg relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-100/60 rounded-full blur-2xl opacity-60" />
                    <div className="flex items-center justify-between w-full mb-2 z-10">
                        <span className="text-sm text-orange-700 font-semibold">Certifications</span>
                        <Award className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 z-10">{analytics?.overall.totalCertifications || 0}</div>
                    <p className="text-xs text-slate-500 mt-1 z-10">Active</p>
                </div>
                <div className="rounded-2xl border border-orange-200/70 bg-white/70 backdrop-blur-lg p-6 flex flex-col items-start shadow-lg relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-100/60 rounded-full blur-2xl opacity-60" />
                    <div className="flex items-center justify-between w-full mb-2 z-10">
                        <span className="text-sm text-orange-700 font-semibold">Overall Score</span>
                        <Brain className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 z-10">{analytics?.overall.averageReadiness || 0}%</div>
                    <p className="text-xs text-slate-500 mt-1 z-10">Career ready</p>
                </div>
                <div className="rounded-2xl border border-orange-200/70 bg-white/70 backdrop-blur-lg p-6 flex flex-col items-start shadow-lg relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-100/60 rounded-full blur-2xl opacity-60" />
                    <div className="flex items-center justify-between w-full mb-2 z-10">
                        <span className="text-sm text-orange-700 font-semibold">Active Session</span>
                        <BarChart3 className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 z-10">{analytics?.overall.totalProjects || 0}</div>
                    <p className="text-xs text-slate-500 mt-1 z-10">Active projects</p>
                </div>
            </div>

            {/* Sector Comparison */}
            <div className="p-4 md:p-6 rounded-2xl border border-orange-200/60 bg-gradient-to-br from-white via-orange-50/30 to-white backdrop-blur-xl shadow-xl mb-6">
                <div className="mb-4">
                    <h2 className="text-xl md:text-2xl font-bold mb-1 text-slate-900">Sector Performance Comparison</h2>
                    <p className="text-slate-600 text-xs">Visualize your progress across different sectors with detailed metrics</p>
                </div>

                {/* Bar Chart */}
                {analytics && (
                    <div className="mb-4">
                        <SectorPerformanceChart
                            data={[
                                {
                                    sector: "Healthcare Informatics",
                                    careerReadiness: analytics.bySector.HEALTHCARE?.careerReadiness || 0,
                                    industryAlignment: analytics.bySector.HEALTHCARE?.industryAlignment || 0,
                                    overall: analytics.bySector.HEALTHCARE?.overallScore || 0
                                },
                                {
                                    sector: "Agricultural Technology",
                                    careerReadiness: analytics.bySector.AGRICULTURE?.careerReadiness || 0,
                                    industryAlignment: analytics.bySector.AGRICULTURE?.industryAlignment || 0,
                                    overall: analytics.bySector.AGRICULTURE?.overallScore || 0
                                },
                                {
                                    sector: "Urban & Smart Cities",
                                    careerReadiness: analytics.bySector.URBAN?.careerReadiness || 0,
                                    industryAlignment: analytics.bySector.URBAN?.industryAlignment || 0,
                                    overall: analytics.bySector.URBAN?.overallScore || 0
                                }
                            ].filter(item => item.overall > 0 || item.careerReadiness > 0 || item.industryAlignment > 0)}
                            height={350}
                        />
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-orange-200/40">
                    <h3 className="text-base font-bold text-slate-900 mb-3">Detailed Sector Analysis</h3>
                    <div className="space-y-3">
                        {/* Healthcare */}
                        {analytics?.bySector.HEALTHCARE && analytics.bySector.HEALTHCARE.overallScore > 0 && (
                            <div className="rounded-lg border border-orange-200/60 bg-gradient-to-br from-orange-50/50 to-white p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-sm">
                                            🏥
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-slate-900">Healthcare Informatics</h3>
                                            <p className="text-xs text-slate-600">Medical sector readiness</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-orange-600">
                                            {analytics.bySector.HEALTHCARE.overallScore}%
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-white rounded-lg p-3 border border-orange-100/40">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-semibold text-slate-700">Career Readiness</span>
                                            <span className="text-sm font-bold text-orange-600">
                                                {analytics.bySector.HEALTHCARE.careerReadiness}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                                                style={{ width: `${analytics.bySector.HEALTHCARE.careerReadiness}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-orange-100/40">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-semibold text-slate-700">Industry Alignment</span>
                                            <span className="text-sm font-bold text-orange-600">
                                                {analytics.bySector.HEALTHCARE.industryAlignment}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                                                style={{ width: `${analytics.bySector.HEALTHCARE.industryAlignment}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Agriculture */}
                        {analytics?.bySector.AGRICULTURE && analytics.bySector.AGRICULTURE.overallScore > 0 && (
                            <div className="rounded-lg border border-orange-200/60 bg-gradient-to-br from-orange-50/50 to-white p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-sm">
                                            🌾
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-slate-900">Agricultural Technology</h3>
                                            <p className="text-xs text-slate-600">Agri-tech sector readiness</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-orange-600">
                                            {analytics.bySector.AGRICULTURE.overallScore}%
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-white rounded-lg p-3 border border-orange-100/40">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-semibold text-slate-700">Career Readiness</span>
                                            <span className="text-sm font-bold text-orange-600">
                                                {analytics.bySector.AGRICULTURE.careerReadiness}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                                                style={{ width: `${analytics.bySector.AGRICULTURE.careerReadiness}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-orange-100/40">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-semibold text-slate-700">Industry Alignment</span>
                                            <span className="text-sm font-bold text-orange-600">
                                                {analytics.bySector.AGRICULTURE.industryAlignment}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                                                style={{ width: `${analytics.bySector.AGRICULTURE.industryAlignment}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Urban */}
                        {analytics?.bySector.URBAN && analytics.bySector.URBAN.overallScore > 0 && (
                            <div className="rounded-lg border border-orange-200/60 bg-gradient-to-br from-orange-50/50 to-white p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-sm">
                                            {/* Place an icon or text here if needed */}
                                        </div>
                                        {/* You can add more content here if needed */}
                                    </div>
                                </div>
                                {/* If you want to show loading or recommendations for URBAN, add them here, not inside the icon div */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-white rounded-lg p-4 border border-orange-100/40">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm font-semibold text-slate-700">Career Readiness</span>
                                            <span className="text-lg font-bold text-orange-600">
                                                {analytics.bySector.URBAN.careerReadiness}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                                                style={{ width: `${analytics.bySector.URBAN.careerReadiness}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border border-orange-100/40">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm font-semibold text-slate-700">Industry Alignment</span>
                                            <span className="text-lg font-bold text-orange-600">
                                                {analytics.bySector.URBAN.industryAlignment}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                                                style={{ width: `${analytics.bySector.URBAN.industryAlignment}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI-Powered Recommendations by Sector */}
            <div className="p-6 md:p-8 rounded-2xl border border-purple-200/60 bg-white/70 backdrop-blur-xl shadow-xl mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">AI-Powered Recommendations</h2>
                    <Link
                        href="/dashboard/chatbot"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 transition-all border border-purple-200/60 text-purple-700 hover:text-purple-900"
                    >
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm font-medium hidden md:inline">AI Assistant</span>
                    </Link>
                </div>

                <div className="space-y-6">
                    {/* Healthcare Recommendations */}
                    {analytics?.bySector.HEALTHCARE && analytics.bySector.HEALTHCARE.overallScore > 0 && (
                        <div className="p-6 rounded-xl border border-blue-200/60 bg-white/50 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <Activity className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">Healthcare Informatics</h2>
                                        <p className="text-sm text-slate-600">Competency Score: {analytics.bySector.HEALTHCARE.overallScore}%</p>
                                    </div>
                                </div>
                            </div>

                            {loadingRecs.HEALTHCARE ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : healthcareRecs.length === 0 ? (
                                <div className="text-center py-12">
                                    <Sparkles className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-600 text-lg font-medium">Fetching AI recommendations...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {(() => {
                                        const news = healthcareRecs.filter(r => r.type === "news").slice(0, 3);
                                        const opportunities = healthcareRecs.filter(r => r.type === "opportunity").slice(0, 3);
                                        const total = Math.min(news.length + opportunities.length, 5);
                                        return (
                                            <>
                                                {news.length > 0 && (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Newspaper className="h-5 w-5 text-blue-600" />
                                                            <h3 className="text-sm font-bold text-slate-700">Industry News & Trends</h3>
                                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{news.length}</span>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {news.map((rec, index) => (
                                                                <div key={index} className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 shadow-sm hover:shadow-md transition-shadow">
                                                                    <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                    <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                                    {rec.source && (
                                                                        <p className="text-xs text-slate-500 mt-2">{rec.source} {rec.date && `• ${rec.date}`}</p>
                                                                    )}
                                                                    {rec.url && (
                                                                        <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                                                                            Learn more →
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {opportunities.length > 0 && (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Briefcase className="h-5 w-5 text-blue-600" />
                                                            <h3 className="text-sm font-bold text-slate-700">Career Opportunities</h3>
                                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{opportunities.length}</span>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {opportunities.map((rec, index) => (
                                                                <div key={index} className="p-4 rounded-xl border border-blue-200 bg-white/80 shadow-sm hover:shadow-md transition-shadow">
                                                                    <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                    <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                                    {rec.source && (
                                                                        <p className="text-xs text-slate-500 mt-2">{rec.source} {rec.date && `• ${rec.date}`}</p>
                                                                    )}
                                                                    {rec.url && (
                                                                        <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                                                                            Learn more →
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-center text-xs text-slate-500 pt-2">
                                                    Showing {total} of {Math.min(healthcareRecs.length, 5)} recommendations
                                                </div>
                                            </div>
                                        </>
                                    })()}
                        </div>
                )}

                {/* Agriculture Recommendations */}
                {analytics?.bySector.AGRICULTURE && analytics.bySector.AGRICULTURE.overallScore > 0 && (
                    <div className="p-6 rounded-xl border border-green-200/60 bg-white/50 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                    <Sprout className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Agricultural Technology</h2>
                                    <p className="text-sm text-slate-600">Innovation Score: {analytics.bySector.AGRICULTURE.overallScore}%</p>
                                </div>
                            </div>

                        </div>

                            {loadingRecs.AGRICULTURE ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                                </div>
                            ) : agricultureRecs.length === 0 ? (
                                <div className="text-center py-12">
                                    <Sparkles className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-600 text-lg font-medium">Fetching AI recommendations...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {(() => {
                                        const news = agricultureRecs.filter(r => r.type === "news").slice(0, 3);
                                        const opportunities = agricultureRecs.filter(r => r.type === "opportunity").slice(0, 3);
                                        const total = Math.min(news.length + opportunities.length, 5);

                                        return (
                                            <>
                                                {news.length > 0 && (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Newspaper className="h-5 w-5 text-green-600" />
                                                            <h3 className="text-sm font-bold text-slate-700">Industry News & Trends</h3>
                                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{news.length}</span>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {news.map((rec, index) => (
                                                                <div key={index} className="p-4 rounded-xl border border-green-100 bg-green-50/50 shadow-sm hover:shadow-md transition-shadow">
                                                                    <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                    <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                                    {rec.source && (
                                                                        <p className="text-xs text-slate-500 mt-2">{rec.source} {rec.date && `• ${rec.date}`}</p>
                                                                    )}
                                                                    {rec.url && (
                                                                        <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline mt-2 inline-block">
                                                                            Learn more →
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {opportunities.length > 0 && (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Briefcase className="h-5 w-5 text-green-600" />
                                                            <h3 className="text-sm font-bold text-slate-700">Career Opportunities</h3>
                                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{opportunities.length}</span>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {opportunities.map((rec, index) => (
                                                                <div key={index} className="p-4 rounded-xl border border-green-200 bg-white/80 shadow-sm hover:shadow-md transition-shadow">
                                                                    <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                    <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                                    {rec.source && (
                                                                        <p className="text-xs text-slate-500 mt-2">{rec.source} {rec.date && `• ${rec.date}`}</p>
                                                                    )}
                                                                    {rec.url && (
                                                                        <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline mt-2 inline-block">
                                                                            Learn more →
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-center text-xs text-slate-500 pt-2">
                                                    Showing {total} of {Math.min(agricultureRecs.length, 5)} recommendations
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    )}

                {/* Urban Recommendations */}
                {analytics?.bySector.URBAN && analytics.bySector.URBAN.overallScore > 0 && (
                    <div className="p-6 rounded-xl border border-cyan-200/60 bg-white/50 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                                    <Building2 className="h-5 w-5 text-cyan-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Urban & Smart Cities</h2>
                                    <p className="text-sm text-slate-600">Readiness Score: {analytics.bySector.URBAN.overallScore}%</p>
                                </div>
                            </div>

                            </div>

                            {loadingRecs.URBAN ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
                                </div>
                            ) : urbanRecs.length === 0 ? (
                                <div className="text-center py-12">
                                    <Sparkles className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-600 text-lg font-medium">Fetching AI recommendations...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {(() => {
                                        const news = urbanRecs.filter(r => r.type === "news").slice(0, 3);
                                        const opportunities = urbanRecs.filter(r => r.type === "opportunity").slice(0, 3);
                                        const total = Math.min(news.length + opportunities.length, 5);

                                        return (
                                            <>
                                                {news.length > 0 && (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Newspaper className="h-5 w-5 text-cyan-600" />
                                                            <h3 className="text-sm font-bold text-slate-700">Industry News & Trends</h3>
                                                            <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">{news.length}</span>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {news.map((rec, index) => (
                                                                <div key={index} className="p-4 rounded-xl border border-cyan-100 bg-cyan-50/50 shadow-sm hover:shadow-md transition-shadow">
                                                                    <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                    <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                                    {rec.source && (
                                                                        <p className="text-xs text-slate-500 mt-2">{rec.source} {rec.date && `• ${rec.date}`}</p>
                                                                    )}
                                                                    {rec.url && (
                                                                        <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-600 hover:underline mt-2 inline-block">
                                                                            Learn more →
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {opportunities.length > 0 && (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Briefcase className="h-5 w-5 text-cyan-600" />
                                                            <h3 className="text-sm font-bold text-slate-700">Career Opportunities</h3>
                                                            <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">{opportunities.length}</span>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {opportunities.map((rec, index) => (
                                                                <div key={index} className="p-4 rounded-xl border border-cyan-200 bg-white/80 shadow-sm hover:shadow-md transition-shadow">
                                                                    <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                    <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                                    {rec.source && (
                                                                        <p className="text-xs text-slate-500 mt-2">{rec.source} {rec.date && `• ${rec.date}`}</p>
                                                                    )}
                                                                    {rec.url && (
                                                                        <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-600 hover:underline mt-2 inline-block">
                                                                            Learn more →
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-center text-xs text-slate-500 pt-2">
                                                    Showing {total} of {Math.min(urbanRecs.length, 5)} recommendations
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                )}
                </div>
            </div>

            {/* Score Calculation Footer */}
            <div className="mt-12 space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-400">*</span>
                    <p><strong>Overall Score:</strong> (Avg Proficiency / 5) × 40 + Min(Certifications × 10, 30) + Min(Completed Projects × 6, 30)</p>
                </div>
                <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-400">*</span>
                    <p><strong>Career Readiness:</strong> (Verified Skills / Total Skills) × 50% + Min(Active Certifications × 10, 50%)</p>
                </div>
                <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-400">*</span>
                    <p><strong>Industry Alignment:</strong> (Skill Count / 10) × 30% + (Avg Proficiency / 5) × 30% + Min(Completed Projects × 8, 25%) + Min(Public Projects × 5, 15%)</p>
                </div>
            </div>
        </div>
    );
}
