import { Body, Controller, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { QaService } from './qa.service';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { AskQuestionDto } from './dto/ask-question.dto';
import {Request} from 'express';
import { AnswerQuestionDto } from './dto/answer-question.dto';

@Controller('qa')
export class QaController {
    constructor(private qaService: QaService) {}

    @Roles(Role.STUDENT)
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard('jwt'))
    @Post('lessons/:id/questions')
    askQuestion(
        @Req() req: Request,
        @Param('id') lessonId: string,
        @Body() body: AskQuestionDto,
    ) {
        if (!req.user) {
            throw new UnauthorizedException('User not authenticated');
        }

        return this.qaService.askQuestion(req.user.userId, +lessonId, body.text);
    }

    @Roles(Role.STUDENT)
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard('jwt'))
    @Post('questions/:id/answer')
    answerQuestion(
        @Req() req: Request,
        @Param('id') questionId: string,
        @Body() body: AnswerQuestionDto,
    ) {
        if (!req.user) {
            throw new UnauthorizedException('User not authenticated');
        }

        return this.qaService.answerQuestion(req.user.userId, +questionId, body.text);
    }
}
