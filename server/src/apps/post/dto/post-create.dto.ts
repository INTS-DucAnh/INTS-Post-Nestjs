export type FormPostDto = {
  title: string;
  content: string;
  updateat: Date;
  updateby?: number;
  createby?: number;
  deleted: boolean;
};

export type CreatePostDto = {
  title: string;
  content: string;
  updateat: Date;
  updateby?: number;
  createby?: number;
  deleted: boolean;
};
