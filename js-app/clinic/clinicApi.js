
'use strict';

// src/report/reportApi.js
/**
  */
import { up } from '../apps/utils';
import { states, update, initApp } from '../apps/appApi';
import { clinicMenu } from './clinicMenu';

import { dispSuite} from './dispatch/dispSuite';
import { dispOptions } from './dispatch/dispOptions';
import { dispUnit } from './dispatch/dispUnit';
import { dispCard } from './dispatch/dispCard';
import { dispTalon } from './dispatch/dispTalon';
import { dispSave } from './dispatch/dispSave';
import { dispPmu } from './dispatch/dispPmu';


const Actions = (state, update) => {
  
  const api = function () {
    
    // stream of states
    this.state = state;
    this.stup = d => up(update)(d);
    this._reject = err => Promise.reject(err);
    this._catch = err => this.stup(err);
    this.F = () => false;
    
    dispSuite.call(this);
    dispOptions.call(this);
    dispUnit.call(this);
    dispCard.call(this);
    dispTalon.call(this);
    dispSave.call(this);
    dispPmu.call(this);
  };
    
  return new api();

};    


//const actions = Actions(states, update); //=> obj of func ref

export const initClinic = () => initApp(
  { suite: { page: "Медстатстика: Поликлиника" },
    inited: true
  },
  clinicMenu,
  Actions(states, update)
);
