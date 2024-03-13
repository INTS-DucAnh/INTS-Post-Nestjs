export type PostImageDto = {
  id: number;
  poid: number;
  url: string;
  createat: Date;
  createby: number;
  updateat: Date;
  updateby: number;
  setdefault: false;
};

export type ImagesToS3 = {
  filename: string;
  image: Express.Multer.File;
};
