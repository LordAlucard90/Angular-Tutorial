import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy,
    ViewChild,
    ElementRef,
    ContentChild,
} from '@angular/core';
import { ServerElement } from '../ServerElement';


@Component({
    selector: 'app-server-element',
    templateUrl: './server-element.component.html',
    styleUrls: ['./server-element.component.css'],
})
export class ServerElementComponent
    implements
    OnInit,
    OnChanges,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy {
    @Input('srvElement') element: ServerElement = {} as ServerElement;
    @Input() name: string = '';
    @ViewChild('heading', { static: true }) header: ElementRef = {} as ElementRef;
    @ContentChild('contentParagraph', { static: true }) paragraph: ElementRef = {} as ElementRef;

    constructor() {
        console.log('constructor!');
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('ngOnChanges!');
        console.log(changes);
    }

    ngOnInit() {
        console.log('ngOnInit!');
        console.log('header: ' + this.header.nativeElement.textContent);
        console.log('paragraph: ' + this.paragraph.nativeElement.textContent);
    }

    ngDoCheck() {
        console.log('ngDoCheck!');
    }

    ngAfterContentInit() {
        console.log('ngAfterContentInit!');
        console.log('paragraph: ' + this.paragraph.nativeElement.textContent);
    }

    ngAfterContentChecked() {
        console.log('ngAfterContentChecked!');
    }

    ngAfterViewInit() {
        console.log('ngAfterViewInit!');
        console.log('header: ' + this.header.nativeElement.textContent);
    }

    ngAfterViewChecked() {
        console.log('ngAfterViewChecked!');
    }

    ngOnDestroy() {
        console.log('ngOnDestroy!');
    }
}
