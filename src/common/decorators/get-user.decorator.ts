import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: {
    sub: string;
    email: string;
    role: string;
  };
}

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      return null;
    }

    // If specific property requested, return that property
    if (data && request.user) {
      return request.user[data as keyof RequestWithUser['user']];
    }

    // Otherwise return entire user object
    return request.user;
  },
);
