import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';

export default function RegisterRecyclingPage() {
  const navigate = useNavigate();

  const [periods, setPeriods] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  const [form, setForm] = useState({
    material_type: 'papel_carton',
    quantity: 1,
    unit: 'kg',
    quality_level: 'media',
    criteria_count: 1,
    notes: '',
    period_id: '',
    record_date: new Date().toISOString().slice(0, 10),
    evidence: null,
    catalog_group_name: '',
    catalog_action_name: '',
    catalog_action_level: '',
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [rankingResponse, catalogResponse] = await Promise.all([
          api.get('/public/ranking'),
          api.get('/public/points-catalog'),
        ]);

        const rankingData = rankingResponse.data;
        const catalogData = catalogResponse.data || [];

        if (rankingData.currentPeriod) {
          setPeriods([rankingData.currentPeriod]);
          setForm((prev) => ({
            ...prev,
            period_id: rankingData.currentPeriod.id,
          }));
        }

        setCatalog(catalogData);

        if (catalogData.length > 0) {
          const firstItem = catalogData[0];
          setForm((prev) => ({
            ...prev,
            catalog_group_name: firstItem.group_name || '',
            catalog_action_name: firstItem.action_name || '',
            catalog_action_level: firstItem.action_level || '',
          }));
        }
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
      } finally {
        setLoadingCatalog(false);
      }
    };

    loadInitialData();
  }, []);

  const groupOptions = useMemo(() => {
    return [...new Set(catalog.map((item) => item.group_name).filter(Boolean))];
  }, [catalog]);

  const actionOptions = useMemo(() => {
    return [
      ...new Set(
        catalog
          .filter((item) => item.group_name === form.catalog_group_name)
          .map((item) => item.action_name)
          .filter(Boolean)
      ),
    ];
  }, [catalog, form.catalog_group_name]);

  const levelOptions = useMemo(() => {
    return [
      ...new Set(
        catalog
          .filter(
            (item) =>
              item.group_name === form.catalog_group_name &&
              item.action_name === form.catalog_action_name
          )
          .map((item) => item.action_level || '')
      ),
    ];
  }, [catalog, form.catalog_group_name, form.catalog_action_name]);

  const selectedCatalogItem = useMemo(() => {
    return (
      catalog.find(
        (item) =>
          item.group_name === form.catalog_group_name &&
          item.action_name === form.catalog_action_name &&
          (item.action_level || '') === (form.catalog_action_level || '')
      ) || null
    );
  }, [
    catalog,
    form.catalog_group_name,
    form.catalog_action_name,
    form.catalog_action_level,
  ]);

  const handleGroupChange = (value) => {
    const actionsForGroup = catalog.filter((item) => item.group_name === value);
    const firstAction = actionsForGroup[0]?.action_name || '';
    const firstLevel =
      actionsForGroup.find((item) => item.action_name === firstAction)?.action_level || '';

    setForm((prev) => ({
      ...prev,
      catalog_group_name: value,
      catalog_action_name: firstAction,
      catalog_action_level: firstLevel,
    }));
  };

  const handleActionChange = (value) => {
    const levelsForAction = catalog.filter(
      (item) =>
        item.group_name === form.catalog_group_name &&
        item.action_name === value
    );

    const firstLevel = levelsForAction[0]?.action_level || '';

    setForm((prev) => ({
      ...prev,
      catalog_action_name: value,
      catalog_action_level: firstLevel,
    }));
  };

  const handleLevelChange = (value) => {
    setForm((prev) => ({
      ...prev,
      catalog_action_level: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'evidence' && value) {
          payload.append('evidence', value);
        }

        if (key !== 'evidence') {
          payload.append(key, value);
        }
      }
    });

    await api.post('/recycling', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    navigate('/leader');
  };

  return (
    <div className="container narrow">
      <form className="card form" onSubmit={handleSubmit}>
        <h2>Registrar reciclaje</h2>

        <label>
          Grupo del catálogo
          <select
            value={form.catalog_group_name}
            onChange={(e) => handleGroupChange(e.target.value)}
            required
            disabled={loadingCatalog}
          >
            {groupOptions.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>

        <label>
          Acción
          <select
            value={form.catalog_action_name}
            onChange={(e) => handleActionChange(e.target.value)}
            required
            disabled={loadingCatalog}
          >
            {actionOptions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </label>

        <label>
          Nivel
          <select
            value={form.catalog_action_level || ''}
            onChange={(e) => handleLevelChange(e.target.value)}
            disabled={loadingCatalog}
          >
            {levelOptions.map((level, index) => (
              <option key={`${level}-${index}`} value={level}>
                {level || 'Sin nivel'}
              </option>
            ))}
          </select>
        </label>

        {selectedCatalogItem && (
          <div
            style={{
              background: '#f4fbf7',
              border: '1px solid #d7ebdf',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '10px',
            }}
          >
            <p style={{ margin: 0, fontWeight: 700 }}>
              Puntaje base del catálogo: {selectedCatalogItem.points}
            </p>
            <p style={{ margin: '6px 0 0 0' }}>
              Evidencia requerida: {selectedCatalogItem.evidence_required || 'No especificada'}
            </p>
            <p style={{ margin: '6px 0 0 0' }}>
              Frecuencia máxima: {selectedCatalogItem.max_frequency || 'No definida'}
            </p>
          </div>
        )}

        <label>
          Material
          <select
            value={form.material_type}
            onChange={(e) => setForm({ ...form, material_type: e.target.value })}
          >
            <option value="papel_carton">Papel y cartón</option>
            <option value="plastico">Plástico</option>
            <option value="vidrio">Vidrio</option>
            <option value="metal">Metal</option>
            <option value="organico">Orgánico</option>
          </select>
        </label>

        <label>
          Cantidad
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
          />
        </label>

        <label>
          Unidad
          <input
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            required
          />
        </label>

        <label>
          Calidad
          <select
            value={form.quality_level}
            onChange={(e) => setForm({ ...form, quality_level: e.target.value })}
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </label>

        <label>
          Criterios cumplidos
          <input
            type="number"
            min="0"
            max="10"
            value={form.criteria_count}
            onChange={(e) => setForm({ ...form, criteria_count: e.target.value })}
          />
        </label>

        <label>
          Periodo
          <select
            value={form.period_id}
            onChange={(e) => setForm({ ...form, period_id: e.target.value })}
          >
            {periods.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Fecha del registro
          <input
            type="date"
            value={form.record_date}
            onChange={(e) => setForm({ ...form, record_date: e.target.value })}
          />
        </label>

        <label>
          Observaciones
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </label>

        <label>
          Evidencia (foto o video)
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setForm({ ...form, evidence: e.target.files[0] })}
          />
        </label>

        <button className="button primary" type="submit" disabled={loadingCatalog}>
          Enviar registro
        </button>
      </form>
    </div>
  );
}

