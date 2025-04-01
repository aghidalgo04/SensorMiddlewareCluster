#ifndef CIPHER_H
#define CIPHER_H

#include <AES.h>
#include <CTR.h>

#define AES_BLOCKSIZE 16
#define AES128_KEYLENGTH 16
#define CTR_NONCE_SIZE 12

struct AES128CTREncryptionResult {
	uint8_t *ciphertext;
	size_t ciphertextSize;

	uint8_t iv[AES_BLOCKSIZE];

	AES128CTREncryptionResult(size_t ciphertextSize);
	~AES128CTREncryptionResult();
};

struct AES128CTRDecryptionResult {
	uint8_t *data;
	size_t dataSize;

	AES128CTRDecryptionResult(size_t dataSize);
	~AES128CTRDecryptionResult();
};


class AES128CTR {
  private:
    CTR<AES128> cipher;
    uint8_t key[AES128_KEYLENGTH];
  
  public:
    AES128CTR(const uint8_t key[AES128_KEYLENGTH]);
    AES128CTREncryptionResult encrypt(uint8_t *data, size_t dataSize);
    AES128CTRDecryptionResult decrypt(uint8_t *ciphertext, size_t ciphertextSize, uint8_t iv[AES_BLOCKSIZE]);
};
#endif