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
    // Cantidad total reciclada (todos los materiales)
    totalQuantity: Number(totalQuantity.toFixed(2)),

    // EPA: 17 árboles por tonelada de papel reciclado
    // 17 / 1000 = 0.017 árboles por kg
    estimatedTreesSaved: Number((paperKg * 0.017).toFixed(2)),

    // EPA: 26.5 litros de agua ahorrados por kg de papel reciclado
    estimatedWaterSaved: Number((paperKg * 26.5).toFixed(2)),

    // EPA (valor conservador): 1 kg CO₂e evitado por kg de papel reciclado
    estimatedCo2Reduction: Number((paperKg * 1.0).toFixed(2)),

    // EPA: 4.1 kWh ahorrados por kg de papel reciclado
    estimatedEnergySaved: Number((paperKg * 4.1).toFixed(2)),
  };
}

