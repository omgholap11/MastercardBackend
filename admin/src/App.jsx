import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Dashboard, History, MatchedDonations, Requests } from './pages';
import NotFound from './pages/NotFound';
import DebugTest from './pages/DebugTest';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/matched" element={<MatchedDonations />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/debug" element={<DebugTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
