import * as Tooltip from '@radix-ui/react-tooltip'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import { typePolicies } from 'src/apollo/typePolicies'
import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import { AuthProvider, useAuth } from './auth'

import './index.css'

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <AuthProvider>
        <RedwoodApolloProvider
          useAuth={useAuth}
          graphQLClientConfig={{
            cacheConfig: {
              typePolicies,
            },
          }}
        >
          <Tooltip.Provider delayDuration={300}>
            <Routes />
          </Tooltip.Provider>
        </RedwoodApolloProvider>
      </AuthProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
