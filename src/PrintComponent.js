import React from 'react';
import ReactToPrint from 'react-to-print';
import './App.css';
import logo from './logo.svg';
import { format } from 'date-fns';

class PrintComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPrinting: false,
      printCount: 0, // Aggiungi la variabile di stato printCount
    };
  }

  componentDidMount() {
    this.setState((prevState) => ({
      printCount: prevState.printCount + 1, // Incrementa il printCount quando il componente viene montato
    }));
  }

  handlePrintDirect = () => {
    this.setState({ isPrinting: true }, () => {
      window.print();
      this.setState({ isPrinting: false });
    });
  };

  render() {
    const { products, total } = this.props;
    const { isPrinting, printCount } = this.state;

    const currentDate = format(new Date(), 'dd/MM/yyyy');
    const currentTime = format(new Date(), 'HH:mm');

    return (
      <div className="print-container">
        <img src={logo} alt="Logo" className="print-logo" />
        <div className="divider-black"></div>
        <h1 className="print-header">Ricevuta</h1>
        <div className="divider-black"></div>
        <ul className="product-list">
          {products.map((product, index) => (
            <li key={index} className="product-item">
              <span className="product-name">{product.name}</span>
              <span className="product-price">
              
                {product.price}€ x {product.quantity}
              </span>
              <div className="divider-black"></div>
            </li>
          ))}
        </ul>
        <div className="divider-black"></div>
        <p className="total-label">Totale:</p>
        <p className="total-price">{total}€</p>
        <div className="infoprint">
        <div className="divider-black"></div>
          <p>Data: {currentDate}</p>
          <p>Ora: {currentTime}</p>
        </div>
      </div>
    );
  }
}

export default PrintComponent;
