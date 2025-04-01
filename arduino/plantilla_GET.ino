/**
 * Redes Avanzadas
 * Modelo para peticiones GET y POST
 */

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <Base64.h>
#include "Cipher.h"

const String ip = "138.100.156.202";

String serverName = "Servidor destino";
const char* ssid     = "noEntrar";
const char* password = "6i3A745%";
String nombreNodo = "nodo4";

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

   WiFi.mode(WIFI_STA);
   WiFi.begin(ssid, password);
   while (WiFi.status() != WL_CONNECTED) 
   { 
     delay(100);  
     Serial.print('.'); 
   }
 
   Serial.println("");
   Serial.print("Iniciado STA:\t");
   Serial.println(ssid);
   Serial.print("IP address:\t");
   Serial.println(WiFi.localIP());
}

void loop() {
  // put your main code here, to run repeatedly:

  WiFiClient client;
  HTTPClient http;

  int temperatura = 20;
  int humedad = 75;
  int co2 = 130;
  int volatiles = 45;
  // http://localhost:3001/record?id_nodo=nodoPrueba1&temperatura=24.5&humedad=68.2&co2=293&volatiles=112
  //String serverPath = "http://"+ip+":3001/record?id_nodo="+nombreNodo+"&temperatura="+temperatura+"&humedad="+humedad+"&co2="+co2+"&volatiles="+volatiles;
  String serverPath = "http://"+ip+":3001/record";

  http.begin(client, serverPath.c_str());
  http.addHeader("content-type", "application/octet-stream");
  // Send HTTP GET request
  //int httpResponseCode = http.GET();
  String mensaje =
    "{\"id\":\"" + nombreNodo + "\"," +
    "\"temperatura\":" + temperatura + "," +
    "\"humedad\":" + humedad + "," +
    "\"co2\":" + co2 + ", " +
    "\"volatiles\":" + volatiles +
  "}";

  uint8_t key[16] = {46, 72, 61, 8, 97, 165, 145, 13, 4, 243, 50, 112, 48, 138, 63, 149};
  AES128CTR cifrador = AES128CTR(key);
  AES128CTREncryptionResult cifrado = cifrador.encrypt((uint8_t *) mensaje.c_str(), mensaje.length());
  uint8_t enviar[cifrado.ciphertextSize + 16]; 
  memcpy(enviar, cifrado.ciphertext, cifrado.ciphertextSize);
  memcpy(enviar + cifrado.ciphertextSize, cifrado.iv, 16);

  int httpResponseCode = http.POST(enviar, cifrado.ciphertextSize + 16);

  if (httpResponseCode <= 0) {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }

  else{
    Serial.println("Todo correcto");
  }

  // Free resources
  http.end();

  delay(500);
}

