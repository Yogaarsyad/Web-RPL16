import React, { useState, useRef, useEffect } from 'react';
import { FiFileText, FiGrid, FiFile } from 'react-icons/fi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Tambahkan prop 'children' disini
function ExportButton({ data, filename, className, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- LOGIKA EXPORT ---

  const convertToCSV = (objArray) => {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    const header = Object.keys(array[0]).join(',') + '\r\n';
    str += header;
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (const index in array[i]) {
        if (line !== '') line += ',';
        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  };

  const downloadCSV = () => {
    if (!data || data.length === 0) return alert("No data to export");
    const csvData = new Blob([convertToCSV(data)], { type: 'text/csv' });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.href = csvURL;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  const downloadExcel = () => {
    if (!data || data.length === 0) return alert("No data to export");
    // Simple XLS export via HTML Table method
    let uri = 'data:application/vnd.ms-excel;base64,';
    let template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head></head><body><table>{table}</table></body></html>';
    
    const base64 = (s) => window.btoa(unescape(encodeURIComponent(s)));
    const format = (s, c) => s.replace(/{(\w+)}/g, (m, p) => c[p]);

    const headers = Object.keys(data[0]);
    let tableHTML = '<thead><tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>';
    data.forEach(row => {
      tableHTML += '<tr>' + headers.map(h => `<td>${row[h]}</td>`).join('') + '</tr>';
    });
    tableHTML += '</tbody>';

    const ctx = { worksheet: 'Worksheet', table: tableHTML };
    const link = document.createElement('a');
    link.href = uri + base64(format(template, ctx));
    link.download = `${filename}.xls`;
    link.click();
    setIsOpen(false);
  };

  const downloadPDF = () => {
    if (!data || data.length === 0) return alert("No data to export");
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Activity History Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    const headers = Object.keys(data[0]);
    const tableRows = data.map(row => headers.map(header => row[header]));

    autoTable(doc, {
      head: [headers],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`${filename}.pdf`);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={className}
      >
        {/* Render Children (Ikon & Teks) disini */}
        {children}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-slate-800 border border-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden origin-top-right transition-all animate-fade-in-up">
          <div className="py-1">
            <button
              onClick={downloadCSV}
              className="flex items-center w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <FiFileText className="mr-3 text-green-400 text-lg" />
              <span>Download CSV</span>
            </button>
            <button
              onClick={downloadExcel}
              className="flex items-center w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-t border-slate-700/50"
            >
              <FiGrid className="mr-3 text-blue-400 text-lg" />
              <span>Download Excel</span>
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-t border-slate-700/50"
            >
              <FiFile className="mr-3 text-red-400 text-lg" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExportButton;