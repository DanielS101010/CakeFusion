import { Routes } from '@angular/router';
import { AddDoughComponent } from './add-dough/add-dough.component';
import { AddFillingComponent } from './add-filling/add-filling.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { ShowRecipeComponent } from './show-recipe/show-recipe.component';
import { AddToppingComponent } from './add-topping/add-topping.component';
import { CakeComponent } from './add-cake/add-cake.component'; 
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';

export const routes: Routes = [
    {path: '', component: MainpageComponent},
    {path: 'Teig', component: AddDoughComponent}, 
    {path: 'Füllung', component: AddFillingComponent},
    {path: 'Topping', component: AddToppingComponent},
    {path: 'Kuchen', component: CakeComponent},
    {path: 'Rezept/:id/:component', component: ShowRecipeComponent},
    {path: 'edit/:id/:component', component: EditRecipeComponent},
];
