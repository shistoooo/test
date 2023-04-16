import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

function onOpenCvReady() {
  document.getElementById("status").innerHTML = "OpenCV.js is ready.";
  // Uncomment the next line to remove the "OpenCV.js is ready." status message
  // document.getElementById("status").style.display = "none";

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

window.onOpenCvReady = onOpenCvReady;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

