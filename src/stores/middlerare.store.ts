class Middlewares {
  private collection: Function[] = [];

  public exists(middleware: Function): boolean {
    return this.collection.includes(middleware);
  }

  public register(middleware: Function): void {
    this.collection.push(middleware);
  }
}

const middlewares = new Middlewares();

export function existsMiddleware(middleware: Function): boolean {
  return middlewares.exists(middleware);
}

export function registerMiddleware(middleware: Function): void {
  middlewares.register(middleware);
}
