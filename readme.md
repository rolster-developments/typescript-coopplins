# Rolster Typescript Coopplins

Package that contains a working environment to develop web applications and API's.

## Installation

```
npm i @rolster/typescript-coopplins
```

## Configuration

You must install the `@rolster/typescript-types` to define package data types, which are configured by adding them to the `files` property of the `tsconfig.json` file.

```json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  },
  "files": ["node_modules/@rolster/typescript-types/index.d.ts"]
}
```

## Contributing

- Daniel Andrés Castillo Pedroza :rocket:
