import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Pagina from './cassa-bar';

const Routes = () => {
  return (
    <Switch>
      {/* Altre rotte della tua app */}
      <Route path="/cassa-bar" component={Pagina} />
    </Switch>
  );
};

export default Routes;