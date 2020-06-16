

export const fieldFrom = function (fromObj, field, data, to_attrs = {}) {
  //console.log(fromObj);
  // fromObj - object with form fields (label, input) description
  // field - fromObj attribute name for form field (form input tag name is equal  to attr name)
  // data - object gets actual data from (model field)
  // to_attrs = additional attrs to be set to input tag

  // this is standard onblur function
  const fblur = e => data[field] = e.target.value;
  const fval = v => v ? v : '';

  let { label, input } = fromObj[field];
  let { tag, attrs = {} } = input;
  let t = tag[2] ? `[tabindex=${tag[2]}]` : '';
  let r = tag[3] ? '[required]' : '';
  let tg = `input${tag[0]}[name=${field}][type=${tag[1]}]${t}${r}`;

  attrs.value = attrs.fval === undefined ? fval(data[field]) : attrs.fval(data[field]);
  //attrs.value= data[field] ? data[field] : '';
  attrs.onblur = attrs.fblur === undefined ? fblur : null;
  //attrs
  attrs = Object.assign(attrs, to_attrs);
  //console.log(attrs);
  let lt;
  if (label.length > 0) {
    lt = `label${label[0]}[for=${field}]`;
    // third elem only for checkbox
    if (label.length > 2) { //firstly on first render time

      attrs.checked = //attrs.checked ? attrs.checked :
        attrs.fcheck ? attrs.fcheck(data[field]) : Boolean(data[field]);
      delete attrs.value;
      delete attrs.onblur;
      return m(lt, m(tg, attrs), label[1]);
    }
    return [m(lt, label[1]), m(tg, attrs)];
  }
  return [m(tg, attrs)];

}
/*
export const formInput = (data, name, attrs) => {
  //console.log(fromObj);
  // fromObj - object with form fields (label, input) description
  // field - fromObj attribute name for form field (form input tag name is equal  to attr name)
  // data - object gets actual data from (model field)
  // to_attrs = additional attrs to be set to input tag

  // this is standard onblur function
  const fblur = e => data[field] = e.target.value;
  const fval = v => v ? v : '';

  let { label, input } = fromObj[field];
  let { tag, attrs = {} } = input;
  let t = tag[2] ? `[tabindex=${tag[2]}]` : '';
  let r = tag[3] ? '[required]' : '';
  let tg = `input${tag[0]}[name=${field}][type=${tag[1]}]${t}${r}`;

  attrs.value = attrs.fval === undefined ? fval(data[field]) : attrs.fval(data[field]);
  //attrs.value= data[field] ? data[field] : '';
  attrs.onblur = attrs.fblur === undefined ? fblur : null;
  //attrs
  attrs = Object.assign(attrs, to_attrs);
  //console.log(attrs);
  let lt;
  if (label.length > 0) {
    lt = `label${label[0]}[for=${field}]`;
    // third elem only for checkbox
    if (label.length > 2) { //firstly on first render time

      attrs.checked = //attrs.checked ? attrs.checked :
        attrs.fcheck ? attrs.fcheck(data[field]) : Boolean(data[field]);
      delete attrs.value;
      delete attrs.onblur;
      return m(lt, m(tg, attrs), label[1]);
    }
    return [m(lt, label[1]), m(tg, attrs)];
  }
  return [m(tg, attrs)];

}
*/