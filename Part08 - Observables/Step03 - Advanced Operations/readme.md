# Step03 - Advanced Operations

## Passing Data With Subject

a **Subject** is and an Observable and an Observer at the same time:

```typescript
export class UserComponent implements OnInit {
  id: number;

  constructor(private route: ActivatedRoute,
              private userService: UserService) { }

  ngOnInit() {...}

  onActivate() {
    this.userService.userActivated.next(this.id);
  }
}
```

```typescript
export class AppComponent implements OnInit{
  user1Activated = false;
  user2Activated = false;

  constructor(private userService: UserService){}

  ngOnInit(): void {
    this.userService.userActivated.subscribe(
      (id: number) => {
        if (id === 1){
          this.user1Activated = true;
        } else {
          this.user2Activated = true;
        }
      }
    );
  }
}
```

It can be used to easily implement cross-component communication.

---

## Operators

An **Operator** allows to transform the data received from the observable remaining in the observable, it can be used on any Observable

#### Map

Map remaps the input into something else:

```typescript
const myNumbers = interval(1000).pipe(
  map((data: number) => {
    return data * 2;
  })
);
```

---

## Documentation

On [ReactiveX](http://reactivex.io/) web site it is possible find more documentation about the api.

