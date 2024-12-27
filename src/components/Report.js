import React from 'react';

const Report = ({ soldProducts }) => (
  <div className="column-report">
    <h2>REPORT</h2>
    <ul>
      {soldProducts.map((product, index) => (
        <li key={index}>
          {product.name} - Quantità venduta: {product.quantity}
        </li>
      ))}
    </ul>
  </div>
);

export default Report