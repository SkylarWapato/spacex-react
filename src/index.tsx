import React from 'react'
import ReactDOM from 'react-dom'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client"
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { orange } from '@material-ui/core/colors'

import reportWebVitals from './reportWebVitals'
import './index.css'
import App from './App'
import { GRAPHQL_URL } from './libs/constants'
const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
    }
  }
})

const theme = createTheme({
  palette: {
    primary: {
      main: orange[500],
    },
  },
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
