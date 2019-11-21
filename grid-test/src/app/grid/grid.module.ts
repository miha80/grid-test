import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container/container.component';
import { GridRoutingModule } from './grid-routing.module';
import { ResponsiveGridComponent } from './responsive-grid/responsive-grid.component';



@NgModule({
  declarations: [
    ContainerComponent,
    ResponsiveGridComponent,
  ],
  entryComponents: [
    ContainerComponent,
  ],
  imports: [
    CommonModule,
    GridRoutingModule,
  ]
})
export class GridModule { }
