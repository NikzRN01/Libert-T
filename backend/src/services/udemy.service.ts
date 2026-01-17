import axios from 'axios';
import { config } from '../config';

export interface UdemyCourse {
    id: string;
    title: string;
    url: string;
    price: string;
    image: string;
    instructor: string;
    rating: number;
    students: number;
    duration: string;
    level: string;
    description?: string;
}

export interface CareerPath {
    role: string;
    description: string;
    courses: UdemyCourse[];
    skills: string[];
    salaryRange: string;
    demand: string;
    matchScore?: number;
}

/**
 * Fetch courses from Udemy RapidAPI
 */
export async function fetchUdemyCourses(searchQuery: string, limit: number = 10): Promise<UdemyCourse[]> {
    const timestamp = new Date().toISOString();
    
    try {
        if (!config.rapidApi.key) {
            console.error(`[${timestamp}] ❌ FAILSAFE: RapidAPI key not configured! Please add RAPIDAPI_KEY to .env file`);
            throw new Error('RapidAPI key not configured');
        }

        console.log(`[${timestamp}] 🔄 API HIT: Fetching Udemy courses for "${searchQuery}" (limit: ${limit})`);
        console.log(`[${timestamp}] 📡 Endpoint: https://${config.rapidApi.host}/search`);

        const options = {
            method: 'GET',
            url: `https://${config.rapidApi.host}/search`,
            params: {
                s: searchQuery,
            },
            headers: {
                'X-RapidAPI-Key': config.rapidApi.key,
                'X-RapidAPI-Host': config.rapidApi.host,
            },
        };

        const response = await axios.request(options);
        
        console.log(`[${timestamp}] ✅ API SUCCESS: Received ${response.data?.length || 0} courses`);
        
        if (!response.data || response.data.length === 0) {
            console.warn(`[${timestamp}] ⚠️  WARNING: No courses found for "${searchQuery}"`);
            return [];
        }
        
        // Transform the response to match our interface
        const courses = response.data.map((course: any) => {
            // Prefer coupon link from RapidAPI (direct course with coupon applied), then other known fields
            const courseUrl = course.coupon
                ? course.coupon
                : course.url
                ? (course.url.startsWith('http') ? course.url : `https://www.udemy.com${course.url}`)
                : course.link
                ? (course.link.startsWith('http') ? course.link : `https://www.udemy.com${course.link}`)
                : course.course_url
                ? course.course_url
                : `https://www.udemy.com/course/${course.slug || course.id || ''}`;

            return {
                id: course.id || course.course_id || String(Math.random()),
                title: course.title || course.name || 'Untitled Course',
                url: courseUrl,
                price: course.price || course.is_paid === false ? 'Free' : 'Paid',
                image: course.image || course.image_480x270 || course.thumbnail || course.image_125_H || '',
                instructor: course.instructor || course.visible_instructors?.[0]?.title || course.author || 'Unknown',
                rating: parseFloat(course.rating || course.avg_rating || course.stars || '4.5'),
                students: parseInt(course.num_subscribers || course.students || course.enrollments || '1000', 10),
                duration: course.content_info || course.content_length_text || course.duration || course.length || 'N/A',
                level: course.instructional_level || course.level || 'All Levels',
                description: course.headline || course.description || '',
            };
        });

        console.log(`[${timestamp}] 📦 Processed ${courses.length} courses successfully`);
        return courses;
        
    } catch (error: any) {
        console.error(`[${timestamp}] ❌ FAILSAFE: API Error - ${error.message}`);
        if (error.response) {
            console.error(`[${timestamp}] 📛 Status: ${error.response.status}`);
            console.error(`[${timestamp}] 📛 Response:`, JSON.stringify(error.response.data, null, 2));
        }
        throw error; // Don't return mock data, throw error to be handled by caller
    }
}

/**
 * Get career pathways for Healthcare sector
 */
export async function getHealthcareCareerPaths(): Promise<CareerPath[]> {
    console.log('🏥 Fetching Healthcare career pathways...');
    
    const pathwayDefinitions = [
        {
            role: 'Healthcare Data Analyst',
            description: 'Analyze healthcare data to improve patient outcomes and operational efficiency',
            skills: ['Data Analysis', 'SQL', 'Python', 'Healthcare Analytics', 'HIPAA Compliance'],
            salaryRange: '$60,000 - $95,000',
            demand: 'Very High',
            searchQuery: 'health',
        },
        {
            role: 'Medical Software Developer',
            description: 'Develop software solutions for medical devices and healthcare systems',
            skills: ['Programming', 'Medical Informatics', 'FHIR', 'HL7', 'Software Development'],
            salaryRange: '$75,000 - $120,000',
            demand: 'High',
            searchQuery: 'medical',
        },
        {
            role: 'Telehealth Coordinator',
            description: 'Manage and coordinate virtual healthcare services and platforms',
            skills: ['Telemedicine', 'Patient Communication', 'Healthcare IT', 'Project Management'],
            salaryRange: '$50,000 - $75,000',
            demand: 'Very High',
            searchQuery: 'telemedicine',
        },
    ];

    const pathways: CareerPath[] = [];
    
    for (const def of pathwayDefinitions) {
        try {
            const courses = await fetchUdemyCourses(def.searchQuery, 5);
            pathways.push({
                role: def.role,
                description: def.description,
                skills: def.skills,
                salaryRange: def.salaryRange,
                demand: def.demand,
                courses,
            });
        } catch (error) {
            console.error(`⚠️  Failed to fetch courses for ${def.role}, using empty array`);
            pathways.push({
                role: def.role,
                description: def.description,
                skills: def.skills,
                salaryRange: def.salaryRange,
                demand: def.demand,
                courses: [],
            });
        }
    }

    console.log(`✅ Healthcare pathways ready with ${pathways.reduce((sum, p) => sum + p.courses.length, 0)} total courses`);
    return pathways;
}

