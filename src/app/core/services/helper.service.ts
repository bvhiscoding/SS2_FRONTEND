import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotiService } from './noti.service';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(private notiService: NotiService) {}

  /**
   *
   * @param params là đối tượng truyền lên có key value làm query string
   */

  public generateQueryString(params: any) {
    return new HttpParams({ fromObject: { ...this.deleteNullParam(params) } });
  }

  private deleteNullParam(params: any) {
    let formValue = params;
    Object.keys(params).forEach((key: string) => {
      if (params[key] == null || params[key] == undefined) {
        delete params[key];
      }
    });
    return formValue;
  }

  /**
   *
   * @param key là field trong đối tượng auth trả về thông tin người dùng. Key nay dùng bằng enum được config trong common enum
   * @returns
   */

  /**
   *
   * @param linkYoutube link youtube gốc khi copy từ máy tính or sao chép bằng điện thoại
   * @returns
   */

  public getEmbeddedLink(
    linkYoutube: string | any,
    hideWarning: boolean = false
  ) {
    let videoId;
    try {
      if (linkYoutube) {
        if (linkYoutube.includes('youtu.be')) {
          videoId = linkYoutube.split('be/').pop();
        } else {
          videoId = linkYoutube.split('v=')[1].split('&')[0];
        }
      }
    } catch (error) {
      if (!hideWarning) {
        this.notiService.warning('Nên nhập đường dẫn Video từ Youtube');
      }
    }

    return `https://www.youtube.com/embed/${videoId}`;
  }

  public decimalToFraction(decimal: number | string) {
    var tolerance = 1.0e-6;
    var h1 = 1;
    var h2 = 0;
    var k1 = 0;
    var k2 = 1;
    var a = Number(decimal);
    var i, x, y;

    do {
      i = Math.floor(a);
      x = a - i;
      y = h1;
      h1 = i * h1 + h2;
      h2 = y;
      y = k1;
      k1 = i * k1 + k2;
      k2 = y;
      a = 1 / x;
    } while (Math.abs(Number(decimal) - h1 / k1) > Number(decimal) * tolerance);
    return h1 + '/' + k1;
  }

  public developNotification() {
    this.notiService.warning('Tính năng đang được phát triển !');
  }
}
