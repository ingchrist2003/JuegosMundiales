// JavaScript Document
// seccion cronograma

//variables informacion
var titulo_crono;
var nid_crono;
var descripcion_crono;
var urlima_crono;
var urlico_crono;
var fecha_crono;
var listadocrono = "";
var fechaupd_crono = ""; //fecha de la última actualización 
var cronoarray = new Array() ;
var nidscronoarray = new Array() ;
//

/*Cronograma*/
function leerBaseCrono()
{
	var db;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(leerBDCrono,errorDB);
}

function leerBDCrono(tx)
{
	tx.executeSql('SELECT * FROM CRONOGRAMA ORDER BY titulo ASC',[],mostrarResultadosCrono,errorDB)
}	


function mostrarResultadosCrono(tx,resultados)
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
			lista += "<img src='"+resultados.rows.item(i).urlicono+"' style='width:80px;float:left;margin-right:5px;margin-bottom:5px;'>";	
			lista += "";
			lista += "<b>"+resultados.rows.item(i).titulo+"</b><br />";
			lista += '<a href="#crono" data-role="button" data-icon="arrow-d" data-iconpos="notext" data-transition="none" data-inline="true" style="float:left; margin-top:5px;margin-right:5px;" onclick="cargarCronograma('+resultados.rows.item(i).nid+')">';
			lista += '<img src="img/vermas.png" width="80" />';
			lista += '</a>';
			lista += "</div>";
			lista += "</li>";
		}
	}
	document.getElementById("thelist").innerHTML=lista;
	document.getElementById("lista3").innerHTML=lista;
	pullDownAction();
	myScroll.refresh();
}



function borrarRepetidasCrono(tx)
{
	tx.executeSql('DELETE FROM CRONOGRAMA WHERE nid in ('+listadocrono+') ')
}
function agregarCronograma()
{
	var db;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(agregarCronogramaSQL,errorDB,leerBaseCrono);
}
function agregarCronogramaSQL(tx)
{
	var nume = cronoarray.length;
	var elemactual = new Array();
	for(i = 0; i < nume ; i++)
	{
		var elemactual = cronoarray[i];
		var nidact = elemactual[0];
		var tituloact = elemactual[1];
		var descripcionact = elemactual[2];
		var imagenact = elemactual[3];
		var iconoact = elemactual[4];
		var fechacre = elemactual[5];
		var fechaact = elemactual[6];
		tx.executeSql('INSERT INTO CRONOGRAMA (titulo,nid,descripcion,urlimagen,urlicono,fecha_creacion,fecha_actualizacion)  VALUES ("'+tituloact+'","'+nidact+'","'+descripcionact+'","'+imagenact+'","'+iconoact+'","'+fechacre+'","'+fechaact+'")');
	}
}

function actualizarCronograma()
{
	var db;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(actualizarCronoBD,errorDB,cargaXMLCronograma);
}
function actualizarCronoBD(tx)
{
	tx.executeSql('SELECT * FROM CRONOGRAMA ORDER BY fecha_actualizacion DESC LIMIT 0,1',[],resultLastUpdateCrono,errorDB)
}	
function resultLastUpdateCrono(tx,resultados)
{
	if(resultados.rows.length>0)
	fechaupd_crono = resultados.rows.item(0).fecha_actualizacion;
}
function cargaXMLCronograma() {
	cronoarray = [];
	nidscronoarray = [];
	$.ajax({
    	type: "GET",
        url: "http://juegosmundiales2013.co/cronograma.php?fechaupd="+fechaupd_crono,
		data: 'fechaupd='+fechaupd_crono,
        dataType: "xml",
        success: function(xml) {
			$(xml).find('cronograma').each(function(){
				var cronograma = new Array();
				var nid = $(this).find('nid').text();
				var titulo = $(this).find('titulo').text();
				var descripcion = $(this).find('descripcion').text();
				var imagen = $(this).find('imagen').text();
				var icono = $(this).find('icono').text();
				var fechacre = $(this).find('fechacreacion').text();
				var fechaupd = $(this).find('fechaactualizacion').text();
				
				cronograma[0] = nid;
                cronograma[1] = titulo;
                cronograma[2] = descripcion;
                cronograma[3] = imagen;
				cronograma[4] = icono;
				cronograma[5] = fechacre;
				cronograma[6] = fechaupd;
                
				cronoarray.push(cronograma);
				nidscronoarray.push(nid);
			});
			creacionCronograma();
        },
		error: function(xhr, error){
			leerBaseCrono();
		}
	});
}

function creacionCronograma()
{
	listadocrono = nidscronoarray.join(",");
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(borrarRepetidasCrono,errorDB,agregarCronograma);	
}

/*Detalle*/

var idcronoactual;

function cargarCronograma(idcrono)
{
	$("#contecrono").html("");
	var db;
	idcronoactual = idcrono;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(cargarCronogramaBD,errorDB);
}
function cargarCronogramaBD(tx)
{
	tx.executeSql('SELECT * FROM CRONOGRAMA WHERE nid='+idcronoactual,[],resultadoCargaCronograma,errorDB);
}
function resultadoCargaCronograma(tx,resultados)
{
	
	var cadenaLocal = "";
	
	cadenaLocal += "";
	cadenaLocal += '<h4>'+resultados.rows.item(0).titulo+'</h4>';
	cadenaLocal += '<div id="Gallery2" class="gallery2" >';
	cadenaLocal += '<center><a href="'+resultados.rows.item(0).urlimagen+'">';
	cadenaLocal += "<img src='"+resultados.rows.item(0).urlimagen+"' style=' max-width:90%;'>";
	cadenaLocal += '</center></a>';
	cadenaLocal += "</div>";	
	cadenaLocal += '';
	
	$("#contecrono").html(cadenaLocal);
	$("#wrapper4").height(window_height);
	myScroll4.refresh();
	myScroll4.scrollTo(0, 0);
	var myPhotoSwipe = $("#Gallery2 a").photoSwipe({ enableMouseWheel: false , enableKeyboard: false }); //
}
/*Detalle*/
