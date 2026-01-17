import { ExternalLink, Star, Users, Clock } from "lucide-react";
import Link from "next/link";
import Image, { type ImageLoaderProps } from "next/image";

const passthroughImageLoader = ({ src }: ImageLoaderProps) => src;

interface UdemyCourse {
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

interface CourseCardProps {
    course: UdemyCourse;
}

export default function CourseCard({ course }: CourseCardProps) {
    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all">
            {/* Course Image */}
            <div className="relative h-32 bg-muted">
                {course.image && (
                    <Image
                        loader={passthroughImageLoader}
                        unoptimized
                        src={course.image}
                        alt={course.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover"
                    />
                )}
                {course.price === "Free" && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                        FREE
                    </span>
                )}
            </div>

            {/* Course Details */}
            <div className="p-4 space-y-2">
                <h4 className="font-semibold text-sm line-clamp-2 hover:text-primary">
                    <Link href={course.url} target="_blank" rel="noopener noreferrer">
                        {course.title}
                    </Link>
                </h4>

                <p className="text-xs text-muted-foreground">{course.instructor}</p>

                {/* Rating & Stats */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">{course.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{course.students.toLocaleString()}</span>
                    </div>
                    {course.duration && (
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{course.duration}</span>
                        </div>
                    )}
                </div>

                {/* Level Badge */}
                <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-muted rounded">
                        {course.level}
                    </span>
                    <Link
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                        View Course
                        <ExternalLink className="h-3 w-3" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
