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
    totalQuantity: Number(totalQuantity.toFixed(2)),

    estimatedTreesSaved: Number((paperKg / 80).toFixed(2)),

    estimatedWaterSaved: Number((paperKg * 50).toFixed(2)),

    estimatedCo2Reduction: Number(
      (
        paperKg * 1.8 +
        plasticKg * 1.5 +
        glassKg * 0.3 +
        metalKg * 2.1
      ).toFixed(2)
    ),

    estimatedEnergySaved: Number(
      (
        paperKg * 4 +
        plasticKg * 6 +
        metalKg * 14
      ).toFixed(2)
    ),
  };
}
