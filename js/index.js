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


function loadLists(idlist,title)
{
	document.getElementById("thelist").innerHTML=document.getElementById("lista"+idlist).innerHTML;
	document.getElementById("currenttitle").innerHTML="<b>"+title+"</b>";
	
	//cierra el panel
	$( "#myPanel" ).panel( "close" );
}
			 	

// Wait for PhoneGap to load
//
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
 });

$(document).on("swiperight", function(event, ui) {
     $( "#myPanel").panel("open", {display: "overlay", position: "left"} );
});          
          

