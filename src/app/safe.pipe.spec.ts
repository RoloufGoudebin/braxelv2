import { SafePipe } from './safe.pipe';

describe('SafePipePipe', () => {
  it('create an instance', () => {
    const pipe = new SafePipe();
    expect(pipe).toBeTruthy();
  });
});
