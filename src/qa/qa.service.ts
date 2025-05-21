import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QaService {
    constructor(private prisma: PrismaService) {}

    async askQuestion(studentId: number, lessonId: number, text: string) {
        return this.prisma.question.create({
            data: { text, studentId, lessonId },
        });
    }

    async answerQuestion(instructorId: number, questionId: number, text: string) {
        return this.prisma.answer.create({
            data: { text, instructorId, questionId },
        });
    }
}
