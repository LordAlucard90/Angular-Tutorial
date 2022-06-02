import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth-service';
import { DataStorageService } from '../shared/data-storage.service';

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

    constructor(private dataStorageService: DataStorageService, private authService: AuthService) {
        this.authSubscription = authService.user.subscribe(user => {
            this.isAuthenticated = !!user && !!user.token;
        });
    }

    ngOnInit(): void {}

    // onSelect(feature: string) {
    //     this.featureSelected.emit(feature);
    // }

    onSaveData() {
        this.dataStorageService.storeRecipes();
    }

    onLoadData() {
        this.dataStorageService.fetchRecipes().subscribe(recipes => {
            console.log('recipes fetched.');
        });
    }

    onLogout(){
        this.authService.logout()
    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }
}
