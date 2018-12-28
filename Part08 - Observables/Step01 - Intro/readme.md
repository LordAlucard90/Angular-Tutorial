# Step01 - Intro

## Observables

Un observable is a data source of various type: User Input (Events), HTTP Requests, etc..

The Observable/Observer pattern in used to implement the Observables logic.

The Observable emits events programmatically, by a button click event or by a HTTP request response and so on.

The Observer is implemented with the code in the subscribe method.

There are three method to handle the data packages received:

- **Handle Data** 
- **Handle Error** 
- **Handle Completion**

---

## Import Syntax


From version `rxjs: 6.x` the import syntax changed.
 
The new syntax will be introduced on the last videos but i will explore it first to directly write the recent one.

It is also possible use the old syntax style with the `rxjs-compat` package:

```bash
$ npm install --save rxjs-compat
```

#### New Import Syntax

Old syntax:
```typescript
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/Rx';

Observable.interval.map(...);

```


New syntax:
```typescript
import {Subject, Observable, Observer, Subscription} from 'rxjs';
import {interval} from 'rxjs';
import {map} from 'rxjs/operators';

interval.pipe(map(...));

```

