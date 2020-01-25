import React, { Suspense, lazy, memo } from 'react';
import { Switch, Route } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import GlobalStyles from '../../styles/global-styles';

const InstructorCertificateExplorer = lazy(() =>
  import('../InstructorCertificateExplorer'),
);
const RiggerCertificateExplorer = lazy(() =>
  import('../RiggerCertificateExplorer'),
);

const App: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route
          path={'/instructor-certificate-explorer'}
          component={InstructorCertificateExplorer}
        />
        <Route
          path={'/rigger-certificate-explorer'}
          component={RiggerCertificateExplorer}
        />
      </Switch>
      <GlobalStyles />
    </Suspense>
  );
};

export default memo(App);