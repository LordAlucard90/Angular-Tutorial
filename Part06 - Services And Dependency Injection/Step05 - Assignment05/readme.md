# Step 05 - Assignment 05

## Exercise

- Optimize this app by adding a UsersService which manages the active and inactive users.

- Also add a CounterService which counts the number of active->inactive and inactive->active actions.

---

## Solution

#### AppModule

```typescript
@NgModule({
  ...
  providers: [UsersService, CounterService],
  ...
})
```

#### UsersService

```typescript
@Injectable()
export class UsersService {
  activeUsers = ['Max', 'Anna'];
  inactiveUsers = ['Chris', 'Manu'];

  constructor(private counterService: CounterService) {}

  setUserToActive(id: number) {
    this.activeUsers.push(this.inactiveUsers[id]);
    this.inactiveUsers.splice(id, 1);
    this.counterService.incrementActivations();
  }

  setUserToInactive(id: number) {
    this.inactiveUsers.push(this.activeUsers[id]);
    this.activeUsers.splice(id, 1);
    this.counterService.incrementDeactivations();
  }
}
```

#### CounterService

```typescript
export class CounterService {
  activations: number = 0;
  deactivations: number = 0;

  incrementActivations(){
    this.activations++;
  }

  incrementDeactivations(){
    this.deactivations++;
  }
}
```

#### AppComponent

```typescript
export class AppComponent implements OnInit {
  activeUsers: string[];
  inactiveUsers: string[];

  constructor(private usersService: UsersService,
              private counterService: CounterService) {
  }

  ngOnInit(): void {
    this.activeUsers = this.usersService.activeUsers;
    this.inactiveUsers = this.usersService.inactiveUsers;
  }
}
```

```angular2html
<div class="container">
  <div class="row">
    <div class="col-xs-12 col-md-8 col-md-offset-2">
      <app-active-users></app-active-users>
      <app-inactive-users></app-inactive-users>
      <hr>
      <div class="col-sm-6 text-success">Activations: {{counterService.activations}}</div>
      <div class="col-sm-6 text-danger">Deactivations: {{counterService.deactivations}}</div>
    </div>
  </div>
</div>
```

#### ActiveUsersComponent

```typescript
export class ActiveUsersComponent implements OnInit{
  users: string[];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.users = this.usersService.activeUsers;
  }

  onSetToInactive(id: number) {
    this.usersService.setUserToInactive(id);
  }
}
```

#### InactiveUsersComponent

```typescript
export class InactiveUsersComponent implements OnInit{
  users: string[];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.users = this.usersService.inactiveUsers;
  }

  onSetToActive(id: number) {
    this.usersService.setUserToActive(id);
  }
}
```
