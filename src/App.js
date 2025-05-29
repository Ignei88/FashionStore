import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import Sales from './pages/Sales';
import SalesRegister from './pages/SalesRegister';
import SalesHistory from './pages/SalesHistory';
import SalesToday from './pages/SalesToday';
import Inventory from './pages/Inventory';
import Staff from './pages/Staff';
import StaffList from './pages/StaffList';
import Prediction from './pages/Prediction';
import ProductList from './pages/ProductList';
// Eliminamos la importación de PurchaseHistory
import PredictionSummary from './pages/PredictionSummary';
import PredictionForecast from './pages/PredictionForecast';
import TopProducts from './pages/TopProducts';
import PrintReport from './pages/PrintReport';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const isAdmin = localStorage.getItem('admin') === 'true';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <Router>
      {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={
            isLoggedIn ? <Home isMobile={isMobile} /> : <Login setIsLoggedIn={setIsLoggedIn} />
          } />
          <Route path="/home" element={
            isLoggedIn ? <Home isMobile={isMobile} /> : <Login setIsLoggedIn={setIsLoggedIn} />
          } />
          
          <Route path="/sales" element={
            isLoggedIn ? <Sales isMobile={isMobile} /> : <Login setIsLoggedIn={setIsLoggedIn} />
          }>
            <Route index element={<Navigate to="register" replace />} />
            <Route path="register" element={<SalesRegister />} />
            <Route path="history" element={<SalesHistory />} />
            {/* Se eliminó la ruta a SalesReturns */}
            <Route path="today" element={<SalesToday />} />
          </Route>
         
          <Route path="/inventory" element={
            isLoggedIn ? <Inventory isMobile={isMobile} /> : <Login setIsLoggedIn={setIsLoggedIn} />
          }>
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<ProductList />} />
            {/* Eliminamos la ruta a PurchaseHistory */}
          </Route>
         
          <Route path="/staff" element={
            isLoggedIn ? <Staff isMobile={isMobile} /> : <Login setIsLoggedIn={setIsLoggedIn} />
          }>
            <Route index element={<Navigate to="list" replace />} />
            <Route path="list" element={<StaffList />} />
          </Route>
          
          <Route path="/prediction" element={
            isLoggedIn ? <Prediction isMobile={isMobile} /> : <Login setIsLoggedIn={setIsLoggedIn} />
          }>
            <Route index element={<Navigate to="summary" replace />} />
            <Route path="summary" element={<PredictionSummary />} />
            <Route path="top-products" element={<TopProducts />} />
            <Route path="forecast" element={<PredictionForecast />} />
            <Route path="print-report" element={<PrintReport />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;