import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import { AiOutlineClose } from 'react-icons/ai';
import './App.css';
import './app_mobile.css';
import { RiShoppingCartFill } from 'react-icons/ri';
import { GiDrinkMe } from 'react-icons/gi';
import { FaMoneyBill } from 'react-icons/fa';
import { initializeApp } from 'firebase/app';
import ReactToPrint from 'react-to-print';
import { getDatabase, ref, push, get, child, onValue } from 'firebase/database';
import PrintComponent from './PrintComponent';
import { saveAs } from 'file-saver';
import Login from './Login';
import Registration from './Registration';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import ReactDOM from 'react-dom'; // Add this import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRApnfbvd1OtVaXLjrrABUcYvVGvta9GI",
  authDomain: "cassa-emersa2.firebaseapp.com",
  databaseURL: "https://cassa-emersa2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cassa-emersa2",
  storageBucket: "cassa-emersa2.appspot.com",
  messagingSenderId: "655203026786",
  appId: "1:655203026786:web:c1005f1fb97947c4cd4e3b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


const App = () => {
  const [products, setProducts] = useState([]);
  const [moneyNotes, setMoneyNotes] = useState([]);
  const [total, setTotal] = useState(0);
  const [moneyReceived, setMoneyReceived] = useState(0);
  const [change, setChange] = useState(0);
  const [soldProducts, setSoldProducts] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);
  const [operationDate, setOperationDate] = useState('');
  const [operationCount, setOperationCount] = useState(1);
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [accessCode, setAccessCode] = useState('');
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef(null);
  
  const fetchLastOperation = async () => {
    try {
      const snapshot = await database
        .ref('operations')
        .orderByChild('operationnumber')
        .limitToLast(1)
        .once('value');
      
      const lastOperation = snapshot.val();
  
      // Esempio di utilizzo dei dati dell'ultima operazione
      const operationId = Object.keys(lastOperation)[0];
      const operationData = lastOperation[operationId];
      const operationNumber = operationData.operationnumber;
      const operationDate = operationData.operationdate;
  
      console.log('Ultima operazione:', operationId, operationNumber, operationDate);
    } catch (error) {
      console.error('Errore durante il recupero dell\'ultima operazione:', error);
    }
  };

  fetchLastOperation();


  const resetIdleTimer = () => {
    setIsIdle(false);
    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(handleIdleTimeout, 900000); // 15 minutes (15 * 60 * 1000)
  };
  
  const handleIdleTimeout = () => {
    setIsPopupVisible(true);
  };
  
  const handleAccessButtonClick = () => {
    if (accessCode.trim() === '') {
      return;
    }
  
    if (accessCode !== '0000') {
      alert('Codice di accesso non valido!');
      return;
    }
  
    setIsPopupVisible(false);
  };
  

  const handleProductClick = (productName, productPrice) => {
    const existingProduct = products.find((product) => product.name === productName);

    if (existingProduct) {
      const updatedProducts = products.map((product) => {
        if (product.name === productName) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
  
      setProducts(updatedProducts);
    } else {
      const newProduct = { name: productName, price: productPrice, quantity: 1, operationCount };
      setProducts([...products, newProduct]);
    }
  };

  const handleDeleteProduct = (productName) => {
    const updatedProducts = products.filter((product) => product.name !== productName);
    setProducts(updatedProducts);
  };

  const calculateTotal = () => {
    const totalPrice = products.reduce(
      (total, product) => total + parseFloat(product.price) * product.quantity,
      0
    );
    return totalPrice.toFixed(2);
  };
  
  const Footer = () => (
    <footer className="footer">
      <div className="footer-left">
        <span className="footer-text">Copyright by Emersa 2023</span>
        <span className="footer-text">Prodotto da Giuseppe Marzullo</span>
      </div>
      <div className="divider"></div>
      <div className="footer-right">
        <img src={logo} className="footer-logo" alt="logo" />
      </div>
    </footer>
  );

  const saveDataToDatabase = () => {
    const productsRef = ref(database, 'products');
    const moneyNotesRef = ref(database, 'moneyNotes');
    const operationsRef = ref(database, 'operations');

  if (accessCode !== '0000') {
  alert('Codice di accesso non valido!');
  return;
}
    push(productsRef, products);
    push(moneyNotesRef, moneyNotes);
    push(operationsRef, { operationNumber: operationCount, operationDate });
  
    resetOperation();
    setOperationCount(operationCount + 1);
  };

  const handleDownloadReport = () => {
    const productQuantities = {};
  
    soldProducts.forEach((product) => {
      if (product.name in productQuantities) {
        productQuantities[product.name] += product.quantity;
      } else {
        productQuantities[product.name] = product.quantity;
      }
    });
  
    let csvData = Object.entries(productQuantities).reduce(
      (data, [name, quantity]) => `${data}${name},${quantity}\n`,
      'Product,Quantity\n'
    );
  
    const totalEarnings = soldProducts.reduce(
      (total, product) => total + parseFloat(product.price) * product.quantity,
      0
    );
  
    csvData += `Total Earnings,${totalEarnings.toFixed(2)}\n`;
  
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'report.csv');
  };
  
  const handleMoneyNoteAdd = (noteValue) => {
    const newNote = { value: noteValue };
    setMoneyNotes([...moneyNotes, newNote]);
  };

  const handleMoneyNoteDelete = (index) => {
    const updatedNotes = [...moneyNotes];
    updatedNotes.splice(index, 1);
    setMoneyNotes(updatedNotes);
  };

  const resetOperation = () => {
    setProducts([]);
    setMoneyNotes([]);
    setTotal(0);
    setMoneyReceived(0);
    setChange(0);
  };

  const printComponentRef = useRef(null);

  const handlePrintDirect = () => {
    setIsPrinting(true);
  };
  
  useEffect(() => {
    const totalAmount = parseFloat(calculateTotal());
    setTotal(totalAmount);

    const received = parseFloat(moneyNotes.reduce((sum, note) => sum + parseFloat(note.value), 0));

    const calculatedChange = received - totalAmount;
    setChange(calculatedChange.toFixed(2));
  }, [products, moneyNotes]);

  useEffect(() => {
    let idleTimer = setTimeout(handleIdleTimeout, 900000); // 15 minuti (15 * 60 * 1000)
  
    return () => {
      clearTimeout(idleTimer);
    };
  }, []);

  useEffect(() => {
    const database = getDatabase();
    const productsRef = ref(database, 'products');
    const moneyNotesRef = ref(database, 'moneyNotes');

    onValue(productsRef, (snapshot) => {
      const productsData = snapshot.val();
      const soldProductsData = Object.values(productsData).flat();
      setSoldProducts(soldProductsData);
    });

    onValue(moneyNotesRef, (snapshot) => {
      const moneyNotesData = snapshot.val();

      if (moneyNotesData !== undefined && moneyNotesData !== null) {
        const moneyNotesArray = Object.values(moneyNotesData);
      } else {
        console.log('moneyNotesData non definito o null');
      }
    });
    
  }, []);

  const moneyValues = [
    { label: '100€', value: 100 },
    { label: '50€', value: 50 },
    { label: '20€', value: 20 },
    { label: '10€', value: 10 },
    { label: '5€', value: 5 },
    { label: '2€', value: 2 },
    { label: '1€', value: 1 },
    { label: '50 cent', value: 0.5 },
    { label: '20 cent', value: 0.2 },
    { label: '10 cent', value: 0.1 },
    { label: '5 cent', value: 0.05 },
  ];

  return (
    <div className="App">
      {isPopupVisible && (
      <div className="popup">
        <div > <h2>ALTRA PAGINA</h2>
        <img src={logo} className="logo-popup" alt="logo" />
      </div>
        <div className="popup-content">
          <h3>Inserisci il codice di accesso:</h3>
          <input
  type="password"
  value={accessCode}
  onChange={(e) => {
    setAccessCode(e.target.value);
    resetIdleTimer();
  }}
/>
          <button onClick={handleAccessButtonClick}>Accedi</button>
        </div>
      </div>
)}
      <div className="top-bar">
        <img src={logo} className="logo" alt="logo" />
      </div>
      <header className="App-header">
        <div className="column-recived-money">
          <div class="titolocolonna"><h3>
            <GiDrinkMe className="drink-icon" /> PRODOTTI
          </h3></div>
          <div className="product-buttons">
            <button className="product-button" onClick={() => {handleProductClick('Gintonic base', '5');resetIdleTimer();}}>GinTonic base - 5€</button>
            <button className="product-button" onClick={() => {handleProductClick('Gintonic prem', '7');resetIdleTimer();}}>GinTonic Premium - 7€ </button>
            <button className="product-button" onClick={() => {handleProductClick('Birra', '3');resetIdleTimer();}}>Birra - 3€</button>
            <button className="product-button" onClick={() => {handleProductClick('Spritz', '5');resetIdleTimer();}}>Spritz - 5€</button>
            <button className="product-button" onClick={() => {handleProductClick('Special', '10');resetIdleTimer();}}>Special - 10€</button>
            <button className="product-button" onClick={() => {handleProductClick('Analcolico', '3');resetIdleTimer();}}>Analcolico - 3€</button>
            <button className="product-button" onClick={() => {handleProductClick('Omaggio', '0');resetIdleTimer();}}>Omaggio - 0€</button>
          </div>
        </div>
        <div className="column-money">
          <div class="titolocolonna">
          <h3><FaMoneyBill />BANCONOTE E MONETE</h3>
          </div>
          <div className="money-notes-container">
            {moneyValues.map((moneyValue, index) => (
              <button
                key={index}
                className="money-notes-button"
                onClick={() => {handleMoneyNoteAdd(moneyValue.value);resetIdleTimer();}}
              >
                {moneyValue.label}
              </button>
            ))}
          </div>
        </div>
        <div className="column-recived-money">
          <div class="titolocolonna">
          <h3>DENARO RICEVUTO</h3>
          </div>
          <div className="notes-container">
            {moneyNotes.map((note, index) => (
              <div key={index} className="note">
                <span className="note-value">{note.value}€</span>
                <button className="delete-button" onClick={() => {handleMoneyNoteDelete(index);resetIdleTimer();}}>
                  <AiOutlineClose />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="column-cassa">
          <div class="titolocolonna">
          <h3>
            <RiShoppingCartFill className="cart-icon" /> CASSA
          </h3>
          </div>
          <div className="products-list">
            {products.map((product, index) => (
              <div key={index} className="product-container">
                <button className="delete-button" onClick={() => {
                handleDeleteProduct(product.name);
                resetIdleTimer();}}>
                  <AiOutlineClose />
                </button>
                <span className="product-name">{product.name}</span>
                <span className="product-price">
                  {product.price}€ x {product.quantity}
                </span>
              </div>
            ))}
            <div className="divider"></div>
            <div className="total-container">
              <span className="total-label">Totale:</span>
              <span className="total-price">{total}€</span>
            </div>
            <div className="divider"></div>
            <div className="change-container">
              <span className="change-label">Resto:</span>
              <span className="change-amount">{change}€</span>
            </div>
            <button className="save-button" onClick={saveDataToDatabase}>
              OPERAZIONE CONCLUSA
            </button>
            <button className="reset-button" onClick={resetOperation}>
              RESETTA OPERAZIONE
            </button>
            <div className="container-pulsante-stampa">
        <ReactToPrint
          trigger={() => (
          <button className="print-button" onClick={handlePrintDirect}>
  STAMPA RICEVUTA
</button>
          )}
          content={() => printComponentRef.current}
        />
        <div>
        <div className="divider"></div>
  <h5>Operazione</h5>
  <p>N°: {operationCount}</p>
</div>
<div className="divider"></div>
      </div>
      <div className="container-componente-stampa">
        <PrintComponent ref={printComponentRef} products={products} total={total} />
      </div>
          </div>
        </div>
        <div className="column-report">
          <h2>REPORT</h2>
          <div>
            <p>Prodotti venduti:</p>
            <ul>
              {soldProducts.reduce((accumulator, product) => {
                const existingProduct = accumulator.find(
                  (item) => item.name === product.name
                );
  
                if (existingProduct) {
                  existingProduct.quantity += product.quantity;
                } else {
                  accumulator.push({ ...product });
                }
  
                return accumulator;
              }, []).map((product, index) => (
                <li key={index}>
                  {product.name} - Quantità venduta: {product.quantity}
                </li>
              ))}
            </ul>
          </div>
          <p>Incasso totale: {soldProducts.reduce((total, product) => total + (parseFloat(product.price) * product.quantity), 0)}€</p>
          <button className="download-button" onClick={handleDownloadReport}>
  Scarica Report
</button> 
        </div>
      </header>
      <Footer />
    </div>
  );
};

export default App;