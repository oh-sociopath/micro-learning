import { IsString, IsNotEmpty } from 'class-validator';

export class AskQuestionDto {
    @IsString()
    @IsNotEmpty()
    text: string;
}
