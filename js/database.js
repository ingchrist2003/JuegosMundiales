// JavaScript Document
// seccion noticias

//variables noticia
var titulo_noti;
var nid_noti;
var descripcion_noti;
var urlima_noti;
var fecha_noti;
var listado = "";
var fechaupd = ""; //fecha de la última actualización 
var notiarray = new Array() ;
var nidsarray = new Array() ;
//

function abrirBaseDatos()
{
	var db;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(crearRegistros,errorDB,leerBaseDatos);	
}

function crearRegistros(tx)
{
	tx.executeSql('DROP TABLE IF EXISTS NOTICIAS');
	tx.executeSql('DROP TABLE IF EXISTS INFORMACION');
	tx.executeSql('DROP TABLE IF EXISTS CRONOGRAMA');
	tx.executeSql('DROP TABLE IF EXISTS POSICIONES');
	tx.executeSql('DROP TABLE IF EXISTS GALERIAS');
	
	tx.executeSql('CREATE TABLE IF NOT EXISTS NOTICIAS (id INTEGER PRIMARY KEY AUTOINCREMENT,nid INTEGER NULL, titulo TEXT  NULL, descripcion TEXT  NULL,urlimagen TEXT  NULL,fecha_creacion DATETIME NULL,fecha_actualizacion DATETIME NULL)')	;
	tx.executeSql('CREATE TABLE IF NOT EXISTS INFORMACION (id INTEGER PRIMARY KEY AUTOINCREMENT,nid INTEGER NULL, titulo TEXT  NULL, descripcion TEXT  NULL,urlimagen TEXT  NULL,fecha_creacion DATETIME NULL,fecha_actualizacion DATETIME NULL)')	;
	tx.executeSql('CREATE TABLE IF NOT EXISTS CRONOGRAMA (id INTEGER PRIMARY KEY AUTOINCREMENT,nid INTEGER NULL,titulo TEXT  NULL, descripcion TEXT  NULL,urlimagen TEXT  NULL,urlicono TEXT  NULL,fecha_creacion DATETIME NULL,fecha_actualizacion DATETIME NULL)')	;
	tx.executeSql('CREATE TABLE IF NOT EXISTS POSICIONES (id INTEGER PRIMARY KEY AUTOINCREMENT,nid INTEGER NULL,titulo TEXT  NULL, descripcion TEXT  NULL,oro INTEGER  NULL,plata INTEGER  NULL,bronce INTEGER NULL,fecha_creacion DATETIME NULL,fecha_actualizacion DATETIME NULL)')	;
	tx.executeSql('CREATE TABLE IF NOT EXISTS GALERIAS (id INTEGER PRIMARY KEY AUTOINCREMENT,nid INTEGER NULL,titulo TEXT  NULL, descripcion TEXT  NULL,imagenes TEXT  NULL,fecha_creacion DATETIME NULL,fecha_actualizacion DATETIME NULL)')	;
	
}
/*Noticias*/
function leerBaseDatos()
{
	var db;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(leerBD,errorDB);
}

function leerBD(tx)
{
	tx.executeSql('SELECT * FROM NOTICIAS ORDER BY fecha_creacion DESC',[],mostrarResultados,errorDB)
}	


function mostrarResultados(tx,resultados)
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
			lista += '<a href="#news" data-role="button" data-icon="arrow-d" data-iconpos="notext" data-transition="none" data-inline="true" style="float:right; margin-top:5px;margin-right:5px;" onclick="cargarNoticia('+resultados.rows.item(i).nid+')">';
			lista += '<img src="img/vermas.png" width="80" />';
			lista += '</a>';
			lista += "</div>";
			lista += "</li>";
		}
	}
	document.getElementById("thelist").innerHTML=lista;
	document.getElementById("lista1").innerHTML=lista;
	pullDownAction();
	myScroll.refresh();
}



function borrarRepetidas(tx)
{
	tx.executeSql('DELETE FROM NOTICIAS WHERE nid in ('+listado+') ')
}
function agregarNoticias()
{
	var db;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(agregarNoticiaSQL,errorDB,leerBaseDatos);
}
function agregarNoticiaSQL(tx)
{
	var nume = notiarray.length;
	var elemactual = new Array();
	for(i = 0; i < nume ; i++)
	{
		var elemactual = notiarray[i];
		var nidact = elemactual[0];
		var tituloact = elemactual[1];
		var descripcionact = elemactual[2];
		var imagenact = elemactual[3];
		var fechacre = elemactual[4];
		var fechaact = elemactual[5];
		tx.executeSql('INSERT INTO NOTICIAS (titulo,nid,descripcion,urlimagen,fecha_creacion,fecha_actualizacion)  VALUES ("'+tituloact+'","'+nidact+'","'+descripcionact+'","'+imagenact+'","'+fechacre+'","'+fechaact+'")');
	}
}

function actualizarNoticias()
{
	var db;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(actualizarNotiBD,errorDB,cargaXMLNoticias);
}
function actualizarNotiBD(tx)
{
	tx.executeSql('SELECT * FROM NOTICIAS ORDER BY fecha_actualizacion DESC LIMIT 0,1',[],resultLastUpdate,errorDB)
}	
function resultLastUpdate(tx,resultados)
{
	if(resultados.rows.length>0)
	fechaupd = resultados.rows.item(0).fecha_actualizacion;
}
function cargaXMLNoticias() {
	notiarray = [];
	nidsarray = [];
	$.ajax({
    	type: "GET",
        url: "http://juegosmundiales2013.co/noticias.php?fechaupd="+fechaupd,
		data: 'fechaupd='+fechaupd,
        dataType: "xml",
        success: function(xml) {
			$(xml).find('noticia').each(function(){
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
                
				notiarray.push(noticias);
				nidsarray.push(nid);
			});
			creacionNoticias();
        },
		error: function(xhr, error){
			leerBaseDatos();
		}
	});
}

function creacionNoticias()
{
	listado = nidsarray.join(",");
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(borrarRepetidas,errorDB,agregarNoticias);	
}

/*Noticias*/

var idnotiactual;

function cargarNoticia(idnoticia)
{
	$("#contenoticia").html("");
	var db;
	idnotiactual = idnoticia;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	db.transaction(cargarNoticiaBD,errorDB);
}
function cargarNoticiaBD(tx)
{
	tx.executeSql('SELECT * FROM NOTICIAS WHERE nid='+idnotiactual,[],resultadoCargaNoticia,errorDB);
}
function resultadoCargaNoticia(tx,resultados)
{
	
	var cadenaNoticia = "";
	
	cadenaNoticia += "";
	cadenaNoticia += '<h4>'+resultados.rows.item(0).titulo+'</h4>';
	cadenaNoticia += "<label style='font-size:10px'><b>"+resultados.rows.item(0).fecha_creacion+"</b></label><br />";
	cadenaNoticia += '<center>';
	cadenaNoticia += "<img src='"+resultados.rows.item(0).urlimagen+"' style='width:80%; max-width:80%;margin:10px;'>";
	cadenaNoticia += '</center><br>';
	cadenaNoticia += '<p>'+resultados.rows.item(0).descripcion+'</p>';
	cadenaNoticia += '';
	
	$("#contenoticia").html(cadenaNoticia);
	$("#wrapper2").height(window_height);
	myScroll2.refresh();
	myScroll2.scrollTo(0, 0);
}
/*Noticias*/
// Transaction error callback
function errorDB(err) {
	//alert("Error Code:"+err.code+"  - Error Message"+err.message)
	console.log("Error processing SQL: "+err.code);
}