const CATALOG_GROUP = 'Dependencias institucionales';

const MATERIAL_TYPES = new Set([
  'papel_carton',
  'plastico',
  'vidrio',
  'metal',
]);

export class CatalogReferenceValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CatalogReferenceValidationError';
  }
}

export function deriveCatalogReference(materialType, quantityValue) {
  const material = normalizeValue(materialType);
  const quantity = Number(quantityValue);

  if (!MATERIAL_TYPES.has(material) || !Number.isFinite(quantity) || quantity <= 0) {
    throw new CatalogReferenceValidationError(
      'Material o cantidad inválidos para determinar la referencia de catálogo.'
    );
  }

  if (quantity <= 5) {
    return {
      catalog_group_name: CATALOG_GROUP,
      catalog_action_name: 'Entrega acopio',
      catalog_action_level: 'Nivel 1: Volumen bajo (1 a 5 kg)',
    };
  }

  if (quantity <= 15) {
    return {
      catalog_group_name: CATALOG_GROUP,
      catalog_action_name: 'Entrega acopio',
      catalog_action_level: 'Nivel 2: Volumen medio (6 a 15 kg)',
    };
  }

  if (quantity <= 30) {
    return {
      catalog_group_name: CATALOG_GROUP,
      catalog_action_name: 'Entrega acopio',
      catalog_action_level: 'Nivel 3: Volumen alto (16 a 30 kg)',
    };
  }

  return {
    catalog_group_name: CATALOG_GROUP,
    catalog_action_name: 'Entrega acopio',
    catalog_action_level: 'Nivel 4: Volumen masivo (+30 kg)',
  };
}

export async function validateCatalogReference({
  materialType,
  quantity,
  receivedReference,
  findCatalogEntry,
}) {
  const expectedReference = deriveCatalogReference(materialType, quantity);

  if (!referencesMatch(expectedReference, receivedReference)) {
    throw new CatalogReferenceValidationError(
      'La referencia de catálogo no corresponde al material y cantidad registrados.'
    );
  }

  const catalogEntry = await findCatalogEntry(expectedReference);

  if (!catalogEntry) {
    throw new CatalogReferenceValidationError(
      'No existe una configuración de catálogo para el material y cantidad indicados.'
    );
  }

  return {
    catalog_group_name: catalogEntry.group_name,
    catalog_action_name: catalogEntry.action_name,
    catalog_action_level: catalogEntry.action_level,
  };
}

function referencesMatch(expected, received = {}) {
  return (
    comparable(expected.catalog_group_name) === comparable(received.catalog_group_name) &&
    comparable(expected.catalog_action_name) === comparable(received.catalog_action_name) &&
    comparable(expected.catalog_action_level) === comparable(received.catalog_action_level)
  );
}

function normalizeValue(value) {
  return value === undefined || value === null ? '' : String(value).trim();
}

function comparable(value) {
  return normalizeValue(value).normalize('NFC').toLocaleLowerCase('es');
}
