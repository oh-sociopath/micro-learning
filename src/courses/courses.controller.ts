import { Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AddLessonDto } from './dto/add-lesson.dto'; // Correct

@Controller('courses')
export class CoursesController {
    constructor(private coursesService: CoursesService) {}

    @Roles(Role.INSTRUCTOR)
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard('jwt'))
    @Post()
    createCourse(@Req() req: Request, @Body() body: CreateCourseDto) {
        if (!req.user) {
            throw new UnauthorizedException('User not authenticated');
        }
        console.log('req: ', req);
        console.log('dto: ', body);

        return this.coursesService.createCourse(req.user.userId, body);
    }
    @Roles(Role.INSTRUCTOR)
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard('jwt'))
    @Post(':id/lessons')
    addLesson(@Param('id') courseId: string, @Body() dto: AddLessonDto) {
        return this.coursesService.addLesson(+courseId, dto);
    }

    @Roles(Role.STUDENT)
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard('jwt'))
    @Post(':id/enroll')
    enroll(@Req() req: Request, @Param('id') courseId: string) {
        if (!req.user) {
            throw new UnauthorizedException('User not authenticated');
        }

        return this.coursesService.enrollStudent(req.user.userId, +courseId);
    }

    @Roles(Role.STUDENT)
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard('jwt'))
    @Get(':id/lessons')
    getLessons(@Req() req: Request, @Param('id') courseId: string) {
        if (!req.user) {
            throw new UnauthorizedException('User not authenticated');
        }

        return this.coursesService.getLessons(+courseId, req.user.userId);
    }
}
