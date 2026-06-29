import * as XLSX from 'xlsx';
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

    const data = result.rows.map((row) => ({
      Fecha: row.record_date,
      Líder: row.leader,
      Equipo: row.team,
      Material: row.material_type,
      Cantidad: row.quantity,
      Unidad: row.unit,
      Estado: row.status,
      Puntos: row.points_awarded,
      Período: row.period,
    }));

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Reporte Ecoamigos'
    );

    const buffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=Reporte_Ecoamigos.xlsx'
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.send(buffer);
  } catch (error) {
    res.status(500).json({
      message: 'Error al generar el reporte',
      error: error.message,
    });
  }
}

