// JavaScript Document
// seccion galeria

//variables galeria
var titulo_gale;
var nid_gale;
var descripcion_gale;
var imagenes_gale;
var fecha_gale;
var listadogale = "";
var fechaupd_gale = ""; //fecha de la última actualización 
var galearray = new Array() ;
var nidsgalearray = new Array() ;
//

/*Galería*/
function leerBaseGale()
{
	var db;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(leerBDGale,errorDB);
}

function leerBDGale(tx)
{
	tx.executeSql('SELECT * FROM GALERIAS ORDER BY fecha_actualizacion DESC',[],mostrarResultadosGale,errorDB)
}	


function mostrarResultadosGale(tx,resultados)
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
			var cadimagenes = resultados.rows.item(i).imagenes;
			var vecimagen00 = cadimagenes.split("|");//parto el vector que tiene toda la informacion de las imagenes
			var cadenafirstimage = vecimagen00[0];
			var vecimagen01 = cadenafirstimage.split(";");//parto la informacion de la primera imagen
			
			var bigimage = vecimagen01[0];
			var thumbimage = vecimagen01[1];
			var titleimage = vecimagen01[2];
			
			lista += "<li>";
			lista += "<div style='width:100%'>";
			lista += "<img src='"+thumbimage+"' style='width:40%; max-width:40%;float:left;margin-right:10px;margin-bottom:10px;'>";	
			lista += "";
			lista += "<b>"+resultados.rows.item(i).titulo+"</b><br />";
			lista += "<label style='font-size:10px'><b>"+resultados.rows.item(i).fecha_creacion+"</b></label><br />";
			lista += ""+abstract.substring(0,numcars)+"...<br />";
			lista += '<a href="#gale" data-role="button" data-icon="arrow-d" data-iconpos="notext" data-transition="none" data-inline="true" style="float:right; margin-top:5px;margin-right:5px;" onclick="cargarGaleria('+resultados.rows.item(i).nid+')">';
			lista += '<img src="img/vermas.png" width="80" />';
			lista += '</a>';
			lista += "</div>";
			lista += "</li>";
		}
	}
	document.getElementById("thelist").innerHTML=lista;
	document.getElementById("lista5").innerHTML=lista;
	pullDownAction();
	myScroll.refresh();
}



function borrarRepetidasGale(tx)
{
	tx.executeSql('DELETE FROM GALERIAS WHERE nid in ('+listadogale+') ')
}
function agregarGaleria()
{
	var db;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(agregarGaleriaSQL,errorDB,leerBaseGale);
}
function agregarGaleriaSQL(tx)
{
	var nume = galearray.length;
	var elemactual = new Array();
	for(i = 0; i < nume ; i++)
	{
		var elemactual = galearray[i];
		var nidact = elemactual[0];
		var tituloact = elemactual[1];
		var descripcionact = elemactual[2];
		var imagenact = elemactual[3];
		var fechacre = elemactual[4];
		var fechaact = elemactual[5];
		tx.executeSql('INSERT INTO GALERIAS (titulo,nid,descripcion,imagenes,fecha_creacion,fecha_actualizacion)  VALUES ("'+tituloact+'","'+nidact+'","'+descripcionact+'","'+imagenact+'","'+fechacre+'","'+fechaact+'")');
	}
}

function actualizarGaleria()
{
	var db;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(actualizarGaleBD,errorDB,cargaXMLGalerias);
}
function actualizarGaleBD(tx)
{
	tx.executeSql('SELECT * FROM GALERIAS ORDER BY fecha_actualizacion DESC LIMIT 0,1',[],resultLastUpdateGale,errorDB)
}	
function resultLastUpdateGale(tx,resultados)
{
	if(resultados.rows.length>0)
	fechaupd_gale = resultados.rows.item(0).fecha_actualizacion;
}
function cargaXMLGalerias() {
	galearray = [];
	nidsgalearray = [];
	$.ajax({
    	type: "GET",
        url: "http://juegosmundiales2013.co/galerias.php?fechaupd="+fechaupd_gale,
		data: 'fechaupd='+fechaupd_gale,
        dataType: "xml",
        success: function(xml) {
			$(xml).find('galeria').each(function(){
				var galerias = new Array();
				var nid = $(this).find('nid').text();
				var titulo = $(this).find('titulo').text();
				var descripcion = $(this).find('descripcion').text();
				var imagenes = $(this).find('imagenes').text();
				var fechacre = $(this).find('fechacreacion').text();
				var fechaupd = $(this).find('fechaactualizacion').text();
				
				galerias[0] = nid;
                galerias[1] = titulo;
                galerias[2] = descripcion;
                galerias[3] = imagenes;
				galerias[4] = fechacre;
				galerias[5] = fechaupd;
                
				galearray.push(galerias);
				nidsgalearray.push(nid);
			});
			creacionGalerias();
        },
		error: function(xhr, error){
			leerBaseGale();
		}
	});
}

function creacionGalerias()
{
	listadogale = nidsgalearray.join(",");
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(borrarRepetidasGale,errorDB,agregarGaleria);	
}

/*Detalle*/

var idgaleactual;

function cargarGaleria(idgale)
{
	$("#contegale").html("");
	var db;
	idgaleactual = idgale;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(cargarGaleriaBD,errorDB);
}
function cargarGaleriaBD(tx)
{
	tx.executeSql('SELECT * FROM GALERIAS WHERE nid='+idgaleactual,[],resultadoCargaGalerias,errorDB);
}
function resultadoCargaGalerias(tx,resultados)
{
	
	var cadenaLocal = "";
	cadenaLocal += '<center><h4>'+resultados.rows.item(0).titulo+'</h4></center>';
	cadenaLocal += '<ul id="Gallery" class="gallery" >';
	var cadimagenes = resultados.rows.item(0).imagenes;
	var vecimagen00 = cadimagenes.split("|");//parto el vector que tiene toda la informacion de las imagenes
	for(i=0;i<vecimagen00.length;i++)
	{
		var cadenafirstimage = vecimagen00[i];
		var vecimagen01 = cadenafirstimage.split(";");//parto la informacion de la primera imagen
		cadenaLocal += '<li><div class="contefoto"><a href="'+vecimagen01[0]+'"><img src="'+vecimagen01[1]+'" alt="'+vecimagen01[2]+'" style="max-width:100%;" /></a></div></li>';	
	}
	cadenaLocal += "</ul>";		
	
	$("#contegale").html(cadenaLocal);
	$("#wrapper6").height(window_height);
	myScroll6.refresh();
	myScroll6.scrollTo(0, 0);
	var myPhotoSwipe = $("#Gallery a").photoSwipe({ enableMouseWheel: false , enableKeyboard: false }); //	
}
/*Detalle*/
