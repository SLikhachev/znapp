

export const file_field= (data) => {
  return [
    m('input.inputfile[type="file"][name="file"][id="file"]',
      {'data-multiple-caption': "{count} files selected",
      'multiple':false, onblur: e=> data.file= e.target.value.split( '\\' ).pop() }
    ),
    m('label[for="file"]', m('strong', "Выбрать файл"))
  ];
}

export const form_file_dom= vnode=>  {
  let inputs = vnode.dom.querySelectorAll('.inputfile');
  Array.prototype.forEach.call( inputs, input=> {
    let label	 = input.nextElementSibling, labelVal = label.innerHTML;
    input.addEventListener( 'change', e=> {
      let fileName = '', el= e.target;
      //console.log(el.files, el.value);
      if( el.files && el.files.length > 1 )
        fileName = ( el.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', el.files.length );
      else
        fileName = el.value.split( '\\' ).pop();
      
      if( fileName )
        label.querySelector( 'strong' ).innerHTML = fileName;
      else
        label.innerHTML = labelVal;
    });
  });
};
