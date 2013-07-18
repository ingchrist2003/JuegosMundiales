// JavaScript Document
// seccion posiciones

//variables informacion
var titulo_posi;
var nid_posi;
var descripcion_posi;
var fecha_posi;
var listadoposi = "";
var fechaupd_posi = ""; //fecha de la última actualización 
var posiarray = new Array() ;
var nidsposiarray = new Array() ;
//

/*Posiciones*/
function leerBasePosi()
{
	var db;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(leerBDPosi,errorDB);
}

function leerBDPosi(tx)
{
	tx.executeSql('SELECT * FROM POSICIONES ORDER BY oro desc, plata desc, bronce desc, titulo asc LIMIT 0,20',[],mostrarResultadosPosi,errorDB)
}	


function mostrarResultadosPosi(tx,resultados)
{
	var lista = "";
	var contenedor = document.getElementById('scroller');
	var ancho = contenedor.offsetWidth;
	var numcars = 0;
	//rangos de texto a mostrar en el resumen
	if(ancho <= 400)
	{
		numcars = 150;
	}else if(ancho >400 && ancho < 600)
	{
		numcars = 300;
	}else{
		numcars = 450;
	}
	//
	if(resultados.rows.length==0)
	{
		lista += "<li>";
		lista += "No se encontraron contenidos";
		lista += "</li>";
	}else{
		lista += "<li>";
		lista += '<table data-role="table" id="movie-table" data-mode="reflow" class="ui-responsive table-stroke" width="100%">';
		lista += '<thead>';
		lista += '<tr>';
		lista += '<th data-priority="1">Posición</th>';
		lista += '<th data-priority="persist">País</th>';
		lista += '<th data-priority="2">Oro</th>';
		lista += '<th data-priority="3">Plata</th>';
		lista += '<th data-priority="4">Bronce</th>';
		lista += '</tr>';
		lista += '</thead>';
		lista += '<tbody>';
		
		
		for(i=0;i<resultados.rows.length;i++)
		{
			//var abstract = resultados.rows.item(i).descripcion;
			var cadtexto = resultados.rows.item(i).descripcion;
			var abstract = $('#tempo').html(cadtexto).text();
			
			lista += '<tr>';
			lista += '<th>'+(i+1)+'</th>';
			lista += '<td>'+resultados.rows.item(i).titulo+'</td>';
			lista += '<td>'+resultados.rows.item(i).oro+'</td>';
			lista += '<td>'+resultados.rows.item(i).plata+'</td>';
			lista += '<td>'+resultados.rows.item(i).bronce+'</td>';
			lista += '</tr>';
			
			
		}
		lista += '</tbody>';
		lista += '</table>';
		lista += "</li>";
	}
	document.getElementById("thelist").innerHTML=lista;
	document.getElementById("lista4").innerHTML=lista;
	pullDownAction();
	myScroll.refresh();
}



function borrarRepetidasPosi(tx)
{
	tx.executeSql('DELETE FROM POSICIONES WHERE nid in ('+listadoposi+') ')
}
function agregarPosiciones()
{
	var db;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(agregarPosicionesSQL,errorDB,leerBasePosi);
}
function agregarPosicionesSQL(tx)
{
	var nume = posiarray.length;
	var elemactual = new Array();
	for(i = 0; i < nume ; i++)
	{
		var elemactual = posiarray[i];
		var nidact = elemactual[0];
		var tituloact = elemactual[1];
		var descripcionact = elemactual[2];
		var oro = elemactual[3];
		var plata = elemactual[4];
		var bronce = elemactual[5];
		var fechacre = elemactual[6];
		var fechaact = elemactual[7];
		tx.executeSql('INSERT INTO POSICIONES (titulo,nid,descripcion,oro,plata,bronce,fecha_creacion,fecha_actualizacion)  VALUES ("'+tituloact+'","'+nidact+'","'+descripcionact+'","'+oro+'","'+plata+'","'+bronce+'","'+fechacre+'","'+fechaact+'")');
	}
}

function actualizarPosiciones()
{
	var db;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(actualizarPosiBD,errorDB,cargaXMLPosiciones);
}
function actualizarPosiBD(tx)
{
	tx.executeSql('SELECT * FROM POSICIONES ORDER BY fecha_actualizacion DESC LIMIT 0,1',[],resultLastUpdatePosi,errorDB)
}	
function resultLastUpdatePosi(tx,resultados)
{
	if(resultados.rows.length>0)
	fechaupd_posi = resultados.rows.item(0).fecha_actualizacion;
}
function cargaXMLPosiciones() {
	posiarray = [];
	nidsposiarray = [];
	$.ajax({
    	type: "GET",
        url: "http://juegosmundiales2013.co/posiciones.php?fechaupd="+fechaupd_posi,
		data: 'fechaupd='+fechaupd_posi,
        dataType: "xml",
        success: function(xml) {
			$(xml).find('posicion').each(function(){
				var posicion = new Array();
				var nid = $(this).find('nid').text();
				var titulo = $(this).find('titulo').text();
				var descripcion = $(this).find('descripcion').text();
				var oro = $(this).find('oro').text();
				var plata = $(this).find('plata').text();
				var bronce = $(this).find('bronce').text();
				var fechacre = $(this).find('fechacreacion').text();
				var fechaupd = $(this).find('fechaactualizacion').text();
				
				posicion[0] = nid;
                posicion[1] = titulo;
                posicion[2] = descripcion;
                posicion[3] = oro;
				posicion[4] = plata;
				posicion[5] = bronce;
				posicion[6] = fechacre;
				posicion[7] = fechaupd;
                
				posiarray.push(posicion);
				nidsposiarray.push(nid);
			});
			creacionPosicion();
        },
		error: function(xhr, error){
			leerBasePosi();
		}
	});
}

function creacionPosicion()
{
	listadoposi = nidsposiarray.join(",");
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(borrarRepetidasPosi,errorDB,agregarPosiciones);	
}

/*Detalle*/

/*Detalle*/
