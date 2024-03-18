import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsUrl()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsNotEmpty()
  @IsArray()
  categories: number[];
}
export type UpdateFormPostDto = {
  id: number;
  title?: string;
  content?: string;
  updateby: number;
  updateat?: Date;
  deleted?: boolean;
  images?: string[];
  categories?: number[];
};
