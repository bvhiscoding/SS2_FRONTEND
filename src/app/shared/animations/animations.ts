import {
  animate,
  animateChild,
  group,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

//
export const swipeInAnimation = trigger('routeAnimations', [
  transition(':increment', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ right: '-100%' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('300ms ease-out', style({ right: '100%' }))]),
      query(':enter', [animate('300ms ease-out', style({ right: '0%' }))]),
    ]),
  ]),
  transition(':decrement', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ left: '-100%' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('300ms ease-out', style({ left: '100%' }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))]),
    ]),
  ]),
]);
export const swipeFromTop = trigger('slideInOut', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)' }),
    animate('200ms ease-in', style({ transform: 'translateY(0%)' })),
  ]),
  transition(':leave', [
    animate('200ms ease-in-out', style({ transform: 'translateY(-100%)' })),
  ]),
]);

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-in', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('200ms ease-in-out', style({ opacity: 0 }))]),
]);
export const slideInTopLeaveBottom = trigger('slideInTopLeaveBottom', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)' }),
    animate('100ms ease-in', style({ transform: 'translateY(0%)' })),
  ]),
  transition(':leave', [
    style({ transform: 'translateY(0%)' }),
    animate('100ms ease-in-out', style({ transform: 'translateY(100%)' })),
  ]),
]);
export const swipeFromBottom = trigger('slideInOut', [
  transition(':enter', [
    style({ transform: 'translateY(100%)' }),
    animate('200ms ease-in', style({ transform: 'translateY(0%)' })),
  ]),
  transition(':leave', [
    animate('50ms ease-in', style({ transform: 'translateY(100%)' })),
  ]),
]);

export const swipeFromBottomSmooth = trigger('slideInOut', [
  transition(':enter', [
    style({ transform: 'translateY(100%)' }),
    animate('200ms ease-in-out', style({ transform: 'translateY(0%)' })),
  ]),
]);

export const flip = trigger('flipState', [
  state(
    'active',
    style({
      transform: 'rotateY(179deg)',
    })
  ),
  state(
    'inactive',
    style({
      transform: 'rotateY(0)',
    })
  ),
  transition('active => inactive', animate('350ms ease-out')),
  transition('inactive => active', animate('350ms ease-in')),
]);
