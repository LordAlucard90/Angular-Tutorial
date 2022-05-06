<!-- ## How an Angular App gets Loaded and Started -->
<!---->
<!-- ### index.html -->
<!---->
<!-- The default html file served by angular is `src/`**index.html**. -->
<!---->
<!-- In the body of the **index.html** there is the tag **<app-root></app-root>**, -->
<!-- this tag will be dynamically managed by the root component of the application. -->
<!---->
<!-- The root component is stored in `src/app/` and is made up the ``app.component.*`` files. -->
<!---->
<!-- ### app.component.ts -->
<!---->
<!-- The typescript part of the component contains the decorator **@Component**. -->
<!---->
<!-- The property **selector** contains the name of the tag -->
<!-- that the component will replace. -->
<!---->
<!-- ### main.ts -->
<!---->
<!-- `src/`**main.ts** is the first typescript file elaborate by the framework. -->
<!---->
<!-- The first import checks the production or development state. -->
<!-- ```typescript -->
<!-- import { enableProdMode } from '@angular/core'; -->
<!-- import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'; -->
<!---->
<!-- if (environment.production) { -->
<!--   enableProdMode(); -->
<!-- } -->
<!---->
<!-- ``` -->
<!---->
<!-- In the second part the angular application is started by passing -->
<!-- a app module which refers to `./app/`**app.module**(.ts). -->
<!---->
<!-- ```typescript -->
<!-- import { AppModule } from './app/app.module'; -->
<!-- import { environment } from './environments/environment'; -->
<!---->
<!-- platformBrowserDynamic().bootstrapModule(AppModule) -->
<!--   .catch(err => console.error(err)); -->
<!-- ``` -->
<!---->
<!-- ### app.module.ts -->
<!---->
<!-- The **bootstrap** field lists all the component needed by angular -->
<!-- for the correct analysis of the html file. -->
<!---->
<!-- ```typescript -->
<!-- bootstrap: [AppComponent] -->
<!-- ``` -->
<!-- Where **AppComponent** is the component **app.component.ts**  introduced above. -->
<!---->
<!-- --- -->
<!---->
<!-- ### Loading Process -->
<!---->
<!-- 1. Angular gets started **main.ts**. -->
<!-- 2. In **main.ts** is bootstrap an Angular application, more specific **AppComponent**. -->
<!-- 3. Angular analyzes **AppComponent** and reads the set up of **@Component** where is define **\<app-root\>** selector. -->
<!-- 4. Angular can now handle **index.html** and the selector **\<app-root\>** and replace it with the html code of the **AppComponent**. -->
<!---->
<!---->
