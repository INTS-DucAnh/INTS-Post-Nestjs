export type UpdatePostDto = {
  id: number;
  title?: string;
  content?: string;
  updateby: number;
  updateat?: Date;
  deleted?: boolean;
};
export type UpdateFormPostDto = {
  id: number;
  title?: string;
  content?: string;
  updateby: number;
  updateat?: Date;
  deleted?: boolean;
  images?: number[];
  categories?: number[];
};
