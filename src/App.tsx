import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SelectionPage from './SelectionPage';
import Safety from './Safety';
import LabourHire from './LabourHire';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SelectionPage />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/labour-hire" element={<LabourHire />} />
      </Routes>
    </Router>
  );
}

export default App;
