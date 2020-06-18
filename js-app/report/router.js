// src/report/router_report.js

import { vuPageTitle } from '../apps/view/vuMain';

import { vuApp, vuView } from '../apps/view/vuApp.js';
//report
import { reportApi, reportMenu } from './reportApi.js';
// routers
import { roSurvey } from './router/roSurvey.js';
//import { roTfoms } from './router/roTfoms.js';
//import { roOnko } from './router/roOnko.js';

const reportRouter = {
  [reportMenu.root]: {
    render() {
      return vuReport(m(vuPageTitle, { text: states().suite.page }));
    }
  }
};

Object.assign(
  reportRouter,
  roRouter(survey),
)

m.route(document.body, "/", reportRouter);

