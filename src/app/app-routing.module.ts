import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarComponent } from './bar/bar.component';
import { DensityComponent } from './density/density.component';
import { PieComponent } from './pie/pie.component';
import { ScatterComponent } from './scatter/scatter.component';

const routes: Routes = [
  { path: 'bar-component', component: BarComponent },
  { path: 'scatter-component', component: ScatterComponent },
  { path: 'density-component', component: DensityComponent },
  { path: 'pie-component', component: PieComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
