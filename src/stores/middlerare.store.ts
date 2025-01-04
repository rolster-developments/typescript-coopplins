class Middlewares {
  private collection: Function[] = [];

  public itIsDefined(middleware: Function): boolean {
    return this.collection.includes(middleware);
  }

  public register(middleware: Function): void {
    this.collection.push(middleware);
  }
}

const middlewares = new Middlewares();

export function itIsDefinedMiddleware(middleware: Function): boolean {
  return middlewares.itIsDefined(middleware);
}

export function registerMiddleware(middleware: Function): void {
  middlewares.register(middleware);
}
