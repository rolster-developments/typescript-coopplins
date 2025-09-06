class Middlewares {
  private collection: Function[] = [];

  public isDefined(middleware: Function): boolean {
    return this.collection.includes(middleware);
  }

  public register(middleware: Function): void {
    this.collection.push(middleware);
  }
}

const middlewares = new Middlewares();

export function isDefinedMiddleware(middleware: Function): boolean {
  return middlewares.isDefined(middleware);
}

export function registerMiddleware(middleware: Function): void {
  middlewares.register(middleware);
}
