import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Export data to CSV
export const exportToCSV = (data, filename = 'digital-twin-data') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = Object.keys(data[0]).join(',');
  const rows = data.map((row) =>
    Object.values(row)
      .map((value) => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value).replace(/,/g, ';');
      })
      .join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export data to JSON
export const exportToJSON = (data, filename = 'digital-twin-data') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${format(new Date(), 'yyyy-MM-dd')}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export data to Excel
export const exportToExcel = (data, filename = 'digital-twin-data', sheetName = 'Data') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  XLSX.writeFile(workbook, `${filename}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};

// Generate Professional PDF Report
export const generatePDFReport = (data, metrics, options = {}) => {
  const {
    title = 'Digital Twin System Report',
    includeCharts = false,
    includeSummary = true,
    deviceName = 'System',
  } = options;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text(title, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`,
    pageWidth / 2,
    yPos,
    { align: 'center' }
  );
  yPos += 15;

  // Device Information
  if (deviceName) {
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text(`Device: ${deviceName}`, 14, yPos);
    yPos += 10;
  }

  // Summary Section
  if (includeSummary && metrics) {
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('Current Metrics Summary', 14, yPos);
    yPos += 8;

    doc.setFontSize(10);
    const summaryData = [
      ['Metric', 'Value', 'Unit'],
      ['Temperature', metrics.temperature?.toFixed(2) || 'N/A', '°C'],
      ['Humidity', metrics.humidity?.toFixed(2) || 'N/A', '%'],
      ['Pressure', metrics.pressure?.toFixed(2) || 'N/A', 'hPa'],
      ['Vibration', metrics.vibration?.toFixed(2) || 'N/A', 'Hz'],
      ['Energy Consumption', metrics.energy?.toFixed(2) || 'N/A', 'kW'],
      ['Status', metrics.status || 'N/A', ''],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 },
    });

    yPos = doc.lastAutoTable.finalY + 15;
  }

  // Data Table
  if (data && data.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(`Historical Data (${data.length} records)`, 14, yPos);
    yPos += 8;

    // Prepare table data
    const tableData = data.slice(-50).map((row) => [
      format(new Date(row.timestamp || Date.now()), 'yyyy-MM-dd HH:mm'),
      row.temperature?.toFixed(2) || 'N/A',
      row.humidity?.toFixed(2) || 'N/A',
      row.pressure?.toFixed(2) || 'N/A',
      row.vibration?.toFixed(2) || 'N/A',
      row.energy?.toFixed(2) || 'N/A',
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Timestamp', 'Temperature', 'Humidity', 'Pressure', 'Vibration', 'Energy']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    });
  }

  // Footer
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  doc.save(`${filename}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

// Export Multiple Devices Comparison
export const exportComparisonReport = (devicesData, filename = 'device-comparison') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  doc.setFontSize(20);
  doc.text('Device Comparison Report', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  doc.setFontSize(10);
  doc.text(
    `Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`,
    pageWidth / 2,
    yPos,
    { align: 'center' }
  );
  yPos += 20;

  // Comparison Table
  const comparisonData = devicesData.map((device) => [
    device.name || device.id,
    device.sensorData?.temperature?.toFixed(2) || 'N/A',
    device.sensorData?.humidity?.toFixed(2) || 'N/A',
    device.sensorData?.pressure?.toFixed(2) || 'N/A',
    device.status || 'N/A',
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Device', 'Temperature (°C)', 'Humidity (%)', 'Pressure (hPa)', 'Status']],
    body: comparisonData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  });

  doc.save(`${filename}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
