import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GridModule } from './grid/grid.module';

const routes: Routes = [
  { path: '', redirectTo: '/grid', pathMatch: 'full' },
  {
    path: 'grid',
    // loadChildren: 'src/app/grid/grid.module#GridModule',
    loadChildren: () => import('./grid/grid.module').then(m => m.GridModule),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
