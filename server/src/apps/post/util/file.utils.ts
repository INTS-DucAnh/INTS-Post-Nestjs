import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUtils {
  static CalSizeFile(sizeFile: string) {
    const [size, type] = sizeFile.split(' ');
    const parsedSized = parseInt(size);

    switch (type) {
      case 'gb':
        return parsedSized * FileUtils.CalSizeFile('1024 mb');
      case 'mb':
        return parsedSized * FileUtils.CalSizeFile('1024 kb');
      case 'kb':
        return parsedSized * FileUtils.CalSizeFile('1024 b');
      default:
        return parsedSized;
    }
  }
}
