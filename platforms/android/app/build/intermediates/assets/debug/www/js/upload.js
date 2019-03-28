var urlAPI='http://resistencia.gob.ar/appencuesta/';

var db = null;
var arrayResultados  = new Array();

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
<<<<<<< HEAD
 db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {
    db.transaction(function(tx) {
    tx.executeSql('SELECT * from respuestas', [], function(tx, resultSet) {

      for(var x = 0; x < resultSet.rows.length; x++) {
        arrayResultados.push({opcion_id : resultSet.rows.item(x).opcion_id, estado:resultSet.rows.item(x).estado});
          }
          subirdatos();
    }, function(tx, error) {
      mensaje('SELECT error: ' + error.message);
=======
  db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {
    db.transaction(function(tx) {
      tx.executeSql('SELECT * from respuestas', [], function(tx, resultSet) {

        for(var x = 0; x < resultSet.rows.length; x++) {
          arrayResultados.push({opcion_id : resultSet.rows.item(x).opcion_id, estado:resultSet.rows.item(x).estado});
        }
        subirdatos();
      }, function(tx, error) {
        mensaje('SELECT error: ' + error.message);
      });
>>>>>>> 47318c7254cfaf98a6daf68eb80ee846bde0cfd7
    });



  }, function (error) {
    mensaje("Error abriendo BD: "+ JSON.stringify(error));
  });
}


function subirdatos()
{
  $.ajax({
    type: 'POST',
    url: urlAPI+'upload.php',
    data: {data : JSON.stringify(arrayResultados)},
    dataType: "json",
    async: false,

<<<<<<< HEAD
              success: function(res) {
                db.transaction(function (tx) {
                    // ...
                    tx.executeSql('delete from elecciones');
                    tx.executeSql('delete from encuestas');
                    tx.executeSql('delete from opciones');
                    tx.executeSql('delete from preguntas');
                    tx.executeSql('delete from tipos');
                    tx.executeSql('delete from encuestas_x_usuario');
                    tx.executeSql('delete from respuestas');
                    tx.executeSql('delete from usuarios');
                }, function (error) {
                    alert('transaction error: ' + error.message);
                }, function () {
                  window.localStorage.clear();
                  window.location.href="index.html";
                });


              },
              error: function(e) {
                db.transaction(function (tx) {
                    // ...
                    tx.executeSql('delete from elecciones');
                    tx.executeSql('delete from encuestas');
                    tx.executeSql('delete from opciones');
                    tx.executeSql('delete from preguntas');
                    tx.executeSql('delete from tipos');
                    tx.executeSql('delete from encuestas_x_usuario');
                    tx.executeSql('delete from respuestas');
                    tx.executeSql('delete from usuarios');
                }, function (error) {
                    alert('transaction error: ' + error.message);
                }, function () {
                  window.localStorage.clear();
                  window.location.href="init.html";
                });
=======
    success: function(res) {
      db.transaction(function (tx) {
        // ...
        tx.executeSql('delete from elecciones');
        tx.executeSql('delete from encuestas');
        tx.executeSql('delete from opciones');
        tx.executeSql('delete from preguntas');
        tx.executeSql('delete from tipos');
        tx.executeSql('delete from encuestas_x_usuario');
        tx.executeSql('delete from respuestas');
        tx.executeSql('delete from usuarios');
      }, function (error) {
        alert('transaction error: ' + error.message);
      }, function () {
        window.localStorage.clear();
        window.location.href="init.html";
      });


    },
    error: function(e) {
      db.transaction(function (tx) {
        // ...
        tx.executeSql('delete from elecciones');
        tx.executeSql('delete from encuestas');
        tx.executeSql('delete from opciones');
        tx.executeSql('delete from preguntas');
        tx.executeSql('delete from tipos');
        tx.executeSql('delete from encuestas_x_usuario');
        tx.executeSql('delete from respuestas');
        tx.executeSql('delete from usuarios');
      }, function (error) {
        alert('transaction error: ' + error.message);
      }, function () {
        window.localStorage.clear();
        window.location.href="init.html";
      });
>>>>>>> 47318c7254cfaf98a6daf68eb80ee846bde0cfd7

    }
  });
}


function mensaje(msg)
{
  alert(msg);
}
