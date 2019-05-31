var urlAPI='http://resistencia.gob.ar/appencuesta/';
var db=null;
mensaje("Conectando al servidor");
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
 db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default', androidDatabaseProvider: 'system', androidLockWorkaround: 1 }, function (db) {

  db.transaction(function(tx) {
      tx.executeSql('SELECT count(*) AS mycount FROM usuarios', [], function(tx, rs) {
        //mensaje("filas: "+rs.rows.item(0).mycount);
        if(rs.rows.item(0).mycount=='0')
        {
          //volver al inicio si no hay usuarios cargados (OJO: bucle infinito?)
          //window.location.href="init.html";
          mensaje("Descargando...");
        }
      }, function(tx, error) {
        mensaje('SELECT error: ' + error.message);
      });
    });
  });
  encuestas();
  elecciones();
  preguntas();
   opciones();
  tipos();
  encuestas_x_usuario();
  //test();
  //las respuestas NO hay que copiarlas del servidor!
  //respuestas();
  usuarios();

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

function elecciones()
{
  //var db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {

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


  /*}, function (error) {
    mensaje("Error abriendo BD: "+ JSON.stringify(error));
  });*/
}

function encuestas()
{


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



}

function opciones()
{
  //var db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {

    $.ajax({
      url: urlAPI+"API.php?tabla=opciones",
      dataType: "json",
      async: false,
      success: function(res) {
        //alert(res);
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


  /*}, function (error) {
    mensaje("Error abriendo BD: "+ JSON.stringify(error));
  });*/
}

function preguntas()
{
  //var db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {

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


 /* }, function (error) {
    mensaje("Error abriendo BD: "+ JSON.stringify(error));
  });*/
}

function tipos()
{
  //var db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {

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


 /* }, function (error) {
    mensaje("Error abriendo BD: "+ JSON.stringify(error));
  });*/
}

function usuarios()
{
  //var db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {

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
          if(localStorage.getItem("nombreUsuario")===null) {
            //no hay nadie logeado, ir al login
            window.location.href="login.html";
          }
          else {
            //ir al content porque hay alguien logeado
            window.location.href="content.html";
          }
          //mensaje("Finalizado");
          //  $("#estado").append('<a href="login.html" class="btn btn-block btn-success rounded border-0 z-3">Empezar</a>');
        });
      },
      error: function(e) {
        mensaje('ajax error: ' + JSON.stringify(e));
        alert('ajax error: ' + JSON.stringify(e));
      }
    });


  /*}, function (error) {
    mensaje("Error abriendo BD: "+ JSON.stringify(error));
  });*/
}

function encuestas_x_usuario()
{
  //var db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {

    $.ajax({
      url: urlAPI+"API.php?tabla=encuesta_x_usuario",
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


 /* }, function (error) {
    mensaje("Error abriendo BD: "+ JSON.stringify(error));
  });*/
}

function respuestas()
{
 // var db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {

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


  /*}, function (error) {
    mensaje("Error abriendo BD: "+ JSON.stringify(error));
  });*/
}


function mensaje(msg)
{
  $('#estado').append('<p>'+msg+'</p>');
}
