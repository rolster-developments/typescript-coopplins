class Clousures {
  private collection: Function[] = [];

  public exists(clousure: Function): boolean {
    return this.collection.includes(clousure);
  }

  public register(clousure: Function): void {
    this.collection.push(clousure);
  }
}

const clousures = new Clousures();

export function existsClousure(clousure: Function): boolean {
  return clousures.exists(clousure);
}

export function registerClousure(clousure: Function): void {
  clousures.register(clousure);
}
