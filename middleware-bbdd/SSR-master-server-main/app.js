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
	if(err) {
	  console.log("Error al suscribirse");
	  process.exit(1);
	}
	console.log("Suscrito");
  });
})

// var fecha = new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000);

// for(var i = 0; i < 20000; i++){
// 	var id = Math.floor(Math.random() * 10);
// 	var temperatura = Math.random() * 50;
// 	var humedad = Math.random() * 100;
// 	var co2 = Math.random() * 1000;
// 	var volatiles = Math.random() * 1000;
// 	fecha = new Date(fecha.getTime() + 30000);
	

// 	cliente_bbdd.query({
// 		sql: "INSERT INTO info (id, temperatura, humedad, co2, volatiles, fecha) VALUES (?, ?, ?, ?, ?, ?);",
// 		values: [id, temperatura, humedad, co2, volatiles, date.format(fecha, "YYYY-MM-DD hh:mm:ss")]
// 	  },
// 	  (error, results, fields) => {
// 		if(error) {
// 		  console.log(error);
// 		}
// 	  }
// 	);
// }


cliente_mqtt.on("message", (topic, message) => {
  var datos = JSON.parse(message.toString())

  console.log("Datos recibidos de nodo " + datos.id);
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
