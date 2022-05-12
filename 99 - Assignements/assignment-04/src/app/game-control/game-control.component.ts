import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-game-control',
    templateUrl: './game-control.component.html',
    styleUrls: ['./game-control.component.css'],
})
export class GameControlComponent implements OnInit {
    @Output() numberEmitter = new EventEmitter<number>();
    private isRunning: boolean = false;
    private curNumber = 0;
    private ref: any;

    constructor() { }

    ngOnInit() { }

    startGame() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.ref = setInterval(() => {
                this.numberEmitter.emit(this.curNumber);
                this.curNumber += 1;
            }, 1000);
        }
    }

    stopGame() {
        if (this.isRunning) {
            clearInterval(this.ref);
            this.isRunning = false;
            this.curNumber = 0;
        }
    }
}
