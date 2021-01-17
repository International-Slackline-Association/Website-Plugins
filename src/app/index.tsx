import * as React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { GlobalStyles } from '../styles/global-styles';

import { CertificatesHomePage } from './pages/CertificatesHomepage/Loadable';
import { EquipmentWarnings } from './pages/EquipmentWarnings/Loadable';
import { GearCertificate } from './pages/GearCertificate/Loadable';
import { InstructorCertificate } from './pages/InstructorCertificate/Loadable';
import { RiggerCertificate } from './pages/RiggerCertificate/Loadable';

export function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={'/certificates'} component={CertificatesHomePage} />
        <Route
          path={'/instructor-certificate-explorer'}
          component={InstructorCertificate}
        />
        <Route
          path={'/rigger-certificate-explorer'}
          component={RiggerCertificate}
        />
        <Route
          path={'/gear-certificate-explorer'}
          component={GearCertificate}
        />
        <Route
          path={'/equipment-warnings-explorer'}
          component={EquipmentWarnings}
        />
      </Switch>
      <GlobalStyles />
    </BrowserRouter>
  );
}
