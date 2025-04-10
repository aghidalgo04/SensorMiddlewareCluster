var express = require('express');
var router = express.Router();
var fs = require('fs');
var requestStats = require("request-stats")

var crypto = require('crypto');
var { Buffer } = require('node:buffer');
var mqtt = require('mqtt');

var cliente_mqtt = mqtt.connect("http://138.100.156.203:1883");



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Data-Logger' });
});

router.get('/record', function(req, res, next) {
	
  res.send("Saving: "+req.query.id_nodo+';'+now.getTime()+";"+req.query.temperatura+";"+req.query.humedad+";"+req.query.co2+";"+req.query.volatiles+" in: "+logfile_name);
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
  console.log(json)

  var now = new Date();
  var logfile_name = __dirname+'/../public/logs/' +json.id+ "-"+ now.getFullYear() + "-"+ now.getMonth() + "-" + now.getDate() +'.csv';

  fs.stat(logfile_name, function(err, stat) {
    if(err == null) {
        console.log('File %s exists', logfile_name);
        let content = json.id+';'+now.getTime()+";"+json.temperatura+";"+json.humedad+";"+json.co2+";"+json.volatiles+"\r\n";
        append2file(logfile_name, content);
      
    } else if(err.code === 'ENOENT') {
        // file does not exist
        let content ='id_nodo; timestamp; temperatura; humedad; CO2; volatiles\r\n'+json.id+';'+now.getTime()+";"+json.temperatura+";"+json.humedad+";"+json.co2+";"+json.volatiles+"\r\n";
        append2file(logfile_name, content);
    
    } else {
        console.log('Some other error: ', err.code);
    }
  });

  respuesta.status(200).send("")
})

function append2file (file2append, content){
	fs.appendFile(file2append, content, function (err) {
    if (err) throw err;
    console.log("Saving: "+content+" in: "+file2append);
});
}

module.exports = router;
