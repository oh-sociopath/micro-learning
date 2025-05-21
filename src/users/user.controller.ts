import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles/roles.guard';

@Controller('users')
export class UserController {

    @Roles(Role.INSTRUCTOR, Role.STUDENT)
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe() {
        return 'user info';
    }
}
