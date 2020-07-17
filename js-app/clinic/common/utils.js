
// src/clinic/view/vuClinic.js

export const getFIO = row => {
    let f = ['fam', 'im', 'ot'].map(k => row[k] ? row[k] : '');
    return `${f[0]} ${f[1]} ${f[2]}`;
}

export const _Num = num => num ? num : ''; //talon number

//talon editable
export const _notEdit = tal => {
    // 0- deleted 1- open (may edit) 2- closed
    //if (tal.talon_type === null || tal.talon_type === 1)
    // talon of the same year may edit
    // case of 1. mek else we can not send it twice in same year
    // same year may edit
    if ((moTalonsList.year == moTalonsList._year) && (tal.talon_type == 1))
        //console.log(tal.tal_num, tal.talon_type);
        return false; // may edit
    return true;
};

const _Name = name => name ? name : 'новый';
const tplName = (tal) => m('legend', `Шаблон ${_Name(tal.crd_num)}`);

export const talNum = function (tal, tpl = '') {
    return tpl ? tplName(tal) :
        m('legend', `Талон № ${_Num(tal.tal_num)}`,
            m('span', { style: "padding: 3em" }, _notEdit(tal) ? 'закрыт' : 'открыт'), `Год ${moTalonsList._year}`
        );
}

String.prototype.transLit = String.prototype.translit || function () {
    const rus = 'ЙЦУКЕНГШЩЗФЫВАПРОЛДЯЧСМИТЬ';
    const eng = 'QWERTYUIOPASDFGHJKLZXCVBNM';
    let i = rus.indexOf(this);
    if (i < 0) return this;
    return eng[i];
};

export const dupper = s => s.length > 0 ? s.charAt(0).toUpperCase().transLit() + s.substring(1) : s;
export const upper = s => s.charAt(0).toUpperCase() + s.substring(1).toLowerCase();

