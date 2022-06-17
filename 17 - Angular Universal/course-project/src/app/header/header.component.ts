import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
// import { AuthService } from '../auth/auth-service';
// import { DataStorageService } from '../shared/data-storage.service';
import * as fromApp from '../store/app.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
    collapsed = true;
    // @Output() featureSelected = new EventEmitter<string>();
    authSubscription: Subscription;
    isAuthenticated = false;

    constructor(
        // private dataStorageService: DataStorageService,
        // private authService: AuthService,
        private store: Store<fromApp.AppState>,
    ) {
        // this.authSubscription = authService.user.subscribe(user => {
        this.authSubscription = this.store.select(fromAuth.selectAuthUser).subscribe(user => {
            this.isAuthenticated = !!user && !!user.token;
        });
    }

    ngOnInit(): void {}

    // onSelect(feature: string) {
    //     this.featureSelected.emit(feature);
    // }

    onSaveData() {
        // this.dataStorageService.storeRecipes();
        this.store.dispatch(RecipeActions.storeRecipes());
    }

    onLoadData() {
        this.store.dispatch(RecipeActions.fetchRecipes());
        // this.dataStorageService.fetchRecipes().subscribe(recipes => {
        //     console.log('recipes fetched.');
        // });
    }

    onLogout() {
        this.store.dispatch(AuthActions.logout());
        // this.authService.logout();
    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }
}
