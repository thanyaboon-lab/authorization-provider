import { AuthorizationCodeModel, BaseController } from '@authorization-provider/core';
import OAuth2Server from 'oauth2-server';
import { NextFunction, Request, Response } from 'express';

export class AuthController extends BaseController {
  constructor(
    private server: OAuth2Server = new OAuth2Server({
      model: AuthorizationCodeModel, // See https://github.com/oauthjs/node-oauth2-server for specification
      accessTokenLifetime: 60 * 60,
    })
  ) {
    super()
  }

  isAuthenticated(req: Request, res: Response, next: NextFunction) {
    // if (req.session && req.session.user) {
      return next();
    // } else {
    //   res.redirect(`/login?returnUrl=${encodeURIComponent(req.originalUrl)}`);
    // }
  }

  async authorize(req: Request, res: Response) {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    return this.server
      .authorize(request, response, {
        authenticateHandler: {
          // handle: async () => {}
        },
      })
      .then((result) => {
        console.log('🚀 ~authorize result:', result);
        res.json(result);
      })
      .catch((err) => {
        console.log('err', err);
        res.status(err.code).json(err);
      });
  }

  async token(req: Request, res: Response) {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    return this.server
      .token(request, response, { alwaysIssueNewRefreshToken: false })
      .then((result) => {
        console.log('🚀 ~token result:', result);
        res.json(result);
      })
      .catch((err) => {
        console.log('err', err);
        res.status(err.code).json(err);
      });
  }

  async authenticate(req: Request, res: Response, next: NextFunction) {
    console.log('🚀 ~ authenticate:');
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    return this.server
      .authenticate(request, response)
      .then((data) => {
        console.log('🚀 ~ data:', data);
        // req.auth = { userId: data?.user?.id, sessionType: 'oauth2' };
        next();
      })
      .catch((err) => {
        console.log('err', err);
        res.status(err.code).json(err);
      });
  }
}
