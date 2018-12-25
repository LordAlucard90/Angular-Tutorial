# Step 02 - Programmatic Navigation

## Router Navigate

Is is possible program a navigation after a computation:

```angular2html
<button class="btn btn-primary" (click)="onLoadServers()">Load Servers</button>
```

```typescript
import {Router} from '@angular/router';

@Component({...})
export class HomeComponent implements OnInit {
  ...

  onLoadServers() {
    // do something complex
    this.router.navigate(['/servers']);
  }
}
```



