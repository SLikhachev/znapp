
// label = [class, text], if null no label
// input = tag = [class, type, tabindex (int), required(bool)]
// input attrs: attrs fval - value function, fblur - onblur function

export const cardField = {

  //vfunc:  v => v ? v : '',
  //smo_val: v => v ? v - 250000: '',

  crd_num: { label: ['', "Номер карты"], input: {
      tag: ['', "text", 1, true],
      attrs: { autofocus: true }
    }
  },
  fam: { label: ['', ''], input: {
      tag: ['', 'text', 2, false],
      attrs: { placeholder: "Фамилия" }
    }
  },
  im: { label: ['', ''], input: {
      tag: ['', 'text', 3, false],
      attrs: { placeholder: "Имя" }
    }
  },
  ot: { label: ['', ''], input: {
      tag: ['', 'text', 4, false],
      attrs: { placeholder: "Отчество" }
    }
  },
  birth_date: { label: ['', 'Дата рождения'], input: {
      tag: ['', 'date', 5, true],
      //attrs: { }
    }
  },
  dul_type: {label: ['', 'Тип документа'], input: {
      tag: ['.pure-u-1-6', 'number', 6, false],
      attrs: { min: 1 }
    }
  },
  dul_serial: {label: ['', "Документ"], input: {
      tag: ['', 'text', 7, false],
      attrs: { placeholder: "Серия" }
    }
  },
  dul_number: {label: ['', ''], input: {
      tag: ['', 'text', 8, false],
      attrs: { placeholder: "Номер" }
    }
  },
  polis_ser: {label: ['', "Полис серия"], input: {
      //tag: ['.pure-u-1-6', 'text', 9, false],
      tag: ['', 'text', 9, false],
      //attrs: {  placeholder:"Серия" }
  }},
  polis_num: {label: ['', "Номер"], input: {
      //tag: ['.pure-u-3-6', 'text', 10, false],
      tag: ['', 'number', 10, true],
      attrs: { min : 1 }
  }},
  smo: {label: ['', "Страховщик"], input: {
      //tag: ['.pure-u-1-6', 'text', 11, false],
      //attrs: { pattern: "[0-9]*" }
  }},
  smo_okato: {label: ['', "Регион"], input: {
      tag: ['', 'text', 12, false],
      attrs: { list:  "okato", fblur: true }
  }},
  mo_att: {label: ['',  "Прикреплен к МО"], input: {
      tag: ['.pure-u-1-6', 'number', 13, false],
      //attrs: { }
    }
  },
  city_g: {label: [], input: {
      tag: ['', 'text', 14, false],
      attrs: { placeholder: "Город" }
  }},
  street_g: {label: [], input: {
      tag: ['', 'text', 15, false],
      attrs: { placeholder: "Улица" }
  }},
  home_g: {label: [], input: {
      tag: ['.pure-u-1-8', 'text', 16, false ],
      attrs: { placeholder: "Дом" }
  }},
  corp_g: {label: [], input: {
    tag: ['.pure-u-1-8', 'text',  17, false ],
    attrs: { placeholder: "Корпус" }
  }},
  flat_g: {label: [], input: {
    tag: ['.pure-u-1-8', 'text',  18, false ],
    attrs: { placeholder: "Кв" }
  }},
  phone_wrk: {label: [], input: {
    tag: ['', 'text',  19, false ],
    attrs: { placeholder: "Мобильный тел" }
  }},
  phone_hom: {label: [], input: {
    tag: ['', 'text',  20, false ],
    attrs: { placeholder: "Контактный тел" }
  }},
};

export const talCard = {
    fam: { label: [], input: {
      tag: ['.pure-u-22-24', "text"],
      attrs: { placeholder: 'Фамилия' }
    }},
    im: {label: [], input: {
      tag: ['.pure-u-22-24', "text"],
      attrs: { placeholder: 'Имя'}
    }},
    ot: {label: [], input: {
      tag: ['.pure-u-22-24', "text"],
      attrs: { placeholder: 'Отчество'}
    }},
    birth_date: { label: ['', 'Дата рождения'], input: {
      tag: ['', "date"],
      //attrs: {}
    }},
    polis_ser: { label: ['', 'Полис (редактируем в карте)'], input: {
      tag: ['', "text"],
      attrs: { placeholder: 'Серия', readonly: true }
    }},
    polis_num: { label: [], input: {
      tag: ['', "text"],
      attrs: { placeholder: 'Номер', readonly: true}
    }},
    smo: {label: ['', 'СМО'], input: {
      tag: ['', "text"],
      attrs: {},
    }},   
};
