
// src/sparv/defines/spravPmus.js
// prof sprav definition

$cards = text => ({
  placeholder: text,
  style: "font-size: 1.2em",
})

export const clinicCards = {

  page: "Клиника: Карты",

  cards: {
    // count crads in db table
    count: {
      rest: {
        url: 'rpc/get_crd_count',
        method: "POST",
        params: { _tbl: 'cardz_clin' },
        //headers: { 'Accept': 'application/json' }
      }
    },
    // fetch list of cards by fetch form params
    rest: {
      url: "rpc/cards_list",
      method: "POST",
      params: { _tbl: 'cardz_clin', lim: 50, offs: 1 },
      //headers: { 'Accept': 'application/json' }
    },
    // form definition
    fetch: {
      q_crd: {
        tag: ['.input-find.pure-u-3-4'],
        attrs: $cards("Номер карты"),
        value: ''
      },
      q_fam: {
        tag: ['.input-find.pure-u-2-3'],
        attrs: $cards("Фамилия"),
        value: '',
      },
      q_im: {
        tag: ['.input-find.pure-u-2-3'],
        attrs: $cards("Имя"),
        value: ''
      },
    },
    item: {
      header: "Поиск карт по номеру и пациенту",
      //href: 'eq.',
      //pk: 'code_usl',
      struct: {
        crd_num: ['Карта'],
        fam: ['ФИО'],
        birth_date: ['Дата рождения'],
        polis_num: ['Номер полиса']
      }
    }
  },
}


export const cards = {
  path: '/cards/',
  name: "Карты",
  def: clinicCards,
  //items: [],
  router: 'cards'
};