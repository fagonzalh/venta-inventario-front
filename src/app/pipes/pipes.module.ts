import { NgModule } from '@angular/core';
import { ImagePipe } from './img.pipe';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';
import { ThousandsPipe } from './thousand.pipe';

@NgModule({
  declarations: [
    ImagePipe,
    DomSanitizerPipe,
    ThousandsPipe
  ],
  exports: [
    ImagePipe,
    DomSanitizerPipe,
    ThousandsPipe
  ]
})
export class PipesModule { }
