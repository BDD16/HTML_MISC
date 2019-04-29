from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.Random import get_random_bytes
from Crypto.Hash   import SHA256
from Crypto.PublicKey import RSA
import binascii
import base64


BLOCK_SIZE = 16  # Bytes

#Padding functions
pad = lambda s: s + (BLOCK_SIZE - len(s) % BLOCK_SIZE) * \
                chr(BLOCK_SIZE - len(s) % BLOCK_SIZE)
unpad = lambda s: s[:-ord(s[-1:])]

me = '[CryptoTools]'

class CryptoTools:


    '''
    Constructor for CryptoPractice Class
    '''
    def __init__(self):
        self.key = None
        self.iv = None
        self.hmac = None
        self.salt = None
        self.mode = AES.MODE_CBC
        self.cipher = None
        self.hash = None
        self.nonce = None
        self.tag = None


    '''
    Generates a Random key of 256 bits
    Returns 256 bit random key
    '''
    def RandomKey256(self):
        key = get_random_bytes(32) #generate a random 256bit key
        return key


    '''
    Generates a Random key of 128 bits
    returns 128 bit random key
    '''
    def RandomKey128(self):
        key = get_random_bytes(16)
        return key


    '''
    Generate a Random Number in this case will be known as a salt
    @size is the size in bytes of the random number to be generated
    Returns random number of user defined size
    '''
    def RandomNumber(self, size):
        salt = get_random_bytes(size)
        self.salt = salt
        return salt


    '''
    Sha256 digest
    @mesg is the data to hash
    returns SHA256 of a message
    '''
    def Sha256(self, mesg):
        self.hash = SHA256.new()
        self.hash.update(mesg)
        hash = self.hash.digest()
        return hash

    '''
    AES-EAX encrypt
    @plaintext is the data to encrypt
    @key is the key to be used for encryption
    Returns ciphertext which is the encrypted data
    '''
    def AesEncryptEAX(self, plaintext, key):
        self.cipher = AES.new(key, AES.MODE_EAX)
        self.nonce = self.cipher.nonce
        self.mode = AES.MODE_EAX
        ciphertext, self.tag = self.cipher.encrypt_and_digest(data)
        return ciphertext


    '''
    AES-EAX decrypt
    @cipherdata is encrypted data
    @key is key to be used for decryption (same key for encryption)
    returns the plain text of the encyrpted data
    '''
    def AesDecryptEAX(self,cipherdata,key):
        self.cipher = AES.new(key, AES.MODE_EAX, nonce=self.nonce)
        self.mode = AES.MODE_EAX
        plaintext = self.cipher.decrypt(cipherdata)
        try:
            self.cipher.verify(self.tag)
            return plaintext
        except ValueError:
            print me + 'Key incorrect or message is corrupted'


    '''
    AES-CBC encryption, encrypts data
    @key is the key for encyrption
    @iv is the initialization vector (usually salt + key)
    @plaintext is data to be encyrpted
    Returns cipher text
    '''
    def AesCbcEncrypt(self, key, iv, plaintext):
        paddedplain = pad(plaintext)
        self.cipher = AES.new(key, AES.MODE_CBC, iv)
        self.mode = AES.MODE_CBC
        ciphertext = self.cipher.encrypt(paddedplain)
        return ciphertext


    '''
    AES-CBC decryption, decrypts data
    @key is the key for encryption
    @iv is the initialization vector (salt + key, usually)
    @ciphertext is the encyrpted data to be decrypted
    '''
    def AesCbcDecrypt(self, key, iv, ciphertext):
        self.cipher = AES.new(key, AES.MODE_CBC, iv)
        self.mode = AES.MODE_CBC
        plaintext = self.cipher.decrypt(ciphertext)
        return unpad(plaintext)

    def RSAEncrypt(self, key, iv, plaintext):
        chunkarray = []
        ciphertext = ''
        padding = 11 #PKCS1_OAEP padding length
        start = 0
        maxChunk = len(key)/8 - padding
        self.cipher = PKCS1_OAEP.new(key)
        while start < len(plaintext):
            if len(plaintext) > (len(key)/8 - padding):
                #split the ciphertext into chunks
                endpoint = start + maxChunk
                if (start + maxChunk) > (len(key)/8 -padding):
                    endpoint = len(plaintext)

                chunk = plaintext[start:endpoint]
                start = endpoint

            ciphertext += self.cipher.encrypt(chunk)
        return ciphertext

    def RSADecyrpt(self, key, iv, ciphertext):
        self.cipher = RSA


    def RSAGenerateKey(keyLength):
        return RSA.generate(keyLength)

'''
just test AES EAX encryption/decryption as well as random256 bit key
'''
if __name__ == '__main__':
    crypt = CryptoTools()
    crypt.key = crypt.RandomKey256()
    b64 = base64.urlsafe_b64encode(str(crypt.key))
    print me + 'INFO> b64 key: ' + b64
    crypt.salt = crypt.RandomNumber(16)
    print me + 'INFO> length of salt: ' + str(len(crypt.salt))
    derivedkey = crypt.Sha256(crypt.salt + crypt.key)
    print me + 'INFO> derived key b64: ' + base64.urlsafe_b64encode(str(derivedkey))
    data = 'well hello to the world'
    #AES-EAX
    ciphertext = crypt.AesEncryptEAX(data, crypt.key)
    print me + 'INFO> AES_EAX ciphertext: ' + ciphertext
    print me + 'INFO> AES_EAX decrypt: ' + crypt.AesDecryptEAX(ciphertext, crypt.key)
    #AES-CBC
    plaintext = 'secret message A through b and possibly c'
    n = 16 - (len(plaintext) % 16)
    plaintext = bytes(plaintext) + bytes(b'\x00')*n
    print str(plaintext)
    print me + 'INFO> ' + str(len(bytes(plaintext)))
    ciphertext1 = crypt.AesCbcEncrypt(derivedkey, crypt.salt, bytes(plaintext))
    print me + 'INFO> AES-CBC Encrypt ' + str(ciphertext1)
    print me + 'INFO> Length of cipher: ' + str(len(ciphertext1))
    decrypted = crypt.AesCbcDecrypt(derivedkey, crypt.salt, ciphertext1)
    print me + 'INFO> AES-CBC Decrypt ' + str(decrypted)
