import { FILE_CONSTANT } from "./default.constant";

export const CalSizeFile = (sizeFile) => {
  const [size, type] = sizeFile.split(" ");
  const parsedSized = parseInt(size);

  switch (type) {
    case FILE_CONSTANT.oneGigabyte.unit:
      return (
        parsedSized *
        CalSizeFile(
          `${FILE_CONSTANT.oneGigabyte.size} ${FILE_CONSTANT.oneGigabyte.child}`
        )
      );
    case FILE_CONSTANT.oneMegabyte.unit:
      return (
        parsedSized *
        CalSizeFile(
          `${FILE_CONSTANT.oneMegabyte.size} ${FILE_CONSTANT.oneMegabyte.child}`
        )
      );
    case FILE_CONSTANT.onKilobyte.unit:
      return (
        parsedSized *
        CalSizeFile(
          `${FILE_CONSTANT.onKilobyte.size} ${FILE_CONSTANT.onKilobyte.child}`
        )
      );
    default:
      return parsedSized;
  }
};

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64DataURL = reader.result;
      resolve(base64DataURL);
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export const ImageUploadHandler = (file) => {};
