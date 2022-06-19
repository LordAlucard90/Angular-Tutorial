import { animate, group, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    animations: [
        trigger('divState', [
            state(
                'normal',
                style({
                    'background-color': 'red',
                    transform: 'translateX(0)',
                }),
            ),
            state(
                'highlighted',
                style({
                    'background-color': 'blue',
                    transform: 'translateX(100px)',
                }),
            ),
            transition('normal <=> highlighted', animate(300)),
            // transition('normal => highlighted', animate(300)),
            // transition('highlighted => normal', animate(600)),
        ]),
        trigger('divWildState', [
            state(
                'normal',
                style({
                    'background-color': 'red',
                    transform: 'translateX(0) scale(1)',
                }),
            ),
            state(
                'highlighted',
                style({
                    'background-color': 'blue',
                    transform: 'translateX(100px) scale(1)',
                }),
            ),
            state(
                'shrunken',
                style({
                    'background-color': 'green',
                    transform: 'translateX(0px) scale(0.5)',
                }),
            ),
            transition('normal <=> highlighted', animate(500)),
            // transition('shrunken <=> *', animate(300)),
            transition('shrunken <=> *', [
                style({
                    'background-color': 'orange',
                }),
                animate(
                    1000,
                    style({
                        borderRadius: '50px',
                    }),
                ),
                animate(500),
            ]),
        ]),
        trigger('list1', [
            state(
                'in', // dummy name
                style({
                    opacity: 1,
                    transform: 'translateX(0)',
                }),
            ),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(-100px)',
                }),
                animate(300),
            ]),
            transition('* => void', [
                animate(
                    300,
                    style({
                        opacity: 0,
                        transform: 'translateX(100px)',
                    }),
                ),
            ]),
        ]),
        trigger('list2', [
            state(
                'in', // dummy name
                style({
                    opacity: 1,
                    transform: 'translateX(0)',
                }),
            ),
            transition('void => *', [
                animate(
                    1000,
                    keyframes([
                        style({
                            opacity: 0,
                            transform: 'translateX(-100px)',
                            offset: 0,
                        }),
                        style({
                            opacity: 0.5,
                            transform: 'translateX(-50px)',
                            offset: 0.3,
                        }),
                        style({
                            opacity: 1,
                            transform: 'translateX(-20px)',
                            offset: 0.8,
                        }),
                        style({
                            opacity: 1,
                            transform: 'translateX(0px)',
                            offset: 1,
                        }),
                    ]),
                ),
            ]),
            transition('* => void', [
                group([
                    animate(
                        300,
                        style({
                            color: 'red',
                        }),
                    ),
                    animate(
                        800,
                        style({
                            opacity: 0,
                            transform: 'translateX(100px)',
                        }),
                    ),
                ]),
            ]),
        ]),
    ],
})
export class AppComponent {
    state = 'normal';
    wildState = 'normal';
    list = ['Milk', 'Sugar', 'Bread'];

    onAnimate() {
        this.state = this.state === 'normal' ? 'highlighted' : 'normal';
        this.wildState = this.wildState === 'normal' ? 'highlighted' : 'normal';
    }

    onShrink() {
        this.wildState = 'shrunken';
    }

    onAdd(item: string) {
        this.list.push(item);
    }

    onDelete(item: string) {
        this.list = this.list.filter(el => el !== item);
    }

    onAnimationStarted(event: any) {
        console.log(event);
    }

    onAnimationFinished(event: any) {
        console.log(event);
    }
}
