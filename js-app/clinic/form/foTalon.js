
// label = [class, text]
// input = tag = [class, type, required]

const month = function () {
    let d = new Date();
    return d.getMonth() + 1;
 };

export const talonField = {

  open_date: { label: ['', "Открыт"], input: {
      tag: ['.pure-u-22-24', "date", 1, true],
      attrs: {style: "height: 45%",}
    }
  },
  close_date: { label: ['', "Закрыт"], input: {
      tag: ['.pure-u-22-24', "date", 2, true],
      attrs: {style: "height: 45%",}
    }
  },
  talon_month: { label: ['.leg-sec.red', "Месяц талона"], input: {
      tag: ['.pure-u-6-24.tal_month', 'number', 3, false],
      attrs: {
        style: "height: 45%", min: 1, max: 12,
        fval: v => v ? v : month()
      }
    }
  },
  first_vflag: { label: ['', "Первичный", 'check'], input: {
      tag: ['', "checkbox", 4, false],
      attrs: {style: "margin-right: 0.7em"}
    }
  },
  for_pom: { label: ['', "Неотложный", 'check'], input: {
      tag: ['', "checkbox", 5, false],
      attrs: {style: "margin-right: 0.7em", fcheck: v => v == 2 } // type coercion
    }
  },
  finality: { label: ['', "Закончен", 'check'], input: {
      tag: ['', "checkbox", 6,  false],
      attrs: {style: "margin-right: 0.7em"}
    }
  },
  ist_fin: { label: ['', "Оплата"], input: {
      tag: ['.pure-u-18-24', "text", 7, true],
      //attrs: { min: 1, max: 9}
    }
  },
  purp: { label: ['', "Цель"], input: {
      tag: ['.pure-u-18-24', 'number', 8, true],
      attrs: { min: 0, max: 33}
    }
  },
  doc_spec: { label: ['', "Врач"], input: {
      tag: ['.pure-u-22-24', "number", 9, true],
      attrs: { placeholder: "Спец"}
    }
  },
  doc_code: { label: ['', "Код"], input: {
      tag: ['.pure-u-22-24', "number", 10, true]
    }
  },
  visit_pol: {label: ['', "Амбул"], input: {
    tag: ['.pure-u-20-24', 'number', 11]
    }
  },
  visit_home: {label: ['', "На дом"], input: {
      tag: ['.input.pure-u-20-24', "number", 12]
    }
  },
  ds1: {label: ['', "Осн. диагноз"], input: {
      tag: ['.input.pure-u-20-24', "text", 13, true]
    }
  },
  char1: {label: ['', "Характер"], input: {
      tag: ['.input.pure-u-16-24', "text", 14, true]
    }
  },
  ishod: {label: ['', "Исход"], input: {
      tag: ['.input.pure-u-16-24', "text", 15, true]
    }
  },
  travma_type: {label: ['', "Травма"], input: {
      tag: ['.input.pure-u-14-24', "text", 16]
    }
  },
  ds2: {label: ['', "Доп. диагноз"], input: {
      tag: ['.input.pure-u-20-24', "text", 17]
    }
  },
  char2: {label: ['', "Характер"], input: {
      tag: ['.input.pure-u-16-24', "text", 18]
    }
  },

};

export const pmuAdd = {
  code_usl: { label: ['', 'Код ПМУ'], input: {
      tag: ['.input-find.pure-u-3-4', "text"],
      //attrs: { placeholder: 'Номер' }
    }
  },
  ccode: { label: ['', 'Номер ПМУ'], input: {
      tag: ['.input-find.pure-u-3-4', "number"],
      //attrs: { placeholder: 'Номер' }
    }
  },
  grup: { label: ['', 'Группа ПМУ'], input: {
      tag: ['.input-find.pure-u-3-4', "number"],
      //attrs: { placeholder: 'Номер' }
    }
  },
  
};

