# Rolster Coopplins Server

Package that contains a working environment to develop web applications and API's.

## Installation

```
npm i @rolster/coopplins-server
```

## Configuration

You must install the `@rolster/types` to define package data types, which are configured by adding them to the `files` property of the `tsconfig.json` file.

```json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  },
  "files": ["node_modules/@rolster/types/index.d.ts"]
}
```

## Contributing

- Daniel Andrés Castillo Pedroza :rocket:
