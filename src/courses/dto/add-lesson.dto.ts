import { IsString, IsNotEmpty } from 'class-validator';

export class AddLessonDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}
