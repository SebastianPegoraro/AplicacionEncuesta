
mensaje("Iniciando");
document.addEventListener("deviceready", onDeviceReady, false);

//iniciar base de datos, crear si no existe. consultar por una tabla, si no
//devuelve filas, tengo que conectarme al servidor y leer los datos.
function onDeviceReady() {
mensaje("Comprobando datos");
  var db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {
//crear las tablas si no existen
    db.executeSql('CREATE TABLE  elecciones (id INTEGER,descripcion)');
    db.executeSql('CREATE TABLE  encuestas (id INTEGER,titulo,fecha_inicio,fecha_cierre,fecha_creacion)');
    db.executeSql('CREATE TABLE  opciones (id INTEGER,eleccion_id,tipo_id,pregunta_id,estado)');
    db.executeSql('CREATE TABLE  preguntas (id INTEGER,descripcion,encuesta_id)');
    db.executeSql('CREATE TABLE  tipos (id INTEGER,clase)');
    db.executeSql('CREATE TABLE  usuarios (idUsuario INTEGER,nombre,password,tipo)');

    mensaje("Leyendo datos");

    db.transaction(function(tx) {
    tx.executeSql('SELECT count(*) AS mycount FROM usuarios', [], function(tx, rs) {
      //mensaje("filas: "+rs.rows.item(0).mycount);
      if(rs.rows.item(0).mycount=='0')
      {
      window.location.href="init.html";
      }
      else {
        window.location.href="login.html";
      }
    }, function(tx, error) {
      mensaje('SELECT error: ' + error.message);
    });
  });


}, function (error) {
  mensaje("Error abriendo BD: "+ JSON.stringify(error));
});
}


function mensaje(msg)
{
  $('#estado').append('<p>'+msg+'</p>');
}
