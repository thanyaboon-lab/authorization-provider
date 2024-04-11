import {
  AuthorizationCodeModel,
  BaseController,
  GenerateApplicationKey,
} from '@authorization-provider/core';
import OAuth2Server from 'oauth2-server';
import { NextFunction, Request, Response } from 'express';

export class AuthController extends BaseController {
  constructor(
    private server: OAuth2Server = new OAuth2Server({
      model: AuthorizationCodeModel, // See https://github.com/oauthjs/node-oauth2-server for specification
      // accessTokenLifetime: 60,
      // refreshTokenLifetime: 60,
    })
  ) {
    super();
  }

  isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.user) {
      return next();
    } else {
      res.redirect(`/login?returnUrl=${encodeURIComponent(req.originalUrl)}`);
    }
  }

  async generateApplicationKey(req: Request, res: Response) {
    const generateKey = new GenerateApplicationKey();
    const result = await generateKey.init();
    return {
      data: result,
    };
  }

  //#region Oauth2
  async authorize(req: Request, res: Response) {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    const result = await this.server.authorize(request, response, {
      authenticateHandler: {
        handle: async () => {
          return {};
        },
      },
    });
    return {
      data: result,
    };
  }

  async token(req: Request, res: Response) {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    const result = await this.server.token(request, response, {
      alwaysIssueNewRefreshToken: false,
    });
    return {
      data: result,
    };
  }

  async authenticate(req: Request, res: Response, next: NextFunction) {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    const result = await this.server.authenticate(request, response);
    return {
      data: result,
    };
  }
  //#endregion
}
