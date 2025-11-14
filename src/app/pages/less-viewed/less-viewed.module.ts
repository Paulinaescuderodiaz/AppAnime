import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { LessViewedPage } from './less-viewed.page';
import { LessViewedPageRoutingModule } from './less-viewed-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessViewedPageRoutingModule
  ],
  declarations: [LessViewedPage]
})
export class LessViewedPageModule {}

