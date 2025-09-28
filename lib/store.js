// lib/store.js
export const memoryStore = {
  files: [],
  onChange: null,

  addFile(file) {
    this.files.push(file);
    if (this.onChange) {
      this.onChange(this.files);
    }
  },

  getFiles() {
    return this.files;
  },
};
