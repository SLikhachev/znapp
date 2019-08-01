// src/reestr/router_reestr.js

import { vuApp, vuView } from '../apps/view/vuApp.js';
//report
import { reestrApi, reestrMenu } from './reestrApi.js';
// routers
import { roReestr } from './router/roReestr.js';
import { roInvoice } from './router/roInvoice.js';
import { roImport } from './router/roImport.js';

const reestrRouter = { [reestrApi.root]: {
    render: function () {
        return vuView(reestrMenu,
            m(vuApp, {text: "Медстатистика: Реестры ОМС"}));
    }
}
};

Object.assign(reestrRouter, roReestr, roInvoice, roImport);

m.route(document.body, "/", reestrRouter);

