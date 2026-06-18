declare function describe(description: string, specDefinitions: (...args: any[]) => any): void;
declare function xdescribe(description: string, specDefinitions: (...args: any[]) => any): void;
declare function fdescribe(description: string, specDefinitions: (...args: any[]) => any): void;

declare function beforeEach(action: (...args: any[]) => any): void;
declare function afterEach(action: (...args: any[]) => any): void;

interface DoneFn {
  (): void;
  fail(error?: any): void;
}

declare function it(description: string, specDefinitions: (...args: any[]) => any): void;
declare function xit(description: string, specDefinitions: (...args: any[]) => any): void;
declare function fit(description: string, specDefinitions: (...args: any[]) => any): void;

interface Expectation {
  toBe(expected: any): void;
  toBeTruthy(): void;
  toBeFalsy(): void;
  toEqual(expected: any): void;
  toContain(expected: any): void;
  toBeDefined(): void;
  toBeNull(): void;
}

declare function expect(actual: any): Expectation;
