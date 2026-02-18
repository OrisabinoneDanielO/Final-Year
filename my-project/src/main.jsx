import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AssignmentsProvider } from './context/AssignmentsContext.jsx'
import { Provider } from 'react-redux'
import store from './store/store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AssignmentsProvider>
        <App />
      </AssignmentsProvider>
    </Provider>
  </StrictMode>,
)
