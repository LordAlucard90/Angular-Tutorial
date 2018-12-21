import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appBetterHighlight]'
})
export class BetterHighlightDirective implements OnInit{

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) { }

  ngOnInit(): void {
    this.renderer.setStyle(this.elementRef.nativeElement,
                            'background-color',
                            'blue');
  }

}
