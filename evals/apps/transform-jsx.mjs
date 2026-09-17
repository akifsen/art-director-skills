/**
 * Maintainer-only JSX → React.createElement transform.
 * Layer: compile React example source without Vite/esbuild native binaries.
 * Not a skill runtime.
 */
export function transformJsx(source, { pragma = "React.createElement", pragmaFrag = "React.Fragment" } = {}) {
  const s = String(source);
  let i = 0;
  let out = "";

  function peek(n = 0) {
    return s[i + n] || "";
  }
  function starts(str) {
    return s.slice(i, i + str.length) === str;
  }

  function readWhile(pred) {
    const start = i;
    while (i < s.length && pred(s[i])) i += 1;
    return s.slice(start, i);
  }

  function skipLineComment() {
    while (i < s.length && s[i] !== "\n") i += 1;
  }
  function skipBlockComment() {
    i += 2;
    while (i < s.length && !starts("*/")) i += 1;
    if (starts("*/")) i += 2;
  }

  function readString(q) {
    let chunk = s[i];
    i += 1;
    while (i < s.length) {
      const c = s[i];
      chunk += c;
      i += 1;
      if (c === "\\") {
        if (i < s.length) {
          chunk += s[i];
          i += 1;
        }
        continue;
      }
      if (c === q) break;
    }
    return chunk;
  }

  function readTemplate() {
    let chunk = s[i];
    i += 1;
    while (i < s.length) {
      const c = s[i];
      if (c === "\\") {
        chunk += c + (s[i + 1] || "");
        i += 2;
        continue;
      }
      if (c === "`") {
        chunk += c;
        i += 1;
        break;
      }
      if (c === "$" && s[i + 1] === "{") {
        chunk += "${";
        i += 2;
        chunk += readJsxAware(true);
        chunk += "}";
        continue;
      }
      chunk += c;
      i += 1;
    }
    return chunk;
  }

  function isIdentStart(c) {
    return /[A-Za-z_$]/.test(c);
  }
  function isIdent(c) {
    return /[A-Za-z0-9_$]/.test(c);
  }

  function canStartJsx() {
    if (peek() !== "<") return false;
    const n = peek(1);
    if (n === "/" || n === ">" || isIdentStart(n)) return true;
    return false;
  }

  function readJsxChildren() {
    const parts = [];
    while (i < s.length && !starts("</") && peek() !== ">") {
      if (starts("{/*")) {
        while (i < s.length && !starts("*/}")) i += 1;
        if (starts("*/}")) i += 3;
        continue;
      }
      if (peek() === "{") {
        i += 1;
        const expr = readJsxAware(true).trim();
        if (expr) parts.push(expr);
        continue;
      }
      if (canStartJsx()) {
        parts.push(readJsx());
        continue;
      }
      const start = i;
      while (i < s.length && peek() !== "{" && peek() !== "<" && !starts("</")) i += 1;
      const collapsed = s.slice(start, i).replace(/[ \t]*\n[ \t]*/g, " ");
      if (collapsed.trim()) parts.push(JSON.stringify(collapsed));
    }
    return parts;
  }

  function readJsx() {
    if (!canStartJsx()) throw new Error(`expected JSX at ${i}: ${s.slice(i, i + 40)}`);
    i += 1;
    if (peek() === ">") {
      i += 1;
      const children = [];
      while (i < s.length && !starts("</>")) {
        if (peek() === "{") {
          i += 1;
          children.push(readJsxAware(true).trim());
          continue;
        }
        if (canStartJsx()) {
          children.push(readJsx());
          continue;
        }
        const start = i;
        while (i < s.length && peek() !== "{" && peek() !== "<" && !starts("</>")) i += 1;
        const collapsed = s.slice(start, i).replace(/[ \t]*\n[ \t]*/g, " ");
        if (collapsed.trim()) children.push(JSON.stringify(collapsed));
      }
      if (starts("</>")) i += 3;
      return `${pragma}(${pragmaFrag}, null${children.length ? ", " + children.join(", ") : ""})`;
    }

    let fullTag = readWhile(isIdent);
    while (peek() === ".") {
      i += 1;
      fullTag += "." + readWhile(isIdent);
    }
    const type = /^[A-Z]/.test(fullTag) || fullTag.includes(".") ? fullTag : JSON.stringify(fullTag);

    const props = [];
    const spreads = [];
    function skipWs() {
      while (/\s/.test(peek())) i += 1;
    }
    skipWs();
    while (i < s.length && peek() !== ">" && peek() !== "/" ) {
      if (starts("{...")) {
        i += 4;
        spreads.push(readJsxAware(true).trim());
        skipWs();
        continue;
      }
      const nameStart = i;
      if (!isIdentStart(peek())) break;
      const name = readWhile((c) => isIdent(c) || c === "-");
      skipWs();
      let value = "true";
      if (peek() === "=") {
        i += 1;
        skipWs();
        if (peek() === "{") {
          i += 1;
          value = readJsxAware(true).trim() || "undefined";
        } else if (peek() === '"' || peek() === "'") {
          value = readString(peek());
        } else {
          throw new Error(`bad jsx prop value for ${name} at ${nameStart}`);
        }
      }
      const key = /[-:]/.test(name) ? JSON.stringify(name) : name;
      props.push(`${key}: ${value}`);
      skipWs();
    }

    let selfClosing = false;
    if (peek() === "/") {
      selfClosing = true;
      i += 1;
      skipWs();
    }
    if (peek() !== ">") throw new Error(`expected > at ${i}: ${s.slice(i, i + 20)}`);
    i += 1;

    const children = selfClosing ? [] : [];
    if (!selfClosing) {
      const nested = readJsxChildren();
      children.push(...nested);
      if (!starts("</")) throw new Error(`expected closing tag for ${fullTag} at ${i}: ${s.slice(i, i + 30)}`);
      i += 2;
      readWhile(isIdent);
      while (peek() === ".") {
        i += 1;
        readWhile(isIdent);
      }
      skipWs();
      if (peek() !== ">") throw new Error(`expected end of closing tag at ${i}`);
      i += 1;
    }

    let propsExpr = "null";
    if (spreads.length && !props.length) {
      propsExpr = spreads.length === 1 ? spreads[0] : `Object.assign({}, ${spreads.join(", ")})`;
    } else if (spreads.length || props.length) {
      const obj = `{ ${props.join(", ")} }`;
      propsExpr = spreads.length ? `Object.assign({}, ${spreads.join(", ")}, ${obj})` : obj;
    }

    const args = [type, propsExpr, ...children];
    return `${pragma}(${args.join(", ")})`;
  }

  function readJsxAware(stopOnBrace) {
    let chunk = "";
    let brace = stopOnBrace ? 1 : 0;
    let paren = 0;
    let bracket = 0;
    while (i < s.length) {
      if (starts("//")) {
        const start = i;
        skipLineComment();
        chunk += s.slice(start, i);
        continue;
      }
      if (starts("/*")) {
        const start = i;
        skipBlockComment();
        chunk += s.slice(start, i);
        continue;
      }
      const c = peek();
      if (c === '"' || c === "'") {
        chunk += readString(c);
        continue;
      }
      if (c === "`") {
        chunk += readTemplate();
        continue;
      }
      if (stopOnBrace && brace === 1 && c === "}" && paren === 0 && bracket === 0) {
        i += 1;
        return chunk;
      }
      if (c === "{") {
        brace += 1;
        chunk += c;
        i += 1;
        continue;
      }
      if (c === "}") {
        brace -= 1;
        chunk += c;
        i += 1;
        continue;
      }
      if (c === "(") {
        paren += 1;
        chunk += c;
        i += 1;
        continue;
      }
      if (c === ")") {
        paren -= 1;
        chunk += c;
        i += 1;
        continue;
      }
      if (c === "[") {
        bracket += 1;
        chunk += c;
        i += 1;
        continue;
      }
      if (c === "]") {
        bracket -= 1;
        chunk += c;
        i += 1;
        continue;
      }
      if (canStartJsx() && (paren > 0 || lookBehindAllowsJsx(chunk))) {
        chunk += readJsx();
        continue;
      }
      chunk += c;
      i += 1;
    }
    return chunk;
  }

  function lookBehindAllowsJsx(chunk) {
    const t = chunk.replace(/\s+$/, "");
    if (!t) return true;
    return /[(,=:?[{!;&|]$/.test(t) || /\breturn$/.test(t) || /\bthrow$/.test(t) || /=>$/.test(t);
  }

  out = readJsxAware(false);
  return out;
}

export function rewriteReactImports(code) {
  return code
    .replaceAll(`from "react-dom/client"`, `from "https://esm.sh/react-dom@18.3.1/client"`)
    .replaceAll(`from "react"`, `from "https://esm.sh/react@18.3.1"`)
    .replaceAll(`from "react-dom"`, `from "https://esm.sh/react-dom@18.3.1"`);
}
