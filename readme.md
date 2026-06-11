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
You declare controllers, routes and middlewares with decorators; dependencies
are resolved through [`@rolster/invertly`](https://www.npmjs.com/package/@rolster/invertly).
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

**`CoopplinsOptions`:** `controllers`, `lambdas`, `handlers` (raw Express
middleware), `clousures` (shutdown hooks), `catchError` (global error handler),
`trustProxy`, `sentryOptions`, and the `beforeAll` / `afterAll` lifecycle hooks.

## Decorators

### Controllers & routes

`@Controller(basePath?, middlewares?)` marks a class as a controller (and
registers it for dependency injection). Route methods are decorated with the
HTTP verb:

```typescript
import { Controller, Get, Post } from '@rolster/coopplins-server';

@Controller('/users')
export class UserController { /* ... */ }
```

| Decorator   | Signature                              |
| ----------- | -------------------------------------- |
| `@Get`      | `Get(path = '/', options?)`            |
| `@Post`     | `Post(path = '/', options?)`           |
| `@Put`      | `Put(path = '/', options?)`            |
| `@Patch`    | `Patch(path = '/', options?)`          |
| `@Delete`   | `Delete(path = '/', options?)`         |
| `@Options`  | `Options(path = '/', options?)`        |

The route `options` accept `{ middlewares?, statusCode? }`.

### Argument decorators

Extract request data straight into method parameters:

| Decorator                              | Reads                                  |
| -------------------------------------- | -------------------------------------- |
| `@Body(key?)`                          | request body (or `body[key]`)          |
| `@Path(key, dataType?)`                | a URL parameter (`:id`)                |
| `@PathNumber(key)` / `@PathBool(key)`  | URL parameter coerced to number/bool   |
| `@Query(key, dataType?)`               | a query-string parameter               |
| `@QueryNumber(key)` / `@QueryBool(key)`| query parameter coerced to number/bool |
| `@Header(key, dataType?)`              | an HTTP header                         |
| `@HeaderNumber(key)` / `@HeaderBool(key)` | header coerced to number/bool       |
| `@Inject(token)`                       | a DI dependency into the parameter     |

### Middlewares

`@Middleware(options?)` registers a reusable, injectable middleware class;
reference it in `@Controller(..., [MyMiddleware])` or a route's `middlewares`
option. `@Clousure(options?)` registers a shutdown/cleanup handler.

## Returning responses

Route methods return a `ResultServer` built with the result helpers. The
framework maps each to the right HTTP status code:

| Helper                          | Status |
| ------------------------------- | ------ |
| `resultSuccessful(data)`        | 200    |
| `resultBadRequest(data)`        | 400    |
| `resultUnauthorized(data)`      | 401    |
| `resultForbidden(data)`         | 403    |
| `resultNotFound(data)`          | 404    |
| `resultDomainError(data)`       | 422    |
| `resultInternalServerError(data)` | 500  |

You can also `throw` the matching exception classes (`BadRequestError`,
`UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `DomainError`,
`InternalServerError`, or the base `CoopplinsError`) and they will be turned
into the corresponding response.

## End-to-end example

```typescript
import 'reflect-metadata';
import {
  coopplins,
  Controller,
  Get,
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
  findOne(@PathNumber('id') id: number) {
    const user = this.service.findById(id);

    if (!user) {
      throw new NotFoundError(`User ${id} not found`);
    }

    return resultSuccessful(user);
  }

  @Post()
  create(@Body('name') name: string) {
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

## Contributing

- Daniel Andrés Castillo Pedroza :rocket:
