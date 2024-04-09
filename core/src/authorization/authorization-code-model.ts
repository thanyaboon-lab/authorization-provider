import OAuth2Server from 'oauth2-server';
import {
  OAuthAccessTokenModel,
  OAuthAuthorizationCodeModel,
  OAuthClientModel,
  OAuthRefreshTokenModel,
} from './authorization.schema';
import JWT, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import GenerateApplicationKey from './generate-key';
import { DateTime } from 'luxon';

async function getClient(
  clientId: string,
  clientSecret: string
): Promise<OAuth2Server.Client | OAuth2Server.Falsey> {
  console.log('🚀 ~ getClient clientId:', clientId);
  console.log('🚀 ~ getClient clientSecret:', clientSecret);
  const client = await OAuthClientModel.findOne({
    clientId,
    ...(clientSecret && { clientSecret }),
  }).lean();
  if (!client) throw new Error('Client not found');

  return {
    id: client.clientId,
    grants: client.grants,
    redirectUris: [client.callbackUrl],
  };
}

/**
 * Verify Scope.
 */

async function verifyScope(token: OAuth2Server.Token, scope: string) {
  console.log('🚀 ~ verifyScope scope:', scope);
  console.log('🚀 ~ verifyScope token:', token);
  if (!token.scope) {
    return false;
  }
  const requestedScopes = scope.split(' ');
  const authorizedScopes = (token.scope as string).split(' ');
  return requestedScopes.every((s) => authorizedScopes.indexOf(s) >= 0);
}

/**
 * Save authorization code.
 */
async function saveAuthorizationCode(
  code: OAuth2Server.AuthorizationCode,
  client: OAuth2Server.Client,
  user: OAuth2Server.User
): Promise<OAuth2Server.AuthorizationCode> {
  console.log('🚀 ~ saveAuthorizationCode code:', code);
  console.log('🚀 ~ saveAuthorizationCode client:', client);
  console.log('🚀 ~ saveAuthorizationCode user:', user);
  const authorizationCode = {
    authorizationCode: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    scope: code.scope,
    clientId: client.id,
    userId: user.id,
    user,
    client,
  };
  await OAuthAuthorizationCodeModel.create({
    id: crypto.randomUUID(),
    ...authorizationCode,
  });
  return authorizationCode;
}

/**
 * Get authorization code.
 */
async function getAuthorizationCode(
  authorizationCode: string
): Promise<OAuth2Server.AuthorizationCode> {
  console.log(
    '🚀 ~ getAuthorizationCode authorizationCode:',
    authorizationCode
  );
  const code = await OAuthAuthorizationCodeModel.findOne({
    authorizationCode,
  }).lean();
  if (!code) throw new Error('Authorization code not found');

  return {
    authorizationCode: code.authorizationCode,
    code: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    scope: code.scope,
    client: { id: code.clientId, grants: ['authorization_code'] },
    user: { id: code.userId },
  };
}

/**
 * Revoke authorization code.
 */
async function revokeAuthorizationCode({
  code,
}: OAuth2Server.AuthorizationCode) {
  console.log('🚀 ~ revokeAuthorizationCode:', code);
  const res = await OAuthAuthorizationCodeModel.deleteOne({
    authorizationCode: code,
  });
  return res.deletedCount === 1;
}

/**
 * Revoke a refresh token.
 */
async function revokeToken({ refreshToken }: OAuth2Server.Token) {
  console.log('🚀 ~ revokeToken refreshToken:', refreshToken);
  const res = await OAuthAccessTokenModel.deleteOne({ refreshToken });
  return res.deletedCount === 1;
}

/**
 * Save token.
 */
