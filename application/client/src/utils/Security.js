const EthCrypto = require("eth-crypto");

const Security = async () => {};

export const GetPublicKey = (privateKey) => {
  return EthCrypto.publicKeyByPrivateKey(privateKey);
};

export const Encrypt = async (hashFile, publicKey) => {
  try {
    //membuat string payload
    const payloadString = JSON.stringify({
      hashFile: hashFile,
    });

    //enkripsi payload dengan kunci publik
    const encrypted = await EthCrypto.encryptWithPublicKey(
      publicKey,
      payloadString
    );

    //konversi hasil enkripsi ke string
    const hashFileEncrypted = EthCrypto.cipher.stringify(encrypted);

    //menembalikan variabel hashFileEncrypted
    return hashFileEncrypted;
  } catch (error) {
    console.info(error);
    return;
  }
};

export const Decrypt = async (hashDocument, privateKey) => {
  try {
    console.info(hashDocument, privateKey, "suck");
    //parse hashDocument to object
    const encryptedObject = EthCrypto.cipher.parse(hashDocument);

    //decrypt hash document using private key
    const decrypted = await EthCrypto.decryptWithPrivateKey(
      privateKey,
      encryptedObject
    );

    console.info(encryptedObject, decrypted, "ddddd");
    // decrypt payload stirng to json
    const decryptedPayload = JSON.parse(decrypted);

    return decryptedPayload.hashFile;
  } catch (error) {
    console.info(error);
    return;
  }
};

export const EncryptSign = async (hashFile, ownerAccount, privateKey) => {
  try {
    //get publickey from private
    const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);

    // hash document
    const hashDocument = EthCrypto.hash.keccak256(
      hashFile + ownerAccount.slice(2)
    );

    // create signature
    const signature = EthCrypto.sign(privateKey, hashDocument);

    //create payload string
    const payloadString = JSON.stringify({
      hashFile: hashFile,
      signature,
    });

    //encrypt payload
    const encrypted = await EthCrypto.encryptWithPublicKey(
      publicKey,
      payloadString
    );

    //encrypt to string
    const encryptedDocument = EthCrypto.cipher.stringify(encrypted);

    return encryptedDocument;
  } catch (error) {
    console.info(error);
    return;
  }
};

export const DecryptSign = async (hashDocument, ownerAccount, privateKey) => {
  try {
    //parse hashDocument to object
    const encryptedObject = EthCrypto.cipher.parse(hashDocument);

    //decrypt hash document using private key
    const decrypted = await EthCrypto.decryptWithPrivateKey(
      privateKey,
      encryptedObject
    );

    // decrypt payload stirng to json
    const decryptedPayload = JSON.parse(decrypted);

    // check signature
    const senderAccount = EthCrypto.recover(
      decryptedPayload.signature,
      EthCrypto.hash.keccak256(
        decryptedPayload.hashFile + ownerAccount.slice(2)
      )
    );

    if (senderAccount !== ownerAccount) {
      throw Object.assign(new Error("Invalid signature"), { code: 503 });
    }

    return decryptedPayload.hashFile;
  } catch (error) {
    console.info(error);
    return;
  }
};

export default Security;
