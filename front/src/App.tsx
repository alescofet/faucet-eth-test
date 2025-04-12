import { Link, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

import Balance from './components/Balance';
import Faucet from './components/Faucet';
import Home from './components/Home';
import { Toaster } from 'sonner';
import Transfer from './components/Transfer';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/faucet", element: <Faucet /> },
      { path: "/transfer", element: <Transfer /> },
      { path: "/balance", element: <Balance /> },
    ],
  },
]);

// Root component with the layout
function Root() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="p-4 bg-primary">
        <div className="container flex gap-4 mx-auto">
          <Link to="/" className="text-white hover:text-gray-200">
            Inicio
          </Link>
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
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="bottom-center" />
    </>
  );
}

export default App;
