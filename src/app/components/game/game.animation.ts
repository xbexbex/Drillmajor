import {
    trigger,
    state,
    style,
    animate,
    transition
  } from '@angular/animations';

export const Animations = [
    trigger('gameFlyIn', [
        state('active', style({ opacity: 1, transform: 'translateX(0)' })),
        state('inactive', style({ opacity: 0, transform: 'translateX(0)' })),
        state('inactiveMenu', style({ opacity: 0, transform: 'translateY(0)' })),
        transition('inactive => active', [
            style({
                opacity: 0,
                transform: 'translateX(100%)'
            }),
            animate('0.5s ease-in')
        ]),
        transition('active => inactive', [
            animate('0.5s ease-out', style({
                opacity: 0
            }))
        ]),
        transition('active => inactiveMenu', [
            animate('0.3s ease-out', style({
                opacity: 0
            }))
        ]),
        transition('inactiveMenu => active', [
            animate('0.3s', style({
                opacity: 0,
                transform: 'translateY(-100%)'
            }))
        ])
    ]),
    trigger('menuFlyIn', [
        state('active', style({ opacity: 1, transform: 'translateX(0)' })),
        state('inactive', style({ opacity: 0, transform: 'translateX(0)' })),
        transition('inactive => active', [
            style({
                opacity: 0,
                transform: 'translateX(-100%)'
            }),
            animate('0.3s ease-in')
        ]),
        transition('active => inactive', [
            animate('0.3s ease-out', style({
                opacity: 0,
                transform: 'translateX(-100%)'
            }))
        ])
    ]),
    trigger('gameMenuFlyIn', [
        state('active', style({ opacity: 1, transform: 'translateY(0)' })),
        state('inactive', style({ opacity: 0, transform: 'translateY(0)' })),
        state('inactiveMenu', style({ opacity: 0, transform: 'translateX(0)' })),
        transition('* => active', [
            style({
                opacity: 0,
                transform: 'translateY(-100%)'
            }),
            animate('0.5s ease-in')
        ]),
        transition('active => inactive', [
            animate('0.1s ease-out', style({
                opacity: 0,
                transform: 'translateY(-100%)'
            }))
        ]),
        transition('active => inactiveMenu', [
            animate('0.5s ease-out', style({
                opacity: 0,
                transform: 'translateX(100%)'
            }))
        ])
    ])
];
