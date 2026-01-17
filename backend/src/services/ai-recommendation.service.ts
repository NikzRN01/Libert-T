import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface RecommendationRequest {
    sector: string;
    competencyScore: number;
    skills: string[];
    projects: number;
    certifications: number;
}

interface Recommendation {
    type: 'news' | 'opportunity';
    title: string;
    description: string;
    source?: string;
    url?: string;
    date?: string;
}

export const generateAIRecommendations = async (
    data: RecommendationRequest
): Promise<Recommendation[]> => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY not set, returning fallback recommendations');
            return getFallbackRecommendations(data.sector, data.competencyScore);
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `You are a career advisor specializing in ${data.sector.toLowerCase()} technology sector.

User Profile:
- Sector: ${data.sector}
- Competency Score: ${data.competencyScore}%
- Skills: ${data.skills.join(', ') || 'None yet'}
- Projects Completed: ${data.projects}
- Certifications: ${data.certifications}

Generate exactly 5 personalized recommendations with this EXACT distribution:
- 2-3 industry news/trends (type: "news")
- 2-3 career opportunities/actions (type: "opportunity")

For each recommendation, provide:
1. Type: Either "news" or "opportunity"
2. Title: Clear, engaging headline (max 60 characters)
3. Description: 1-2 sentences explaining relevance to user's profile
4. Source: Realistic source name (e.g., "TechCrunch", "LinkedIn", "IEEE", "Forbes", "Industry Report", etc.)
5. Date: Recent date in format "YYYY-MM-DD"

Content Guidelines:
- Make recommendations SPECIFIC to their competency level (${data.competencyScore}%)
- For low scores (0-40%), focus on fundamentals, free courses, and entry-level roles
- For medium scores (41-70%), focus on skill building, certifications, and mid-level roles
- For high scores (71-100%), focus on leadership, thought leadership, and executive opportunities
- Ensure NEWS items discuss industry trends, breakthroughs, or market changes
- Ensure OPPORTUNITY items suggest specific actions: certifications, roles, projects, or networking
- Use real-world industry insights and realistic company/organization names
- DO NOT include URLs (leave url field empty)

CRITICAL: Return ONLY valid JSON array with exactly 5 items:
[
  {
    "type": "news",
    "title": "Breaking: AI in Healthcare",
    "description": "...",
    "source": "TechCrunch",
    "date": "2026-01-18"
  },
  {
    "type": "opportunity",
    "title": "New Role: Healthcare Data Engineer",
    "description": "...",
    "source": "LinkedIn",
    "date": "2026-01-17"
  }
]`;


        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.error('Failed to parse Gemini response:', text);
            return getFallbackRecommendations(data.sector, data.competencyScore);
        }

        const recommendations = JSON.parse(jsonMatch[0]);
        
        // Validate and clean recommendations
        return recommendations
            .filter((rec: any) => rec.type && rec.title && rec.description)
            .slice(0, 5)
            .map((rec: any) => ({
                type: rec.type === 'opportunity' ? 'opportunity' : 'news',
                title: rec.title,
                description: rec.description,
                source: rec.source || 'Industry Insights',
                date: rec.date || new Date().toISOString().split('T')[0],
                url: rec.url || undefined,
            }));
    } catch (error) {
        console.error('Error generating AI recommendations:', error);
        return getFallbackRecommendations(data.sector, data.competencyScore);
    }
};

