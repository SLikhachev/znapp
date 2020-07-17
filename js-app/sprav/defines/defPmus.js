
// src/sparv/defines/spravPmus.js
// prof sprav definition

import { linkItem } from '../../apps/defines/defStruct';


export const spravPmus = {

  page: "Простые медуслуги (ПМУ)",

  pmus: {
    rest: {
      url: 'pmu',
      params: { order: 'code_usl.asc', limit: 20 },
      options: ['usl_grup']
    },
    fetch: {
      ccode: {
        //label: ["Номер услуги"],
        type: 'number',
        tag: ['.pure-u-1-8'],
        attrs: { placeholder: "Номер услуги", min: 1 },
        params: 'gte.'
      },
      code_usl: {
        //label: ["Код услуги"],
        tag: ['.pure-u-1-8'],
        attrs: { placeholder: "Код услуги" },
        params: 'ilike.*'
      },
    },
    item: {
      find: 0,
      href: 'eq.',
      name: "ПМУ",
      editable: ['add'],
      editable_fields: ['ccode', 'code_podr', 'code_spec'],
      //pk: 'code_usl',
      struct: {
        code_usl: { th: ['Код услуги', '', linkItem], tag: ['', 'required'] },
        ccode: ['Номер'],
        name: { th: ['Наименование'], tag: ['', 'required'] },
        code_podr: ['Подразд.'],
        code_spec: ['Спец.']
      }
    },
  },
  // pmu_grup (id, name)
  pmu_grup: {
    rest: {
      params: { order: 'id.asc', limit: 20 },
      options: ['grup_usl']
    },
    fetch: {
      id: {
        //label: ["Номер услуги"],
        type: 'number',
        tag: ['.pure-u-1-8'],
        attrs: { placeholder: "Номер группы", min: 1 },
        params: 'gte.'
      },
    },
    item: {
      find: 0,
      href: 'eq.',
      name: "Группы ПМУ",
      editable: ['add'],
      editable_fields: ['name'],
      struct: {
        id: ['Номер группы', '', linkItem],
        name: ['Имя группы'],
      }
    },
  },

  // M2M table: pmu_grup_code (grup:: pmu_grup.id, code_usl:: noref )
  pmu_grup_code: {
    item: {
      name: "",
      pk: 'grup',
      editable_fields: ['grup', 'code_usl']
    }
  }, //pgr

  // function (code_usl) -> pmu_grup(id, name); select * from get_pgc('A11.25.002')
  // select all grups where usl is present
  usl_grup: {
    rest: {
      url: 'rpc/get_pgc',
      method: 'POST',
      body: ['code_usl'],
      params: {}
    },
    item: {
      struct: {
        id: ['Номер группы'],
        name: ['Имя группы'],
      },
    },
  },

  // select all usl present in current grup
  // 
  grup_usl: {
    rest: {
      url: 'rpc/get_grc',
      method: 'POST',
      body: ['id'],
      params: {}
    },
    item: {
      struct: {
        code_usl: ['Код услуги'],
        name: ['Наименование'],
      },
    }, // grc
  }
}


export const pmus = {
  path: '/pmus/:item',
  name: "ПМУ",
  def: spravPmus,
  items: ['pmus', 'pmu_grup'],
  router: 'pmus'
};