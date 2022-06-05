# NgRx

## Content

- [Intro](#intro)
- [First Integration](#first-integration)
- [Version Update](#version-update)
- [Auth Store](#auth-store)
- [Effects](#effects)
- [Router Store](#router-store)
- [Recipes Store](#recipes-store)

---

## Intro

NgRx implements the Redux pattern.

The idea is to have a global store that is accessed by the services and component
and can be updated by an action that triggers a reducer that depending on 
the action create a coy of the new state that must be updated in the store.

### Installation

The store dependency is:
```bash
npm i @ngrx/store
```

### Redux Devtools

It is possible to install a chrome / firefox browser extension 
[redux-devtools](https://github.com/reduxjs/redux-devtools)
that in combination with the dev dependency
```bash
npm i --save-dev @ngrx/store-devtools
```
and a configuration in the app module:
```typescript
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';

@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        // on prod only logs
        StoreDevtoolsModule.instrument({logOnly: environment.production}),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```
Allows to see the store and its changes in the redux tab of the browser
development tools.


## First Integration

### Action

The action defines the possible state changes:
```typescript
// good practice
export const ADD_INGREDIENT = 'ADD_INGREDIENT';

export class AddIngredient implements Action {
    // type cannot be changed
    readonly type: string = ADD_INGREDIENT;
    // payload is not mandatory, also another name can be used
    constructor(public payload?: Ingredient) { }
}
```

### Reduces

the reducer manages the state updates:
```typescript
interface ShoppingListState {
    ingredients: Ingredient[];
}

const initialState: ShoppingListState = {
    ingredients: [new Ingredient('First', 3), new Ingredient('Second', 5)],
};

export function shoppingListReducer(
    state = initialState,
    action: ShoppingListActions.AddIngredient,
) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            if (action.payload) {
                // always a new state must be generated
                return {
                    ...state,
                    ingredients: [...state.ingredients, action.payload],
                };
            }
            return state;
        // default behaviour for initialization
        default:
            return state;
    }
}
```

### Store

In the app module is generate a store section only for the shopping list
```typescript
@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        StoreModule.forRoot({
            shoppingList: shoppingListReducer,
        }),
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
```

### Getting The State

The component uses the store to retrieve the current status
```typescript
@Component({
    // ...
})
export class ShoppingListComponent implements OnInit, OnDestroy {
    // ingredients: Ingredient[] = [];
    // definition update
    ingredients: Observable<ShoppingListState>;

    constructor(
        private shoppingListService: ShoppingListService,
        private loggingService: LoggingService,
        private store: Store<{ shoppingList: ShoppingListState }>,
    ) { 
        this.ingredients = this.store.select('shoppingList');
        // also subscribe is ok, remember to unsubscribe
        // this.store.select('shoppingList').subscribe();
    }
    
    ngOnInit(): void {
        // not necessary anymore
        // this.ingredients = this.shoppingListService.getIngredients();
        // this.shoppingListSubscription = this.shoppingListService.ingredientsChanged.subscribe(
        //     (ingredients: Ingredient[]) => {
        //         this.ingredients = ingredients;
        //     },
        // );
        this.loggingService.printLog('Hello from ShoppingListComponent.');
    }

    // ...

    ngOnDestroy(): void {
        // not necessary anymore
        // if (this.shoppingListSubscription) {
        //     this.shoppingListSubscription.unsubscribe();
        // }
    }
}
```
it is then needed to update the template:
```angular2html
<!-- shopping-list.component.html -->
<!-- ... -->
    <!-- old implementation non working anymore -->
    <!-- *ngFor="let ingredient of ingredients; let i = index" (click)="onEditItem(i)"> -->
    <!-- async automatically manages subscription in a clear way -->
    *ngFor="let ingredient of (ingredients | async)?.ingredients; let i = index" (click)="onEditItem(i)">
<!-- ... -->
```

### Dispatch Actions

Actions can be dispatched in this way:
```typescript
@Component({
    // ...
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    // ...

    constructor(
        private shoppingListService: ShoppingListService,
        private store: Store<{ shoppingList: ShoppingListState }>,
    ) {
        // ...
    }

    ngOnInit(): void { }

    onSubmit(form: NgForm) {
        // ...
        if (this.editMode && this.editedItemIndex !== undefined) {
            // ...
        } else {
            // this.shoppingListService.addIngredient(ingredient);
            // new add ingredient uses dispatch
            this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient))
        }
        // ..
    }

    // ..
}
```

## Actions Management

It is possible to add a type to tell the reducer all the possible actions' types:
```typescript
export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';

export class AddIngredient implements Action {
    // type cannot be changed
    readonly type: string = ADD_INGREDIENT;
    // payload is not mandatory, also another name can be used
    constructor(public payload?: Ingredient) { }
}

export class AddIngredients implements Action {
    readonly type: string = ADD_INGREDIENTS;
    constructor(public payload?: Ingredient[]) { }
}

export class UpdateIngredient implements Action {
    readonly type: string = UPDATE_INGREDIENT;
    constructor(public payload?: { index: number; ingredient: Ingredient }) { }
}

export class DeleteIngredient implements Action {
    readonly type: string = DELETE_INGREDIENT;
    constructor(public payload?: number) { }
}

export type ShoppingListActions =
    | AddIngredient
    | AddIngredients
    | UpdateIngredient
    | DeleteIngredient;
```
the reducer must be updated accordently:
```typescript
import * as ShoppingListActions from './shopping-list.actions';

export interface ShoppingListState {
    ingredients: Ingredient[];
}

const initialState: ShoppingListState = {
    ingredients: [new Ingredient('First', 3), new Ingredient('Second', 5)],
};

export function shoppingListReducer(
    state = initialState,
    action: ShoppingListActions.ShoppingListActions,
) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            if (action instanceof ShoppingListActions.AddIngredient && action.payload) {
                return {
                    ...state,
                    ingredients: [...state.ingredients, action.payload],
                };
            }
            return state;
        case ShoppingListActions.ADD_INGREDIENTS:
            if (action instanceof ShoppingListActions.AddIngredients && action.payload) {
                return {
                    ...state,
                    ingredients: [...state.ingredients, ...action.payload],
                };
            }
            return state;
        case ShoppingListActions.UPDATE_INGREDIENT:
            if (action instanceof ShoppingListActions.UpdateIngredient && action.payload) {
                const ingredient = state.ingredients[action.payload.index];
                const updatedIngredient = {
                    ...ingredient,
                    ...action.payload.ingredient,
                };
                const updatedIngredients = {
                    ...state.ingredients,
                };
                updatedIngredients[action.payload.index] = updatedIngredient;
                return {
                    ...state,
                    ingredients: updatedIngredients,
                };
            }
            return state;
        case ShoppingListActions.DELETE_INGREDIENT:
            if (action instanceof ShoppingListActions.DeleteIngredient && action.payload) {
                return {
                    ...state,
                    ingredients: state.ingredients.filter((ingredient, index) => {
                        return index !== action.payload;
                    }),
                };
            }
            return state;
        default:
            return state;
    }
}
```
in the end the component and the service becomes:
```typescript
@Component({
    // ...
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    // ...

    // ...

    onSubmit(form: NgForm) {
        // ...
        if (this.editMode && this.editedItemIndex !== undefined) {
            // old
            // this.shoppingListService.updateIngredient(this.editedItemIndex, ingredient);
            this.store.dispatch(new ShoppingListActions.UpdateIngredient({
                index: this.editedItemIndex,
                ingredient: ingredient
            }))
        } else {
            // old
            // this.shoppingListService.addIngredient(ingredient);
            this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient))
        }
        // ...
    }

    // ...

    onDelete() {
        if (this.editedItemIndex !== undefined) {
            // old
            // this.shoppingListService.deleteIngredient(this.editedItemIndex);
            this.store.dispatch(new ShoppingListActions.DeleteIngredient(this.editedItemIndex))
        }
        // ...
    }

    // ...
}
```
```typescript
@Injectable()
export class RecipeService {
    // ...

    constructor(
        private shoppingListService: ShoppingListService,
        private store: Store<{ shoppingList: ShoppingListState }>,
    ) { }

    // ...

    addIngredientToShoppingList(ingredients: Ingredient[]) {
        // this.shoppingListService.addIngredients(ingredients);
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    }

    // ...
}
```

## Expand State

To the store can be add the current element under edit and the element itself,
this simplifies the actions and the reducer:
```typescript
export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
export const START_EDIT = 'START_EDIT';
export const STOP_EDIT = 'STOP_EDIT';

export class AddIngredient implements Action {
    // type cannot be changed
    readonly type: string = ADD_INGREDIENT;
    // payload is not mandatory, also another name can be used
    constructor(public payload?: Ingredient) { }
}

export class AddIngredients implements Action {
    readonly type: string = ADD_INGREDIENTS;
    constructor(public payload?: Ingredient[]) { }
}

export class UpdateIngredient implements Action {
    readonly type: string = UPDATE_INGREDIENT;
    // constructor(public payload?: { index: number; ingredient: Ingredient }) { }
    constructor(public payload?: Ingredient) { }
}

export class DeleteIngredient implements Action {
    readonly type: string = DELETE_INGREDIENT;
    // constructor(public payload?: number) { }
    constructor() { }
}

export class StartEdit implements Action {
    readonly type: string = START_EDIT;
    constructor(public payload?: number) { }
}

export class StopEdit implements Action {
    readonly type: string = STOP_EDIT;
}

export type ShoppingListActions =
    | AddIngredient
    | AddIngredients
    | UpdateIngredient
    | DeleteIngredient
    | StartEdit
    | StopEdit;
```
```typescript
export interface State {
    ingredients: Ingredient[];
    editedIngredient?: Ingredient;
    editedIngredientIndex?: number;
}

export interface AppState {
    shoppingList: State;
}

const initialState: State = {
    ingredients: [new Ingredient('First', 3), new Ingredient('Second', 5)],
};

export function shoppingListReducer(
    state: State = initialState,
    action: ShoppingListActions.ShoppingListActions,
) {
    console.log(action);
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            if (action instanceof ShoppingListActions.AddIngredient && action.payload) {
                return {
                    ...state,
                    ingredients: [...state.ingredients, action.payload],
                };
            }
            return state;
        case ShoppingListActions.ADD_INGREDIENTS:
            if (action instanceof ShoppingListActions.AddIngredients && action.payload) {
                return {
                    ...state,
                    ingredients: [...state.ingredients, ...action.payload],
                };
            }
            return state;
        case ShoppingListActions.UPDATE_INGREDIENT:
            if (
                action instanceof ShoppingListActions.UpdateIngredient &&
                action.payload &&
                state.editedIngredientIndex !== undefined
            ) {
                const ingredient = state.ingredients[state.editedIngredientIndex];
                const updatedIngredient = {
                    ...ingredient,
                    ...action.payload,
                };
                const updatedIngredients = [...state.ingredients];
                updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
                console.log({
                    ...state,
                    ingredients: updatedIngredients,
                    editedIngredientIndex: undefined,
                    editedIngredient: undefined,
                });
                return {
                    ...state,
                    ingredients: updatedIngredients,
                    editedIngredientIndex: undefined,
                    editedIngredient: undefined,
                };
            }
            return state;
        case ShoppingListActions.DELETE_INGREDIENT:
            if (
                action instanceof ShoppingListActions.DeleteIngredient &&
                state.editedIngredientIndex !== undefined
            ) {
                return {
                    ...state,
                    ingredients: state.ingredients.filter((ingredient, index) => {
                        return index !== state.editedIngredientIndex;
                    }),
                    editedIngredientIndex: undefined,
                    editedIngredient: undefined,
                };
            }
            return state;
        case ShoppingListActions.START_EDIT:
            if (action instanceof ShoppingListActions.StartEdit && action.payload !== undefined) {
                return {
                    ...state,
                    editedIngredientIndex: action.payload,
                    editedIngredient: { ...state.ingredients[action.payload] },
                };
            }
            return state;
        case ShoppingListActions.STOP_EDIT:
            if (action instanceof ShoppingListActions.StopEdit) {
                return {
                    ...state,
                    editedIngredientIndex: undefined,
                    editedIngredient: undefined,
                };
            }
            return state;
        default:
            return state;
    }
}
```
then comopnenets and services becomes:
```typescript
@Injectable() 
export class RecipeService {
    // ...

    constructor(
        // private shoppingListService: ShoppingListService,
        private store: Store<fromShoppingList.AppState>,
    ) { }

    // ...

    addIngredientToShoppingList(ingredients: Ingredient[]) {
        // this.shoppingListService.addIngredients(ingredients);
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    }

    // ...
}
```
```typescript
import * as fromShoppingList from '../store/shopping-list.reducer';
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
    // ...
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    // ...
    private shoppingListSubscription: Subscription;
    public editMode: boolean = false;
    // private editedItemIndex: number | undefined;
    <!-- private editedItem: Ingredient | undefined; -->

    constructor(
        // private shoppingListService: ShoppingListService,
        private store: Store<fromShoppingList.AppState>,
    ) {
        this.shoppingListSubscription = this.store.select('shoppingList').subscribe(stateData => {
            if (stateData.editedIngredientIndex !== undefined && stateData.editedIngredient) {
                this.editMode = true;
                if (this.shoppingListForm) {
                    this.shoppingListForm.setValue({
                        name: stateData.editedIngredient.name,
                        amount: stateData.editedIngredient.amount,
                    });
                }
            } else {
                this.editMode = false;
            }
        });
        // this.startedEditingSubscription = shoppingListService.startedEditing.subscribe(
        //     (index: number) => {
        //         this.editedItemIndex = index;
        //         this.editedItem = shoppingListService.getIngredient(index);
        //         this.editMode = true;
        //         if (this.shoppingListForm) {
        //             this.shoppingListForm.setValue({
        //                 name: this.editedItem.name,
        //                 amount: this.editedItem.amount,
        //             });
        //         }
        //     },
        // );
    }

    ngOnInit(): void { }

    onSubmit(form: NgForm) {
        // ...
        // changed
        // if (this.editMode && this.editedItemIndex !== undefined) {
        if (this.editMode) {
            this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient));
        } else {
            // changed
            // this.store.dispatch(new ShoppingListActions.UpdateIngredient({
            //     index: this.editedItemIndex,
            //     ingredient: ingredient
            // }))
            this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
        }
        // ...
    }

    // ...

    onDelete() {
        // not necessary
        // if (this.editedItemIndex !== undefined) {
        // this.shoppingListService.deleteIngredient(this.editedItemIndex);
        // this.store.dispatch(new ShoppingListActions.DeleteIngredient(this.editedItemIndex));
        // }
        this.store.dispatch(new ShoppingListActions.DeleteIngredient());
        this.onClear();
    }

    ngOnDestroy(): void {
        // not necessary
        // this.startedEditingSubscription.unsubscribe();
        this.shoppingListSubscription.unsubscribe();
        this.store.dispatch(new ShoppingListActions.StopEdit());
    }
}
```
```typescript
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
    // ...
})
export class ShoppingListComponent implements OnInit, OnDestroy {
    // ...

    constructor(
        // private shoppingListService: ShoppingListService,
        private loggingService: LoggingService,
        private store: Store<fromShoppingList.AppState>,
    ) {
        this.ingredients = this.store.select('shoppingList');
    }

    // ...

    onEditItem(index: number) {
        // changed
        // this.shoppingListService.startedEditing.next(index);
        this.store.dispatch(new ShoppingListActions.StartEdit(index));
    }

    // ...
}
```

## Version Update

In the course is used the version 7, at the moment the current version si the 12
from the [official documentation](https://v12.ngrx.io/guide/store)
i updated the reduc patter in this way:

### Actions
```typescript
export const addIngredient = createAction(
    '[Shopping List] Add Ingredient',
    props<{ingredient: Ingredient}>()
);
export const addIngredients = createAction(
    '[Shopping List] Add Ingredients',
    props<{ingredients: Ingredient[]}>()
);
export const updateIngredient = createAction(
    '[Shopping List] Update Ingredient',
    props<{ingredient: Ingredient}>()
);
export const deleteIngredient = createAction(
    '[Shopping List] Delete Ingredient'
);
export const startEdit = createAction(
    '[Shopping List] Start Edit',
    props<{index: number}>()
);
export const stopEdit = createAction(
    '[Shopping List] Stop Edit',
    props<{index: number}>()
);
```

### Reducer And Selectors
```typescript
export interface State {
    ingredients: Ingredient[];
    editedIngredient?: Ingredient;
    editedIngredientIndex?: number;
}

export interface AppState {
    shoppingList: State;
}

const initialState: State = {
    ingredients: [new Ingredient('First', 3), new Ingredient('Second', 5)],
};

export const selectShoppingList = (state: AppState) => state.shoppingList;

export const selectShoppingListIngredients = createSelector(
    selectShoppingList,
    (state: State) => state.ingredients,
);


export const shoppingListReducer = createReducer(
    initialState,
    on(ShoppingListActions.addIngredient, (state, { ingredient }) => {
        return {
            ...state,
            ingredients: [...state.ingredients, ingredient],
        };
    }),
    on(ShoppingListActions.addIngredients, (state, { ingredients }) => {
        return {
            ...state,
            ingredients: [...state.ingredients, ...ingredients],
        };
    }),
    on(ShoppingListActions.updateIngredient, (state, { ingredient }) => {
        if (!state.editedIngredientIndex) {
            return state;
        }
        const oldIngredient = state.ingredients[state.editedIngredientIndex];
        const updatedIngredient = {
            ...oldIngredient,
            ...ingredient,
        };
        const updatedIngredients = [...state.ingredients];
        updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
        console.log({
            ...state,
            ingredients: updatedIngredients,
            editedIngredientIndex: undefined,
            editedIngredient: undefined,
        });
        return {
            ...state,
            ingredients: updatedIngredients,
            editedIngredientIndex: undefined,
            editedIngredient: undefined,
        };
    }),
    on(ShoppingListActions.deleteIngredient, state => {
        if (!state.editedIngredientIndex) {
            return state;
        }
        return {
            ...state,
            ingredients: state.ingredients.filter((ingredient, index) => {
                return index !== state.editedIngredientIndex;
            }),
            editedIngredientIndex: undefined,
            editedIngredient: undefined,
        };
    }),
    on(ShoppingListActions.startEdit, (state, { index }) => {
        return {
            ...state,
            editedIngredientIndex: index,
            editedIngredient: { ...state.ingredients[index] },
        };
    }),
    on(ShoppingListActions.stopEdit, state => {
        return {
            ...state,
            editedIngredientIndex: undefined,
            editedIngredient: undefined,
        };
    }),
);
```

### Store
```typescript
import * as fromShoppingList from './shopping-list/store/shopping-list.reducer';

interface AppState extends fromShoppingList.AppState {}

@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        StoreModule.forRoot<AppState>({
            shoppingList: fromShoppingList.shoppingListReducer,
        }),
    ],
})
export class AppModule { }
```

### Dispatch And Selectors
```typescript
import * as fromShoppingList from '../store/shopping-list.reducer';
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
    // ...
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    // ...

    constructor(
        private store: Store<fromShoppingList.AppState>,
    ) {
        // changed
        // this.shoppingListSubscription = this.store.select('shoppingList').subscribe(stateData => {
        this.shoppingListSubscription = this.store.select(fromShoppingList.selectShoppingList).subscribe(stateData => {
            if (stateData.editedIngredientIndex !== undefined && stateData.editedIngredient) {
                this.editMode = true;
                if (this.shoppingListForm) {
                    this.shoppingListForm.setValue({
                        name: stateData.editedIngredient.name,
                        amount: stateData.editedIngredient.amount,
                    });
                }
            } else {
                this.editMode = false;
            }
        });
    }

    onSubmit(form: NgForm) {
        // ...
        if (this.editMode) {
            // changed
            // this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient));
            this.store.dispatch(ShoppingListActions.updateIngredient({ingredient}));
        } else {
            // changed
            // this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
            this.store.dispatch(ShoppingListActions.addIngredient({ingredient}));
        }
        // ...
    }

    onClear() {
        // ...
        // changed
        // this.store.dispatch(new ShoppingListActions.StopEdit());
        this.store.dispatch(ShoppingListActions.stopEdit());
    }

    onDelete() {
        // changed
        // this.store.dispatch(new ShoppingListActions.DeleteIngredient());
        this.store.dispatch(ShoppingListActions.deleteIngredient());
        this.onClear();
    }

    ngOnDestroy(): void {
        this.shoppingListSubscription.unsubscribe();
        // changed
        // this.store.dispatch(new ShoppingListActions.StopEdit());
        this.store.dispatch(ShoppingListActions.stopEdit());
    }
}
```
```typescript
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
    // ...
})
export class ShoppingListComponent implements OnInit, OnDestroy {
    // ...
    // changed
    // ingredients: Observable<fromShoppingList.State>;
    ingredients: Observable<Ingredient[]>;

    constructor(
        private loggingService: LoggingService,
        private store: Store<fromShoppingList.AppState>,
    ) {
        // cahnged
        // this.ingredients = this.store.select('shoppingList');
        this.ingredients = this.store.select(fromShoppingList.selectShoppingListIngredients);
    }

    // ...

    onEditItem(index: number) {
        // changed
        // this.store.dispatch(new ShoppingListActions.StartEdit(index));
        this.store.dispatch(ShoppingListActions.startEdit({index}));
    }
}
```
```angular2html
<!-- shopping-list.component.html -->
<!-- ... -->
    *ngFor="let ingredient of (ingredients | async); let i = index" (click)="onEditItem(i)">
    <!-- *ngFor="let ingredient of (ingredients | async)?.ingredients; let i = index" (click)="onEditItem(i)"> -->
<!-- ... -->
```
```typescript
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';

@Injectable()
export class RecipeService {
    // ...

    constructor(
        private store: Store<fromShoppingList.AppState>,
    ) { }

    // ...

    addIngredientToShoppingList(ingredients: Ingredient[]) {
        // changed
        // this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
        this.store.dispatch(ShoppingListActions.addIngredients({ingredients}));
    }

    // ...
}
```

## Auth Store

### Global Store

The creation of the auth store:
```typescript
export interface State {
    user?: User;
}

export interface AppState {
    auth: State;
}


const initialState: State = { };

export const authReducer = createReducer(
    initialState,

)
```
leads to a genetalization of the app store
```typescript
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState extends fromShoppingList.AppState, fromAuth.AppState {}

export const appReducer: ActionReducerMap<AppState> = {
    shoppingList: fromShoppingList.shoppingListReducer,
    auth: fromAuth.authReducer,
};
```
```typescript
import * as fromApp from './store/app.reducer';

// interface AppState extends fromShoppingList.AppState, fromAuth.AppState {}

@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        // changed
        // StoreModule.forRoot<AppState>({
        //     shoppingList: fromShoppingList.shoppingListReducer,
        //     auth: fromAuth.authReducer
        // }),
        StoreModule.forRoot(fromApp.appReducer),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```
The new state can be used in the services and components:
```typescript
import * as fromApp from '../../store/app.reducer';
// ...
    // private store: Store<fromShoppingList.AppState>,
    private store: Store<fromApp.AppState>,
// ...
```

### Auth Actions And Reducers

Auth actions:
```typescript
export const login = createAction(
    '[Auth] Login',
    props<{
        id: number;
        email: string;
        token: string;
        expirationDate: Date;
    }>(),
);

export const logout = createAction('[Auth] Logout');
```
Auth reducer:
```typescript
export const authReducer = createReducer(
    initialState,
    on(AuthActions.login, (state, { id, email, token, expirationDate }) => {
        return {
            ...state,
            user: new User(id, email, token, expirationDate),
        };
    }),
    on(AuthActions.logout, state => {
        return {
            ...state,
            user: undefined,
        };
    }),
);
```

### Dispatch And Selectors

After the definition of a selector in the auth store:
```typescript
export const selectAuth = (state: AppState) => state.auth;

export const selectAuthUser = createSelector(
    selectAuth,
    (state: State) => state.user,
);
```
the store can be integrated in the different services and components in this way:
```typescript
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
    // ...
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    // ...

    constructor(
        // ...
        private store: Store<fromApp.AppState>,
    ) {}

    // ...

    autoLogin() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const { id, email, _token, _tokenExpirationDate } = JSON.parse(userData);
            // not necessary
            // const curUser = new User(id, email, _token, new Date(_tokenExpirationDate));

            // changed
            // if (!!curUser.token) {
            if (!!_token) {
                // changed
                // this.user.next(curUser);
                this.store.dispatch(
                    AuthActions.login({
                        id: id,
                        email: email,
                        token: _token,
                        expirationDate: _tokenExpirationDate,
                    }),
                );
                const expiration = new Date(_tokenExpirationDate).getTime() - new Date().getTime();
                this.autoLogout(expiration);
            }
        }
    }

    logout() {
        // changed
        // this.user.next(undefined);
        this.store.dispatch(AuthActions.logout());
        // ...
    }

    // ...

    private handleAuthentication(authData: AuthResponseData) {
        const expirationDate = new Date(new Date().getTime() + 60 * 60 * 1000);
        // changed
        // this.user.next(curUser);
        this.store.dispatch(
            AuthActions.login({
                id: authData.user.id,
                email: authData.user.email,
                token: authData.accessToken,
                expirationDate: expirationDate,
            }),
        );
        // used for local storage
        var curUser = new User(
            authData.user.id,
            authData.user.email,
            authData.accessToken,
            expirationDate,
        );
        localStorage.setItem('userData', JSON.stringify(curUser));
        this.autoLogout(60 * 60 * 1000);
    }

    // ...
}
```
```typescript
import * as fromApp from '../store/app.reducer';
import * as fromAuth from './store/auth.reducer';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        // ...
        private store: Store<fromApp.AppState>,
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // changed
        // return this.authService.user.pipe(
        return this.store.select(fromAuth.selectAuthUser).pipe(
            // ...
        );
    }
}
```
```typescript
import * as fromApp from '../store/app.reducer';
import * as fromAuth from '../auth/store/auth.reducer';

@Component({
    // ...
})
export class HeaderComponent implements OnInit, OnDestroy {
    // ...

    constructor(
        // ...
        private store: Store<fromApp.AppState>,
    ) {
        // changed
        // this.authSubscription = authService.user.subscribe(user => {
        this.authSubscription = this.store.select(fromAuth.selectAuthUser).subscribe(user => {
            // ...
        });
    }

    // ...
}
```

## Effects

Effects are side effects in the "real world" that do not deal with directly with the store.

An example of this is the local store, it is needed to persisted and retrived,
but cannot be managed in the store directly.

### Installation

Since the effects are not directly connected with the store, 
are also available in a differt package:
```bash
npm i @ngrx/effects
```

### Full Auth Effects

All the login inside the AuthService, except fot the timeout, can be moved
to the effect class defined in this way:
```typescript
export interface AuthResponseData {
    accessToken: string;
    user: {
        email: string;
        id: number;
    };
}

@Injectable()
export class AuthEffects {
    private baseUrl = environment.serverUrl;
    constructor(
        // action$ is a subscription
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService,
    ) {}

    authLogin$ = createEffect(() =>
        this.actions$.pipe(
            // filters the types for the actions
            ofType(AuthActions.loginStart),
            // transform the action
            switchMap(action => {
                return this.http
                    .post<AuthResponseData>(`${this.baseUrl}/login`, {
                        email: action.email,
                        password: action.password,
                    })
                    // a valid action must be returned
                    .pipe(map(this.handleAuthentication), catchError(this.handleError));
            }),
        ),
    );

    authRedirect = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.authenticateSuccess),
                tap(() => {
                    this.router.navigate(['/']);
                }),
            ),
        { dispatch: false }, // needed because no action is returned
    );

    authSighUp = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.singUpStart),
            switchMap(action => {
                return this.http
                    .post<AuthResponseData>(`${this.baseUrl}/register`, {
                        email: action.email,
                        password: action.password,
                    })
                    .pipe(map(this.handleAuthentication), catchError(this.handleError));
            }),
        ),
    );

    authLogout = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.logout),
                tap(() => {
                    localStorage.removeItem('userData');
                    this.authService.clearLogoutTimer();
                    this.router.navigate(['/auth']);
                }),
            ),
        { dispatch: false },
    );

    autoLogin = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.autoLogin),
            map(() => {
                const userData = localStorage.getItem('userData');
                if (userData) {
                    const { id, email, _token, _tokenExpirationDate } = JSON.parse(userData);
                    if (!!_token) {
                        const expiration =
                            new Date(_tokenExpirationDate).getTime() - new Date().getTime();
                        this.authService.setLogoutTimer(expiration);
                        return AuthActions.authenticateSuccess({
                            id: id,
                            email: email,
                            token: _token,
                            expirationDate: _tokenExpirationDate,
                        });
                    }
                }
                // dummy action, needed to always return a valid action
                return { type: 'EMPTY' };
            }),
        ),
    );

    // to access the this reference to the authService 
    // an arrow function is required to work correctly
    private handleAuthentication = (authData: AuthResponseData) => {
        const expirationDate = new Date(new Date().getTime() + 60 * 60 * 1000);
        const user = new User(
            authData.user.id,
            authData.user.email,
            authData.accessToken,
            expirationDate,
        );
        localStorage.setItem('userData', JSON.stringify(user));
        this.authService.setLogoutTimer(60 * 60 * 1000);
        return AuthActions.authenticateSuccess({
            id: authData.user.id,
            email: authData.user.email,
            token: authData.accessToken,
            expirationDate: expirationDate,
        });
    };

    private handleError(errorResponse: HttpErrorResponse) {
        console.error(errorResponse);
        let message = 'An error occurred!';
        if (errorResponse.error) {
            message = errorResponse.error;
        }
        // of is needed to return a valid observable in this case
        return of(AuthActions.authenticateFail({ error: message }));
    }
}
```
The effects must be registered in the app module:
```typescript
import { AuthEffects } from './auth/store/auth.effects';

@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        EffectsModule.forRoot([AuthEffects])
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```

### Auth Actions

The final auth action are:
```typescript
export const loginStart = createAction(
    '[Auth] Login Start',
    props<{
        email: string;
        password: string;
    }>(),
);

export const singUpStart = createAction(
    '[Auth] Sing Up Start',
    props<{
        email: string;
        password: string;
    }>(),
);

export const autoLogin = createAction('[Auth] Auto Login');

export const authenticateFail = createAction(
    '[Auth] Authenticate Fail',
    props<{
        error: string;
    }>(),
);

export const clearError = createAction('[Auth] Clear Error');

export const authenticateSuccess = createAction(
    '[Auth] Authenticate Success',
    props<{
        id: number;
        email: string;
        token: string;
        expirationDate: Date;
    }>(),
);

export const logout = createAction('[Auth] Logout');
```

### Auth Reducer

The needed updates to the reducer are:
```typescript
export interface State {
    user?: User;
    error?: string;
    loading: boolean;
}

export interface AppState {
    auth: State;
}

export const selectAuth = (state: AppState) => state.auth;

export const selectAuthUser = createSelector(selectAuth, (state: State) => state.user);

export const selectAuthError = createSelector(selectAuth, (state: State) => state.error);

export const selectAuthLoading = createSelector(selectAuth, (state: State) => state.loading);

const initialState: State = {
    loading: false,
};

// not all the actions are needed to be managed, 
// autoLogin is only used in the effects
export const authReducer = createReducer(
    initialState,
    on(AuthActions.loginStart, state => {
        return {
            ...state,
            error: undefined,
            loading: true,
        };
    }),
    on(AuthActions.singUpStart, state => {
        return {
            ...state,
            error: undefined,
            loading: true,
        };
    }),
    on(AuthActions.authenticateFail, (state, { error }) => {
        return {
            ...state,
            user: undefined,
            error: error,
            loading: false,
        };
    }),
    on(AuthActions.clearError, state => {
        return {
            ...state,
            error: undefined,
        };
    }),
    on(AuthActions.authenticateSuccess, (state, { id, email, token, expirationDate }) => {
        return {
            ...state,
            error: undefined,
            user: new User(id, email, token, expirationDate),
            loading: false,
        };
    }),
    on(AuthActions.logout, state => {
        return {
            ...state,
            user: undefined,
        };
    }),
);
```

### Component And Service Updates

The auth service now menages only the logout time:
```typescript
// export interface AuthResponseData {
//     accessToken: string;
//     user: {
//         email: string;
//         id: number;
//     };
// }

@Injectable({ providedIn: 'root' })
export class AuthService {
    public tokenExpirationTimer: any;

    constructor(
        private store: Store<fromApp.AppState>,
    ) {}

    // renamed
    // autoLogout(expirationDuration: number) {
    setLogoutTimer(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(AuthActions.logout());
        // }, 5000);
        }, expirationDuration);
    }

    clearLogoutTimer() {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = undefined;
        }
    }

    // all previous code is removed
}
```

The AppComponent call directly the dispatch for the autoLogin:
```typescript
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
    // ...
})
export class AppComponent implements OnInit {
    // ...

    constructor(
        // ...
        // removed
        // private authService: AuthService,
        private store: Store<fromApp.AppState>,
    ) {}

    ngOnInit(): void {
        // changed
        // this.authService.autoLogin();
        this.store.dispatch(AuthActions.autoLogin())
        // ...
    }
}
```
like the header for the logout:
```typescript
import * as fromApp from '../store/app.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
    // ...
})
export class HeaderComponent implements OnInit, OnDestroy {
    // ...
    authSubscription: Subscription;

    constructor(
        // ...
        // removed
        <!-- private authService: AuthService, -->
        private store: Store<fromApp.AppState>,
    ) {
        // changed
        // this.authSubscription = authService.user.subscribe(user => {
        this.authSubscription = this.store.select(fromAuth.selectAuthUser).subscribe(user => {
            this.isAuthenticated = !!user && !!user.token;
        });
    }

    // ...

    onLogout() {
        // changed
        // this.authService.logout();
        this.store.dispatch(AuthActions.logout());
    }

    ngOnDestroy(): void {
        // technically the same but on another object
        this.authSubscription.unsubscribe();
    }
}
```
the auth component is become:
```typescript
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';
import * as fromAuth from './store/auth.reducer';

@Component({
    // ...
})
export class AuthComponent implements OnInit, OnDestroy {
    // ...
    // changed to subscription
    // isLoading = false;
    isLoading$ = this.store.select(fromAuth.selectAuthLoading);
    error$: Subscription | undefined;
    error: string | undefined;
    // ...

    constructor(
        // removed
        // private authService: AuthService,
        // private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromApp.AppState>,
    ) {}

    ngOnInit(): void {
        // error is managed in the auth store
        this.error$ = this.store.select(fromAuth.selectAuthError).subscribe(error => {
            this.error = error;
            if (error) {
                this.showErrorMessage(error);
            }
        });
    }

    // ...

    onSubmit(form: NgForm) {
        // this.isLoading = true;
        const { email, password } = form.value;

        // let authObservable: Observable<AuthResponseData>;
        if (this.isLoginMode) {
            // moved to dispatch
            // authObservable = this.authService.login(email, password);
            this.store.dispatch(AuthActions.loginStart({ email, password }));
        } else {
            // moved to dispatch
            // authObservable = this.authService.signUp(email, password);
            this.store.dispatch(AuthActions.singUpStart({ email, password }));
        }

        // authObservable.subscribe(
        //     response => {
        //         // console.log(response);
        //         this.isLoading = false;
        //         this.router.navigate(['/recipes']);
        //     },
        //     errorMessage => {
        //         // console.error(error);
        //         this.error = errorMessage;
        //         this.showErrorMessage(errorMessage);
        //         this.isLoading = false;
        //     },
        // );
        form.reset();
    }

    onHandleError() {
        // moved to dispatch
        // this.error = undefined;
        this.store.dispatch(AuthActions.clearError());
    }

    // ...

    ngOnDestroy(): void {
        // ...
        if (this.error$) {
            this.error$.unsubscribe();
        }
    }
}
```
```angular2html
<!-- auth.component.html -->
<!-- ... -->
    <!-- moved to subscription -->
    <!-- <div *ngIf="isLoading" style="text-align: center"> -->
    <div *ngIf="isLoading$ | async" style="text-align: center">
        <app-loading-spinner></app-loading-spinner>
    </div>
    <!-- moved to subscription -->
    <!-- <form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)" *ngIf="!isLoading"> -->
    <form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)" *ngIf="!(isLoading$ | async)">
<!-- ... -->
```

## Router Store

The router store is a tool that allows to react to routing actions,
it dispatch automatically actions based on the router.

### Installation

the needed package is:
```bash
npm i @ngrx/router-store
```
then it must be configured in the app module:
```typescript
import { StoreRouterConnectingModule } from '@ngrx/router-store';

@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        StoreRouterConnectingModule.forRoot(),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```

### Events

the events dispatched by the router store are:
-`@ngrx/router-store/request`: navigation started
-`@ngrx/router-store/navigation`: navigation in progress
-`@ngrx/router-store/navigated`: navigation finished
the payload is composed by the router state and the ending route.

It is possible to analyze these events with the Redux Devtools.

## Recipes Store

The last part is to manage the recipes in the store.

### App Store

The updated app store is:
```typescript
import * as fromRecipe from '../recipes/store/recipe.reducer';

export interface AppState
    extends fromShoppingList.AppState,
        fromAuth.AppState,
        fromRecipe.AppState {}

export const appReducer: ActionReducerMap<AppState> = {
    shoppingList: fromShoppingList.shoppingListReducer,
    auth: fromAuth.authReducer,
    recipes: fromRecipe.authReducer
};
```
in the app module must be registered the new effects
```typescript
import { RecipeEffects } from './recipes/store/recipe.effects';

@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        EffectsModule.forRoot([AuthEffects, RecipeEffects]),
        // ...
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```
### Actions, Reducer And Effects

```typescript
export const setRecipes = createAction(
    '[Recipes] Set Recipes',
    props<{
        recipes: Recipe[];
    }>(),
);

export const fetchRecipes = createAction('[Recipes] Fetch Recipes');

export const addRecipe = createAction(
    '[Recipes] Add Recipe',
    props<{
        recipe: Recipe;
    }>(),
);

export const updateRecipe = createAction(
    '[Recipes] Update Recipe',
    props<{
        index: number;
        recipe: Recipe;
    }>(),
);

export const deleteRecipe = createAction(
    '[Recipes] Delete Recipe',
    props<{
        index: number;
    }>(),
);

export const storeRecipes = createAction('[Recipes] Store Recipes');
```
```typescript
export interface State {
    recipes: Recipe[];
}

export interface AppState {
    recipes: State;
}

export const selectRecipes = (state: AppState) => state.recipes;

export const selectRecipesRecipes = createSelector(selectRecipes, (state: State) => state.recipes);

export const selectRecipesRecipesRecipe = createSelector(
    selectRecipes,
    (state: State, props: { index: number }) => {
        return state.recipes.find((recipe, index) => {
            return props.index === index;
        });
    },
);

const initialState: State = {
    recipes: [],
};

export const authReducer = createReducer(
    initialState,
    on(RecipeActions.setRecipes, (state, { recipes }) => {
        return {
            ...state,
            recipes: [...recipes],
        };
    }),
    on(RecipeActions.addRecipe, (state, { recipe }) => {
        return {
            ...state,
            recipes: [...state.recipes, recipe],
        };
    }),
    on(RecipeActions.updateRecipe, (state, { index, recipe }) => {
        const updatedRecipe = { ...state.recipes[index], ...recipe };
        const updatedRecipes = [...state.recipes];
        updatedRecipes[index] = updatedRecipe;
        return {
            ...state,
            recipes: updatedRecipes,
        };
    }),
    on(RecipeActions.deleteRecipe, (state, { index }) => {
        return {
            ...state,
            recipes: state.recipes.filter((_, idx) => {
                return index !== idx;
            }),
        };
    }),
);
```
```typescript
@Injectable()
export class RecipeEffects {
    private baseUrl = `${environment.serverUrl}/recipes`;
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.AppState>,
    ) {}

    fetchRecipes = createEffect(() =>
        this.actions$.pipe(
            ofType(RecipeActions.fetchRecipes),
            switchMap(() => {
                return this.http.get<Recipe[]>(`${this.baseUrl}`);
            }),
            map(recipes => {
                return recipes.map(recipe => {
                    return {
                        ...recipe,
                        ingredients: recipe.ingredients ? recipe.ingredients : [],
                    };
                });
            }),
            map(recipes => {
                return RecipeActions.setRecipes({ recipes });
            }),
        ),
    );

    storeRecipes = createEffect(
        () =>
            this.actions$.pipe(
                ofType(RecipeActions.storeRecipes),
                withLatestFrom(this.store.select(fromRecipe.selectRecipesRecipes)),
                tap(([_, recipes]) => {
                    for (let i = 0; i < recipes.length; i++) {
                        const curRecipe = recipes[i];
                        if (curRecipe.id) {
                            this.http
                                .put<Recipe>(`${this.baseUrl}/${curRecipe.id}`, curRecipe)
                                .subscribe(recipe => {
                                    console.log(recipe);
                                    this.store.dispatch(
                                        RecipeActions.updateRecipe({ index: i, recipe: recipe }),
                                    );
                                });
                        } else {
                            this.http
                                .post<Recipe>(`${this.baseUrl}`, curRecipe)
                                .subscribe(recipe => {
                                    console.log(recipe);
                                    this.store.dispatch(
                                        RecipeActions.updateRecipe({ index: i, recipe: recipe }),
                                    );
                                });
                        }
                    }
                }),
            ),
        { dispatch: false },
    );
}
```

### RecipeListComponent
```typescript
import * as fromApp from '../../store/app.reducer';
import * as fromRecipe from '../../recipes/store/recipe.reducer';

@Component({
    // ...
})
export class RecipeListComponent implements OnInit, OnDestroy {
    // changed
    // recipes: Recipe[] = [];
    recipes$ = this.store.select(fromRecipe.selectRecipesRecipes);
    // recipeChangedSubscription: Subscription;

    constructor(
        // private recipeService: RecipeService,
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<fromApp.AppState>,
    ) {
        // removed
        // this.recipeChangedSubscription = this.recipeService.recipeChanged.subscribe(
        //     (recipes: Recipe[]) => {
        //         this.recipes = recipes;
        //     },
        // );
    }

    ngOnInit(): void {
        // removed
        // this.recipes = this.recipeService.getRecipes();
    }

    // ...

    ngOnDestroy(): void {
        // removed
        // this.recipeChangedSubscription.unsubscribe();
    }
}
```
```angular2html
<!-- recipe-list.component.html -->
<!-- ... -->
    <!-- *ngFor="let curRecipe of recipes; let i = index" -->
    *ngFor="let curRecipe of (recipes$ | async); let i = index"
<!-- ... -->
```

### RecipeEditComponent

```typescript
import * as fromApp from '../../store/app.reducer';
import * as fromRecipe from '../../recipes/store/recipe.reducer';
import * as RecipesActions from '../../recipes/store/recipe.actions';

@Component({
    // ...
})
export class RecipeEditComponent implements OnInit, OnDestroy {
    // ...
    store$: Subscription | undefined;

    constructor(
        // ...
        // removed
        // private recipeService: RecipeService,
        private store: Store<fromApp.AppState>,
    ) {
        this.recipeForm = this.initForm();
    }

    // ...

    private initForm(): FormGroup {
        let recipeName = '';
        let recipeImagePath = '';
        let recipeDescription = '';
        let recipeIngredients = new FormArray([]);

        if (this.editMode && this.id !== undefined) {
            console.log('id', this.id);
            this.store$ = this.store
                .select(fromRecipe.selectRecipesRecipesRecipe, { index: this.id })
                .subscribe(recipe => {
                    console.log('recipe', recipe);
                    if (recipe) {
                        recipeName = recipe.name;
                        recipeImagePath = recipe.imagePath;
                        recipeDescription = recipe.description;
                        if (recipe.ingredients) {
                            for (let ingredient of recipe.ingredients) {
                                recipeIngredients.push(
                                    new FormGroup({
                                        name: new FormControl(ingredient.name, Validators.required),
                                        amount: new FormControl(ingredient.amount, [
                                            Validators.required,
                                            Validators.pattern(/^[1-9]+[0-9]*$/),
                                        ]),
                                    }),
                                );
                            }
                        }
                    }
                });
            // changed
            // const recipe = this.recipeService.getRecipe(this.id);
            // recipeName = recipe.name;
            // recipeImagePath = recipe.imagePath;
            // recipeDescription = recipe.description;
            // if (recipe.ingredients) {
            //     for (let ingredient of recipe.ingredients) {
            //         recipeIngredients.push(
            //             new FormGroup({
            //                 name: new FormControl(ingredient.name, Validators.required),
            //                 amount: new FormControl(ingredient.amount, [
            //                     Validators.required,
            //                     Validators.pattern(/^[1-9]+[0-9]*$/),
            //                 ]),
            //             }),
            //         );
            //     }
            // }
        }

        // ...
    }

    // ...

    onSubmit() {
        // ...

        if (this.editMode && this.id !== undefined) {
            // changed
            // this.recipeService.updateRecipe(this.id, recipe);
            this.store.dispatch(RecipesActions.updateRecipe({ index: this.id, recipe: recipe }));
        } else {
            // changed
            // this.recipeService.addRecipe(recipe);
            this.store.dispatch(RecipesActions.addRecipe({ recipe }));
        }
        // ...
    }

    ngOnDestroy(): void {
        if (this.store$) {
            this.store$.unsubscribe();
        }
    }
}
```

### RecipeDetailComponent

```typescript
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../../recipes/store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as fromRecipe from '../../recipes/store/recipe.reducer';

@Component({
    // ...
})
export class RecipeDetailComponent implements OnInit {
    recipe: Recipe = {} as Recipe;
    id: number = 0;

    constructor(
        // ...
        // removed
        // private recipeService: RecipeService,
        private store: Store<fromApp.AppState>,
    ) {}

    ngOnInit(): void {
        // changed
        // this.route.params.subscribe((params: Params) => {
        //     this.id = +params['id'];
        //     this.recipe = this.recipeService.getRecipe(this.id);
        // });
        this.route.params
            .pipe(
                map(params => {
                    return +params['id'];
                }),
                switchMap((id: number) => {
                    this.id = id;
                    return this.store.select(fromRecipe.selectRecipesRecipesRecipe, {
                        index: id,
                    });
                }),
            )
            .subscribe(recipe => {
                if (recipe) {
                    this.recipe = recipe;
                }
            });
    }

    // ...

    onAddToShoppingList() {
        // changed
        // this.recipeService.addIngredientToShoppingList(this.recipe.ingredients);
        this.store.dispatch(
            ShoppingListActions.addIngredients({ ingredients: this.recipe.ingredients }),
        );
    }

    onDeleteRecipe() {
        // changed
        // this.recipeService.deleteRecipe(this.id);
        this.store.dispatch(RecipesActions.deleteRecipe({ index: this.id }));
        this.router.navigate(['/recipes']);
    }
}
```

### HeaderComponent

```typescript
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
    // ...
})
export class HeaderComponent implements OnInit, OnDestroy {
    // ...

    constructor(
        // removed
        // private dataStorageService: DataStorageService,
        // private authService: AuthService,
        private store: Store<fromApp.AppState>,
    ) {
        // changed
        // this.authSubscription = authService.user.subscribe(user => {
        this.authSubscription = this.store.select(fromAuth.selectAuthUser).subscribe(user => {
            this.isAuthenticated = !!user && !!user.token;
        });
    }

    // ...

    onSaveData() {
        // changed
        // this.dataStorageService.storeRecipes();
        this.store.dispatch(RecipeActions.storeRecipes());
    }

    onLoadData() {
        // changed
        this.store.dispatch(RecipeActions.fetchRecipes());
        // this.dataStorageService.fetchRecipes().subscribe(recipes => {
        //     console.log('recipes fetched.');
        // });
    }

    onLogout() {
        // changed
        this.store.dispatch(AuthActions.logout());
        // this.authService.logout();
    }

    ngOnDestroy(): void {
        // used by another
        this.authSubscription.unsubscribe();
    }
}
```

### RecipeResolverService

```typescript
@Injectable({ providedIn: 'root' })
export class RecipeResolverService implements Resolve<Recipe[]> {
    constructor(
        // removed
        // private dataStorageService: DataStorageService,
        // private recipeService: RecipeService,
        private store: Store<fromApp.AppState>,
        private actions$: Actions,
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        return this.store.select(fromRecipe.selectRecipesRecipes).pipe(
            take(1),
            switchMap(recipes => {
                if (recipes.length === 0) {
                    this.store.dispatch(RecipeActions.fetchRecipes());
                    return this.actions$.pipe(
                        ofType(RecipeActions.setRecipes),
                        take(1),
                        map(action => action.recipes),
                    );
                }
                return of(recipes);
            }),
        );
        // changed
        // const recipes = this.recipeService.getRecipes();
        //
        // if (recipes.length === 0) {
        //     return this.dataStorageService.fetchRecipes();
        // } else {
        //     return recipes;
        // }
    }
}
```

### Removed

The RecipeService and the DataStorageService are conpletely deleted.

### Auth

The authentication has been improved:
```typescript
// Action
// ...
export const authenticateSuccess = createAction(
    '[Auth] Authenticate Success',
    props<{
        id: number;
        email: string;
        token: string;
        expirationDate: Date;
        redirect: boolean;
    }>(),
);
// effects

// ...
    authRedirect = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.authenticateSuccess),
                tap(action => {
                    if (action.redirect) {
                        this.router.navigate(['/']);
                    }
                }),
            ),
        { dispatch: false },
    );

    // ...

    autoLogin = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.autoLogin),
            map(() => {
                const userData = localStorage.getItem('userData');
                if (userData) {
                    const { id, email, _token, _tokenExpirationDate } = JSON.parse(userData);
                    if (!!_token) {
                        const expiration =
                            new Date(_tokenExpirationDate).getTime() - new Date().getTime();
                        this.authService.setLogoutTimer(expiration);
                        return AuthActions.authenticateSuccess({
                            id: id,
                            email: email,
                            token: _token,
                            expirationDate: _tokenExpirationDate,
                            redirect: false,
                        });
                    }
                }
                return { type: 'EMPTY' };
            }),
        ),
    );

    private handleAuthentication = (authData: AuthResponseData) => {
        const expirationDate = new Date(new Date().getTime() + 60 * 60 * 1000);
        const user = new User(
            authData.user.id,
            authData.user.email,
            authData.accessToken,
            expirationDate,
        );
        localStorage.setItem('userData', JSON.stringify(user));
        // this requires an arrow function to work correctly
        this.authService.setLogoutTimer(60 * 60 * 1000);
        return AuthActions.authenticateSuccess({
            id: authData.user.id,
            email: authData.user.email,
            token: authData.accessToken,
            expirationDate: expirationDate,
            redirect: true,
        });
    };
```

