/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var idseccion = 1;

function loadLists(idlist,title)
{
	document.getElementById("thelist").innerHTML=document.getElementById("lista"+idlist).innerHTML;
	document.getElementById("currenttitle").innerHTML="<b>"+title+"</b>";
	idseccion = idlist;
	//cierra el panel
	$( "#myPanel" ).panel( "close" );
	if(idseccion==1)
		actualizarNoticias();//obtiene la ultima fecha de actualizacion
	else if(idseccion==2)
		actualizarInformacion();//obtiene la ultima fecha de actualizacion
	else if(idseccion==3)
		actualizarCronograma();//obtiene la ultima fecha de actualizacion
	else if(idseccion==4)
		actualizarPosiciones();//obtiene la ultima fecha de actualizacion
	else if(idseccion==5)
		actualizarGaleria();//obtiene la ultima fecha de actualizacion
	else
		actualizarNoticias();//obtiene la ultima fecha de actualizacion
	
}
			 	

// Wait for PhoneGap to load
//
var header_height;
var window_height;

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	alert("Dispositivo listo");
		
}

$(function () {
    var db;
	db = window.openDatabase("juegosMundiales","1.0","Juegos Mundiales 2013",200000);
	//db.transaction(leerBD,errorDB);
	db.transaction(crearRegistros,errorDB,cargaXMLNoticias);
	leerBaseDatos();
	var myPhotoSwipe = $("#Gallery a").photoSwipe({ enableMouseWheel: false , enableKeyboard: false }); //	
 });

$(document).on("swiperight", function(event, ui) {
     $( "#myPanel").panel("open", {display: "overlay", position: "left"} );
});          
          
$(function () {
header_height  = $('[data-role="header"]').height();
footer_height  = $('[data-role="footer"]').height();
window_height  = ($(this).height())-header_height-footer_height-30;
});

