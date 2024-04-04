import mongoose, { Document, Schema } from 'mongoose';

interface OAuthClient extends Document {
  id: string;
  userId: string;
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  grants: string[];
}

interface OAuthAuthorizationCode extends Document {
  id: string;
  authorizationCode: string;
  expiresAt: Date;
  redirectUri: string;
  scope: string;
  clientId: string;
  userId: string;
}

interface OAuthAccessToken extends Document {
  id: string;
  accessToken: string;
  accessTokenExpiresAt: Date;
  scope: string;
  clientId: string;
  userId: string;
}

interface OAuthRefreshToken extends Document {
  id: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  scope: string;
  clientId: string;
  userId: string;
}

const OAuthClientSchema: Schema = new Schema({
  id: { type: String, auto: true },
  clientId: { type: String },
  clientSecret: { type: String },
  callbackUrl: { type: String },
  grants: {
    type: [String],
    required: true,
    enum: ['authorization_code', 'refresh_token'],
  },
});

const OAuthAuthorizationCodeSchema: Schema = new Schema({
  id: { type: String, auto: true },
  authorizationCode: { type: String },
  expiresAt: { type: Date },
  redirectUri: { type: String },
  scope: { type: String },
  clientId: { type: String },
  userId: { type: String },
});

const OAuthAccessTokenSchema: Schema = new Schema({
  id: { type: String, auto: true },
  accessToken: { type: String },
  accessTokenExpiresAt: { type: Date },
  scope: { type: String },
  clientId: { type: String },
  userId: { type: String },
});

const OAuthRefreshTokenSchema: Schema = new Schema({
  id: { type: String, auto: true },
  refreshToken: { type: String },
  refreshTokenExpiresAt: { type: Date },
  scope: { type: String },
  clientId: { type: String },
  userId: { type: String },
});

const OAuthClientModel = mongoose.model<OAuthClient>('OAuthClient', OAuthClientSchema);
const OAuthAuthorizationModel = mongoose.model<OAuthAuthorizationCode>('OAuthAuthorizationCode', OAuthAuthorizationCodeSchema);
const OAuthAccessTokenModel = mongoose.model<OAuthAccessToken>('OAuthAccessToken', OAuthAccessTokenSchema);
const OAuthRefreshTokenModel = mongoose.model<OAuthRefreshToken>('OAuthRefreshToken', OAuthRefreshTokenSchema);
