import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Balance from './components/Balance';
import Faucet from './components/Faucet';
import Transfer from './components/Transfer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <nav className="bg-primary p-4">
          <div className="container mx-auto flex gap-4">
            <Link to="/faucet" className="text-white hover:text-gray-200">
              Faucet
            </Link>
            <Link to="/transfer" className="text-white hover:text-gray-200">
              Transfer
            </Link>
            <Link to="/balance" className="text-white hover:text-gray-200">
              Balance
            </Link>
          </div>
        </nav>

        <main className="container mx-auto mt-8">
          <Routes>
            <Route path="/faucet" element={<Faucet />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/" element={<Faucet />} />
            <Route path="/balance" element={<Balance />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
