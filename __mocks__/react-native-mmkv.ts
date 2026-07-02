class FakeMMKV {
  private store = new Map<string, string>();

  set(key: string, value: string) {
    this.store.set(key, value);
  }

  getString(key: string) {
    return this.store.get(key);
  }

  remove(key: string) {
    return this.store.delete(key);
  }

  contains(key: string) {
    return this.store.has(key);
  }
}

export function createMMKV() {
  return new FakeMMKV();
}
