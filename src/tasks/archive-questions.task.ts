import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArchiveQuestionsTask {

    constructor(private prisma: PrismaService) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        const date = new Date();
        date.setDate(date.getDate() - 30);

        const unansweredQuestions = await this.prisma.question.findMany({
            where: { answer: null, createdAt: { lte: date } },
        });

        if (unansweredQuestions.length > 0) {
            await this.prisma.$transaction([
                this.prisma.archivedQuestion.createMany({
                    data: unansweredQuestions.map((unansweredQuestion) => ({
                        text: unansweredQuestion.text,
                        studentId: unansweredQuestion.studentId,
                        lessonId: unansweredQuestion.lessonId,
                        createdAt: unansweredQuestion.createdAt,
                    })),
                }),

                this.prisma.question.deleteMany({
                    where: { id: { in: unansweredQuestions.map((unansweredQuestion) => unansweredQuestion.id) } },
                }),
            ]);

            console.log(`Archived ${unansweredQuestions.length} questions.`);
        }
    }
}