async function saveToken(
  token: OAuth2Server.Token,
  client: OAuth2Server.Client,
  user: OAuth2Server.User
): Promise<OAuth2Server.Token> {
  console.log('🚀 ~ saveToken token:', token);
  console.log('🚀 ~ saveToken client:', client);
  console.log('🚀 ~ saveToken user:', user);
  const jwtDecodeAccessToken = JWT.decode(token.accessToken);
  const jwtDecodeRefreshToken = JWT.decode(token.refreshToken!);
  const accessTokenExpiresAt = jwtDecodeAccessToken
    ? DateTime.fromSeconds((jwtDecodeAccessToken as JwtPayload).exp!, {
        zone: 'utc',
      })
        .setZone(process.env.PORT)
        .toJSDate()
    : undefined;
  const refreshTokenExpiresAt = jwtDecodeRefreshToken
    ? DateTime.fromSeconds((jwtDecodeRefreshToken as JwtPayload).exp!, {
        zone: 'utc',
      })
        .setZone(process.env.PORT)
        .toJSDate()
    : undefined;

  await OAuthAccessTokenModel.create({
    accessToken: token.accessToken,
    accessTokenExpiresAt,
    scope: token.scope,
    id: crypto.randomUUID(),
    clientId: client.id,
    userId: user.id,
  });

  if (token.refreshToken) {
    await OAuthRefreshTokenModel.create({
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt,
      scope: token.scope,
      id: crypto.randomUUID(),
      clientId: client.id,
      userId: user.id,
    });
  }

  return {
    accessToken: token.accessToken,
    accessTokenExpiresAt,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt,
    scope: token.scope,
    client: { id: client.id, grants: ['authorization_code'] },
    user: { id: user.id },
  };
}

/**
 * Generate Access Token.
 */
async function generateAccessToken(
  client: OAuth2Server.Client,
  user: OAuth2Server.User,
  scope: string
) {
  const generateApplicationKey = new GenerateApplicationKey();
  const applicationKeyPair =
    await generateApplicationKey.getApplicationKeyPair();
  if (applicationKeyPair) {
    const payload = {
      iss: 'oauth',
      aud: 'oauth',
      sub: user.id,
      client_id: client.id,
      scope: scope,
    };
    return JWT.sign(payload, applicationKeyPair.privateKey, {
      algorithm: 'RS256',
      expiresIn: '4h',
    });
  }
  return undefined;
}

/**
 * Get access token.
 */
async function getAccessToken(
  accessToken: string
): Promise<OAuth2Server.Token> {
  console.log('🚀 ~ getAccessToken:', accessToken);
  const token = await OAuthAccessTokenModel.findOne({ accessToken }).lean();
  if (!token) throw new Error('Access token not found');
  const jwtDecodeAccessToken = JWT.decode(token.accessToken);
  const accessTokenExpiresAt = jwtDecodeAccessToken
    ? DateTime.fromSeconds((jwtDecodeAccessToken as JwtPayload).exp!, {
        zone: 'utc',
      })
        .setZone(process.env.PORT)
        .toJSDate()
    : undefined;

  return {
    accessToken: token.accessToken,
    accessTokenExpiresAt,
    scope: token.scope,
    client: { id: token.clientId, grants: ['authorization_code'] },
    user: { id: token.userId },
  };
}

/**
 * Generate Access Token.
 */
async function generateRefreshToken(
  client: OAuth2Server.Client,
  user: OAuth2Server.User,
  scope: string
) {
  const generateApplicationKey = new GenerateApplicationKey();
  const applicationKeyPair =
    await generateApplicationKey.getApplicationKeyPair();
  if (applicationKeyPair) {
    const payload = {
      iss: 'oauth',
      aud: 'oauth',
      sub: user.id,
      client_id: client.id,
      scope: scope,
    };
    return JWT.sign(payload, applicationKeyPair.privateKey, {
      algorithm: 'RS256',
      expiresIn: '5h',
    });
  }
  return undefined;
}

/**
 * Get refresh token.
 */
async function getRefreshToken(
  refreshToken: string
): Promise<OAuth2Server.RefreshToken | OAuth2Server.Falsey> {
  console.log('🚀 ~ getRefreshToken:', refreshToken);
  const token = await OAuthRefreshTokenModel.findOne({ refreshToken }).lean();
  if (!token) throw new Error('Refresh token not found');

  return {
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    scope: token.scope,
    client: { id: token.clientId, grants: ['refresh_token'] },
    user: { id: token.userId },
  };
}

export default {
  saveToken,
  verifyScope,
  saveAuthorizationCode,
  revokeAuthorizationCode,
  revokeToken,
  generateAccessToken,
  generateRefreshToken,
  getAuthorizationCode,
  getAccessToken,
  getClient,
  getRefreshToken,
} as OAuth2Server.AuthorizationCodeModel;
