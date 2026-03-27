import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import generateModule from "@babel/generator";
import * as t from "@babel/types";

const traverse = traverseModule.default ?? traverseModule;
const generate = generateModule.default ?? generateModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

function isUnder(parentDir, childPath) {
  const rel = path.relative(parentDir, childPath);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
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
    if (abs.endsWith(".js") || abs.endsWith(".jsx")) outFiles.push(abs);
  }
}

function parseWithPlugins(code, ext) {
  const plugins = ["importMeta", "topLevelAwait", "typescript"];
  if (ext === ".jsx") plugins.push("jsx");
  return parse(code, {
    sourceType: "module",
    plugins,
    errorRecovery: false,
  });
}

function stripTypeScriptAndCleanupImports(ast) {
  traverse(ast, {
    ImportDeclaration(p) {
      const node = p.node;
      if (node.importKind === "type") {
        p.remove();
        return;
      }

      node.specifiers = node.specifiers.filter((s) => s.importKind !== "type");
      // Keep side-effect imports as-is.
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
    ObjectPattern(p) {
      if (p.node.typeAnnotation) p.node.typeAnnotation = null;
      if (p.node.optional) p.node.optional = false;
    },
    ArrayPattern(p) {
      if (p.node.typeAnnotation) p.node.typeAnnotation = null;
      if (p.node.optional) p.node.optional = false;
    },
    AssignmentPattern(p) {
      if (p.node.left && p.node.left.typeAnnotation) p.node.left.typeAnnotation = null;
    },
    RestElement(p) {
      if (p.node.typeAnnotation) p.node.typeAnnotation = null;
      const arg = p.node.argument;
      if (arg && arg.typeAnnotation) arg.typeAnnotation = null;
      if (arg && arg.optional) arg.optional = false;
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

    Program: {
      exit(programPath) {
        // After stripping types, drop now-unused import specifiers.
        for (const stmtPath of programPath.get("body")) {
          if (!stmtPath.isImportDeclaration()) continue;
          const importPath = stmtPath;
          const node = importPath.node;
          if (node.specifiers.length === 0) continue; // already side-effect import

          const kept = [];
          for (const spec of node.specifiers) {
            const localName = spec.local?.name;
            if (!localName) {
              kept.push(spec);
              continue;
            }
            const binding = importPath.scope.getBinding(localName);
            if (binding && binding.referenced) kept.push(spec);
          }

          if (kept.length === 0) {
            // Preserve any potential module side effects.
            importPath.replaceWith(t.importDeclaration([], node.source));
          } else {
            node.specifiers = kept;
          }
        }
      },
    },
  });
}

async function processFile(absPath) {
  const ext = path.extname(absPath); // .js or .jsx
  const code = await fs.readFile(absPath, "utf8");
  const ast = parseWithPlugins(code, ext);
  stripTypeScriptAndCleanupImports(ast);
  const out = generate(
    ast,
    {
      comments: true,
      compact: false,
      retainLines: false,
    },
    code,
  ).code;
  await fs.writeFile(absPath, out + "\n", "utf8");
}

async function main() {
  const files = [];
  await walk(path.join(repoRoot, "src"), files);

  const rootFiles = [path.join(repoRoot, "vite.config.js")];
  for (const f of rootFiles) {
    try {
      const st = await fs.stat(f);
      if (st.isFile()) files.push(f);
    } catch {
      // ignore
    }
  }

  const safeFiles = files.filter((f) => isUnder(repoRoot, f) && !f.includes(`${path.sep}node_modules${path.sep}`));
  safeFiles.sort((a, b) => a.localeCompare(b));

  for (const f of safeFiles) {
    await processFile(f);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
