import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthComponent } from './auth.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
    {
        path: '', // path: 'auth',
        component: AuthComponent,
    },
];

@NgModule({
    declarations: [AuthComponent],
    imports: [SharedModule, FormsModule, RouterModule.forChild(routes)],
})
export class AuthModule {}
