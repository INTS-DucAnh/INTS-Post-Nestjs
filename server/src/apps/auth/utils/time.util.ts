import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeUtil {
  caltime(timeString: string): number {
    const [time, type] = timeString.split(' ');
    const parsedTime = parseInt(time);

    switch (type.toLocaleLowerCase()) {
      case 'd':
        return parsedTime * this.caltime(`24 h`);
      case 'h':
        return parsedTime * this.caltime(`60 m`);
      case 'm':
        return parsedTime * this.caltime(`60 s`);
      case 's':
        return parsedTime * this.caltime(`1000 ms`);
      default:
        return parsedTime;
    }
  }
}