/**
 * Get career pathways for Agriculture sector
 */
export async function getAgricultureCareerPaths(): Promise<CareerPath[]> {
    console.log('🌾 Fetching Agriculture career pathways...');
    
    const pathwayDefinitions = [
        {
            role: 'Precision Agriculture Specialist',
            description: 'Use technology and data to optimize crop yields and farming practices',
            skills: ['GIS', 'IoT', 'Data Analytics', 'Agronomy', 'Drone Technology'],
            salaryRange: '$55,000 - $85,000',
            demand: 'High',
            searchQuery: 'agriculture',
        },
        {
            role: 'Agricultural Data Scientist',
            description: 'Apply data science to improve agricultural productivity and sustainability',
            skills: ['Machine Learning', 'Python', 'R', 'Agricultural Science', 'Statistics'],
            salaryRange: '$70,000 - $110,000',
            demand: 'Very High',
            searchQuery: 'farming',
        },
        {
            role: 'Smart Farming Consultant',
            description: 'Advise farms on implementing smart agriculture technologies',
            skills: ['IoT', 'Sensors', 'Farm Management', 'Consulting', 'Sustainability'],
            salaryRange: '$60,000 - $90,000',
            demand: 'High',
            searchQuery: 'agro',
        },
    ];

    const pathways: CareerPath[] = [];
    
    for (const def of pathwayDefinitions) {
        try {
            const courses = await fetchUdemyCourses(def.searchQuery, 5);
            pathways.push({
                role: def.role,
                description: def.description,
                skills: def.skills,
                salaryRange: def.salaryRange,
                demand: def.demand,
                courses,
            });
        } catch (error) {
            console.error(`⚠️  Failed to fetch courses for ${def.role}, using empty array`);
            pathways.push({
                role: def.role,
                description: def.description,
                skills: def.skills,
                salaryRange: def.salaryRange,
                demand: def.demand,
                courses: [],
            });
        }
    }

    console.log(`✅ Agriculture pathways ready with ${pathways.reduce((sum, p) => sum + p.courses.length, 0)} total courses`);
    return pathways;
}

/**
 * Get career pathways for Urban Technology sector
 */
export async function getUrbanCareerPaths(): Promise<CareerPath[]> {
    console.log('🏛️ Fetching Urban Technology career pathways...');
    
    const pathwayDefinitions = [
        {
            role: 'Smart City Planner',
            description: 'Design and implement smart city initiatives and infrastructure',
            skills: ['Urban Planning', 'IoT', 'Data Analytics', 'Sustainability', 'GIS'],
            salaryRange: '$65,000 - $100,000',
            demand: 'Very High',
            searchQuery: 'city',
        },
        {
            role: 'Urban IoT Engineer',
            description: 'Develop and maintain IoT systems for smart city applications',
            skills: ['IoT', 'Embedded Systems', 'Networking', 'Cloud Computing', 'Programming'],
            salaryRange: '$75,000 - $115,000',
            demand: 'High',
            searchQuery: 'urban',
        },
        {
            role: 'Sustainable Infrastructure Developer',
            description: 'Create sustainable and efficient urban infrastructure solutions',
            skills: ['Sustainability', 'Green Technology', 'Engineering', 'Project Management'],
            salaryRange: '$70,000 - $105,000',
            demand: 'High',
            searchQuery: 'infrastructure',
        },
    ];

    const pathways: CareerPath[] = [];
    
    for (const def of pathwayDefinitions) {
        try {
            const courses = await fetchUdemyCourses(def.searchQuery, 5);
            pathways.push({
                role: def.role,
                description: def.description,
                skills: def.skills,
                salaryRange: def.salaryRange,
                demand: def.demand,
                courses,
            });
        } catch (error) {
            console.error(`⚠️  Failed to fetch courses for ${def.role}, using empty array`);
            pathways.push({
                role: def.role,
                description: def.description,
                skills: def.skills,
                salaryRange: def.salaryRange,
                demand: def.demand,
                courses: [],
            });
        }
    }

    console.log(`✅ Urban Technology pathways ready with ${pathways.reduce((sum, p) => sum + p.courses.length, 0)} total courses`);
    return pathways;
}
