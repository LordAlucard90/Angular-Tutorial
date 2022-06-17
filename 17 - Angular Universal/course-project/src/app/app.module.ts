import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
// import { RecipesComponent } from './recipes/recipes.component';
// import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
// import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
// import { RecipeItemComponent } from './recipes/recipe-list/recipe-item/recipe-item.component';
// import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
// import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
// import { ShoppingListComponent } from './shopping-list/shopping-list.component';
// import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
// import { DropdownDirective } from './shared/dropdown.directive';
// import { ShoppingListService } from './shopping-list/shopping-list.service';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { RecipeService } from './recipes/recipe.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { AuthComponent } from './auth/auth.component';
// import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
// import { AuthInterceptorService } from './auth/auth-interceptor/auth-interceptor.service';
// import { AlertComponent } from './shared/alert/alert.component';
// import { PlaceholderDirective } from './shared/placeholder/placeholder.directive';
// import { RecipesModule } from './recipes/recipes.module';
// import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
// import { LoggingService } from './logging.service';
import { StoreModule } from '@ngrx/store';
// import { shoppingListReducer } from './shopping-list/store/shopping-list.reducer';
// import { AuthModule } from './auth/auth.module';
// import * as fromShoppingList from './shopping-list/store/shopping-list.reducer';
// import * as fromAuth from './auth/store/auth.reducer';
import * as fromApp from './store/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth/store/auth.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { RecipeEffects } from './recipes/store/recipe.effects';

// interface AppState extends fromShoppingList.AppState, fromAuth.AppState {}

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        // AuthComponent,
        // RecipesComponent,
        // RecipeListComponent,
        // RecipeDetailComponent,
        // RecipeItemComponent,
        // RecipeStartComponent,
        // RecipeEditComponent,
        // ShoppingListComponent,
        // ShoppingEditComponent,
        // DropdownDirective,
        // LoadingSpinnerComponent,
        // AlertComponent,
        // PlaceholderDirective,
    ],
    imports: [
        HttpClientModule,
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        AppRoutingModule,
        // FormsModule,
        // ReactiveFormsModule,
        // RecipesModule,
        // ShoppingListModule,
        SharedModule,
        CoreModule,
        // AuthModule,
        // StoreModule.forRoot<AppState>({
        //     shoppingList: fromShoppingList.shoppingListReducer,
        //     auth: fromAuth.authReducer
        // }),
        StoreModule.forRoot(fromApp.appReducer),
        EffectsModule.forRoot([AuthEffects, RecipeEffects]),
        StoreDevtoolsModule.instrument({logOnly: environment.production}),
        StoreRouterConnectingModule.forRoot(),
    ],
    // providers: [
    //     LoggingService
    // ],
    // providers: [
    //     ShoppingListService,
    //     RecipeService,
    //     {
    //         provide: HTTP_INTERCEPTORS,
    //         useClass: AuthInterceptorService,
    //         multi: true,
    //     },
    // ],
    bootstrap: [AppComponent],
    // up to Angular 8
    // entryComponents: [AlertComponent],
})
export class AppModule {}
