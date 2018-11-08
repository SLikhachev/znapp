// src/report/router/roSurvey.js

// common
import { vuApp, vuView } from '../../apps/view/vuApp.js';
import { moModel } from '../model/moModel.js';
import { moStruct } from '../model/moStruct.js';
//report
import { pgRest, appApi, appMenu } from '../reportApi.js';
// survey
import { vuHosp } from '../view/vuHosp.js';
import { vuVolum } from '../view/vuVolum.js';

const roSurvey = {
  [appApi.surv]: {
    render: function() {
      return vuView(appMenu, m(vuApp, { text: "Отчеты сводные" } ) );
    }
  },
  [appApi.surv_hosp]: {
    render: function() {
      let view = m(vuHosp, {
        header: "Госпитализация отчет из файда ЕИР",
        model: moModel.getModel()
        
      });
      return vuView(appMenu, view);
    }
  },
  [appApi.surv_volum]: {
    render: function() {
      //console.log(pgRest.volum);
      let view = m(vuVolum, {
        header: "Обемы помощи приказ 146",
        model: moModel.getModel( pgRest.volum ),
        struct: moStruct().p146_report,
        //form: true
      });
      return vuView(appMenu, view);
    }
  },
}

export { roSurvey };