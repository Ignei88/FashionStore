import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PrintReport = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const generateSummaryPDF = useCallback((doc) => {
    doc.text('Resumen de Ventas', 105, 15, null, null, 'center');
    // Agregar contenido específico...
  }, []);

  const generateTopProductsPDF = useCallback((doc) => {
    doc.text('Productos Más Vendidos', 105, 15, null, null, 'center');
    // Agregar contenido específico...
  }, []);

  const generateForecastPDF = useCallback((doc) => {
    doc.text('Predicción de Demanda', 105, 15, null, null, 'center');
    // Agregar contenido específico...
  }, []);

  const generateFullReportPDF = useCallback((doc) => {
    doc.text('Informe Completo de Predicción', 105, 15, null, null, 'center');
    // Agregar todo el contenido...
  }, []);

  const generatePDF = useCallback(() => {
    const doc = new jsPDF();
    
    if (location.pathname.includes('summary')) {
      generateSummaryPDF(doc);
    } else if (location.pathname.includes('top-products')) {
      generateTopProductsPDF(doc);
    } else if (location.pathname.includes('forecast')) {
      generateForecastPDF(doc);
    } else {
      generateFullReportPDF(doc);
    }
    
    doc.save(`informe-prediccion-${new Date().toISOString().slice(0, 10)}.pdf`);
  }, [location.pathname, generateSummaryPDF, generateTopProductsPDF, generateForecastPDF, generateFullReportPDF]);

  useEffect(() => {
    generatePDF();
    const timer = setTimeout(() => navigate('/prediction'), 1000);
    return () => clearTimeout(timer);
  }, [generatePDF, navigate]);

  return null;
};

export default PrintReport;