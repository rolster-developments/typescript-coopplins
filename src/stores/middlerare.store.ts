class Middlewares {
  private collection: Function[] = [];

  public register(middleware: Function): void {
    this.collection.push(middleware);
  }

  public itIsExists(middleware: Function): boolean {
    return this.collection.includes(middleware);
  }
}

const middlewares = new Middlewares();

export function registerMiddleware(lambda: Function): void {
  middlewares.register(lambda);
}

export function itIsExistsMiddleware(lambda: Function): boolean {
  return middlewares.itIsExists(lambda);
}
