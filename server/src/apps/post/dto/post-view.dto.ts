export type ViewPostDto = {
  id: number;
  title: string;
  content: string;
  createby?: number;
  updateby?: number;
  updateat: Date;
  createat: Date;
  deletedat: Date;
};
