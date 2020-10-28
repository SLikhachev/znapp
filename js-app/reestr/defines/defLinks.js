
import { $path } from '../../clinic/defines/defClinic';


export const _appref = app => {
  let path = location.href.split('/').slice(0, 3);
  path[1] = '/';
  path.push(`${app}/#!`);
  return path.join('/');
};


export const linkCard = (row, key, pk) => ([
  m('a',
    {
      href: `${_appref('clinic')}${$path.cards}/${row.crd_num}`,
      target: '_blank'
    },
    row.crd_num
  ),
  '.choice.blue',
]);


export const linkTalon = (row, key, pk) => ([
  m('a',
    {
      href: `${_appref('clinic')}${$path.talons}/${row.crd_num}/${row.tal_num}`,
      target: '_blank'
    },
    row.tal_num
  ),
  '.choice.blue',
]);