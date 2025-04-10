# Script PowerShell para configurar un nodo Ethereum privado en Windows 10
# Guardar como start-eth-node.ps1

# Definir variables
$CONTAINER_NAME = "nodo_eth"
$NETWORK_ID = "15"
$HTTP_PORT = "5556"
$IMAGE = "ethereum/client-go:v1.13.15"
$BALANCE = "300000000000000000000000000000000"
$CURRENT_DIR = Get-Location

# Crear directorios si no existen
if (-not (Test-Path -Path "data")) {
    New-Item -ItemType Directory -Path "data" | Out-Null
    Write-Host "Directorio data creado."
}

# Verificar si pwd.txt existe
if (-not (Test-Path -Path "pwd.txt")) {
    Write-Host "Creando archivo pwd.txt. Por favor edita este archivo con tu contraseña."
    "password" | Out-File -FilePath "pwd.txt" -Encoding ascii
}

# Verificar si existe una cuenta, si no, crear una
if (-not (Test-Path -Path "data\keystore")) {
    Write-Host "Creando nueva cuenta Ethereum..."
    docker run -v "${CURRENT_DIR}\data:/data" -v "${CURRENT_DIR}\pwd.txt:/pwd.txt" $IMAGE account new --datadir /data --password /pwd.txt
    
    # Obtener la dirección de la cuenta creada
    if (Test-Path -Path "data\keystore") {
        $KEYSTORE_FILE = Get-ChildItem -Path "data\keystore" | Select-Object -First 1
        if ($KEYSTORE_FILE) {
            $KEYSTORE_CONTENT = Get-Content -Path "data\keystore\$($KEYSTORE_FILE.Name)" -Raw | ConvertFrom-Json
            $ACCOUNT = $KEYSTORE_CONTENT.address
            if ($ACCOUNT) {
                Write-Host "Nueva cuenta creada: $ACCOUNT"
            } else {
                Write-Host "No se pudo extraer la dirección de la cuenta. Usando valor por defecto."
                $ACCOUNT = "32aAD9eaD5e3EA9d7448D413DF70a6F949688895"
            }
        } else {
            Write-Host "No se encontró el archivo keystore. Usando valor por defecto."
            $ACCOUNT = "32aAD9eaD5e3EA9d7448D413DF70a6F949688895"
        }
    } else {
        Write-Host "No se pudo crear la cuenta. Usando valor por defecto."
        $ACCOUNT = "32aAD9eaD5e3EA9d7448D413DF70a6F949688895"
    }
} else {
    # Si ya existe una cuenta, intentar obtenerla
    $KEYSTORE_FILE = Get-ChildItem -Path "data\keystore" | Select-Object -First 1
    if ($KEYSTORE_FILE) {
        $KEYSTORE_CONTENT = Get-Content -Path "data\keystore\$($KEYSTORE_FILE.Name)" -Raw | ConvertFrom-Json
        $ACCOUNT = $KEYSTORE_CONTENT.address
        if ($ACCOUNT) {
            Write-Host "Usando cuenta existente: $ACCOUNT"
        } else {
            Write-Host "No se pudo extraer la dirección de la cuenta existente. Usando valor por defecto."
            $ACCOUNT = "32aAD9eaD5e3EA9d7448D413DF70a6F949688895"
        }
    } else {
        Write-Host "No se encontró el archivo keystore. Usando valor por defecto."
        $ACCOUNT = "32aAD9eaD5e3EA9d7448D413DF70a6F949688895"
    }
}

# Construir el extradata para Clique PoA
$EXTRADATA = "0x0000000000000000000000000000000000000000000000000000000000000000${ACCOUNT}0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"

# Verificar si genesis.json existe, si no, crearlo con la cuenta detectada
if (-not (Test-Path -Path "genesis.json")) {
    Write-Host "Creando archivo genesis.json con la cuenta $ACCOUNT"
    @"
{
  "config": {
    "chainId": 15,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "clique": {
      "period": 30,
      "epoch": 30000
    }
  },
  "difficulty": "1",
  "gasLimit": "8000000",
  "extradata": "${EXTRADATA}",
  "alloc": {
    "0x${ACCOUNT}": {
      "balance": "${BALANCE}"
    },
    "0x19a9C9bD99Be0b3E018DCC25dc6D925255A532B7": {
      "balance": "${BALANCE}"
    }
  }
}
"@ | Out-File -FilePath "genesis.json" -Encoding ascii
} else {
    # Si el blockchain no está inicializado y genesis.json ya existe, actualizarlo con la nueva cuenta
    if (-not (Test-Path -Path "data\geth")) {
        Write-Host "Actualizando genesis.json con la cuenta $ACCOUNT"
        $GENESIS_CONTENT = Get-Content -Path "genesis.json" -Raw | ConvertFrom-Json
        $GENESIS_CONTENT.extradata = $EXTRADATA
        $GENESIS_CONTENT.alloc | Add-Member -Name "0x${ACCOUNT}" -Value @{"balance" = $BALANCE} -MemberType NoteProperty -Force
        $GENESIS_CONTENT | ConvertTo-Json -Depth 10 | Out-File -FilePath "genesis.json" -Encoding ascii
    }
}

# Detener y eliminar el contenedor si ya existe
$CONTAINER_EXISTS = docker ps -a --format "{{.Names}}" | Select-String -Pattern "^${CONTAINER_NAME}$"
if ($CONTAINER_EXISTS) {
    Write-Host "Deteniendo y eliminando el contenedor existente..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
}

# Inicializar el blockchain si no está inicializado
if (-not (Test-Path -Path "data\geth")) {
    Write-Host "Inicializando blockchain con genesis.json..."
    docker run -v "${CURRENT_DIR}\genesis.json:/genesis.json" -v "${CURRENT_DIR}\data:/data" $IMAGE init --datadir /data /genesis.json
}

# Iniciar el nodo Ethereum
Write-Host "Iniciando nodo Ethereum..."
docker run -v "${CURRENT_DIR}\pwd.txt:/pwd.txt" -v "${CURRENT_DIR}\data:/data" -p "${HTTP_PORT}:8545" --name $CONTAINER_NAME -d `
    $IMAGE --datadir /data --networkid $NETWORK_ID --unlock "0x${ACCOUNT}" --mine `
    --miner.etherbase "0x${ACCOUNT}" --password /pwd.txt --nodiscover --http `
    --http.addr "0.0.0.0" --http.api "admin,eth,debug,miner,net,txpool,personal,web3" `
    --http.corsdomain "*" --allow-insecure-unlock

Write-Host "Nodo Ethereum iniciado. Expuesto en http://localhost:$HTTP_PORT"
Write-Host "Usando cuenta: 0x$ACCOUNT"
Write-Host "Para ver los logs: docker logs $CONTAINER_NAME"
Write-Host "Para detener: docker stop $CONTAINER_NAME"