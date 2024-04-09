import crypto from 'crypto';
import mongoose, { Schema, Document, Model } from 'mongoose';

interface ApplicationKey extends Document {
  privateKey: string;
  publicKey: string;
  isDelete: boolean;
  createAt: Date;
  deleteAt: Date;
}

const ApplicationKeySchema: Schema = new Schema({
  privateKey: { type: String },
  publicKey: { type: String },
  isDelete: { type: Boolean },
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date },
});

const ApplicationKeyModel = mongoose.model<ApplicationKey>(
  'ApplicationKey',
  ApplicationKeySchema
);

export default class GenerateApplicationKey {
  private secretPassphrase = 's;lz\\V7xFioac,Um';
  constructor(
    private applicationKey: Model<ApplicationKey> = ApplicationKeyModel
  ) {}

  async init() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048, // Length of your key in bits
      publicKeyEncoding: {
        type: 'spki', // Recommended to be 'spki' by the Node.js docs
        format: 'pem', // Key is encoded in PEM format
      },
      privateKeyEncoding: {
        type: 'pkcs8', // Recommended to be 'pkcs8' by the Node.js docs
        format: 'pem', // Key is encoded in PEM format
        // cipher: 'aes-256-cbc',   // Optional encryption for private key
        // passphrase: this.secretPassphrase  // Necessary if cipher is used
      },
    });
    await ApplicationKeyModel.findOneAndUpdate(
      { isDelete: false },
      { isDelete: true, deleteAt: new Date() }
    );
    const result = new this.applicationKey({
      privateKey,
      publicKey,
      isDelete: false,
    });
    result.save();
  }

  async getApplicationKeyPair() {
    return await ApplicationKeyModel.findOne(
      { isDelete: false },
      { privateKey: 1, publicKey: 1, _id: 0 }
    ).lean();
  }
}
