var db = null;


document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {
}, function (error) {
    alert('Open database ERROR: ' + JSON.stringify(error));
});
}

$("#submit").on("click",function(){

  db.transaction(function (tx) {

      var query = "SELECT * from usuarios where nombre=? and password=?";

      tx.executeSql(query, [$("#usuario").val(),$("#pass").val()], function (tx, resultSet) {
        
        if(resultSet.rows.length==0)
        {
          $("#error").css("display","block");
        }
        else
        {
          for(var x = 0; x < resultSet.rows.length; x++) {
                  localStorage.setItem("nombreUsuario",resultSet.rows.item(x).nombre);
                  localStorage.setItem("tipoUsuario",resultSet.rows.item(x).tipo);
                  localStorage.setItem("idUsuario",resultSet.rows.item(x).id);
              }
          window.location.href="content.html";
        }
      },
      function (tx, error) {
          alert('SELECT error: ' + error.message);
      });
  }, function (error) {
      alert('transaction error: ' + error.message);
  }, function () {

  });
});
