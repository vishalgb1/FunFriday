import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
 
// Apply persisted theme before first paint to prevent flash
const theme = localStorage.getItem('ffhub-theme') || 'light'
if (theme === 'dark') document.documentElement.classList.add('dark')
 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)