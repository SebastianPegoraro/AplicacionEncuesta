//ToDo: Mejorar control de errores; mejorar diseño; agregar filtro por usuario;
var db = null;
var totalPreguntas=0;
var currentPregunta=0;
var currentEncuesta=0;
var tituloEncuesta="";
var arrayPreguntas = new Array();
var arrayResultados  = new Array();

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  $("#title").html("Encuestas");
 db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {
    db.transaction(function(tx) {
    tx.executeSql('SELECT preguntas.encuesta_id,encuestas.titulo,count(*) as cantpreguntas FROM preguntas inner join encuestas on encuestas.id=preguntas.encuesta_id group by preguntas.encuesta_id,encuestas.titulo', [], function(tx, resultSet) {

      for(var x = 0; x < resultSet.rows.length; x++) {
              $("#content").append('<ul class="list-group mb-4 media-list"><li class="list-group-item"><a href="#" class="media shadow-15 start"  data-preguntas="'+(resultSet.rows.item(x).cantpreguntas-1)+'" data-id="'+resultSet.rows.item(x).encuesta_id+'" data-title="'+resultSet.rows.item(x).titulo+'"><div class="media-body"><h3>'+resultSet.rows.item(x).titulo+'</h3><p>'+resultSet.rows.item(x).cantpreguntas+' preguntas</p></div></a></li></ul>');
          }
pendientes();
    }, function(tx, error) {
      mensaje('SELECT error: ' + error.message);
    });
  });



}, function (error) {
  mensaje("Error abriendo BD: "+ JSON.stringify(error));
});
}



/************************************************
esto responde al click del boton de la encuesta que se quiere iniciar
setea las variables currentEncuesta y totalPreguntas
obtiene un listado de las preguntas para dicha encuesta
************************************************/
$(document).on('click', '.start', function () {
   totalPreguntas=0;
   currentPregunta=0;
   currentEncuesta=0;
   tituloEncuesta="";
   arrayPreguntas = new Array();
   arrayResultados  = new Array();
    currentEncuesta=$(this).data("id");
    totalPreguntas=$(this).data("preguntas");
      $("#title").html($(this).data("title"));
    getPreguntas(currentEncuesta);
//ToDo: mostrar titulo de la encuesta en algun lado
});

/************************************************
esto responde al click del boton Continuar
trae la siguiente pregunta
************************************************/
$(document).on('click', '.continue', function () {
    getPreguntaOpciones();
});

function getEncuestas()
{
    $("#title").html("Encuestas");
  db.transaction(function(tx) {
  tx.executeSql('SELECT preguntas.encuesta_id,encuestas.titulo,count(*) as cantpreguntas FROM preguntas inner join encuestas on encuestas.id=preguntas.encuesta_id group by preguntas.encuesta_id,encuestas.titulo', [], function(tx, resultSet) {

    for(var x = 0; x < resultSet.rows.length; x++) {
            $("#content").append('<ul class="list-group mb-4 media-list"><li class="list-group-item"><a href="#" class="media shadow-15 start"  data-preguntas="'+(resultSet.rows.item(x).cantpreguntas-1)+'" data-id="'+resultSet.rows.item(x).encuesta_id+'" data-title="'+resultSet.rows.item(x).titulo+'"><div class="media-body"><h3>'+resultSet.rows.item(x).titulo+'</h3><p>'+resultSet.rows.item(x).cantpreguntas+' preguntas</p></div></a></li></ul>');
        }
pendientes();
  }, function(tx, error) {
    mensaje('SELECT error: ' + error.message);
  });
});
}

/************************************************
getPreguntas: obtiene un listado de las preguntas para la encuesta seleccionada
y carga la primer pregunta
Parametros: idEncuesta (el id de la encuesta en cuestion)
ToDo: modificar URL de la API
************************************************/
function getPreguntas(idEncuesta)
{

db.transaction(function (tx) {

       var query = "SELECT * from preguntas";

       tx.executeSql(query, [], function (tx, resultSet) {
         //$("#content").empty();
         //alert(idEncuesta);
           for(var x = 0; x < resultSet.rows.length; x++) {
             if(resultSet.rows.item(x).encuesta_id==idEncuesta){
               //alert(resultSet.rows.item(x).descripcion)
               arrayPreguntas.push({id: resultSet.rows.item(x).id,nombre: resultSet.rows.item(x).descripcion});
               currentPregunta=0;
             }
           //arrayPreguntas.push(resultSet.rows.item(x));
           //currentPregunta=0;
           }
       },
       function (tx, error) {
           mensaje('SELECT error: ' + error.message);
       });
   }, function (error) {
       mensaje('transaction error: ' + error.message);
   }, function () {
     //obtengo la primer pregunta
     getPreguntaOpciones();
   });
}

