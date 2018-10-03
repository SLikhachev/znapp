// src/clinic/common/tableToXls.js

const uri = 'data:application/vnd.ms-excel;base64,';
const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
	xmlns:x="urn:schemas-microsoft-com:office:excel"
	xmlns="http://www.w3.org/TR/REC-html40">
	<head>
	  <!--[if gte mso 9]>
		<xml>
		  <x:ExcelWorkbook>
		    <x:ExcelWorksheets>
			  <x:ExcelWorksheet>
			    <x:Name>{worksheet}</x:Name>
				<x:WorksheetOptions>
				  <x:DisplayGridlines/>
				</x:WorksheetOptions>
			  </x:ExcelWorksheet>
			</x:ExcelWorksheets>
		  </x:ExcelWorkbook>
	    </xml>
	  <![endif]-->
	  <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
	</head>
	<body>
	  <table>{table}</table>
	</body>
</html>`;
const base64 = function(s) {
  return window.btoa( unescape( encodeURIComponent(s) ));
}
const format = function(s, c) { 	    	 
  return s.replace( /{(\w+)}/g, (m, p) => c[p] );
}
/*
onst downloadURI = function(uri, name) {
  let link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.click();
}
*/
const tableToXlsProto = function(table, name="Лист1", fileName=null) {
  let tbl = table;
  if (!table.nodeType) tbl = document.getElementById(table);
  let ctx = { worksheet: name || 'Worksheet', table: tbl.innerHTML };
  return uri + base64( format( template, ctx ) );
  //let resuri = uri + base64( format( template, ctx ) );
  //downloadURI(resuri, fileName);
}

const tableToXls = function(table) {
  return tableToXlsProto(table);
}  



export { tableToXls };
// params: element id, sheet name, file name
//tableToExcel('resultTable','Смета', 'Ремрайон_смета.xls');