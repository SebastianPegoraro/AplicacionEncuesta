//ToDo: Mejorar control de errores; mejorar diseño;
var db = null; //conexion a la BD local del android
var totalPreguntas=0; //cantidad de preguntas que tiene una encuesta
var currentPregunta=0; //en que pregunta estoy ahora
var currentEncuesta=0; //en que encuesta estoy ahora
var tituloEncuesta=""; //x=(-b±√b²-4ac)/2a (?)
var arrayPreguntas = new Array(); //array con las preguntas que contiene la encuesta seleccionada
var arrayResultados  = new Array(); //array donde voy guardando las respuestas que se eligen en cada pregunta

document.addEventListener("deviceready", onDeviceReady, false);
//esto es el "load" de la pagina. cargo las encuestas para este usuario
function onDeviceReady() {
  $("#title").html("Encuestas");
  var consulta="";
  db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default', androidDatabaseProvider: 'system', androidLockWorkaround: 1 }, function (db) {
    db.transaction(function(tx) {
      if(localStorage.getItem("tipoUsuario")=="Administrador")
      { //es un admin, entonces traer TODAS las encuestas
        consulta='SELECT preguntas.encuesta_id,encuestas.titulo,count(*) as cantpreguntas FROM preguntas inner join encuestas on encuestas.id=preguntas.encuesta_id group by preguntas.encuesta_id,encuestas.titulo';
      }
      else
      { //no es admin, filtrar por usuario
        consulta='SELECT preguntas.encuesta_id,encuestas.titulo,count(*) as cantpreguntas FROM encuestas_x_usuario inner join encuestas on encuestas.id=encuestas_x_usuario.encuesta_id inner join preguntas on preguntas.encuesta_id=encuestas.id where usuario_id='+localStorage.getItem("idUsuario")+' group by preguntas.encuesta_id,encuestas.titulo';
      }
      tx.executeSql(consulta, [], function(tx, resultSet) {
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
//  test();
}

function test()
{
  db.transaction(function(tx) {
    tx.executeSql("select * from opciones", [], function(tx, resultSet) {

    alert(resultSet.rows.length);

    }, function(tx, error) {
      mensaje('SELECT error: ' + error.message);
    });
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
  getPreguntaOpciones(true);
});

/*Boton para ir para atras */
$(document).on('click', '.goback', function () {

  if(currentPregunta>1) //si ya pase la primera pregunta, tengo que volver a la anterior pregunta
  {
    //tengo que restar 2 numeros porque el contador de preguntas
    //va uno adelantado respecto a la pregunta actual
    currentPregunta=currentPregunta-2;
    //cargo las respuestas para la pregunta, no hay que controlar si hay respuestas marcadas
    getPreguntaOpciones(false);
  }
  else {
    //si estoy en la primer pregunta, tengo que preguntar si quiero salir
    //y cargar la lista de encuestas
    swal({
      title: "Encuesta",
      text: "Desea salir de esta Encuesta?",
      type: "warning",
      showCancelButton: true,
      closeOnConfirm: true,
      cancelButtonText: "No",
      confirmButtonText: "Si",
      confirmButtonColor: "#ec6c62"
    }, function() {
      //dijo que si
      //vaciar el div
      $("#content").empty();
      //cargar las encuestas disponibles
      getEncuestas();
    });

  }
});


// obtengo el listado de encuestas para este usuario (es lo mismo que se hace en onDeviceReady)
function getEncuestas()
{
  var consulta="";
  $("#title").html("Encuestas");
  if(localStorage.getItem("tipoUsuario")=="Administrador")
  { //es un admin, entonces traer TODAS las encuestas
    consulta='SELECT preguntas.encuesta_id,encuestas.titulo,count(*) as cantpreguntas FROM preguntas inner join encuestas on encuestas.id=preguntas.encuesta_id group by preguntas.encuesta_id,encuestas.titulo';
  }
  else
  { //no es admin, filtrar por usuario
    consulta='SELECT preguntas.encuesta_id,encuestas.titulo,count(*) as cantpreguntas FROM encuestas_x_usuario inner join encuestas on encuestas.id=encuestas_x_usuario.encuesta_id inner join preguntas on preguntas.encuesta_id=encuestas.id where usuario_id='+localStorage.getItem("idUsuario")+' group by preguntas.encuesta_id,encuestas.titulo';
  }
  db.transaction(function(tx) {
    tx.executeSql(consulta, [], function(tx, resultSet) {

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
      for(var x = 0; x < resultSet.rows.length; x++) {
        if(resultSet.rows.item(x).encuesta_id==idEncuesta){
          arrayPreguntas.push({id: resultSet.rows.item(x).id,nombre: resultSet.rows.item(x).descripcion});
          currentPregunta=0;
        }
      }
    },
    function (tx, error) {
      mensaje('SELECT error: ' + error.message);
    });
  }, function (error) {
    mensaje('transaction error: ' + error.message);
  }, function () {
    //obtengo la primer pregunta
    getPreguntaOpciones(true);
  });
}

/************************************************
getPreguntaOpciones: obtiene las opciones para una pregunta y las dibuja en el div
se incrementa de manera automatica  y almacena en un array los resultados
de la pregunta anterior (si hubo)
************************************************/
function getPreguntaOpciones(hayQueControlarRespuestas)
{
  //si ya tengo cargado un listado de respuestas (es decir, NO es la primera vez que
  // se ejecuta este método), tengo que controlar que se haya marcado al menos una opcion
  if((currentPregunta>0)&&(hayQueControlarRespuestas))
  {
    if(!controlarRespuestas())
    {
      //mostrar error
      swal({
        title:"Encuesta",
        text:"Debe seleccionar una respuesta para poder continuar",
        type:"error"
      },
      function(){ });
      return;
    }
  }

  //guardar resultados de las respuestas en el array si ya pasé la primer pregunta
  if(currentPregunta>0)
  {
    $('#content input').each(function () { //para cada elemento del div
      switch ($(this).prop('type')) { //segun el tipo del elemento
        case "radio":
        if($(this).prop('checked')){ //si es radio y esta checked
          arrayResultados.push({eleccion_id : $(this).data("eleccion"), tipo_id : $(this).data("clase"), pregunta_id: $(this).data("pregunta"), estado:'1'});
        }
        break;
        case "checkbox":
        if($(this).prop('checked')){ //si es checkbox y esta checked
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

      var query = "SELECT  opciones.id,elecciones.descripcion,tipos.clase,tipos.id as idclase,opciones.pregunta_id from opciones inner join elecciones on elecciones.id=opciones.eleccion_id inner join tipos on tipos.id=opciones.tipo_id ";

      tx.executeSql(query, [], function (tx, resultSet) {
        $("#content").empty();
        $("#content").append('<legend style="margin-left:15px">'+arrayPreguntas[currentPregunta].nombre+'</legend><div id="pretty-scale-test" style="font-size: 56px;">'); //titulo
//alert( resultSet.rows.length);
        for(var x = 0; x < resultSet.rows.length; x++) {

          if(resultSet.rows.item(x).pregunta_id==arrayPreguntas[currentPregunta].id){
  //alert(resultSet.rows.item(x).pregunta_id+"-"+resultSet.rows.item(x).clase);
            //mostrar mis opciones para esta pregunta
            switch (resultSet.rows.item(x).clase) { //segun el tipo mostrar el control adecuado
              //en cada elemento se agregan atributos para mantener informaion importante
              //data-pregunta: el id de la pregunta
              //data-eleccion: el id de la opcion (respuesta)
              //data-clase: el id del tipo de objeto (check, radio, text, etc)
              //ToDo: modificar el append para mejorar el diseño

              case 'checkbox':
              $("#content").append('<div class="pretty p-default p-curve p-smooth" style="margin-left:35px"><input type="checkbox" id="option'+resultSet.rows.item(x).id+'" value="'+resultSet.rows.item(x).id+'" data-pregunta="'+arrayPreguntas[currentPregunta].id+'" data-eleccion="'+resultSet.rows.item(x).id+'" data-clase="'+resultSet.rows.item(x).idclase+'" /><div class="state p-success"><label>'+resultSet.rows.item(x).descripcion+'</label></div></div><br><br>');
              break;
              case 'radio':
              $("#content").append('<div class="pretty p-default p-round p-smooth"  style="margin-left:35px"><input type="radio" name="radio1" id="option'+resultSet.rows.item(x).id+'" value="'+resultSet.rows.item(x).id+'" data-pregunta="'+arrayPreguntas[currentPregunta].id+'" data-eleccion="'+resultSet.rows.item(x).id+'" data-clase="'+resultSet.rows.item(x).idclase+'" /><div class="state p-success"><label>'+resultSet.rows.item(x).descripcion+'</label></div></div><br><br>');
              break;
              case 'text':
              $("#content").append('<div class="form-group" style="font-size: 15px;"><label for="option'+resultSet.rows.item(x).id+'">'+resultSet.rows.item(x).descripcion+'</label><input type="text" class="form-control" id="option'+resultSet.rows.item(x).id+'" data-pregunta="'+arrayPreguntas[currentPregunta].id+'" data-eleccion="'+resultSet.rows.item(x).id+'" data-clase="'+resultSet.rows.item(x).idclase+'"></div>');
              break;
            }


          }
        }
        $("#content").append('</div>')
      },
      function (tx, error) {
        mensaje('SELECT error: ' + error.message);
      });
    }, function (error) {
      mensaje('transaction error: ' + error.message);
    }, function () {
      currentPregunta++; //incremento la posicion de la pregunta actual (para la proxima vez que se llame)
      //muestro el boton Continuar y el boton Volver
      $("#content").append('<hr><a href="#" class="btn btn-warning goback" style="margin-left:15px">Volver</a> <a href="#" class="btn btn-success continue">Continuar</a>');
    });

  }
  else {
    //llegue al final de la encuesta
    //guardo los resultados en BD
    saveResults();

    //vaciar el div
    $("#content").empty();
    //cargar las encuestas disponibles
    getEncuestas();
  }
}

/* Controla que se haya seleccionado al menos una opcion en la pregunta actual */
function controlarRespuestas()
{
  var hayOpcionMarcada=false;
  $('#content input').each(function () { //para cada elemento del div
    switch ($(this).prop('type')) { //segun el tipo del elemento
      case "radio":
      case "checkbox":
      if($(this).prop('checked')){ //si es radio/checkbox y esta checked
        hayOpcionMarcada=true;
      }
      break;
      case "text": //si es text y no esta vacio
      if($(this).val()!="")
      {
        hayOpcionMarcada=true;
      }
      break;
    }
  });
  return hayOpcionMarcada;
}

//muestro el badge en el menu con la cantidad de cosas pendientes a subir
function pendientes()
{
  db.transaction(function(tx) {
    tx.executeSql('SELECT count(*) AS mycount FROM respuestas where estado is not null', [], function(tx, rs) {
      $("#pendientes").html('<i class="material-icons">star</i> Actualizar datos <span class="badge badge-secondary">'+rs.rows.item(0).mycount+'</span>');
    }, function(tx, error) {
      mensaje('SELECT error: ' + error.message);
    });
  });
}


// guardo las respuestas elegidas en la BD
function saveResults()
{
  //obtengo el siguiente ID
  db.transaction(function(tx) {
    tx.executeSql('SELECT max(id) AS mycount FROM respuestas', [], function(tx, rs) {
      maximo=rs.rows.item(0).mycount;
      maximo++;
    }, function(tx, error) {
      mensaje('SELECT error: ' + error.message);
    });
  });
  //recorro el array de respuestas y las guardo en la BD
  db.transaction(function(tx) {
    $.each(arrayResultados, function(i, item) {
      tx.executeSql("INSERT INTO respuestas values (?,?,?)", [maximo,item.eleccion_id,item.estado]);
      maximo++;
    });
  }, function(e) {
    mensaje('Transaction error1: ' + e.message);
    alert('Transaction error1: ' + e.message);
  }, function() {

  });

  //mostrar mensaje de final
  swal({
    title:"Encuesta",
    text:"La encuesta se completó correctamente!",
    type:"success"
  },
  function(){ });

}

//me conecto con el satelite de la CIA
function mensaje(msg)
{
  alert(msg);
}
