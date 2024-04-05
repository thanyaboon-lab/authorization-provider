import crypto from 'crypto'
import mongoose, { Schema, Document, Model } from 'mongoose';

interface ApplicationKey extends Document {
  privateKey: string;
  publicKey: string;
  createAt: Date
}

const ApplicationKeySchema: Schema = new Schema({
  privateKey: { type: String },
  publicKey: { type: String },
  createAt: { type: Date, auto: true },
});

const ApplicationKeyModel = mongoose.model<ApplicationKey>(
  'ApplicationKey',
  ApplicationKeySchema
);

export class GenerateApplicationKey {
    private secretPassphrase = 's;lz\\V7xFioac,Um'
    constructor(private applicationKey: Model<ApplicationKey> = ApplicationKeyModel) {}

    init () {
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,  // Length of your key in bits
        publicKeyEncoding: {
          type: 'spki',       // Recommended to be 'spki' by the Node.js docs
          format: 'pem'       // Key is encoded in PEM format
        },
        privateKeyEncoding: {
          type: 'pkcs8',      // Recommended to be 'pkcs8' by the Node.js docs
          format: 'pem',      // Key is encoded in PEM format
          cipher: 'aes-256-cbc',   // Optional encryption for private key
          passphrase: this.secretPassphrase  // Necessary if cipher is used
        }
      });
      console.log('🚀 ~ privateKey:', privateKey)
      console.log('🚀 ~ publicKey:', publicKey)
      const result = new this.applicationKey({privateKey, publicKey})
      result.save()
    }

    async applicationKeyPair () {
      return await ApplicationKeyModel.findOne({}, {privateKey: 1, _id: 0}).sort({createAt: -1}).lean()
    }
}
