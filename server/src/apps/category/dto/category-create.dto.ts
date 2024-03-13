import { IsNotEmpty, IsString } from 'class-validator';

export type CreateCategoryDto = {
  title: string;
  updateby: number;
  createby: number;
  createat: Date;
  updateat: Date;
};
export class FormCreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}
