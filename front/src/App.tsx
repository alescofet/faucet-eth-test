import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Balance from './components/Balance';
import Faucet from './components/Faucet';
import { Toaster } from 'sonner';
import Transfer from './components/Transfer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <nav className="p-4 bg-primary">
          <div className="container flex gap-4 mx-auto">
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
      <Toaster richColors position="bottom-center" />
    </Router>
  );
}

export default App;
