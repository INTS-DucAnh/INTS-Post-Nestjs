import { Injectable } from '@nestjs/common';
import { TIME_CONSTANT } from 'src/config/app.constant';

@Injectable()
export class TimeUtil {
  caltime(timeString: string): number {
    const [time, type] = timeString.split(' ');
    const parsedTime = parseInt(time);

    switch (type.toLocaleLowerCase()) {
      case TIME_CONSTANT.oneDay.unit:
        return (
          parsedTime *
          this.caltime(
            `${TIME_CONSTANT.oneDay.time} ${TIME_CONSTANT.oneDay.child}`,
          )
        );
      case TIME_CONSTANT.oneHour.unit:
        return (
          parsedTime *
          this.caltime(
            `${TIME_CONSTANT.oneHour.time} ${TIME_CONSTANT.oneHour.child}`,
          )
        );
      case TIME_CONSTANT.oneMinute.unit:
        return (
          parsedTime *
          this.caltime(
            `${TIME_CONSTANT.oneMinute.time} ${TIME_CONSTANT.oneMinute.child}`,
          )
        );
      case TIME_CONSTANT.oneSec.unit:
        return (
          parsedTime *
          this.caltime(
            `${TIME_CONSTANT.oneSec.time} ${TIME_CONSTANT.oneSec.child}`,
          )
        );
      default:
        return parsedTime;
    }
  }
}
