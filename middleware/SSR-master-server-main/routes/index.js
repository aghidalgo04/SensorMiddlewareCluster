var express = require('express');
var router = express.Router();
var fs = require('node:fs');

var crypto = require('crypto');
var { Buffer } = require('node:buffer');
var mqtt = require('mqtt');

var cliente_mqtt = mqtt.connect("http://10.100.0.119:1883");

var descripcion = "";

fs.readFile("descripcion.xml", "utf8", (err, data) => {
  if(err) {
    console.error(err);
    return;
  }
  descripcion = data;
})


/* GET home page. */
router.get('/', function(req, res, next) {
  
  if(req.query.wadl == '')
  {
    res.status(200).send(descripcion);
  } else {
    res.render('index', { title: 'Data-Logger' });
  }

  
});

router.get('/record', function(req, res, next) {
	
  res.send("Saving...");
  var datos = { "id": req.query.id_nodo,
                "temperatura": req.query.temperatura,
                "humedad": req.query.humedad,
                "co2": req.query.co2,
                "volatiles": req.query.volatiles};

  cliente_mqtt.publish("node/"+ req.query.id_nodo , JSON.stringify(datos));
});

router.post("/record", function(peticion, respuesta) {
    var mensaje = [...peticion.body];

  var cifrado = mensaje.slice(0, mensaje.length - 16)
  var vi = mensaje.slice(mensaje.length - 16)

  const cifradoBuffer = Buffer.from(cifrado)
  const viBuffer = Buffer.from(vi)

  const clave = [46, 72, 61, 8, 97, 165, 145, 13, 4, 243, 50, 112, 48, 138, 63, 149]
  const claveBuffer = Buffer.from(clave)

  var descifrador = crypto.createDecipheriv("aes-128-ctr", claveBuffer, viBuffer)
  var descifrado = descifrador.update(cifradoBuffer) + descifrador.final()

  var json = JSON.parse(descifrado)

  var datos = { "id": json.id,
                "temperatura": json.temperatura,
                "humedad": json.humedad,
                "co2": json.co2,
                "volatiles": json.volatiles};

  cliente_mqtt.publish("node/"+ req.query.id_nodo , JSON.stringify(datos));

  respuesta.status(200).send("")
})

module.exports = router;
