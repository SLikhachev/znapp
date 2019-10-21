// src/report/router/roSurvey.js

// common
import { vuApp, vuView } from '../../apps/view/vuApp.js';
import { moModel } from '../model/moModel.js';
import { moStruct } from '../model/moStruct.js';
//report
import { restReport, reportApi, reportMenu } from '../reportApi.js';
// survey
import { vuHosp } from '../view/vuHosp.js';
import { vuVolum } from '../view/vuVolum.js';

export const roSurvey = {
  [reportApi.surv]: {
    render: function() {
      return vuView(reportMenu, m(vuApp, { text: "Отчеты сводные" } ) );
    }
  },
  [reportApi.surv_hosp]: {
    render: function() {
      let view = m(vuHosp, {
        header: "Госпитализация отчет из файда ЕИР",
        model: moModel.getModel()
        
      });
      return vuView(reportMenu, view);
    }
  },
  [reportApi.surv_volum]: {
    render: function() {
      //console.log(pgRest.volum);
      let view = m(vuVolum, {
        header: "Обемы помощи приказ 146",
        model: moModel.getModel( restReport.volum ),
        struct: moStruct().p146_report,
        //form: true
      });
      return vuView(reportMenu, view);
    }
  },
}

