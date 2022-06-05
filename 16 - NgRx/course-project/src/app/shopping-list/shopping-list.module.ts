import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LoggingService } from '../logging.service';

const routes: Routes = [
    {
        path: '', // path: 'shopping-list',
        component: ShoppingListComponent,
    },
];

@NgModule({
    declarations: [ShoppingListComponent, ShoppingEditComponent],
    imports: [FormsModule, RouterModule.forChild(routes), SharedModule],
    // providers: [LoggingService],
})
export class ShoppingListModule {}
