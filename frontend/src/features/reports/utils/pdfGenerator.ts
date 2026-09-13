import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FinancialReport } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export function buildPdfDocument(report: FinancialReport): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor: [number, number, number] = [15, 23, 42]; // Slate 900
  const accentLime: [number, number, number] = [132, 204, 22]; // Lime 500
  const textDark: [number, number, number] = [30, 41, 59]; // Slate 800
  const textMuted: [number, number, number] = [100, 116, 139]; // Slate 500

  // 1. Cabeçalho
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('DeliveryControl', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('RELATÓRIO DE FECHAMENTO FINANCEIRO E LIQUIDAÇÃO', 14, 18);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  const dataGeracao = `Gerado em: ${formatDate(report.generatedAt)}`;
  doc.text(dataGeracao, 196, 12, { align: 'right' });
  const periodoStr = `Período: ${report.period || 'Geral'}`;
  doc.text(periodoStr, 196, 18, { align: 'right' });

  let currentY = 36;

  // 2. Quadro de Indicadores Consolidados
  doc.setTextColor(...textDark);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. RESUMO FINANCEIRO CONSOLIDADO', 14, currentY);

  currentY += 4;

  const cardWidth = 43;
  const cardHeight = 16;
  const cards = [
    { label: 'RECEITA BRUTA', value: formatCurrency(report.grossRevenue), color: textDark },
    { label: 'COMBUSTÍVEL', value: `-${formatCurrency(report.gasolineExpense)}`, color: [225, 29, 72] as [number, number, number] },
    { label: 'EMPRESA (50%)', value: formatCurrency(report.carShare), color: [16, 149, 193] as [number, number, number] },
    { label: 'ENTREGADORES', value: formatCurrency(report.employeesShare), color: [124, 58, 237] as [number, number, number] },
  ];

  cards.forEach((c, idx) => {
    const x = 14 + idx * (cardWidth + 2.5);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, currentY, cardWidth, cardHeight, 1.5, 1.5, 'FD');

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textMuted);
    doc.text(c.label, x + 3, currentY + 5);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...c.color);
    doc.text(c.value, x + 3, currentY + 12);
  });

  currentY += cardHeight + 8;

  // 3. Tabela de Pagamento aos Entregadores
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textDark);
  doc.text('2. LIQUIDAÇÃO INDIVIDUAL AOS ENTREGADORES', 14, currentY);
  currentY += 2;

  const employeeRows = report.employeesSummary.length > 0
    ? report.employeesSummary.map(e => [
        e.employeeName,
        `${e.shiftsCount} turnos`,
        `${e.deliveriesCount} entregas`,
        formatCurrency(e.totalEarned),
      ])
    : [['Nenhum entregador com registros no período.', '-', '-', '-']];

  autoTable(doc, {
    startY: currentY,
    head: [['Entregador / Motorista', 'Turnos Trabalhados', 'Entregas', 'Total Líquido a Receber']],
    body: employeeRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
    },
    columnStyles: {
      3: { halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] },
    },
    margin: { left: 14, right: 14 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // 4. Detalhamento dos Turnos
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textDark);
  doc.text('3. DETALHAMENTO DE TURNOS DE ENTREGA', 14, currentY);
  currentY += 2;

  const deliveryRows = report.deliveries.length > 0
    ? report.deliveries.slice(0, 15).map(d => [
        formatDate(d.date),
        d.employeeBName ? `${d.employeeAName} + ${d.employeeBName}` : d.employeeAName,
        `${d.deliveryCount} ped.`,
        formatCurrency(d.revenue),
        formatCurrency(d.carShare),
        formatCurrency(d.netRevenueShareA + (d.netRevenueShareB || 0)),
      ])
    : [['Sem turnos registrados no período.', '-', '-', '-', '-', '-']];

  autoTable(doc, {
    startY: currentY,
    head: [['Data', 'Equipe / Motoristas', 'Qtd.', 'Bruto', 'Empresa (50%)', 'Líquido Equipe']],
    body: deliveryRows,
    theme: 'striped',
    headStyles: {
      fillColor: [71, 85, 105],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [51, 65, 85],
    },
    columnStyles: {
      2: { halign: 'center' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // 5. Despesas com Combustível
  if (report.gasolineExpenses && report.gasolineExpenses.length > 0) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textDark);
    doc.text('4. DEDUÇÕES DE COMBUSTÍVEL', 14, currentY);
    currentY += 2;

    const gasRows = report.gasolineExpenses.slice(0, 8).map(g => [
      formatDate(g.date),
      g.description || 'Abastecimento',
      g.liters ? `${g.liters} L` : '--',
      formatCurrency(g.amount),
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Data', 'Descrição / Posto', 'Litros', 'Valor Duzido']],
      body: gasRows,
      theme: 'grid',
      headStyles: {
        fillColor: [100, 116, 139],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: [51, 65, 85],
      },
      columnStyles: {
        3: { halign: 'right', fontStyle: 'bold', textColor: [225, 29, 72] },
      },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 14;
  } else {
    currentY += 6;
  }

  // Rodapé Oficial simples (sem campos de assinatura, apenas autenticidade e data)
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textMuted);
  doc.text('Documento oficial de dados e prestação de contas do sistema DeliveryControl.', 105, 290, { align: 'center' });

  return doc;
}

export function downloadPdfReport(report: FinancialReport, customFilename?: string): void {
  const doc = buildPdfDocument(report);
  const periodSlug = (report.period || 'fechamento')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
  const filename = customFilename || `relatorio-financeiro-deliverycontrol-${periodSlug}.pdf`;
  doc.save(filename);
}

export function openPdfInNewTab(report: FinancialReport): void {
  const doc = buildPdfDocument(report);
  const blob = doc.output('blob');
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, '_blank');
}
