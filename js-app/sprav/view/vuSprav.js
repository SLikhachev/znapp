// src/sprav/view/vuSprav.js

import { vuView } from '../../apps/view/vuMain';
import { spravMenu } from '../spravMenu';

//export const vuView = (appMenu, view)=> m(vuMain, appMenu, view);
export const vuSprav = view => vuView({ spaMenu: spravMenu }, view);


