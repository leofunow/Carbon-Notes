import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './components/index/index.component';


const routes: Routes = [
  {
    path: '', component: IndexComponent
  },
  {
    path: ':id', component: IndexComponent
  },
  {
    path: '**', redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
