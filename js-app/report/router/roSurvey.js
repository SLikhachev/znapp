// src/report/router/roSurvey.js

// common
import { vuApp, vuView } from '../../apps/view/vuApp.js';
import { moModel } from '../model/moModel.js';
//report
import { appApi, appMenu } from '../reportApi.js';
// survey
import { vuHosp } from '../view/vuHosp.js';

const roSurvey = {
  [appApi.surv]: {
    render: function() {
      return vuView(appMenu, m(vuApp, { text: "Отчеты сводные" } ) );
    }
  },
  [appApi.surv_hosp]: {
    render: function() {
      let view = m(vuHosp, {
        header: "Госпитализация",
        model: moModel.getModel()
      });
      return vuView(appMenu, view);
    }
  },
  
}

export { roSurvey };