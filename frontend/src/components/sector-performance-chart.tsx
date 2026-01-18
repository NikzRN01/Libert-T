"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SectorData {
    sector: string;
    careerReadiness: number;
    industryAlignment: number;
    overall: number;
}

interface SectorPerformanceChartProps {
    data: SectorData[];
    height?: number;
}

// Orange color palette with different shades
const ORANGE_PALETTE = {
    light: '#FED7AA',      // Light orange
    medium: '#FB923C',     // Medium orange
    dark: '#EA580C',       // Dark orange
};

type TooltipEntry = {
    color?: string;
    name?: string;
    value?: number | string;
};

type CustomTooltipProps = {
    active?: boolean;
    payload?: TooltipEntry[];
    label?: string;
};




const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm border border-orange-200 rounded-lg shadow-lg p-4 min-w-[220px]">
                <p className="font-semibold text-slate-900 text-sm mb-2">{label}</p>
                {payload.map((entry, index) => (
                {payload.map((entry, index) => (
                    <p key={index} className="text-xs font-medium text-slate-700 mb-1">
                        <span
                            className="inline-block w-3 h-3 rounded mr-2"
                            style={{ backgroundColor: entry.color ?? ORANGE_PALETTE.medium }}
                        ></span>
                        {entry.name ?? "Value"}: <span className="font-bold text-orange-600">{entry.value}%</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

type LegendEntry = {
    value: string;
    color: string;
};

type CustomLegendProps = {
    payload: LegendEntry[];
};

const CustomLegend = (props: LegendProps) => {
    const { payload } = props;
    return (
        <div className="flex flex-wrap justify-center gap-6 mt-6 pb-4">
            {payload && payload.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-sm font-medium text-slate-700">{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

export function SectorPerformanceChart({ data, height = 450 }: SectorPerformanceChartProps) {
    type YAxisLabelProps = {
        viewBox?: {
            x?: number;
            y?: number;
            height?: number;
        };
    };

    // Centered Y-axis label renderer
    const renderYAxisLabel = ({ viewBox }: { viewBox?: { x?: number; y?: number; width?: number; height?: number } }) => {
        const { x, y, height } = viewBox || {};
        const cx = (x ?? 0) + 24; // nudge inside the chart for visibility
        const cy = (y ?? 0) + (height ?? 0) / 2;
        return (
            <text
                x={cx}
                y={cy}
                fill="#64748b"
                fontSize={12}
                fontWeight={500}
                textAnchor="middle"
                transform={`rotate(-90, ${cx}, ${cy})`}
            >
                Performance Score (%)
            </text>
        );
    };
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-96 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-slate-600 font-medium">No data available</p>
                    <p className="text-slate-500 text-sm mt-1">Complete assessments to see your sector performance</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="bg-gradient-to-br from-orange-50/50 via-white to-amber-50/30 rounded-xl p-6 border border-orange-100/50">
                {/* Header */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Performance Metrics by Sector</h3>
                    <p className="text-sm text-slate-600 mt-1">Compare your career readiness, industry alignment, and overall score across different sectors</p>
                </div>

                {/* Chart Container */}
                <div className="bg-white/60 rounded-lg border border-orange-100/40 p-4">
                    <ResponsiveContainer width="100%" height={height}>
                        <BarChart
                            data={data}
                            margin={{ top: 16, right: 24, left: 56, bottom: 24 }}
                            barCategoryGap="20%"
                        >
                            <defs>
                                {/* Gradients for bars */}
                                <linearGradient id="colorLight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={ORANGE_PALETTE.light} stopOpacity={0.9} />
                                    <stop offset="100%" stopColor={ORANGE_PALETTE.light} stopOpacity={0.6} />
                                </linearGradient>
                                <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={ORANGE_PALETTE.medium} stopOpacity={0.9} />
                                    <stop offset="100%" stopColor={ORANGE_PALETTE.medium} stopOpacity={0.6} />
                                </linearGradient>
                                <linearGradient id="colorDark" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={ORANGE_PALETTE.dark} stopOpacity={0.9} />
                                    <stop offset="100%" stopColor={ORANGE_PALETTE.dark} stopOpacity={0.6} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="4 4"
                                stroke="#fed7aa"
                                opacity={0.5}
                                vertical={false}
                            />
                            <XAxis
                                dataKey="sector"
                                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                axisLine={{ stroke: '#fed7aa', strokeWidth: 1 }}
                                tickLine={false}
                                interval={0}
                                tickMargin={8}
                                height={40}
                            />
                            <YAxis
                                label={{ content: renderYAxisLabel }}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                axisLine={{ stroke: '#fed7aa', strokeWidth: 1 }}
                                tickLine={false}
                                domain={[0, 100]}
                                ticks={[0, 25, 50, 75, 100]}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: 'rgba(249, 115, 22, 0.08)' }}
                            />

                            <Bar
                                dataKey="careerReadiness"
                                fill="url(#colorLight)"
                                name="Career Readiness"
                                radius={[8, 8, 0, 0]}
                                animationDuration={800}
                            />
                            <Bar
                                dataKey="industryAlignment"
                                fill="url(#colorMedium)"
                                name="Industry Alignment"
                                radius={[8, 8, 0, 0]}
                                animationDuration={800}
                            />
                            <Bar
                                dataKey="overall"
                                fill="url(#colorDark)"
                                name="Overall Score"
                                radius={[8, 8, 0, 0]}
                                animationDuration={800}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <CustomLegend payload={[
                    { value: 'Career Readiness', color: ORANGE_PALETTE.light },
                    { value: 'Industry Alignment', color: ORANGE_PALETTE.medium },
                    { value: 'Overall Score', color: ORANGE_PALETTE.dark }
                ]} />
            </div>
        </div>
    );
}
