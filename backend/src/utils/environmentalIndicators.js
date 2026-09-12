// Input contract: total_quantity contains only approved quantities declared in kg.
// Filtering happens in getPublicStats, before grouping by material. No conversions.
export function calculateEnvironmentalIndicators(materials = []) {
  let totalQuantity = 0;

  let paperKg = 0;
  let plasticKg = 0;
  let glassKg = 0;
  let metalKg = 0;

  materials.forEach((item) => {
    const quantity = Number(item.total_quantity || 0);

    totalQuantity += quantity;

    switch (item.material_type) {
      case 'papel_carton':
        paperKg += quantity;
        break;

      case 'plastico':
        plasticKg += quantity;
        break;

      case 'vidrio':
        glassKg += quantity;
        break;

      case 'metal':
        metalKg += quantity;
        break;

      default:
        break;
    }
  });

  return {
    // Cantidad aprobada declarada en kg (todos los materiales).
    totalQuantity,

    // EPA: 17 árboles por tonelada de papel reciclado
    // 17 / 1000 = 0.017 árboles por kg
    estimatedTreesSaved: paperKg * 0.017,

    // EPA: 26.5 litros de agua ahorrados por kg de papel reciclado
    estimatedWaterSaved: paperKg * 26.5,

    // EPA (valor conservador): 1 kg CO₂e evitado por kg de papel reciclado
    estimatedCo2Reduction: paperKg * 1.0,

    // EPA: 4.1 kWh ahorrados por kg de papel reciclado
    estimatedEnergySaved: paperKg * 4.1,
  };
}

