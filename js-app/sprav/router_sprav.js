// src/sprav/router_sprav.js

import { vuMain } from '../apps/view/vuMain.js';
// sprav
import { spravApi, spravMenu } from './spravApi.js';
import { vuSprav } from './view/vuSprav.js';
// routers
import { roLocal } from './router/roLocal.js';
import { roTfoms } from './router/roTfoms.js';
import { roOnko } from './router/roOnko.js';

const spravRouter = { [spravApi.root]: {
    render: function() {
       return m(vuMain, spravMenu,
          m(vuSprav, { text: "Медстатистика: Справочники" }));
    }
  }
}

Object.assign(spravRouter, roLocal, roTfoms, roOnko);

//m.route(document.getElementById('content'), "/", {})
m.route(document.body, "/", spravRouter);

  /*
  "/reflocal/dul-list": {
    render: function() {
      return m(vuMain,
        m(vuDul, {
          model: moModel.getModel( 'dul'),
          header: "Документы удостоверния личности",
          name: "ДУЛ",
          find: 2, // search in the first 2 table columns
          struct: moStruct.dul
        })
      );
    }
  },
   "/reflocal/categ-case": {
    render: function() {
      let cat = m(vuCateg, {
          model: moModel.getModel( 'kategor' ),
          header: "Категории ОМС",
          name: "Категория"
      });
      return m(vuMain, cat);
    }
  },
  "/reflocal/polis-type": {
    render: function() {
      let pol = m(vuPolis, {
          model: moModel.getModel( 'polis_type' ),
          header: "Полис ОМС",
          name: "Полис"
      });
      return m(vuMain, pol);
    }
  },
  "/reflocal/okato": {
    render: function() {
      return m(vuMain,
        m(vuOkato, {
          model: moModel.getModel( 'okato' ),
          header: "ОКАТО",
          name: "ОКАТО",
          find: 3, // search in the first 3 table columns
          struct: moStruct.okato
        })
      );
    }
  },
  "/reflocal/invalid-type": {
    render: function() {
      let inv = m(vuInvalid, {
          model: moModel.getModel( 'invalid_type' ),
          header: "Инвалидность",
          name: "Инвалидность"
      });
      return m(vuMain, inv);
    }
  },

    "/refederal": {
    render: function() {
      return m(vuMain, m(vuRoot, { text: "Cправочники федеральные" } ));
    }
  },
  
  "/refederal/dul-list": {
    render: function() {
      return m(vuMain,
        m(vuDul, {
          model: moModel.getModel( 'dul'),
          header: "Документы удостоверния личности",
          name: "ДУЛ",
          find: 2, // search in the first 2 table columns
          struct: moStruct.dul
        })
      );
    }
  },

  "/refederal/polis-type": {
    render: function() {
      let pol = m(vuPolis, {
          model: moModel.getModel( 'polis_type' ),
          header: "Полис ОМС",
          name: "Полис"
      });
      return m(vuMain, pol);
    }
  },

  "/refederal/okato": {
    render: function() {
      return m(vuMain,
        m(vuOkato, {
          model: moModel.getModel( 'okato' ),
          header: "ОКАТО",
          name: "ОКАТО",
          find: 3, // search in the first 3 table columns
          struct: moStruct.okato
        })
      );
    }
  },
  */


