import React, { useEffect, useState } from 'react'; 
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import { getAllTransactions } from '../services/apiService';

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('timestamp');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getAllTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Errore durante il recupero delle transazioni:', error);
      }
    };

    fetchTransactions();
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortData = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Elenco delle Transazioni
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Transazione</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'timestamp'}
                    direction={orderBy === 'timestamp' ? order : 'asc'}
                    onClick={() => handleSort('timestamp')}
                  >
                    Data
                  </TableSortLabel>
                </TableCell>
                <TableCell>Prodotti</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'value_trans'}
                    direction={orderBy === 'value_trans' ? order : 'asc'}
                    onClick={() => handleSort('value_trans')}
                  >
                    Importo Totale (€)
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortData(
                transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
                getComparator(order, orderBy)
              ).map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.transactionId}</TableCell>
                  <TableCell>
                    {transaction.timestamp
                      ? new Date(transaction.timestamp).toLocaleString()
                      : 'Data non disponibile'}
                  </TableCell>
                  <TableCell>
                    {transaction.products && transaction.products.length > 0
                      ? transaction.products.map((product, i) => (
                          <Typography key={i} variant="body2">
                            {product.name} (Quantità: {product.quantitysold || 0})
                          </Typography>
                        ))
                      : 'Nessun prodotto'}
                  </TableCell>
                  <TableCell>
                    €{transaction.value_trans ? transaction.value_trans.toFixed(2) : '0.00'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 1000]}
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default TransactionTable;
