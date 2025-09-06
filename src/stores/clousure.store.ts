class Clousures {
  private collection: Function[] = [];

  public isDefined(clousure: Function): boolean {
    return this.collection.includes(clousure);
  }

  public register(clousure: Function): void {
    this.collection.push(clousure);
  }
}

const clousures = new Clousures();

export function isDefinedClousure(clousure: Function): boolean {
  return clousures.isDefined(clousure);
}

export function registerClousure(clousure: Function): void {
  clousures.register(clousure);
}
