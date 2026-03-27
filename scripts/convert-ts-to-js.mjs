import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import generateModule from "@babel/generator";

const traverse = traverseModule.default ?? traverseModule;
const generate = generateModule.default ?? generateModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const ROOT_TS_FILES = ["vite.config.ts"];

function isUnder(parentDir, childPath) {
  const rel = path.relative(parentDir, childPath);
  return !!rel && !rel.startsWith("..") && !path.isAbsolute(rel);
}

async function walk(dirAbs, outFiles) {
  const entries = await fs.readdir(dirAbs, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dirAbs, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      await walk(abs, outFiles);
      continue;
    }
    if (!entry.isFile()) continue;
    if (abs.endsWith(".ts") || abs.endsWith(".tsx") || abs.endsWith(".d.ts")) outFiles.push(abs);
  }
}

function outPathFor(inAbs) {
  if (inAbs.endsWith(".d.ts")) return null;
  if (inAbs.endsWith(".tsx")) return inAbs.slice(0, -4) + ".jsx";
  if (inAbs.endsWith(".ts")) return inAbs.slice(0, -3) + ".js";
  throw new Error(`Unexpected input: ${inAbs}`);
}

function parseWithPlugins(code, ext) {
  const plugins = [
    // Keep this list conservative; add more only when needed.
    "importMeta",
    "topLevelAwait",
  ];
  if (ext === ".tsx") plugins.push("jsx");
  plugins.push("typescript");
  return parse(code, {
    sourceType: "module",
    plugins,
    errorRecovery: false,
    tokens: false,
  });
}

function stripTypeScript(ast) {
  traverse(ast, {
    ImportDeclaration(p) {
      const node = p.node;
      if (node.importKind === "type") {
        p.remove();
        return;
      }

      node.specifiers = node.specifiers.filter((s) => s.importKind !== "type");
      if (node.specifiers.length === 0 && !node.source) {
        p.remove();
      }
    },
    ExportNamedDeclaration(p) {
      const node = p.node;

      if (node.exportKind === "type") {
        p.remove();
        return;
      }

      if (
        node.declaration &&
        (node.declaration.type === "TSInterfaceDeclaration" ||
          node.declaration.type === "TSTypeAliasDeclaration" ||
          node.declaration.type === "TSEnumDeclaration" ||
          node.declaration.type === "TSModuleDeclaration")
      ) {
        p.remove();
        return;
      }

      // export { type Foo, Bar }
      node.specifiers = node.specifiers.filter((s) => s.exportKind !== "type");
      if (!node.declaration && node.specifiers.length === 0) p.remove();
    },
    ExportAllDeclaration(p) {
      if (p.node.exportKind === "type") p.remove();
    },

    TSInterfaceDeclaration(p) {
      p.remove();
    },
    TSTypeAliasDeclaration(p) {
      p.remove();
    },
    TSEnumDeclaration(p) {
      p.remove();
    },
    TSModuleDeclaration(p) {
      p.remove();
    },
    TSImportEqualsDeclaration(p) {
      p.remove();
    },
    TSExportAssignment(p) {
      p.remove();
    },
    TSNamespaceExportDeclaration(p) {
      p.remove();
    },
    TSDeclareFunction(p) {
      p.remove();
    },

    TSAsExpression(p) {
      p.replaceWith(p.node.expression);
    },
    TSTypeAssertion(p) {
      p.replaceWith(p.node.expression);
    },
    TSNonNullExpression(p) {
      p.replaceWith(p.node.expression);
    },
    TSSatisfiesExpression(p) {
      p.replaceWith(p.node.expression);
    },

    Identifier(p) {
      if (p.node.typeAnnotation) p.node.typeAnnotation = null;
      if (p.node.optional) p.node.optional = false;
    },
    RestElement(p) {
      if (p.node.typeAnnotation) p.node.typeAnnotation = null;
      const arg = p.node.argument;
      if (arg && arg.type === "Identifier") {
        if (arg.typeAnnotation) arg.typeAnnotation = null;
        if (arg.optional) arg.optional = false;
      }
    },
    Function(p) {
      if (p.node.returnType) p.node.returnType = null;
      if (p.node.typeParameters) p.node.typeParameters = null;
    },
    Class(p) {
      if (p.node.implements) p.node.implements = null;
      if (p.node.typeParameters) p.node.typeParameters = null;
      if (p.node.superTypeParameters) p.node.superTypeParameters = null;
    },
    CallExpression(p) {
      if (p.node.typeParameters) p.node.typeParameters = null;
      if (p.node.typeArguments) p.node.typeArguments = null;
    },
    OptionalCallExpression(p) {
      if (p.node.typeParameters) p.node.typeParameters = null;
      if (p.node.typeArguments) p.node.typeArguments = null;
    },
    NewExpression(p) {
      if (p.node.typeParameters) p.node.typeParameters = null;
      if (p.node.typeArguments) p.node.typeArguments = null;
    },
    JSXOpeningElement(p) {
      if (p.node.typeParameters) p.node.typeParameters = null;
      if (p.node.typeArguments) p.node.typeArguments = null;
    },
    VariableDeclarator(p) {
      if (p.node.id && p.node.id.typeAnnotation) p.node.id.typeAnnotation = null;
    },
  });
}

async function convertFile(inAbs) {
  const rel = path.relative(repoRoot, inAbs);
  const outAbs = outPathFor(inAbs);
  if (!outAbs) {
    await fs.unlink(inAbs);
    console.log(`Deleted ${rel}`);
    return;
  }

  const ext = path.extname(inAbs); // .ts or .tsx
  const code = await fs.readFile(inAbs, "utf8");
  const ast = parseWithPlugins(code, ext);
  stripTypeScript(ast);

  const out = generate(
    ast,
    {
      comments: true,
      compact: false,
      retainLines: false,
    },
    code,
  ).code;

  await fs.writeFile(outAbs, out + "\n", "utf8");
  await fs.unlink(inAbs);

  console.log(`Converted ${rel} -> ${path.relative(repoRoot, outAbs)}`);
}

async function main() {
  const files = [];

  // Convert TS/TSX under src/
  const srcAbs = path.join(repoRoot, "src");
  await walk(srcAbs, files);

  // Convert some known root-level TS files
  for (const f of ROOT_TS_FILES) {
    const abs = path.join(repoRoot, f);
    try {
      const st = await fs.stat(abs);
      if (st.isFile()) files.push(abs);
    } catch {
      // ignore
    }
  }

  // Safety: only touch files inside repoRoot (and not node_modules)
  const safeFiles = files.filter((f) => isUnder(repoRoot, f) && !f.includes(`${path.sep}node_modules${path.sep}`));

  // Convert deepest paths first so deletes don't affect traversal assumptions.
  safeFiles.sort((a, b) => b.length - a.length);

  for (const f of safeFiles) {
    await convertFile(f);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
