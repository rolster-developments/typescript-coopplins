class Middlewares {
  private collection: Function[] = [];

  public itIsExists(middleware: Function): boolean {
    return this.collection.includes(middleware);
  }

  public register(middleware: Function): void {
    this.collection.push(middleware);
  }
}

const middlewares = new Middlewares();

export function itIsExistsMiddleware(middleware: Function): boolean {
  return middlewares.itIsExists(middleware);
}

export function registerMiddleware(middleware: Function): void {
  middlewares.register(middleware);
}
