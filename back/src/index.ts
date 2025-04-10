import Web3 from 'web3';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';

// Configuración de variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Web3 setup (se configurará más adelante con el nodo Docker)
const web3 = new Web3();

// Rutas básicas
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Ruta para solicitar ETH del faucet
app.post('/faucet', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address || !web3.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Dirección ETH inválida' });
    }

    // TODO: Implementar la lógica de transferencia de ETH
    // Esto se completará cuando tengamos el nodo ETH configurado
    
    res.json({
      success: true,
      message: 'Solicitud de ETH recibida',
      address
    });
  } catch (error) {
    console.error('Error en la solicitud del faucet:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Manejador de errores global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor backend ejecutándose en http://localhost:${port}`);
});