// src/report/router/roSurvey.js

// common
import { moModel } from '../../apps/model/moFormModel.js';
import { vuApp, vuView } from '../../apps/view/vuApp.js';
import { moStruct } from '../model/moStruct.js';
//report
import { taskReport, restReport, reportApi, reportMenu } from '../_reportApi.js';
// survey
import { vuHosp } from '../view/vuHosp.js';
import { vuVolum } from '../view/vuVolum.js';

export const roSurvey = {
  [reportApi.surv]: {
    render: function () {
      return vuView(reportMenu, m(vuApp, { text: "Отчеты сводные" }));
    }
  },
  [reportApi.surv_hosp]: {
    render: function () {
      let view = m(vuHosp, {
        header: "Госпитализация отчет из файда ЕИР",
        model: moModel.getModel(taskReport.hosp.post_url)

      });
      return vuView(reportMenu, view);
    }
  },
  [reportApi.surv_volum]: {
    render: function () {
      let view = m(vuVolum, {
        header: "Обемы помощи приказ 146",
        model: moModel.getModel(restReport.volum.url),
        params: restReport.volum.params,
        struct: moStruct().p146_report,

      });
      return vuView(reportMenu, view);
    }
  },
}

