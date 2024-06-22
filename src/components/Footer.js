import logo from '../logo.svg';

export const Footer = () => (
    <footer className="footer">
      <div className="footer-left">
        <span className="footer-text">Copyright by Emersa 2024</span>
        <span className="footer-text">Prodotto da Giuseppe Marzullo</span>
      </div>
      <div className="divider"></div>
      <div className="footer-right">
        <img src={logo} className="footer-logo" alt="logo" />
      </div>
    </footer>
  );