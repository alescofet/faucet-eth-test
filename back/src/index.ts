import Web3 from 'web3';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
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
web3.setProvider(process.env.ETH_NODE_URL as string);

// Rutas básicas
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Ruta para solicitar ETH del faucet
app.post('/api/faucet/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const route = "../nodo/data/keystore/UTC--2025-04-10T22-35-24.522674685Z--84cea1efca4e43fba51534b14fa9660d635c7913"
    const jsonFile = fs.readFileSync(route, 'utf8');
    const wallet = await web3.eth.accounts.decrypt(jsonFile, process.env.FAUCET_PASSWORD as string);
    const tx = {
      from: wallet.address,
      to: address,
      value: web3.utils.toWei(process.env.FAUCET_AMOUNT as string, 'ether'),
      gas: 21000,
      gasPrice: web3.utils.toWei('10', 'gwei')
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, wallet.privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('Transacción enviada:', receipt.transactionHash);
    console.log(wallet)


    if (!address || !web3.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Dirección ETH inválida' });
    }

    // TODO: Implementar la lógica de transferencia de ETH
    // Esto se completará cuando tengamos el nodo ETH configurado
    console.log('Recibida peticion de faucet:', {
      success: true,
      message: 'Solicitud de ETH recibida',
      address
    });
    
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

app.get('/api/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address || !web3.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Dirección ETH inválida' });
    }
    
    const weiBalance = await web3.eth.getBalance(address);
    const balance = web3.utils.fromWei(weiBalance, 'ether');
    
    console.log('Recibida check de balance de cuenta:', {
      address,
      balance
    });
    
    res.status(200).json({
      success:true,
      address,
      balance
    });
  } catch (error) {
    console.error('Error en la solicitud de balance:', error);
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