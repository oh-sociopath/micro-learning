import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddLessonDto } from './dto/add-lesson.dto';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) {}

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
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            include: { enrollments: true, instructor: true },
        });

        const isEnrolled = course?.enrollments.some((enrolment) => enrolment.studentId === userId);
        const isInstructor = course?.instructor.id === userId;

        if (!isEnrolled && !isInstructor) {
            throw new UnauthorizedException('Not enrolled or instructor');
        }

        return this.prisma.lesson.findMany({
            where: { courseId },
        });
    }
}
