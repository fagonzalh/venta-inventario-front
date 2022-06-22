import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const urlImg = environment.urlImg;

@Pipe({
  name: 'img'
})
export class ImagePipe implements PipeTransform {

  transform(img: string, categoria: string): string {

    const ruta = `${urlImg}/producto/${img}`

    return ruta;
  }

}
