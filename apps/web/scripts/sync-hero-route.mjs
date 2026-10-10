import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const appRoot = path.resolve(import.meta.dirname, '..');
const repoRoot = path.resolve(appRoot, '../..');
const sourcePath = path.join(repoRoot, 'packages/cms/src/localProvider.ts');
const routePath = path.join(appRoot, 'src/features/home/heroRoute.json');
const sourceText = await fs.readFile(sourcePath, 'utf8');
const sourceFile = ts.createSourceFile(sourcePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

function property(node, key) {
  return node.properties.find((item) =>
    ts.isPropertyAssignment(item) &&
    (ts.isIdentifier(item.name) || ts.isStringLiteral(item.name)) &&
    item.name.text === key
  )?.initializer;
}

function number(node) {
  return node && (ts.isNumericLiteral(node) || ts.isPrefixUnaryExpression(node))
    ? Number(node.getText(sourceFile))
    : undefined;
}

let milestonesArray;
for (const statement of sourceFile.statements) {
  if (!ts.isVariableStatement(statement)) continue;
  for (const declaration of statement.declarationList.declarations) {
    if (ts.isIdentifier(declaration.name) && declaration.name.text === 'INITIAL_NARRATIVE_MILESTONES') {
      milestonesArray = declaration.initializer;
    }
  }
}

if (!milestonesArray || !ts.isArrayLiteralExpression(milestonesArray)) {
  throw new Error('Could not read INITIAL_NARRATIVE_MILESTONES from the CMS.');
}

const canonicalCoordinates = new Map();
for (const milestone of milestonesArray.elements) {
  if (!ts.isObjectLiteralExpression(milestone)) continue;
  const order = number(property(milestone, 'order'));
  const coordinates = property(milestone, 'coordinates');
  if (!order || !coordinates || !ts.isObjectLiteralExpression(coordinates)) continue;
  const lat = number(property(coordinates, 'lat'));
  const lng = number(property(coordinates, 'lng'));
  if (lat === undefined || lng === undefined) throw new Error(`Milestone ${order} has incomplete coordinates.`);
  canonicalCoordinates.set(order, { lat, lng });
}

const route = JSON.parse(await fs.readFile(routePath, 'utf8'));
if (route.length !== canonicalCoordinates.size) {
  throw new Error(`Route has ${route.length} stops, but the CMS has ${canonicalCoordinates.size} coordinate-bearing milestones.`);
}

for (const stop of route) {
  const coordinates = canonicalCoordinates.get(stop.order);
  if (!coordinates) throw new Error(`No canonical coordinates found for route stop ${stop.order}.`);
  Object.assign(stop, coordinates);
}

const stopSpecificLandmarks = new Map([
  [9, 'geyser'],
  [11, 'aurora'],
  [32, 'campervan'],
  [35, 'louvre'],
  [36, 'versailles'],
  [37, 'pyrenees'],
]);
for (const stop of route) {
  const landmark = stopSpecificLandmarks.get(stop.order);
  if (landmark) stop.monumentId = landmark;
}

await fs.writeFile(routePath, `${JSON.stringify(route, null, 2)}\n`);
console.log(`Synchronized ${route.length} hero stops from the canonical CMS coordinates.`);
