import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class FormPostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsNotEmpty({ message: 'Atleast 1 image should be provided!' })
  @IsArray()
  images: string[];

  @IsNotEmpty({ message: 'Atleast 1 category should be provided!' })
  @IsArray()
  categories: number[];
}

export type CreatePostDto = {
  title: string;
  content: string;
  updateat: Date;
  updateby?: number;
  createby?: number;
  createat: Date;
};

export class PostImageUploadDto {
  @IsNotEmpty()
  @IsBoolean()
  setdefault: boolean;

  @IsNotEmpty()
  image: Express.Multer.File;
}
