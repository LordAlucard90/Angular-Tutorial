// Old
// import {Subject} from "rxjs/Subject";
// Current
import {Subject} from 'rxjs';

export class UserService {
  userActivated = new Subject<number>();
}
