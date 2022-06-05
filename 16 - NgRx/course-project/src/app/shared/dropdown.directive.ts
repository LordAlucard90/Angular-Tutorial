import {Directive, ElementRef, HostBinding, HostListener} from '@angular/core';

@Directive({
    selector: '[appDropdown]',
})
export class DropdownDirective {
    @HostBinding('class.open') isOpen: boolean = false;

    constructor(private elRef: ElementRef) {
        // console.log(elRef)
    }

    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
        this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
    }
    // @HostListener('click') toggle() {
    //     this.isOpen = !this.isOpen;
    // }
}
