import { Injectable } from '@nestjs/common';
import { FILE_CONSTANT } from 'src/config/app.constant';

@Injectable()
export class FileUtils {
  static CalSizeFile(sizeFile: string) {
    const [size, type] = sizeFile.split(' ');
    const parsedSized = parseInt(size);

    switch (type) {
      case FILE_CONSTANT.oneGigabyte.unit:
        return (
          parsedSized *
          FileUtils.CalSizeFile(
            `${FILE_CONSTANT.oneGigabyte.size} ${FILE_CONSTANT.oneGigabyte.child}`,
          )
        );
      case FILE_CONSTANT.oneMegabyte.unit:
        return (
          parsedSized *
          FileUtils.CalSizeFile(
            `${FILE_CONSTANT.oneMegabyte.size} ${FILE_CONSTANT.oneMegabyte.child}`,
          )
        );
      case FILE_CONSTANT.onKilobyte.unit:
        return (
          parsedSized *
          FileUtils.CalSizeFile(
            `${FILE_CONSTANT.onKilobyte.size} ${FILE_CONSTANT.onKilobyte.child}`,
          )
        );
      default:
        return parsedSized;
    }
  }
}
