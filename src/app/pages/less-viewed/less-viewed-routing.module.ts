import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessViewedPage } from './less-viewed.page';

const routes: Routes = [
  {
    path: '',
    component: LessViewedPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LessViewedPageRoutingModule {}

