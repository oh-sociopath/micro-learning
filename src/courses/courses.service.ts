import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddLessonDto } from './dto/add-lesson.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CoursesService {
    constructor(
        private prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cache: Cache,
    ) {}

    async createCourse(instructorId: number, dto: CreateCourseDto) {
        return this.prisma.course.create({
            data: {
                ...dto,
                instructorId,
            },
        });
    }

    async addLesson(courseId: number, dto: AddLessonDto) {
        return this.prisma.lesson.create({
            data: {
                ...dto,
                courseId,
            },
        });
    }

    async enrollStudent(studentId: number, courseId: number) {
        return this.prisma.enrollment.create({
            data: { studentId, courseId },
        });
    }

    async getLessons(courseId: number, userId: number) {
        const cacheKey = `course_${courseId}_lessons`;
        const cached = await this.cache.get(cacheKey);

        if (cached) {
            console.log('returned data from cache');
            return cached;
        }

        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            include: { enrollments: true, instructor: true },
        });

        const isEnrolled = course?.enrollments.some((enrolment) => enrolment.studentId === userId);
        const isInstructor = course?.instructor.id === userId;

        if (!isEnrolled && !isInstructor) {
            throw new UnauthorizedException('Not enrolled or instructor');
        }
        const lessons = await this.prisma.lesson.findMany({
            where: { courseId },
        });

        await this.cache.set(cacheKey, lessons, 60000);
        return lessons
    }
}
