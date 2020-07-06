
// src/reestr/defines/defImport.js
// packages definition

import { $month, $checkbox, $button } from '../../apps/defines/defStruct';

export const reestrImport = {

  page: "Импорт реестров",

  dbf: {
    task: {
      url: "/reestr/import/dbf",
      form: {
        legend: "Импорт файла DBF",
        file: { type: 'file' },
        month: $month,
        test: $checkbox("Тест")
      },
      buttons: {
        but1: $button("Загрузить")
      }
    },
    item: {
      name: "Файлы реестров (DBF)",
      header: "Импорт файлов реестров DBF"
    }
  }
}

export const impo = {
  path: '/impo/:item',
  name: "Импорт",
  def: reestrImport,
  items: ['dbf']
};