// F05: valida la referencia de catálogo sin cargar .env ni conectarse a PostgreSQL.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  CatalogReferenceValidationError,
  deriveCatalogReference,
  validateCatalogReference,
} from '../src/utils/catalogReference.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const references = {
  level1: {
    catalog_group_name: 'Dependencias institucionales',
    catalog_action_name: 'Entrega acopio',
    catalog_action_level: 'Nivel 1: Volumen bajo (1 a 5 kg)',
  },
  level2: {
    catalog_group_name: 'Dependencias institucionales',
    catalog_action_name: 'Entrega acopio',
    catalog_action_level: 'Nivel 2: Volumen medio (6 a 15 kg)',
  },
  level3: {
    catalog_group_name: 'Dependencias institucionales',
    catalog_action_name: 'Entrega acopio',
    catalog_action_level: 'Nivel 3: Volumen alto (16 a 30 kg)',
  },
  level4: {
    catalog_group_name: 'Dependencias institucionales',
    catalog_action_name: 'Entrega acopio',
    catalog_action_level: 'Nivel 4: Volumen masivo (+30 kg)',
  },
  organic: {
    catalog_group_name: 'Dependencias institucionales',
    catalog_action_name: 'Ciclo orgánico',
    catalog_action_level: '5 kg de abono generado en compostera',
  },
};

function catalogRow(reference) {
  return {
    group_name: reference.catalog_group_name,
    action_name: reference.catalog_action_name,
    action_level: reference.catalog_action_level,
  };
}

async function assertInvalid(receivedReference) {
  let lookupCalled = false;

  await assert.rejects(
    validateCatalogReference({
      materialType: 'plastico',
      quantity: 4,
      receivedReference,
      findCatalogEntry: async () => {
        lookupCalled = true;
        return catalogRow(references.level1);
      },
    }),
    CatalogReferenceValidationError
  );

  assert.equal(lookupCalled, false, 'Una referencia incoherente no debe consultarse como autoridad');
}

test('acepta la combinación derivada y conserva los textos canónicos del catálogo', async () => {
  const result = await validateCatalogReference({
    materialType: 'plastico',
    quantity: '5',
    receivedReference: references.level1,
    findCatalogEntry: async (expected) => catalogRow(expected),
  });

  assert.deepEqual(result, references.level1);
});

test('rechaza grupo, acción y nivel manipulados o inexistentes', async (t) => {
  await t.test('grupo inexistente', () => assertInvalid({
    ...references.level1,
    catalog_group_name: 'Grupo inventado',
  }));

  await t.test('acción inexistente', () => assertInvalid({
    ...references.level1,
    catalog_action_name: 'Acción inventada',
  }));

  await t.test('nivel inválido', () => assertInvalid({
    ...references.level1,
    catalog_action_level: 'Nivel inexistente',
  }));
});

test('rechaza un nivel superior aunque exista cuando la cantidad corresponde al nivel 1', async () => {
  await assertInvalid(references.level4);
});

test('rechaza una referencia coherente si la identidad no existe en points_catalog', async () => {
  await assert.rejects(
    validateCatalogReference({
      materialType: 'plastico',
      quantity: 5,
      receivedReference: references.level1,
      findCatalogEntry: async () => null,
    }),
    (error) => {
      assert.ok(error instanceof CatalogReferenceValidationError);
      assert.match(error.message, /No existe una configuración de catálogo/);
      return true;
    }
  );
});

test('la derivación del backend conserva el contrato actual del frontend en sus límites', () => {
  assert.deepEqual(deriveCatalogReference('papel_carton', 5), references.level1);
  assert.deepEqual(deriveCatalogReference('plastico', 5.1), references.level2);
  assert.deepEqual(deriveCatalogReference('plastico', 6), references.level2);
  assert.deepEqual(deriveCatalogReference('vidrio', 15), references.level2);
  assert.deepEqual(deriveCatalogReference('metal', 15.1), references.level3);
  assert.deepEqual(deriveCatalogReference('metal', 16), references.level3);
  assert.deepEqual(deriveCatalogReference('papel_carton', 30), references.level3);
  assert.deepEqual(deriveCatalogReference('plastico', 30.1), references.level4);
  assert.throws(() => deriveCatalogReference('organico', 1), CatalogReferenceValidationError);

  const frontend = read('frontend/src/pages/leader/RegisterRecyclingPage.jsx');
  for (const reference of [references.level1, references.level2, references.level3, references.level4]) {
    assert.ok(frontend.includes(reference.catalog_group_name));
    assert.ok(frontend.includes(reference.catalog_action_name));
    assert.ok(frontend.includes(reference.catalog_action_level));
  }
});

test('points del cliente no son entrada y la puntuación conserva su fuente autorizada', () => {
  const controller = read('backend/src/controllers/recyclingController.js');
  const createRecord = controller.slice(
    controller.indexOf('export async function createRecord'),
    controller.indexOf('export async function listMyRecords')
  );
  const reviewRecord = controller.slice(
    controller.indexOf('export async function reviewRecord'),
    controller.indexOf('export async function listReviewedRecords')
  );

  assert.doesNotMatch(createRecord, /\bpoints(?:_awarded)?\s*[,}]/);
  assert.match(createRecord, /'pending',\$12,\$13,\$14,0/);
  assert.match(createRecord, /catalogReference\.catalog_group_name/);
  assert.match(createRecord, /catalogReference\.catalog_action_name/);
  assert.match(createRecord, /catalogReference\.catalog_action_level/);
  assert.match(controller, /SELECT\s+points\s+FROM points_catalog/i);
  assert.match(reviewRecord, /if \(status === 'approved'\)[\s\S]*getCatalogPoints/);
  assert.match(reviewRecord, /points_awarded = \$4/);
});

test('T15 orgánico se rechaza antes de consultar incluso un catálogo sintético válido', async()=>{
  for (const receivedReference of [references.organic,references.level1]) {
    let called=false;
    await assert.rejects(validateCatalogReference({materialType:'organico',quantity:5,receivedReference,
      findCatalogEntry:async()=>{called=true;return catalogRow(receivedReference);}}),CatalogReferenceValidationError);
    assert.equal(called,false);
  }
});
test('T15 cuatro materiales conservan niveles y rechazan cantidades inválidas',()=>{
  for(const material of ['papel_carton','plastico','vidrio','metal']) {
    for(const [quantity,level] of [[5,1],[5.1,2],[15,2],[15.1,3],[30,3],[30.1,4]]) {
      assert.deepEqual(deriveCatalogReference(material,quantity),references['level'+level]);
    }
    for(const quantity of [0,-1,NaN,Infinity,'invalid'])assert.throws(()=>deriveCatalogReference(material,quantity),CatalogReferenceValidationError);
  }
});
