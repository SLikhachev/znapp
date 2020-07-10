
// src/sparv/defines/spravPmus.js
// prof sprav definition

export const clinicCards = {

  page: "Клиника: Карты",

  cards: {
    rest: {
      url: 'pmu',
      params: { order: 'code_usl.asc', limit: 20 },
      options: ['usl_grup']
    },
    fetch: {
      q_crd: {
        tag: ['.input-find.pure-u-3-4'],
        attrs: { placeholder: "Номер карты", style: "font-size: 1.2em" }
      },
      q_fam: {
        tag: ['.input-find.pure-u-2-3'],
        attrs: { placeholder: "Фамилия", style: "font-size: 1.2em" }
      },
      q_im: {
        tag: ['.input-find.pure-u-2-3'],
        attrs: { placeholder: "Имя", style: "font-size: 1.2em" }
      },
    },
    item: {
      href: 'eq.',
      //pk: 'code_usl',
      struct: {
        crd_num: ['Карта'],
        fam: ['ФИО'],
        birth_date: ['Дата рождения'],
        polis_num: ['Номер полиса']
      };
    }
  },
}


export const cards = {
  path: '/cards/:crd',
  name: "Карты",
  def: clinicCards,
  items: [],
  router: 'cards'
};