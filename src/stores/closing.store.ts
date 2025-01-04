class Clousures {
  private collection: Function[] = [];

  public itIsDefined(clousure: Function): boolean {
    return this.collection.includes(clousure);
  }

  public register(clousure: Function): void {
    this.collection.push(clousure);
  }
}

const clousures = new Clousures();

export function itIsDefinedClousure(clousure: Function): boolean {
  return clousures.itIsDefined(clousure);
}

export function registerClousure(clousure: Function): void {
  clousures.register(clousure);
}
