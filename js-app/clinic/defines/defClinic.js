


export const $path = { 
  cards: '/cards', 
  talons: '/talons', 
  templs: '/templs' 
};


// consult spec
export const $scons = [63];


export const mkb10 = {
  rest: {
    params: {
      order: 'code'
    },
    headers: {
      'Range': '0-20'
    }
  },
  fetch: {
    code: {
      alias: 'ds1',
      params: 'like.*'
    }
  }
};