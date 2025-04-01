#include "Cipher.h"

uint8_t key[16] = {1, 2, 4, 8, 16, 15, 14, 13, 12, 11, 0, 0, 0, 0, 0, 0};
AES128CTR cipher(key);
String text = "Hola qué tal";

void printhex(uint8_t *data, size_t dataSize);

void setup() {
// write your initialization code here
	Serial.begin(9600);

  //while(1) {
    Serial.print("\n\n\n");
    Serial.print("plaintext (" + text + "): ");
    printhex((uint8_t*) text.c_str(), text.length());
    Serial.println();

    auto result = cipher.encrypt((uint8_t*) text.c_str(), text.length());

    Serial.print("ciphertext: ");
    printhex(result.ciphertext, result.ciphertextSize);
    Serial.println();

    Serial.print("iv: ");
    printhex(result.iv, sizeof(result.iv));
    
    //delay(2500);
  //}
}

void loop() {
// write your code here.
}

void printhex(uint8_t *data, size_t dataSize) {
  for(int i = 0; i < dataSize; i++) {
		Serial.print("0x");
    if(data[i] < 0x10) {
      Serial.print("0");
    }
		Serial.print(data[i], HEX);

    if(i < dataSize - 1) {
		  Serial.print(", ");
    }
	}
}