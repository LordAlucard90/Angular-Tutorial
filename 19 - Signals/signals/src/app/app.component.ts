import { Component } from '@angular/core';

import { DefaultComponent } from './default/default.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [DefaultComponent]
})
export class AppComponent {}