/************************************************
getPreguntaOpciones: obtiene las opciones para una pregunta y las dibuja en el div
se incrementa de manera automatica  y almacena en un array los resultados
de la pregunta anterior (si hubo)
ToDo: modificar URL de la API
ToDo: mejorar diseño en el append
ToDo: implementar filtro por usuario
************************************************/
function getPreguntaOpciones()
{

  //guardar resultados de las respuestas si ya pasé la primer pregunta
  if(currentPregunta>0)
  {
    $('#content').children('input').each(function () { //para cada elemento del div
      switch ($(this).attr('type')) { //segun el tipo del elemento
        case "radio":
          if($(this).is(':checked')){ //si es radio y esta checked
            arrayResultados.push({eleccion_id : $(this).data("eleccion"), tipo_id : $(this).data("clase"), pregunta_id: $(this).data("pregunta"), estado:'1'});
          }
          break;
          case "checkbox":
            if($(this).is(':checked')){ //si es checkbox y esta checked
              arrayResultados.push({eleccion_id : $(this).data("eleccion"), tipo_id : $(this).data("clase"), pregunta_id: $(this).data("pregunta"), estado:'1'});
            }
            break;
            case "text": //si es text
                arrayResultados.push({eleccion_id : $(this).data("eleccion"), tipo_id : $(this).data("clase"), pregunta_id: $(this).data("pregunta"), estado:$(this).val()});
              break;

      }
});

  }
//si NO estoy en la ultima pregunta
  if(currentPregunta<=totalPreguntas)
  {
    db.transaction(function (tx) {

           var query = "SELECT  elecciones.id,elecciones.descripcion,tipos.clase,tipos.id as idclase,opciones.estado,opciones.pregunta_id from opciones inner join elecciones on elecciones.id=opciones.eleccion_id inner join tipos on tipos.id=opciones.tipo_id where estado is null";

           tx.executeSql(query, [], function (tx, resultSet) {
             $("#content").empty();
              $("#content").append('<legend>'+arrayPreguntas[currentPregunta].nombre+'</legend>'); //titulo
               for(var x = 0; x < resultSet.rows.length; x++) {
                 if(resultSet.rows.item(x).pregunta_id==arrayPreguntas[currentPregunta].id){

                 //mostrar mis opciones para esta pregunta
                 switch (resultSet.rows.item(x).clase) { //segun el tipo mostrar el control adecuado
                     //en cada elemento se agregan atributos para mantener informaion importante
                     //data-pregunta: el id de la pregunta
                     //data-eleccion: el id de la opcion (respuesta)
                     //data-clase: el id del tipo de objeto (check, radio, text, etc)
                     //ToDo: modificar el append para mejorar el diseño
                     case 'checkbox':
                         $("#content").append('<input type="checkbox" id="option'+resultSet.rows.item(x).id+'" value="'+resultSet.rows.item(x).id+'" data-pregunta="'+arrayPreguntas[currentPregunta].id+'" data-eleccion="'+resultSet.rows.item(x).id+'" data-clase="'+resultSet.rows.item(x).idclase+'" > '+resultSet.rows.item(x).descripcion+'<br>');
                       break;
                       case 'radio':
                           $("#content").append('<input type="radio" id="option'+resultSet.rows.item(x).id+'" value="'+resultSet.rows.item(x).id+'" data-pregunta="'+arrayPreguntas[currentPregunta].id+'" data-eleccion="'+resultSet.rows.item(x).id+'" data-clase="'+resultSet.rows.item(x).idclase+'"> '+resultSet.rows.item(x).descripcion+'<br>');
                         break;
                         case 'text':
                             $("#content").append('<p>'+resultSet.rows.item(x).descripcion+'</p><input type="text" id="option'+resultSet.rows.item(x).id+'" data-pregunta="'+arrayPreguntas[currentPregunta].id+'" data-eleccion="'+resultSet.rows.item(x).id+'" data-clase="'+resultSet.rows.item(x).idclase+'"><br>');
                           break;
                   }


                 }
               }
           },
           function (tx, error) {
               mensaje('SELECT error: ' + error.message);
           });
       }, function (error) {
           mensaje('transaction error: ' + error.message);
       }, function () {
       currentPregunta++; //incremento la posicion de la pregunta actual (para la proxima vez que se llame)
       //muestro el boton Continuar
       $("#content").append('<hr><a href="#" class="btn btn-success continue">Continuar</a>');
       });

  }
  else {
    //llegue al final de la encuesta
    //guardo los resultados
  saveResults();

    //vaciar el div
    $("#content").empty();
    //cargar las encuestas disponibles
    getEncuestas();
  }
}

function pendientes()
{
  db.transaction(function(tx) {
  tx.executeSql('SELECT count(*) AS mycount FROM opciones where estado is not null', [], function(tx, rs) {
    $("#pendientes").html('<i class="material-icons">star</i> Actualizar datos <span class="badge badge-secondary">'+rs.rows.item(0).mycount+'</span>');
  }, function(tx, error) {
    mensaje('SELECT error: ' + error.message);
  });
});
}

function saveResults()
{

  db.transaction(function(tx) {
  tx.executeSql('SELECT max(id) AS mycount FROM opciones', [], function(tx, rs) {
    //mensaje("filas: "+rs.rows.item(0).mycount);
    maximo=rs.rows.item(0).mycount;
    maximo++;
  }, function(tx, error) {
    mensaje('SELECT error: ' + error.message);
  });
});

  db.transaction(function(tx) {
    $.each(arrayResultados, function(i, item) {
      tx.executeSql("INSERT INTO opciones values (?,?,?,?,?)", [maximo,item.eleccion_id,item.tipo_id,item.pregunta_id,item.estado]);
      maximo++;
    });
  }, function(e) {
    mensaje('Transaction error1: ' + e.message);
    alert('Transaction error1: ' + e.message);
  }, function() {

  });

}


function mensaje(msg)
{
  alert(msg);
}
