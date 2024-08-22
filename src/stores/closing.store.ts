class Clousures {
  private collection: Function[] = [];

  public itIsExists(clousure: Function): boolean {
    return this.collection.includes(clousure);
  }

  public register(clousure: Function): void {
    this.collection.push(clousure);
  }
}

const clousures = new Clousures();

export function itIsExistsClousure(clousure: Function): boolean {
  return clousures.itIsExists(clousure);
}

export function registerClousure(clousure: Function): void {
  clousures.register(clousure);
}
