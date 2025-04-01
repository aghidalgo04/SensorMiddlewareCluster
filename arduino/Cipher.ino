
#include <AES.h>
#include <CTR.h>
#include "Cipher.h"


AES128CTREncryptionResult::AES128CTREncryptionResult(size_t ciphertextSize) {
  this->ciphertext = (uint8_t*) malloc(ciphertextSize);
  this->ciphertextSize = ciphertextSize;
}
AES128CTREncryptionResult::~AES128CTREncryptionResult() {
  free(this->ciphertext);
}


AES128CTRDecryptionResult::AES128CTRDecryptionResult(size_t dataSize) {
  this->data = (uint8_t*) malloc(dataSize);
  this->dataSize = dataSize;
}
AES128CTRDecryptionResult::~AES128CTRDecryptionResult() {
  free(this->data);
}



AES128CTR::AES128CTR(const uint8_t key[AES128_KEYLENGTH]) {
  memcpy(this->key, key, AES128_KEYLENGTH);
  cipher.setKey(this->key, sizeof(this->key));
}

AES128CTREncryptionResult AES128CTR::encrypt(uint8_t *data, size_t dataSize) {
  cipher.clear();
  cipher.setKey(key, AES128_KEYLENGTH);
  AES128CTREncryptionResult result(dataSize);

  // Generate a random IV.
  // NOTE: Insecure random()
  memset(result.iv, 0, AES_BLOCKSIZE);
  for(size_t i = 0; i < CTR_NONCE_SIZE; i++) {
    result.iv[i] = random();
  }
  cipher.setIV(result.iv, sizeof(result.iv));

  cipher.encrypt(result.ciphertext, data, dataSize);

  return result;
}


AES128CTRDecryptionResult AES128CTR::decrypt(uint8_t *ciphertext, size_t ciphertextSize, uint8_t iv[AES_BLOCKSIZE]) {
  cipher.clear();
  cipher.setKey(key, AES128_KEYLENGTH);
  AES128CTRDecryptionResult result(ciphertextSize);

  cipher.setIV(iv, AES_BLOCKSIZE);
  cipher.decrypt(result.data, ciphertext, ciphertextSize);

  return result;
}
