// lib/store.js
export const memoryStore = [];

memoryStore.onChange = null;

export function addFile(file) {
  memoryStore.push(file);
  if (memoryStore.onChange) {
    memoryStore.onChange();
  }
}
