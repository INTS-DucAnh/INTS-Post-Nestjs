import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class FormPostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsUrl()
  thumbnail: string;

  @IsNotEmpty({ message: 'Atleast 1 category should be provided!' })
  @IsArray()
  categories?: number[];
}

export type CreatePostDto = {
  title: string;
  content: string;
  updateat: Date;
  updateby?: number;
  createby?: number;
  createat: Date;
};
