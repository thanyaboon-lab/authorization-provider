import mongoose, { Document, Schema } from 'mongoose';

interface OAuthClient extends Document {
  userId: string;
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  grants: string[];
}

interface OAuthAuthorizationCode extends Document {
  authorizationCode: string;
  expiresAt: Date;
  redirectUri: string;
  scope: string;
  clientId: string;
  userId: string;
}

interface OAuthAccessToken extends Document {
  accessToken: string;
  accessTokenExpiresAt: Date;
  scope: string;
  clientId: string;
  userId: string;
}

interface OAuthRefreshToken extends Document {
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  scope: string;
  clientId: string;
  userId: string;
}

const OAuthClientSchema: Schema = new Schema({
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
  authorizationCode: { type: String },
  expiresAt: { type: Date },
  redirectUri: { type: String },
  scope: { type: String },
  clientId: { type: String },
  userId: { type: String },
});

const OAuthAccessTokenSchema: Schema = new Schema({
  accessToken: { type: String },
  accessTokenExpiresAt: { type: Date },
  scope: { type: String },
  clientId: { type: String },
  userId: { type: String },
});

const OAuthRefreshTokenSchema: Schema = new Schema({
  refreshToken: { type: String },
  refreshTokenExpiresAt: { type: Date },
  scope: { type: String },
  clientId: { type: String },
  userId: { type: String },
});

const OAuthClientModel = mongoose.model<OAuthClient>('OAuthClient', OAuthClientSchema);
const OAuthAuthorizationCodeModel = mongoose.model<OAuthAuthorizationCode>('OAuthAuthorizationCode', OAuthAuthorizationCodeSchema);
const OAuthAccessTokenModel = mongoose.model<OAuthAccessToken>('OAuthAccessToken', OAuthAccessTokenSchema);
const OAuthRefreshTokenModel = mongoose.model<OAuthRefreshToken>('OAuthRefreshToken', OAuthRefreshTokenSchema);

export { OAuthClientModel, OAuthAuthorizationCodeModel, OAuthAccessTokenModel, OAuthRefreshTokenModel }