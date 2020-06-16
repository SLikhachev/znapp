
// src/sprav/router/roRouter.js

import { tomatch, torender } from '../spravApi';
import { vuSprav } from '../view/vuSprav';
import { vuSheet } from '../view/vuSheet';

export const roRouter = route => ({
    [route.path.split(':')[0]]: {
        render() { return torender(route) }
    },
    [route.path]: {
        onmatch: tomatch(route, vuSheet),
        render(vnode) { return vuSprav(vnode); }
    },
});
