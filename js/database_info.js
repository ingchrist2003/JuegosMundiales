// JavaScript Document
// seccion informacion

//variables informacion
var titulo_info;
var nid_info;
var descripcion_info;
var urlima_info;
var fecha_info;
var listadoinfo = "";
var fechaupd_info = ""; //fecha de la última actualización 
var infoarray = new Array() ;
var nidsinfoarray = new Array() ;
//

/*Noticias*/
function leerBaseInfo()
{
	var db;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(leerBDInfo,errorDB);
}

function leerBDInfo(tx)
{
	tx.executeSql('SELECT * FROM INFORMACION ORDER BY fecha_creacion DESC',[],mostrarResultadosInfo,errorDB)
}	


function mostrarResultadosInfo(tx,resultados)
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
		for(i=0;i<resultados.rows.length;i++)
		{
			//var abstract = resultados.rows.item(i).descripcion;
			var cadtexto = resultados.rows.item(i).descripcion;
			var abstract = $('#tempo').html(cadtexto).text();
			lista += "<li>";
			lista += "<div style='width:100%'>";
			lista += "<img src='"+resultados.rows.item(i).urlimagen+"' style='width:40%; max-width:40%;float:left;margin-right:10px;margin-bottom:10px;'>";	
			lista += "";
			lista += "<b>"+resultados.rows.item(i).titulo+"</b><br />";
			lista += "<label style='font-size:10px'><b>"+resultados.rows.item(i).fecha_creacion+"</b></label><br />";
			lista += ""+abstract.substring(0,numcars)+"...<br />";
			lista += '<a href="#info" data-role="button" data-icon="arrow-d" data-iconpos="notext" data-transition="none" data-inline="true" style="float:right; margin-top:5px;margin-right:5px;" onclick="cargarInformacion('+resultados.rows.item(i).nid+')">';
			lista += '<img src="img/vermas.png" width="80" />';
			lista += '</a>';
			lista += "</div>";
			lista += "</li>";
		}
	}
	document.getElementById("thelist").innerHTML=lista;
	document.getElementById("lista2").innerHTML=lista;
	pullDownAction();
	myScroll.refresh();
}



function borrarRepetidasInfo(tx)
{
	tx.executeSql('DELETE FROM INFORMACION WHERE nid in ('+listadoinfo+') ')
}
function agregarInformacion()
{
	var db;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(agregarInformacionSQL,errorDB,leerBaseInfo);
}
function agregarInformacionSQL(tx)
{
	var nume = infoarray.length;
	var elemactual = new Array();
	for(i = 0; i < nume ; i++)
	{
		var elemactual = infoarray[i];
		var nidact = elemactual[0];
		var tituloact = elemactual[1];
		var descripcionact = elemactual[2];
		var imagenact = elemactual[3];
		var fechacre = elemactual[4];
		var fechaact = elemactual[5];
		tx.executeSql('INSERT INTO INFORMACION (titulo,nid,descripcion,urlimagen,fecha_creacion,fecha_actualizacion)  VALUES ("'+tituloact+'","'+nidact+'","'+descripcionact+'","'+imagenact+'","'+fechacre+'","'+fechaact+'")');
	}
}

function actualizarInformacion()
{
	var db;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(actualizarInfoBD,errorDB,cargaXMLInformacion);
}
function actualizarInfoBD(tx)
{
	tx.executeSql('SELECT * FROM INFORMACION ORDER BY fecha_actualizacion DESC LIMIT 0,1',[],resultLastUpdateInfo,errorDB)
}	
function resultLastUpdateInfo(tx,resultados)
{
	if(resultados.rows.length>0)
	fechaupd_info = resultados.rows.item(0).fecha_actualizacion;
}
function cargaXMLInformacion() {
	infoarray = [];
	nidsinfoarray = [];
	$.ajax({
    	type: "GET",
        url: "http://juegosmundiales2013.co/informacion.php?fechaupd="+fechaupd_info,
		data: 'fechaupd='+fechaupd_info,
        dataType: "xml",
        success: function(xml) {
			$(xml).find('informacion').each(function(){
				var noticias = new Array();
				var nid = $(this).find('nid').text();
				var titulo = $(this).find('titulo').text();
				var descripcion = $(this).find('descripcion').text();
				var imagen = $(this).find('imagen').text();
				var fechacre = $(this).find('fechacreacion').text();
				var fechaupd = $(this).find('fechaactualizacion').text();
				
				noticias[0] = nid;
                noticias[1] = titulo;
                noticias[2] = descripcion;
                noticias[3] = imagen;
				noticias[4] = fechacre;
				noticias[5] = fechaupd;
                
				infoarray.push(noticias);
				nidsinfoarray.push(nid);
			});
			creacionInformacion();
        },
		error: function(xhr, error){
			leerBaseInfo();
		}
	});
}

function creacionInformacion()
{
	listadoinfo = nidsinfoarray.join(",");
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(borrarRepetidasInfo,errorDB,agregarInformacion);	
}

/*Detalle*/

var idinfoactual;

function cargarInformacion(idinfo)
{
	$("#conteinfo").html("");
	var db;
	idinfoactual = idinfo;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(cargarInformacionBD,errorDB);
}
function cargarInformacionBD(tx)
{
	tx.executeSql('SELECT * FROM INFORMACION WHERE nid='+idinfoactual,[],resultadoCargaInformacion,errorDB);
}
function resultadoCargaInformacion(tx,resultados)
{
	
	var cadenaLocal = "";
	
	cadenaLocal += "";
	cadenaLocal += '<h4>'+resultados.rows.item(0).titulo+'</h4>';
	cadenaLocal += "<label style='font-size:10px'><b>"+resultados.rows.item(0).fecha_creacion+"</b></label><br />";
	cadenaLocal += '<center>';
	cadenaLocal += "<img src='"+resultados.rows.item(0).urlimagen+"' style='width:80%; max-width:80%;margin:10px;'>";
	cadenaLocal += '</center><br>';
	cadenaLocal += '<p>'+resultados.rows.item(0).descripcion+'</p>';
	cadenaLocal += '';
	
	$("#conteinfo").html(cadenaLocal);
	$("#wrapper3").height(window_height);
	myScroll3.refresh();
	myScroll3.scrollTo(0, 0);
}
/*Detalle*/
