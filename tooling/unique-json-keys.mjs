/**
 * JSON.parse keeps the last duplicate key and does not throw.
 * This walker fails on duplicate keys in the same object.
 */
export function duplicateKeysInJson(text) {
  const source = String(text);
  let i = 0;
  const duplicates = [];

  function fail(message) {
    throw new Error(`${message} at index ${i}`);
  }

  function peek() {
    return source[i] || "";
  }

  function skipWs() {
    while (i < source.length && /\s/.test(source[i])) i += 1;
  }

  function parseString() {
    if (peek() !== "\"") fail("expected string");
    i += 1;
    let out = "";
    while (i < source.length) {
      const c = source[i];
      i += 1;
      if (c === "\"") return out;
      if (c === "\\") {
        const n = source[i];
        i += 1;
        if (n === "u") {
          out += String.fromCharCode(parseInt(source.slice(i, i + 4), 16));
          i += 4;
        } else {
          out += n;
        }
        continue;
      }
      out += c;
    }
    fail("unterminated string");
    return out;
  }

  function parseNumber() {
    const start = i;
    if (peek() === "-") i += 1;
    while (/\d/.test(peek())) i += 1;
    if (peek() === ".") {
      i += 1;
      while (/\d/.test(peek())) i += 1;
    }
    if (peek() === "e" || peek() === "E") {
      i += 1;
      if (peek() === "+" || peek() === "-") i += 1;
      while (/\d/.test(peek())) i += 1;
    }
    if (start === i) fail("expected number");
  }

  function parseLiteral(word) {
    if (source.slice(i, i + word.length) !== word) fail(`expected ${word}`);
    i += word.length;
  }

  function parseArray() {
    i += 1;
    skipWs();
    if (peek() === "]") {
      i += 1;
      return;
    }
    while (i < source.length) {
      parseValue();
      skipWs();
      if (peek() === ",") {
        i += 1;
        skipWs();
        continue;
      }
      if (peek() === "]") {
        i += 1;
        return;
      }
      fail("expected ]");
    }
  }

  function parseObject() {
    i += 1;
    skipWs();
    const seen = new Set();
    if (peek() === "}") {
      i += 1;
      return;
    }
    while (i < source.length) {
      skipWs();
      const key = parseString();
      if (seen.has(key)) duplicates.push(key);
      seen.add(key);
      skipWs();
      if (peek() !== ":") fail("expected :");
      i += 1;
      parseValue();
      skipWs();
      if (peek() === ",") {
        i += 1;
        skipWs();
        continue;
      }
      if (peek() === "}") {
        i += 1;
        return;
      }
      fail("expected }");
    }
  }

  function parseValue() {
    skipWs();
    const c = peek();
    if (c === "\"") {
      parseString();
      return;
    }
    if (c === "{") {
      parseObject();
      return;
    }
    if (c === "[") {
      parseArray();
      return;
    }
    if (c === "t") {
      parseLiteral("true");
      return;
    }
    if (c === "f") {
      parseLiteral("false");
      return;
    }
    if (c === "n") {
      parseLiteral("null");
      return;
    }
    parseNumber();
  }

  parseValue();
  skipWs();
  if (i !== source.length) fail("unexpected trailing content");
  return duplicates;
}
