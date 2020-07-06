
// src/reestr/defines/defXmlerrr.js
// packages definition

import { $button } from '../../apps/defines/defStruct';
//import { _mo } from '../../apps/model/moModel';

const packType = {
  1: "Амбулаторный",
  2: "Онкология",
}

export const xmlErrors = {

  page: "Правим ошибки реестра",

  ximp: {
    /*
    rest: {
      url: "vmx_errors",
      params: { limit: 50 } // show vmx errors
    },
    */
    task: {
      url: "/reestr/xml/vmx",
      get: "/utils/file/reestr/vmx/", //GET report file  
      form: {
        legend: "Тип файла ошибок",
        file: { type: 'file' },
        pack: {
          label: ["Тип протокола"],
          tag: ['.ml10'],
          type: 'select',
          options: packType,
          attrs: { 'data-initial': 1 }
        }
      },
      buttons: {
        butt1: $button("Импорт")
      },
    },
    item: {
      name: "Импорт ошибок",
      header: "Импорт протокола ошибок (XML файл)",
      struct: {
        tal_num: ['Талон'],
        crd_num: ['Карта'],
        error: ['Ошибка']
      }
    },
  },
}


export const xerr = {
  path: '/xerr/:item',
  name: "Ошибки",
  def: xmlErrors,
  items: ['ximp']
};