<!-- # Data Binding -->
<!---->
<!-- It is a method to allow the TypeScript Code (Business Logic) -->
<!-- to communicate with the Template (HTML). -->
<!---->
<!-- There are some types of data binding: -->
<!---->
<!-- - **Output Data**: -->
<!--   - **String Interpolation** - `{{ data }}` -->
<!--   - **Property Binding** - `[property]="data"` -->
<!-- - **React To (User) Events**: -->
<!--   - **Event Binding** - `(event)="expression"` -->
<!-- - **Combination I/O**: -->
<!--   - **Two-Way-Binding** - `[(ngModel)]="data` -->
<!---->
<!-- ### String Interpolation -->
<!---->
<!-- For string interpolation is used the `{{ data }}` syntax. -->
<!---->
<!-- Where data must be a string or everything could be converted to a string, like: -->
<!---->
<!-- ```typescript -->
<!-- serverID: number = 10; -->
<!-- serverStatus: string = 'offline'; -->
<!---->
<!-- getServerState(){ -->
<!--     return this.serverStatus; -->
<!-- } -->
<!-- ``` -->
<!---->
<!-- Template code: -->
<!---->
<!-- ```html -->
<!-- <p> {{'Server'}} with ID {{serverID}} is {{getServerState()}}. </p> -->
<!-- ``` -->
<!---->
<!-- ## Property Binding -->
<!---->
<!-- For property binding is used the `[property]="data"` syntax. -->
<!---->
<!-- Property binding allows Angular to update the template -->
<!-- when a value from TypeScript change. -->
<!---->
<!-- In this case after two seconds the **Add Server** button become enabled: -->
<!-- ```typescript -->
<!-- export class ServersComponent implements OnInit { -->
<!--   allowNewServers: boolean = false; -->
<!---->
<!--   constructor() { -->
<!--     setTimeout(() => { -->
<!--       this.allowNewServers = true; -->
<!--     }, 2000); -->
<!--   } -->
<!-- } -->
<!-- ``` -->
<!---->
<!-- Template code: -->
<!-- ```angular2html -->
<!-- <button  -->
<!--     class="btn badge-primary" -->
<!--     [disabled]="!allowNewServers" -->
<!--     > -->
<!--     Add Server -->
<!-- </button> -->
<!-- ``` -->
<!---->
<!-- ### String Interpolation vs Property Binding -->
<!---->
<!-- **String Interpolation**: to print some text into a template. -->
<!---->
<!-- **Property Binding**: to change some property into a template, -->
<!-- a directive or a component. -->
<!---->
<!-- It is not possible to mix them. -->
<!---->
<!-- ### Event Binding -->
<!---->
<!-- Event binding allows to call a method on a specific property or event of a element. -->
<!---->
<!-- ```angular2html -->
<!-- <button -->
<!--   class="btn badge-primary" -->
<!--   [disabled]="!allowNewServers" -->
<!--   (click)="onCreateServer()"> -->
<!--   Add Server -->
<!-- </button> -->
<!-- <p>{{serverCreationStatus}}</p> -->
<!-- ``` -->
<!---->
<!-- ```typescript -->
<!-- export class ServersComponent implements OnInit { -->
<!--   ... -->
<!--   serverCreationStatus: string = 'No server was created!'; -->
<!--   onCreateServer(){ -->
<!--     this.serverCreationStatus = 'Server was created!'; -->
<!--   } -->
<!-- } -->
<!-- ``` -->
<!---->
<!-- Is possible catch the event variable connected to a specific event -->
<!-- by passing it to the method with `$event`. -->
<!-- ```angular2html -->
<!-- <input -->
<!--   type="text" -->
<!--   class="form-control" -->
<!--   (input)="onUpdateServerName($event)"> -->
<!-- <p>{{serverName}}</p> -->
<!-- ``` -->
<!---->
<!-- In TypeScript is possible to log it in the console to see the content and take data from it. -->
<!-- ```typescript -->
<!-- private serverName: string = ''; -->
<!---->
<!-- onUpdateServerName(event: Event) { -->
<!-- console.log(event); -->
<!-- this.serverName = (<HTMLInputElement>event.target).value; -->
<!-- } -->
<!-- ``` -->
<!---->
<!-- ### Two-Way-Binding -->
<!---->
<!-- Two-Way-Binding need the `ngModel` directive in the **app.module**: -->
<!-- ```typescript -->
<!-- import {FormsModule} from "@angular/forms"; -->
<!---->
<!-- @NgModule({ -->
<!--   ... -->
<!--   imports: [ -->
<!--     BrowserModule, -->
<!--     FormsModule -->
<!--   ], -->
<!--   ... -->
<!-- }) -->
<!-- ``` -->
<!---->
<!-- The `ngModule` works bidirectionally so, if **serverName** has a default value, -->
<!-- that text will become the `<input>` default value.  -->
<!-- This do not append with Event Binding. -->
<!---->
<!-- ```angular2html -->
<!-- <input -->
<!--   type="text" -->
<!--   class="form-control" -->
<!--   [(ngModel)]="serverName"> -->
<!-- ``` -->
<!---->
<!-- ### Events and Properties -->
<!---->
<!-- It is possible have a list of properties and events of a element -->
<!-- with a `console.log` or searching it on google.  -->
<!---->
