import { IsString, IsNotEmpty } from 'class-validator';

export class AnswerQuestionDto {
    @IsString()
    @IsNotEmpty()
    text: string;
}
