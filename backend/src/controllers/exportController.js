import ExcelJS from 'exceljs';
import { logError } from '../utils/logger.js';
import { query } from '../config/db.js';

// A single export per process bounds simultaneous workbook allocation.
let exporting = false;
export function exportMaxRows(env = process.env) {
  const raw = env.EXPORT_MAX_ROWS ?? '1000';
  if (!/^\d+$/.test(raw) || Number(raw)<1 || Number(raw)>10000) throw Error('Configuración de exportación inválida');
  return Number(raw);
}
// XLSX string cells are not formulas. Never pass user objects as ExcelJS cell values.
const textCell = value => value == null ? null : String(value);
export async function exportRecyclingReport(req, res) {
  if (exporting) return res.status(429).json({message:'Ya hay una exportación en curso',code:'EXPORT_BUSY'});
  exporting = true;
  try {
    const maxRows = exportMaxRows();
    const result = await query(`
      SELECT
        rr.record_date,
        u.name AS leader,
        t.name AS team,
        rr.material_type,
        rr.quantity,
        rr.unit,
        rr.status,
        rr.points_awarded,
        p.name AS period
      FROM recycling_records rr
      JOIN users u ON u.id = rr.user_id
      JOIN teams t ON t.id = rr.team_id
      LEFT JOIN periods p ON p.id = rr.period_id
      ORDER BY rr.record_date DESC
      LIMIT $1
    `, [maxRows + 1]);

    if (result.rows.length > maxRows) {
      return res.status(422).json({message: 'El reporte supera el límite de exportación', code: 'EXPORT_LIMIT_EXCEEDED', maxRows});
    }

    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'Ecoamigos';
    workbook.company = 'Parques Nacionales Naturales de Colombia';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Reporte Ecoamigos');

    worksheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 18 },
      { header: 'Líder', key: 'leader', width: 28 },
      { header: 'Equipo', key: 'team', width: 28 },
      { header: 'Material', key: 'material', width: 20 },
      { header: 'Cantidad', key: 'quantity', width: 15 },
      { header: 'Unidad', key: 'unit', width: 12 },
      { header: 'Estado', key: 'status', width: 18 },
      { header: 'Puntos', key: 'points', width: 12 },
      { header: 'Período', key: 'period', width: 25 },
    ];

    worksheet.getRow(1).font = {
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };

    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF71B956' },
    };

    worksheet.getRow(1).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };

    result.rows.forEach((row) => {
      worksheet.addRow({
        fecha: row.record_date,
        leader: textCell(row.leader),
        team: textCell(row.team),
        material: textCell(row.material_type),
        quantity: row.quantity,
        unit: textCell(row.unit),
        status: textCell(row.status),
        points: row.points_awarded,
        period: textCell(row.period),
      });
    });

    worksheet.autoFilter = {
      from: 'A1',
      to: 'I1',
    };

    worksheet.views = [
      {
        state: 'frozen',
        ySplit: 1,
      },
    ];

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=Reporte_Ecoamigos.xlsx'
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {
    logError('EXPORT_ERROR');
    if (res.headersSent) return res.destroy();
    res.removeHeader?.('Content-Disposition');
    res.removeHeader?.('Content-Type');

    res.status(500).json({
      message: 'Error al generar el reporte',
    });
  } finally {
    exporting = false;
  }
}
