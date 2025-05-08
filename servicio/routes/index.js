var express = require('express');
var router = express.Router();
var fs = require('node:fs');
var mysql = require('mysql');
var date = require('date-and-time')

var cliente_bbdd = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "sensor_info"
});

cliente_bbdd.connect();

var descripcion = "";

fs.readFile("descripcion.xml", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  descripcion = data;
})


/* GET home page. */
router.get('/', function (req, res, next) {

  if (req.query.wadl == '') {
    res.status(200).send(descripcion);
  } else {
    res.render('index', { title: 'Data-Logger' });
  }


});

router.get('/media_co2', function (req, res, next) {
  var fecha_inicio = req.query.fecha_inicio;
  var fecha_final = req.query.fecha_final;

  if ('fecha_inicio' in req.query && 'fecha_final' in req.query) {
    fecha_inicio = new Date(parseInt(fecha_inicio) * 1000)
    fecha_final = new Date(parseInt(fecha_final) * 1000)
    cliente_bbdd.query({
      sql: "select avg(co2) from info where fecha BETWEEN ? AND ?;",
      values: [date.format(fecha_inicio, "YYYY-MM-DD hh:mm:ss"), date.format(fecha_final, "YYYY-MM-DD hh:mm:ss")]
    },

      (error, results, fields) => {
        if (!error) {
          res.send(results[0]['avg(co2)'].toString())
        } else {
          res.sendStatus(400)
        }
      }
    )
  } else {
    cliente_bbdd.query({
      sql: "select avg(co2) from info;",
    },

      (error, results, fields) => {
        if (!error) {
          res.send(results[0]['avg(co2)'].toString())
        } else {
          res.sendStatus(400)
        }
      }
    )
  }
});

router.get('/fecha_co2_alto', function (req, res, next) {
  var valor_co2 = req.query.valor_co2;
  var lista = [] 

  if ('valor_co2' in req.query) {
    cliente_bbdd.query({
      sql: "select id, fecha, co2 from info where co2 > ?;",
      values: [valor_co2]
    },
      (error, results, fields) => {
        if (!error) {
          for(var i of results){
            lista.push({"id": i.id, "fecha": i.fecha, "co2": i.co2})
          }
          res.send(lista)
        } else {
          res.sendStatus(400)
        }
      }
    )
  } else {
    res.sendStatus(400)
  }
});

module.exports = router;
