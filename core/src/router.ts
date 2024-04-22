import express, { Request, Response, NextFunction } from 'express';
import { MaybePromise } from './types';
import { BaseResponse } from './responses';
import { HandlerMetadata } from './typed-routes';

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => MaybePromise<BaseResponse> | void;

export const catchAsync =
  (fn: (...args: any[]) => any) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };

export class Router {
  constructor(public readonly instance: express.Router = express.Router()) {}

  private extractHandlers(handlers: RequestHandler[]) {
    const handler = handlers[handlers.length - 1];
    const middlewares = handlers.slice(0, handlers.length - 1);
    return { handler, middlewares };
  }

  private preRequest(handler: RequestHandler) {
    const invokeHandler = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const result = await handler(req, res, next);
      return res.send({
        success: true,
        message: 'Request successful',
        ...result,
      } satisfies BaseResponse);
    };
    return catchAsync(invokeHandler);
  }

  get(path: string, ...handlers: RequestHandler[]) {
    const { handler, middlewares } = this.extractHandlers(handlers);
    this.instance.route(path).get(middlewares, this.preRequest(handler));
  }

  post(path: string, ...handlers: RequestHandler[]) {
    const { handler, middlewares } = this.extractHandlers(handlers);
    this.instance.route(path).post(middlewares, this.preRequest(handler));
  }

  put(path: string, ...handlers: RequestHandler[]) {
    const { handler, middlewares } = this.extractHandlers(handlers);
    this.instance.route(path).put(middlewares, this.preRequest(handler));
  }

  delete(path: string, ...handlers: RequestHandler[]) {
    const { handler, middlewares } = this.extractHandlers(handlers);
    this.instance.route(path).delete(middlewares, this.preRequest(handler));
  }

  registerClassRoutes(classInstance: object) {
    const routes = Object.values(classInstance);
    routes.forEach((route: HandlerMetadata) => {
      if (route.__handlerMetadata) {
        const { path, handler } = route;
        const method = route.method.toLowerCase();
        console.log('Registering route', method, path);
        (this.instance.route(path) as any)[method](this.preRequest(handler));
      }
    });
    return this;
  }
}
