import { NgModule } from '@angular/core';

import { ShoppingListService } from './shopping-list/shopping-list.service';
// import { RecipeService } from './recipes/recipe.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor/auth-interceptor.service';
import { LoggingService } from './logging.service';

@NgModule({
    providers: [
        ShoppingListService,
        // RecipeService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true,
        },
        // LoggingService
    ],
})
export class CoreModule {}
