import ExcelJS from 'exceljs';
import { logError } from '../utils/logger.js';
import { query } from '../config/db.js';

export async function exportRecyclingReport(req, res) {
  try {
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
    `);

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
        leader: row.leader,
        team: row.team,
        material: row.material_type,
        quantity: row.quantity,
        unit: row.unit,
        status: row.status,
        points: row.points_awarded,
        period: row.period,
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

    res.status(500).json({
      message: 'Error al generar el reporte',
    });
  }
}
