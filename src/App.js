import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CassaBar from './pages/CassaBar';
import Settings from './pages/Settings';

const App = () => {
  // Stato necessario per le props
  const [products, setProducts] = useState([]);
  const [moneyNotes, setMoneyNotes] = useState([]);
  const [total, setTotal] = useState(0);
  const [change, setChange] = useState(0);
  const [soldProducts, setSoldProducts] = useState([]);
  const [accessCode, setAccessCode] = useState('');
  const [operationCount,setOperationCount] = useState(1);

  // Funzioni aggiuntive
  const resetOperation = () => {
    setProducts([]);
    setMoneyNotes([]);
    setTotal(0);
    setChange(0);
  };

  const saveDataToDatabase = () => {
    if (accessCode !== '0000') {
      alert('Codice di accesso non valido!');
      return;
    }
    // Logica per salvare i dati
    console.log('Dati salvati nel database');
  };

  return (
    <Router>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 100px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/CassaBar"
            element={
              <CassaBar
                products={products}
                setProducts={setProducts}
                moneyNotes={moneyNotes}
                setMoneyNotes={setMoneyNotes}
                total={total}
                setTotal={setTotal}
                change={change}
                setChange={setChange}
                soldProducts={soldProducts}
                setSoldProducts={setSoldProducts}
                operationCount={operationCount}
                setOperationCount={setOperationCount}
                accessCode={accessCode}
                saveDataToDatabase={saveDataToDatabase}
                resetOperation={resetOperation}
                setAccessCode={setAccessCode}
                
              />
            }
          />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
