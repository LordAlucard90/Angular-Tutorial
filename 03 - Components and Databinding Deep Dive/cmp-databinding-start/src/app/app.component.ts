import {Component, ViewEncapsulation} from '@angular/core';
import { ServerElement } from './ServerElement';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class AppComponent {
  serverElements: ServerElement[] = [{type: 'server', name: 'Test Server', content: 'Dummy Content'}];

  onServerAdded(serverData: {serverName: string, serverContent: string}) {
    this.serverElements.push({
      type: 'server',
      name: serverData.serverName,
      content: serverData.serverContent
    });
  }

  onBlueprintAdded(blueprintData: {serverName: string, serverContent: string}) {
    this.serverElements.push({
      type: 'blueprint',
      name: blueprintData.serverName,
      content: blueprintData.serverContent
    });
  }

  onChangeFirst() {
    if (this.serverElements.length > 0) {
      this.serverElements[0].name = 'Changed!';
    }
  }

  onDestroyFirst() {
    this.serverElements.splice(0, 1);
  }
}
