var express = require('express');
var router = express.Router();

var mqtt = require('mqtt');
var mysql = require('mysql');
var date = require('date-and-time')

var cliente_mqtt = mqtt.connect("http://10.100.0.119:1883");
var cliente_bbdd = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "sensor_info"
});

cliente_bbdd.connect();

cliente_mqtt.on("connect", () => {
  cliente_mqtt.subscribe("#", (err) => {
    console.log("Suscribiendo");
    if(err) {
      console.log("Error al suscribirse");
      process.exit(1);
    }
  });
})


cliente_mqtt.on("message", (topic, message) => {
  var datos = JSON.parse(message.toString())

  cliente_bbdd.query({
      sql: "INSERT INTO info (id, temperatura, humedad, co2, volatiles, fecha) VALUES (?, ?, ?, ?, ?, ?);",
      values: [datos.id, datos.temperatura, datos.humedad, datos.co2, datos.volatiles, date.format(new Date(), "YYYY-MM-DD hh:mm:ss")]
    },
    (error, results, fields) => {
      if(error) {
        console.log(error);
      }
    }
  );
});


module.exports = router;
