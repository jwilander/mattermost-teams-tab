// https://fluentsite.z22.web.core.windows.net/quick-start
import {
  FluentProvider,
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  Spinner,
} from '@fluentui/react-components';
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { useTeamsUserCredential } from '@microsoft/teamsfx-react';

import Privacy from './Privacy';
import TermsOfUse from './TermsOfUse';
import Tab from './Tab';
import Config from './Config';
import Setup from './Setup';
import { TeamsFxContext } from './Context';
import config from './lib/config';

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  const { loading, theme, themeString, teamsUserCredential } = useTeamsUserCredential({
    initiateLoginEndpoint: config.initiateLoginEndpoint!,
    clientId: config.clientId!,
  });

  return (
    <TeamsFxContext.Provider value={{ theme, themeString, teamsUserCredential }}>
      <FluentProvider
        theme={
          themeString === 'dark' ? teamsDarkTheme : themeString === 'contrast' ? teamsHighContrastTheme : {
            ...teamsLightTheme,
            colorNeutralBackground3: '#eeeeee',
          }
        }
        style={{ height: '100%' }}
      >
        <Router>
          {loading ? (
            <Spinner style={{ margin: 100 }} />
          ) : (
            <Routes>
              <Route
                path='/privacy'
                element={<Privacy />}
              />
              <Route
                path='/termsofuse'
                element={<TermsOfUse />}
              />
              <Route
                path='/tab'
                element={<Tab />}
              />
              <Route
                path='/config'
                element={<Config />}
              />
              <Route
                path='/setup'
                element={<Setup />}
              />
              <Route
                path='*'
                element={<Navigate to={'/setup'} />}
              />
            </Routes>
          )}
        </Router>
      </FluentProvider>
    </TeamsFxContext.Provider>
  );
}