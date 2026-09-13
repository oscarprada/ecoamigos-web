import LoadState from '../../components/LoadState';
import { uiError } from '../../utils/uiError';
import { useEffect, useMemo, useState } from 'react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

const QUALITY_CRITERIA = [
  'Material limpio',
  'Material seco',
  'Separado correctamente',
  'Sin residuos contaminantes',
  'Evidencia clara',
];

function getCatalogReference(materialType, quantityValue) {
  const quantity = Number(quantityValue) || 0;

  if (materialType === 'organico') {
    return {
      catalog_group_name: 'Dependencias institucionales',
      catalog_action_name: 'Ciclo orgánico',
      catalog_action_level: '5 kg de abono generado en compostera',
    };
  }

  if (quantity <= 5) {
    return {
      catalog_group_name: 'Dependencias institucionales',
      catalog_action_name: 'Entrega acopio',
      catalog_action_level: 'Nivel 1: Volumen bajo (1 a 5 kg)',
    };
  }

  if (quantity <= 15) {
    return {
      catalog_group_name: 'Dependencias institucionales',
      catalog_action_name: 'Entrega acopio',
      catalog_action_level: 'Nivel 2: Volumen medio (6 a 15 kg)',
    };
  }

  if (quantity <= 30) {
    return {
      catalog_group_name: 'Dependencias institucionales',
      catalog_action_name: 'Entrega acopio',
      catalog_action_level: 'Nivel 3: Volumen alto (16 a 30 kg)',
    };
  }

  return {
    catalog_group_name: 'Dependencias institucionales',
    catalog_action_name: 'Entrega acopio',
    catalog_action_level: 'Nivel 4: Volumen masivo (+30 kg)',
  };
}

function localCalendarDate() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

