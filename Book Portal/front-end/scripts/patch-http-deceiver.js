const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'node_modules', 'http-deceiver', 'lib', 'deceiver.js');

if (!fs.existsSync(file)) {
  process.exit(0);
}

const source = fs.readFileSync(file, 'utf8');
const needle = [
  "var mode = /^v0\\.8\\./.test(process.version) ? 'rusty' :",
  "           /^v0\\.(9|10)\\./.test(process.version) ? 'old' :",
  "           /^v0\\.12\\./.test(process.version) ? 'normal' :",
  "           'modern';"
].join('\n');

const replacement = [
  'var hasHttpParser = true;',
  'try {',
  "  process.binding('http_parser');",
  '} catch (err) {',
  '  hasHttpParser = false;',
  '}',
  '',
  "var mode = !hasHttpParser ? 'old' :",
  "           /^v0\\.8\\./.test(process.version) ? 'rusty' :",
  "           /^v0\\.(9|10)\\./.test(process.version) ? 'old' :",
  "           /^v0\\.12\\./.test(process.version) ? 'normal' :",
  "           'modern';"
].join('\n');

if (source.includes(replacement)) {
  process.exit(0);
}

if (!source.includes(needle)) {
  throw new Error('Could not find http-deceiver mode block to patch.');
}

fs.writeFileSync(file, source.replace(needle, replacement));
