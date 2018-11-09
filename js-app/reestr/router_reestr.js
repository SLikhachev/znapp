// src/reestr/router_reestr.js

import { vuApp, vuView } from '../apps/view/vuApp.js';
//report
import { appApi, appMenu } from './reestrApi.js';
// routers
import { roImport } from './router/roImport.js';
//import { roTfoms } from './router/roTfoms.js';
//import { roOnko } from './router/roOnko.js';

const reestrRouter = { [appApi.root]: {
    render: function () {
        return vuView(appMenu,
            m(vuApp, {text: "Медстатистика: Реестры ОМС"}));
    }
}
};

Object.assign(reestrRouter, roImport)

m.route(document.body, "/", reestrRouter);