export default function RegisterRecyclingPage() {
  const { showToast } = useToast();

  const [period, setPeriod] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checkedCriteria, setCheckedCriteria] = useState(['Material limpio']);

  const [form, setForm] = useState({
    material_type: 'papel_carton',
    quantity: 1,
    unit: 'kg',
    quality_level: 'media',
    notes: '',
    period_id: '',
    record_date: localCalendarDate(),
    evidence: null,
  });

  useEffect(() => {
    const loadPeriod = async () => {
      try {
        const { data } = await api.get('/public/ranking');

        if (data.currentPeriod) {
          setPeriod(data.currentPeriod);

          setForm((prev) => ({
            ...prev,
            period_id: data.currentPeriod.id,
          }));
        }
      } catch (err) {
        setLoadError('No fue posible cargar el periodo activo.');
        showToast(
          'No fue posible cargar el periodo activo.',
          'error'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPeriod();
  }, [showToast]);

  const catalogReference = useMemo(() => {
    return getCatalogReference(
      form.material_type,
      form.quantity
    );
  }, [form.material_type, form.quantity]);

  const handleCriteriaChange = (criterion) => {
    setCheckedCriteria((prev) =>
      prev.includes(criterion)
        ? prev.filter((item) => item !== criterion)
        : [...prev, criterion]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const payload = new FormData();

      payload.append('material_type', form.material_type);
      payload.append('quantity', form.quantity);
      payload.append('unit', form.unit);
      payload.append('quality_level', form.quality_level);
      payload.append('criteria_count', checkedCriteria.length);
      payload.append('notes', form.notes || '');
      payload.append('period_id', form.period_id);
      payload.append('record_date', form.record_date);

      payload.append(
        'catalog_group_name',
        catalogReference.catalog_group_name
      );

      payload.append(
        'catalog_action_name',
        catalogReference.catalog_action_name
      );

      payload.append(
        'catalog_action_level',
        catalogReference.catalog_action_level
      );

      if (form.evidence) {
        payload.append('evidence', form.evidence);
      }

      await api.post('/recycling', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showToast(
        'Registro enviado correctamente. Pendiente de validación administrativa.',
        'success'
      );

      setForm({
        material_type: 'papel_carton',
        quantity: 1,
        unit: 'kg',
        quality_level: 'media',
        notes: '',
        period_id: period?.id || '',
        record_date: localCalendarDate(),
        evidence: null,
      });

      setCheckedCriteria(['Material limpio']);
    } catch (err) {
      showToast(
        uiError(err, 'No fue posible guardar el registro.'),
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadError) return <LoadState loading={loading} error={loadError} retry={() => window.location.reload()} />;

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <div style={styles.header}>
          <p style={styles.kicker}>Registro de actividad</p>

          <h2 style={styles.title}>
            Registrar reciclaje
          </h2>

          <p style={styles.description}>
            Completa la información del material reciclado.
            El sistema asignará los puntos cuando el
            administrador valide el registro.
          </p>
        </div>

        {period ? (
          <div style={styles.periodBox}>
            <strong>Periodo activo:</strong> {period.name}
          </div>
        ) : (
          <div style={styles.warningBox}>
            No hay un periodo activo. Crea o activa un periodo antes de registrar reciclaje.
          </div>
        )}

        <label style={styles.label}>
          Material

          <select
            style={styles.input}
            value={form.material_type}
            onChange={(e) =>
              setForm({
                ...form,
                material_type: e.target.value,
              })
            }
          >
            <option value="papel_carton">
              Papel y cartón
            </option>

            <option value="plastico">
              Plástico
            </option>

            <option value="vidrio">
              Vidrio
            </option>

            <option value="metal">
              Metal
            </option>

            <option value="organico">
              Orgánico
            </option>
          </select>
        </label>

        <div style={styles.twoCols}>
          <label style={styles.label}>
            Cantidad

            <input
              style={styles.input}
              type="number"
              min="0.1"
              step="0.1"
              value={form.quantity}
              onChange={(e) =>
                setForm({
                  ...form,
                  quantity: e.target.value,
                })
              }
              required
            />
          </label>

          <label style={styles.label}>
            Unidad

            <input
              style={styles.input}
              value={form.unit}
              onChange={(e) =>
                setForm({
                  ...form,
                  unit: e.target.value,
                })
              }
              required
            />
          </label>
        </div>

        <label style={styles.label}>
          Calidad del material

          <select
            style={styles.input}
            value={form.quality_level}
            onChange={(e) =>
              setForm({
                ...form,
                quality_level: e.target.value,
              })
            }
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </label>

        <div style={styles.criteriaBox}>
          <p style={styles.criteriaTitle}>
            Criterios de calidad cumplidos
          </p>

          <div style={styles.criteriaGrid}>
            {QUALITY_CRITERIA.map((criterion) => (
              <label
                key={criterion}
                style={styles.checkboxLabel}
              >
                <input
                  type="checkbox"
                  checked={checkedCriteria.includes(
                    criterion
                  )}
                  onChange={() =>
                    handleCriteriaChange(criterion)
                  }
                />

                {criterion}
              </label>
            ))}
          </div>
        </div>

        <label style={styles.label}>
          Fecha del registro

          <input
            style={styles.input}
            type="date"
            value={form.record_date}
            onChange={(e) =>
              setForm({
                ...form,
                record_date: e.target.value,
              })
            }
          />
        </label>

        <label style={styles.label}>
          Observaciones

          <textarea
            style={{
              ...styles.input,
              minHeight: '100px',
              resize: 'vertical',
            }}
            value={form.notes}
            onChange={(e) =>
              setForm({
                ...form,
                notes: e.target.value,
              })
            }
            placeholder="Escribe observaciones relevantes del registro"
          />
        </label>

        <label style={styles.label}>
          Evidencia (foto o video)

          <input
            style={styles.input}
            type="file"
            accept="image/*,video/*"
            onChange={(e) =>
              setForm({
                ...form,
                evidence: e.target.files[0],
              })
            }
          />
        </label>

        <button
          style={styles.submitButton}
          type="submit"
          disabled={
            loading ||
            !period ||
            saving
          }
        >
          {saving
            ? 'Guardando...'
            : 'Enviar registro'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '42px 32px 72px',
    fontFamily: 'Montserrat, sans-serif',
  },

  card: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: 'var(--shadow-card)',
    display: 'grid',
    gap: '18px',
  },

  header: {
    marginBottom: '4px',
  },

  kicker: {
    margin: 0,
    color: 'var(--turquoise)',
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
  },

  title: {
    margin: '8px 0 10px',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '34px',
    color: '#000000',
  },

  description: {
    margin: 0,
    color: '#444',
    lineHeight: 1.6,
  },

  periodBox: {
    backgroundColor: '#eef8f3',
    color: '#000000',
    border: '1px solid #d7ebdf',
    borderRadius: '14px',
    padding: '14px 16px',
  },

  warningBox: {
    backgroundColor: '#fff3f0',
    color: '#c0392b',
    border: '1px solid #f2c7c0',
    borderRadius: '14px',
    padding: '14px 16px',
    fontWeight: 600,
  },

  label: {
    display: 'grid',
    gap: '8px',
    fontWeight: 600,
    color: '#222',
  },

  input: {
    width: '100%',
    border: '1px solid #d6e1db',
    borderRadius: '12px',
    padding: '12px 14px',
    fontSize: '14px',
    fontFamily: 'Montserrat, sans-serif',
    outline: 'none',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
  },

  twoCols: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },

  criteriaBox: {
    backgroundColor: '#f8fbf9',
    border: '1px solid #e1ebe5',
    borderRadius: '16px',
    padding: '16px',
  },

  criteriaTitle: {
    margin: '0 0 12px',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '19px',
    fontWeight: 800,
  },

  criteriaGrid: {
    display: 'grid',
    gap: '10px',
  },

  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: 500,
  },

  submitButton: {
    backgroundColor: 'var(--green)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 22px',
    fontSize: '15px',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'Montserrat, sans-serif',
  },
};
