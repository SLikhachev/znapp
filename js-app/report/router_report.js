// src/report/router_report.js

import { vuApp, vuView } from '../apps/view/vuApp.js';
//report
import { appApi, appMenu } from './reportApi.js';
// routers
import { roSurvey } from './router/roSurvey.js';
//import { roTfoms } from './router/roTfoms.js';
//import { roOnko } from './router/roOnko.js';

const reportRouter = { [appApi.root]: {
    render: function() {
       return vuView( appMenu,
          m(vuApp, { text: "Медстатистика: Отчеты" }));
    }
  }
}

Object.assign(reportRouter, roSurvey) //, roTfoms, roOnko);

m.route(document.body, "/", reportRouter);

