import { Request, Response } from 'express';
import GenerateApplicationKey from '../generate-key';
import { BaseController } from '../../base-controller';
import { pem2jwk } from 'pem-jwk';

interface OpenIDConfig {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  response_types_supported: [
    'code',
    'token',
    'id_token',
    'code token',
    'code id_token'
  ];
  subject_types_supported: ['public'];
  id_token_signing_alg_values_supported: ['RS256'];
  grant_types_supported: ['authorization_code', 'refresh_token']
}

export class OpenidConfigurationController extends BaseController {
  private openidConfig: OpenIDConfig = {
    issuer: process.env.OPENID_ISSUER!,
    authorization_endpoint: `${process.env.OPENID_ISSUER}/oauth/authorize`,
    token_endpoint: `${process.env.OPENID_ISSUER}/oauth/token`,
    userinfo_endpoint: `${process.env.OPENID_ISSUER}/userinfo`,
    jwks_uri: `${process.env.OPENID_ISSUER}/.well-known/openid-configuration/jwks`,
    response_types_supported: [
      'code',
      'token',
      'id_token',
      'code token',
      'code id_token',
    ],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256'],
    grant_types_supported: ['authorization_code', 'refresh_token']
  };

  constructor() {
    super();
  }

  get(req: Request, res: Response) {
    return res.json(this.openidConfig);
  }

  async jwks(req: Request, res: Response) {
    const generateApplicationKey = new GenerateApplicationKey();
    const applicationKeyPair =
    await generateApplicationKey.getApplicationKeyPair();
    if (applicationKeyPair?.publicKey) {
      const jwk = pem2jwk(applicationKeyPair.publicKey);
      return res.json({keys: [jwk]});
    }
    return undefined;
  }
}
