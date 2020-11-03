
//const $show = 'animation: bup_show 0.5s';
//const $hide = 'animation: bup_hide 0.5s';

'use strict';

export const toggle_bup = () => {
  let b = document.getElementById('bup');
  if (window.pageYOffset > 350) {
    b.classList.remove('bup_hide');
    b.classList.add('bup_show');
    //b.setAttribute('style', $show);
  } else {
    //b.setAttribute('style', $hide);
    b.classList.remove('bup_show');
    b.classList.add('bup_hide');
  }
  return false;
};

// POJO
export const vuBup = {

  onbeforeremove(vnode) {
    vnode.dom.classList.add('bup_hide');
    return new Promise(resolve => {
      vnode.dom.addEventListener('animationend', resolve);
    });
  },

  onclick() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    return false;
  },

  view() {
    return m('#bup.but__up.hvr.bup_show', {
      onclick: this.onclick,
      //style: 'opacity: 0'
    });
  }
};
