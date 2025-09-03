declare global {
  interface String {
    format(...values: (string | number)[]): string;
  }
}

String.prototype.format = function (...values: (string | number)[]): string {
  const template = this.toString();
  if (!template) return '';
  return template.replace(/{(\d+)}/g, (match, index) => {
    return values[index] !== undefined ? values[index].toString() : match;
  });
};

export {}; // 👈 important pour que TS traite ce fichier comme un module
