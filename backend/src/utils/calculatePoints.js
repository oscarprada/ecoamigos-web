const MATERIAL_BASE_POINTS = {
  papel_carton: 8,
  plastico: 10,
  vidrio: 9,
  metal: 12,
  organico: 6,
};

const QUALITY_MULTIPLIER = {
  alta: 1.4,
  media: 1,
  baja: 0.5,
};

export function calculatePoints({ material_type, quantity, quality_level, criteria_count }) {
  const base = MATERIAL_BASE_POINTS[material_type] ?? 5;
  const qty = Number(quantity) || 0;
  const qualityMultiplier = QUALITY_MULTIPLIER[quality_level] ?? 1;
  const criteriaBonus = Math.min(Number(criteria_count) || 0, 5) * 2;

  const points = Math.round(base * qty * qualityMultiplier + criteriaBonus);
  return Math.max(points, 0);
}

export function getPointsRules() {
  return {
    materialBasePoints: MATERIAL_BASE_POINTS,
    qualityMultiplier: QUALITY_MULTIPLIER,
    formula: 'puntos = (base_material × cantidad × multiplicador_calidad) + (criterios_cumplidos × 2)',
  };
}
