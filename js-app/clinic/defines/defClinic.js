


export const $path = { cards: '/cards', talons: '/talons' };

// consult spec
export const $scons = [63];

const change_kol_usl = method => e => disp(
  ['pmu_kol_usl', method, e.target.getAttribute('data')]
);

export const del_usl = change_kol_usl('DELETE');
export const add_usl = change_kol_usl('PATCH');

const change_usl = (vnode, action) => (row, key, pk) => m(
  vnode, { data: row[pk], onclick: action }
);