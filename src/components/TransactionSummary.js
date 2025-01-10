import React, { useContext } from 'react';
import { Grid, Typography, Button, Container } from '@mui/material';
import { AppContext } from '../context/AppContext';
import { saveTransaction, getProducts, getAllRawMaterials, updateProduct, updateRawMaterial } from '../services/apiService';

const TransactionSummary = ({ onSave }) => {
  const {
    selectedProducts,
    total,
    receivedTotal,
    change,
    receivedNotes,
    setSelectedProducts,
    setReceivedNotes,
  } = useContext(AppContext);

  const generateTempId = () => {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
  };

  const tempTransactionId = generateTempId();

  const handleSave = async () => {
    if (selectedProducts.length === 0 || receivedNotes.length === 0) {
      alert('Impossibile salvare: aggiungi almeno un prodotto e una banconota.');
      return;
    }

    try {
      // Ottieni tutti i prodotti e le materie prime per gli indici
      const products = await getProducts();
      const rawMaterials = await getAllRawMaterials();

      for (const product of selectedProducts) {
        // Trova l'indice del prodotto
        const productIndex = products.findIndex((p) => p.id === product.id);
        if (productIndex === -1) {
          alert(`Prodotto ${product.name} non trovato.`);
          return;
        }

        // Calcola il nuovo stock del prodotto
        const updatedProduct = {
          ...products[productIndex],
          stock: products[productIndex].stock - product.quantity,
        };

        if (updatedProduct.stock < 0) {
          alert(`Stock insufficiente per il prodotto ${product.name}.`);
          return;
        }

        // Aggiorna il prodotto nel database
        await updateProduct(productIndex, updatedProduct);

        // Aggiorna lo stock delle materie prime
        for (const material of product.rawMaterials) {
          const rawMaterialIndex = rawMaterials.findIndex((rm) => rm.id === material.rawMaterialId);
          if (rawMaterialIndex === -1) {
            alert(`Materia prima ${material.rawMaterialName} non trovata.`);
            return;
          }

          const updatedRawMaterial = {
            ...rawMaterials[rawMaterialIndex],
            stock: rawMaterials[rawMaterialIndex].stock - material.quantity * product.quantity,
          };

          if (updatedRawMaterial.stock < 0) {
            alert(`Stock insufficiente per la materia prima ${material.rawMaterialName}.`);
            return;
          }

          await updateRawMaterial(rawMaterialIndex, updatedRawMaterial);
        }
      }

      // Salva la transazione
      const transaction = {
        transactionId: tempTransactionId,
        products: selectedProducts.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          quantitySold: product.quantity,
          stock: product.stock,
          rawMaterials: product.rawMaterials,
        })),
        moneyNotes: receivedNotes,
        timestamp: new Date().toISOString(),
        value_trans: total,
      };

      await saveTransaction(transaction);

      alert('Transazione salvata con successo!');
      handleReset();
      onSave();
    } catch (error) {
      console.error('Errore durante il salvataggio della transazione:', error.response || error);
      alert('Errore durante il salvataggio della transazione.');
    }
  };

  const handleReset = () => {
    setSelectedProducts([]);
    setReceivedNotes([]);
  };

  return (
    <Container maxWidth="tm">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Riepilogo Transazione
          </Typography>
        </Grid>

        <Grid item xs={12}>
          {selectedProducts.length > 0 ? (
            selectedProducts.map((product, index) => (
              <Typography key={index}>
                {product.name} - {product.quantity} x €{product.price.toFixed(2)}
              </Typography>
            ))
          ) : (
            <Typography color="textSecondary">Nessun prodotto selezionato.</Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Totale da Pagare: €{total.toFixed(2)}</Typography>
          <Typography variant="h6">Totale Ricevuto: €{receivedTotal.toFixed(2)}</Typography>
          <Typography variant="h6">Resto: €{change.toFixed(2)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Button variant="contained" color="primary" fullWidth onClick={handleSave}>
            Salva
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="outlined" color="secondary" fullWidth onClick={handleReset}>
            Resetta
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TransactionSummary;
