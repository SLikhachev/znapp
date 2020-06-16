
// src/sparv/struct/spravStruct.js
/**
    spravStruct object of ITEMs define the app states, the table or view or proc of DB
    every ITEM is an object present the item state
    the name of item is a state name ( and the endpoint of the rest api by default )
    itemName: {
    // rest api interface define rest api endpoint if any
      // defaul absent and endpoint is an item name and no prarms and no options
      rest: {
        url: String REST table name (defalut item name is a table name) if any 
        params: Object present the query params ( default { order_by: 'id' } ) if any
        options: Array of items' objects to query in option with this item 
      },
      // item object define the item properties 
      item: {
        find: Number, defines how number table comns includes in find finction
        name: String define the item name in navigation
        // Array present the allowed action with object item
        editable: ['add', 'edit'. 'del'] default no actions allowed
        edit_fields: Array of Strings, fields' names which allowed to edit default all fields exclude 'id'  
        pk: String primary key for sql model table dafault id
        
        // if struct is abcent in definition then this idName object used by default
        struct: Object of returned rest data fields name and array of their names
          { 
            field_name: [ UI_table_name: String, sortable: bool ] ...
          }
      }  
    }

*/

// this func return the default struct object to render table
export const idName = {
  id: { th: ["Код", 'sort'], type: 'number', tag: ['.lcode', 'readonly'] },
  name: { th: ["Описаение", 'sort'], tag: ['', 'required'] }
}

