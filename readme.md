# Rolster Coopplins Server

Package that contains a working environment to develop web applications and API's.

## Installation

```
npm i @rolster/coopplins-server
```

## Configuration

You must install the `@rolster/types` to define package data types, which are configured by adding them to the `files` property of the `tsconfig.json` file. Decorators require the `emitDecoratorMetadata` and `experimentalDecorators` compiler options.

```json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  },
  "files": ["node_modules/@rolster/types/index.d.ts"]
}
```

## Overview

Coopplins is a decorator-based web/API framework built on top of **Express**.
You declare controllers, lambdas, routes and middlewares with decorators;
dependencies are resolved through
[`@rolster/invertly`](https://www.npmjs.com/package/@rolster/invertly).
Remember to `import 'reflect-metadata'` once at your application entry point.

## Bootstrapping a server

`coopplins(options)` builds the server; `start(port)` launches it.

```typescript
import 'reflect-metadata';
import { coopplins } from '@rolster/coopplins-server';
import { UserController } from './user.controller';

const server = coopplins({
  controllers: [UserController],
  beforeAll: async () => {
    /* run migrations, warm caches, ... */
  },
  afterAll: () => console.log('Server ready')
});

await server.start(3000);
```

The options object (its type is internal and not exported) accepts:
`controllers`, `lambdas`, `handlers` (raw Express middleware), `clousures`
(shutdown hooks), `catchError` (a `CatchError`, called with
`(error, request, response)` before the error response is sent), `trustProxy`,
`sentryOptions` (`{ dsn, sendDefaultPii }`), and the `beforeAll` / `afterAll`
lifecycle hooks.

## Decorators

### Controllers & routes

`@Controller(basePath?, middlewares?)` marks a class as a controller (and
registers it for dependency injection). Route methods are decorated with the
HTTP verb:

```typescript
import { Controller, Get, Post } from '@rolster/coopplins-server';

@Controller('/users')
export class UserController {
  /* ... */
}
```

| Decorator  | Signature                       |
| ---------- | ------------------------------- |
| `@Get`     | `Get(path = '/', options?)`     |
| `@Post`    | `Post(path = '/', options?)`    |
| `@Put`     | `Put(path = '/', options?)`     |
| `@Patch`   | `Patch(path = '/', options?)`   |
| `@Delete`  | `Delete(path = '/', options?)`  |
| `@Options` | `Options(path = '/', options?)` |

The route `options` accept `{ middlewares?, statusCode? }`. Every verb,
`@Post` included, responds with `200` on success by default; use `statusCode`
to change it:

```typescript
import { Body, Controller, HttpCode, Post } from '@rolster/coopplins-server';

@Controller('/users')
export class UserController {
  @Post('/', { statusCode: HttpCode.Created })
  async create(@Body('name') name: string) {
    /* ... */
  }
}
```

Route methods should be `async` (return a `Promise`): the returned value or
thrown error is then mapped to an HTTP response as described in
[Returning responses](#returning-responses). After the decorated parameters,
the raw Express `request` and `response` are appended as trailing arguments.

### Argument decorators

Extract request data straight into method parameters:

| Decorator                                           | Reads                                  |
| --------------------------------------------------- | -------------------------------------- |
| `@Body(key?)`                                       | request body (or `body[key]`)          |
| `@Path(key, dataType?)`                             | a URL parameter (`:id`)                |
| `@PathNumber(key)` / `@PathBool(key)`               | URL parameter coerced to number/bool   |
| `@QueryParams(key, dataType?)`                      | a query-string parameter               |
| `@QueryParamsNumber(key)` / `@QueryParamsBool(key)` | query parameter coerced to number/bool |
| `@Header(key, dataType?)`                           | an HTTP header                         |
| `@HeaderNumber(key)` / `@HeaderBool(key)`           | header coerced to number/bool          |
| `@Inject(token)`                                    | a DI dependency into the parameter     |

`dataType` is an `ArgumentsDataType`
(`'string' | 'number' | 'boolean' | 'object'`, default `'string'`).

### Lambdas

A lambda is a class that handles a single route through its `execute` method.
`LambdaGet`, `LambdaPost`, `LambdaPut`, `LambdaPatch` and `LambdaDelete` share
the signature `(path = '/', middlewares = [], statusCode = HttpCode.Ok)`. The
class is registered for dependency injection and a new instance is created per
request, bound to the [request context](#request-context). Argument decorators
work on `execute` exactly as on controller routes.

```typescript
import 'reflect-metadata';
import {
  Body,
  coopplins,
  HttpCode,
  LambdaPost,
  resultSuccessful
} from '@rolster/coopplins-server';
import { UserService } from './user.service';

@LambdaPost('/users', [], HttpCode.Created)
export class CreateUserLambda {
  constructor(private readonly service: UserService) {}

  async execute(@Body('name') name: string) {
    return resultSuccessful(this.service.create(name));
  }
}

const server = coopplins({ lambdas: [CreateUserLambda] });
await server.start(3000);
```

### Middlewares

`@Middleware(options?)` registers a reusable, injectable middleware class;
reference it in `@Controller(..., [MyMiddleware])`, a route's `middlewares`
option or a lambda's `middlewares` argument. The class must implement
`OnMiddleware`, i.e. expose `middleware(req, res, next)`. Plain Express
handlers and `express-validator` chains are accepted in the same places
(`MiddlewareToken`).

```typescript
import { Middleware, OnMiddleware } from '@rolster/coopplins-server';
import { NextFunction, Request, Response } from 'express';

@Middleware()
export class AuthMiddleware implements OnMiddleware {
  middleware(req: Request, res: Response, next: NextFunction): void {
    req.headers.authorization ? next() : res.status(401).end();
  }
}
```

`@Clousure(options?)` registers a shutdown/cleanup handler. The class must
implement `OnClousure`, i.e. expose `clousure(request, response)`.

Both decorators accept `{ scopeable?, singleton? }` to configure how
`@rolster/invertly` instantiates the class.

## Request context

Each request may carry an `@rolster/invertly` `Context` (a `save` /
`findByKey` store), which is used to instantiate lambdas:

| Function                             | Returns                                                    |
| ------------------------------------ | ---------------------------------------------------------- |
| `contextFromRequest(request)`        | the request `Context`, creating and attaching it if absent |
| `contextOfRequest(request)`          | the request `Context`, or `undefined`                      |
| `contextInRequest(request, context)` | attaches a `Context` to the request                        |

```typescript
import { contextFromRequest } from '@rolster/coopplins-server';
import { NextFunction, Request, Response } from 'express';

export function tenantHandler(
  req: Request,
  _: Response,
  next: NextFunction
): void {
  contextFromRequest(req).save('tenant', req.headers['x-tenant']);
  next();
}
```

## Returning responses

Route methods return a `ResultServer` built with the result helpers. The
framework maps each to the right HTTP status code:

| Helper                            | Status |
| --------------------------------- | ------ |
| `resultSuccessful(data)`          | 200    |
| `resultBadRequest(data)`          | 400    |
| `resultUnauthorized(data)`        | 401    |
| `resultForbidden(data)`           | 403    |
| `resultNotFound(data)`            | 404    |
| `resultDomainError(data)`         | 422    |
| `resultInternalServerError(data)` | 500    |

`ResultServer<T>` is `Result<T, ResultInvalid>`, where `ResultInvalid` is
`{ data, statusCode }`. `Result<S, F>` is a sealed state built with
`Result.success(value?)` or `Result.failure(value?)` and resolved with
`result.when({ success, failure })`; a successful result responds with the
route `statusCode` (default `200`), a failed one with its own `statusCode`. Any
other returned value is serialized with `200`.

```typescript
import { Result, ResultServer } from '@rolster/coopplins-server';

const result: ResultServer<string> = Result.failure({
  data: 'Expired',
  statusCode: 401
});

result.when({
  success: (data) => console.log(data),
  failure: ({ statusCode }) => console.log(statusCode)
});
```

You can also `throw` the matching exception classes (`BadRequestError`,
`UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `DomainError`,
`InternalServerError`, or the base `CoopplinsError`) and they will be turned
into the corresponding response.

### Enums

| Enum         | Members                                                                                                                                                                                         |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HttpCode`   | `Ok` (200), `Created` (201), `Accept` (202), `NoContent` (204), `BadRequest`, `Unauthorized`, `Forbidden`, `NotFound`, `Conflict`, `Locked`, `UnprocessableDomain` (422), `InternalServerError` |
| `HttpMethod` | `Post`, `Put`, `Patch`, `Query`, `Get`, `Delete`, `Options`                                                                                                                                     |
| `Arguments`  | `Body`, `Header`, `Path`, `QueryParams`, `Inject` (the source of a decorated argument)                                                                                                          |

## End-to-end example

```typescript
import 'reflect-metadata';
import {
  coopplins,
  Controller,
  Get,
  HttpCode,
  Post,
  Body,
  PathNumber,
  resultSuccessful,
  NotFoundError
} from '@rolster/coopplins-server';

// A service resolved by dependency injection
class UserService {
  private users = [{ id: 1, name: 'Daniel' }];

  findById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  create(name: string) {
    const user = { id: this.users.length + 1, name };
    this.users.push(user);
    return user;
  }
}

@Controller('/users')
class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/:id')
  async findOne(@PathNumber('id') id: number) {
    const user = this.service.findById(id);

    if (!user) {
      throw new NotFoundError(`User ${id} not found`);
    }

    return resultSuccessful(user);
  }

  @Post('/', { statusCode: HttpCode.Created })
  async create(@Body('name') name: string) {
    return resultSuccessful(this.service.create(name));
  }
}

const server = coopplins({ controllers: [UserController] });
await server.start(3000);
```

### Environment variables

`environment(key, options?)` loads `.env` (via `dotenv`) and returns the parsed
value (numbers/booleans/JSON are parsed automatically):

```typescript
import { environment } from '@rolster/coopplins-server';

const port = environment<number>('PORT'); // 3000
```

## Types

The main entry point exports `OnMiddleware`, `OnClousure`, `Result` and
`ResultServer`. The remaining types live in the `@rolster/coopplins-server/types`
subpath:

```typescript
import { CatchError, MiddlewareToken } from '@rolster/coopplins-server/types';
```

| Type                              | Description                                                                |
| --------------------------------- | -------------------------------------------------------------------------- |
| `CatchError<T>`                   | `(error: T, request, response) => void`, the `catchError` option           |
| `MiddlewareToken`                 | a `@Middleware` class, an Express handler or an `express-validator` chain  |
| `MiddlewareRoute`                 | an Express handler or an `express-validator` chain                         |
| `ClousureToken` / `ClousureRoute` | a `@Clousure` class / `(request, response) => void`                        |
| `ControllerOptions`               | `{ basePath, middlewares }` stored by `@Controller`                        |
| `RouteOptions`                    | `{ http, key, middlewares, path, statusCode? }` stored by route decorators |
| `LambdaOptions`                   | `{ http, middlewares, path, statusCode? }` stored by lambda decorators     |
| `ArgumentsOptions`                | `{ index, name, type, dataType?, key?, token? }` stored per argument       |
| `ArgumentsDataType`               | `'string' \| 'number' \| 'boolean' \| 'object'`                            |
| `ResultInvalid<T>`                | `{ data: T, statusCode }`, the failure payload of a `ResultServer`         |

## Contributing

- Daniel Andrés Castillo Pedroza :rocket:
