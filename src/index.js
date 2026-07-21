import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return <h1>Five by Five!</h1>;
}

const root = createRoot(document.getElementById('react-root'));
root.render(<App />);