const getFallbackRecommendations = (
    sector: string,
    score: number
): Recommendation[] => {
    const sectorMap: { [key: string]: any } = {
        HEALTHCARE: {
            low: [
                {
                    type: 'news',
                    title: 'Healthcare IT Fundamentals: What Employers Look For',
                    description: 'Industry report shows strong demand for professionals with basic EHR and healthcare data management skills.',
                    source: 'Healthcare IT News',
                    date: '2026-01-15',
                },
                {
                    type: 'opportunity',
                    title: 'Free Healthcare Informatics Certification Course',
                    description: 'HIMSS offers free introductory certification for aspiring healthcare IT professionals.',
                    source: 'HIMSS',
                    date: '2026-01-17',
                },
            ],
            medium: [
                {
                    type: 'news',
                    title: 'AI-Powered Diagnostics Transform Patient Care',
                    description: 'Healthcare organizations increasingly seek professionals skilled in AI integration and medical data analytics.',
                    source: 'NEJM Catalyst',
                    date: '2026-01-16',
                },
                {
                    type: 'opportunity',
                    title: 'Healthcare Data Analyst Positions Surge 35%',
                    description: 'Mid-level opportunities available for professionals with 2-3 years experience in healthcare informatics.',
                    source: 'LinkedIn Healthcare',
                    date: '2026-01-18',
                },
            ],
            high: [
                {
                    type: 'news',
                    title: 'Healthcare CIOs Prioritize Interoperability Experts',
                    description: 'Leading health systems seeking senior professionals to lead FHIR and HL7 integration projects.',
                    source: 'Healthcare Executive',
                    date: '2026-01-14',
                },
                {
                    type: 'opportunity',
                    title: 'Speaking Opportunity: HIMSS Global Conference',
                    description: 'Call for proposals open for healthcare technology thought leaders to share innovations.',
                    source: 'HIMSS',
                    date: '2026-01-12',
                },
            ],
        },
        AGRICULTURE: {
            low: [
                {
                    type: 'news',
                    title: 'AgriTech Startups Offer Entry-Level Training Programs',
                    description: 'New initiatives help aspiring professionals enter precision agriculture and farm management technology.',
                    source: 'AgFunder News',
                    date: '2026-01-16',
                },
                {
                    type: 'opportunity',
                    title: 'Free IoT for Agriculture Course Available',
                    description: 'Learn basics of sensor technology and data collection for smart farming applications.',
                    source: 'Coursera',
                    date: '2026-01-15',
                },
            ],
            medium: [
                {
                    type: 'news',
                    title: 'Drone Technology Revolutionizes Crop Monitoring',
                    description: 'Agricultural businesses seek professionals skilled in aerial imaging analysis and precision farming techniques.',
                    source: 'PrecisionAg',
                    date: '2026-01-17',
                },
                {
                    type: 'opportunity',
                    title: 'AgriTech Companies Hiring Remote Farm Data Analysts',
                    description: 'Growing demand for professionals who can interpret agricultural IoT data and provide actionable insights.',
                    source: 'AgCareers',
                    date: '2026-01-18',
                },
            ],
            high: [
                {
                    type: 'news',
                    title: 'Climate-Smart Agriculture Draws Major Investment',
                    description: 'Industry leaders need experts in sustainable farming technology and carbon credit systems.',
                    source: 'Forbes AgTech',
                    date: '2026-01-13',
                },
                {
                    type: 'opportunity',
                    title: 'Lead AgriTech Innovation at Fortune 500 Ag Company',
                    description: 'Senior positions available for professionals with proven track record in agricultural technology implementation.',
                    source: 'Ag Executive Search',
                    date: '2026-01-16',
                },
            ],
        },
        URBAN: {
            low: [
                {
                    type: 'news',
                    title: 'Smart Cities Initiative Expands Nationwide',
                    description: 'Government programs offer training for entry-level positions in urban technology and IoT infrastructure.',
                    source: 'Smart Cities Dive',
                    date: '2026-01-17',
                },
                {
                    type: 'opportunity',
                    title: 'Urban Planning Technology Bootcamp Open',
                    description: 'Learn GIS, data visualization, and smart city fundamentals in 12-week intensive program.',
                    source: 'Code for America',
                    date: '2026-01-14',
                },
            ],
            medium: [
                {
                    type: 'news',
                    title: '5G Networks Enable Next-Gen Smart City Solutions',
                    description: 'Cities worldwide deploying connected infrastructure, creating demand for IoT and network specialists.',
                    source: 'IoT World Today',
                    date: '2026-01-16',
                },
                {
                    type: 'opportunity',
                    title: 'Smart City Project Manager Roles Available',
                    description: 'Mid-career opportunities managing urban IoT deployments and citizen engagement platforms.',
                    source: 'Govtech Jobs',
                    date: '2026-01-18',
                },
            ],
            high: [
                {
                    type: 'news',
                    title: 'Urban Digital Twin Technology Transforms City Planning',
                    description: 'Leading municipalities seek experts in 3D modeling, simulation, and predictive urban analytics.',
                    source: 'CityLab',
                    date: '2026-01-15',
                },
                {
                    type: 'opportunity',
                    title: 'Chief Innovation Officer: Major Metropolitan City',
                    description: 'Executive leadership role overseeing smart city strategy and technology transformation initiatives.',
                    source: 'Public Sector Executive Search',
                    date: '2026-01-12',
                },
            ],
        },
    };

    const level = score <= 40 ? 'low' : score <= 70 ? 'medium' : 'high';
    const recommendations = sectorMap[sector]?.[level] || [];

    // Add generic recommendations if sector not found
    if (recommendations.length === 0) {
        return [
            {
                type: 'news',
                title: 'Industry Technology Trends for 2026',
                description: `Stay updated on latest developments in ${sector.toLowerCase()} technology sector.`,
                source: 'Tech Industry Report',
                date: '2026-01-18',
            },
            {
                type: 'opportunity',
                title: 'Skill Development Opportunities',
                description: 'Explore certifications and courses to advance your career in your chosen sector.',
                source: 'Career Development',
                date: '2026-01-17',
            },
        ];
    }

    return recommendations;
};
