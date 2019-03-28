var urlAPI='http://resistencia.gob.ar/appencuesta/';

mensaje("Conectando al servidor");
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  elecciones();
  encuestas();
  opciones();
  preguntas();
  tipos();
  encuestas_x_usuario();
  //las respuestas NO hay que copiarlas del servidor!
  //respuestas();
  usuarios();

}

function elecciones()
{
  var db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {

    $.ajax({
      url: urlAPI+"API.php?tabla=elecciones",
      dataType: "json",
      async: false,
      success: function(res) {
        mensaje("Copiando datos");
        db.transaction(function(tx) {
          $.each(res, function(i, item) {
            tx.executeSql("INSERT INTO elecciones values (?,?)", [item.id,item.descripcion]);

          });
        }, function(e) {
          mensaje('Transaction error1: ' + e.message);
          alert('Transaction error1: ' + e.message);
        }, function() {

        });
      },
      error: function(e) {
        mensaje('ajax error: ' + JSON.stringify(e));
        alert('ajax error: ' + JSON.stringify(e));
      }
    });


  }, function (error) {
    mensaje("Error abriendo BD: "+ JSON.stringify(error));
  });
}

function encuestas()
{
  var db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {

    $.ajax({
      url: urlAPI+"API.php?tabla=encuestas",
      dataType: "json",
      async: false,
      success: function(res) {
        //  mensaje("Copiando datos 2/6");
        db.transaction(function(tx) {
          $.each(res, function(i, item) {
            tx.executeSql("INSERT INTO encuestas values (?,?,?,?,?)", [item.id,item.titulo,item.fecha_inicio,item.fecha_cierre,item.fecha_creacion]);

          });
        }, function(e) {
          mensaje('Transaction error2: ' + e.message);
          alert('Transaction error2: ' + e.message);
        }, function() {

        });
      },
      error: function(e) {
        mensaje('ajax error: ' + JSON.stringify(e));
        alert('ajax error: ' + JSON.stringify(e));
      }
    });


  }, function (error) {
    mensaje("Error abriendo BD: "+ JSON.stringify(error));
  });
}

function opciones()
{
  var db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {

    $.ajax({
      url: urlAPI+"API.php?tabla=opciones",
      dataType: "json",
      async: false,
      success: function(res) {
        //  mensaje("Copiando datos 3/6");
        db.transaction(function(tx) {
          $.each(res, function(i, item) {
            tx.executeSql("INSERT INTO opciones values (?,?,?,?)", [item.id,item.eleccion_id,item.tipo_id,item.pregunta_id]);

          });
        }, function(e) {
          mensaje('Transaction error3: ' + e.message);
          alert('Transaction error3: ' + e.message);
        }, function() {

        });
      },
      error: function(e) {
        mensaje('ajax error: ' + JSON.stringify(e));
        alert('ajax error: ' + JSON.stringify(e));
      }
    });


  }, function (error) {
    mensaje("Error abriendo BD: "+ JSON.stringify(error));
  });
}

function preguntas()
{
  var db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {

    $.ajax({
      url: urlAPI+"API.php?tabla=preguntas",
      dataType: "json",
      async: false,
      success: function(res) {
        //  mensaje("Copiando datos 4/6");
        db.transaction(function(tx) {
          $.each(res, function(i, item) {
            tx.executeSql("INSERT INTO preguntas values (?,?,?)", [item.id,item.descripcion,item.encuesta_id]);

          });
        }, function(e) {
          mensaje('Transaction error4: ' + e.message);
          alert('Transaction error4: ' + e.message);
        }, function() {

        });
      },
      error: function(e) {
        mensaje('ajax error: ' + JSON.stringify(e));
        alert('ajax error: ' + JSON.stringify(e));
      }
    });


  }, function (error) {
    mensaje("Error abriendo BD: "+ JSON.stringify(error));
  });
}

function tipos()
{
  var db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {

    $.ajax({
      url: urlAPI+"API.php?tabla=tipos",
      dataType: "json",
      async: false,
      success: function(res) {
        //  mensaje("Copiando datos 5/6");
        db.transaction(function(tx) {
          $.each(res, function(i, item) {
            tx.executeSql("INSERT INTO tipos values (?,?)", [item.id,item.clase]);

          });
        }, function(e) {
          mensaje('Transaction error5: ' + e.message);
          alert('Transaction error5: ' + e.message);
        }, function() {

        });
      },
      error: function(e) {
        mensaje('ajax error: ' + JSON.stringify(e));
        alert('ajax error: ' + JSON.stringify(e));
      }
    });


  }, function (error) {
    mensaje("Error abriendo BD: "+ JSON.stringify(error));
  });
}

function usuarios()
{
  var db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {

    $.ajax({
      url: urlAPI+"API.php?tabla=usuarios",
      dataType: "json",
      async: false,
      success: function(res) {
        //  mensaje("Copiando datos 6/6");
        db.transaction(function(tx) {
          $.each(res, function(i, item) {
            tx.executeSql("INSERT INTO usuarios values (?,?,?,?)", [item.id,item.nombre,item.password,item.tipo]);

          });
        }, function(e) {
          mensaje('Transaction error8: ' + e.message);
          alert('Transaction error8: ' + e.message);
        }, function() {
          mensaje("Finalizado");
          $("#estado").append('<a href="login.html" class="btn btn-block btn-success rounded border-0 z-3">Empezar</a>');
        });
      },
      error: function(e) {
        mensaje('ajax error: ' + JSON.stringify(e));
        alert('ajax error: ' + JSON.stringify(e));
      }
    });


  }, function (error) {
    mensaje("Error abriendo BD: "+ JSON.stringify(error));
  });
}

function encuestas_x_usuario()
{
  var db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {

    $.ajax({
      url: urlAPI+"API.php?tabla=encuestas_x_usuario",
      dataType: "json",
      async: false,
      success: function(res) {
        //  mensaje("Copiando datos 6/6");
        db.transaction(function(tx) {
          $.each(res, function(i, item) {
            tx.executeSql("INSERT INTO encuestas_x_usuario values (?,?)", [item.encuesta_id,item.usuario_id]);

          });
        }, function(e) {
          mensaje('Transaction error6: ' + e.message);
          alert('Transaction error6: ' + e.message);
        }, function() {  });
      },
      error: function(e) {
        mensaje('ajax error: ' + JSON.stringify(e));
        alert('ajax error: ' + JSON.stringify(e));
      }
    });


  }, function (error) {
    mensaje("Error abriendo BD: "+ JSON.stringify(error));
  });
}

function respuestas()
{
  var db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {

    $.ajax({
      url: urlAPI+"API.php?tabla=respuestas",
      dataType: "json",
      async: false,
      success: function(res) {
        //  mensaje("Copiando datos 6/6");
        db.transaction(function(tx) {
          $.each(res, function(i, item) {
            tx.executeSql("INSERT INTO respuestas values (?,?,?)", [item.id,item.opcion_id,item.estado]);

          });
        }, function(e) {
          mensaje('Transaction error7: ' + e.message);
          alert('Transaction error7: ' + e.message);
        }, function() {  });
      },
      error: function(e) {
        mensaje('ajax error: ' + JSON.stringify(e));
        alert('ajax error: ' + JSON.stringify(e));
      }
    });


  }, function (error) {
    mensaje("Error abriendo BD: "+ JSON.stringify(error));
  });
}


function mensaje(msg)
{
  $('#estado').append('<p>'+msg+'</p>');
}
