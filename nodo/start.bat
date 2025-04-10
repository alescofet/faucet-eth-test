@echo off
echo Iniciando nodo Ethereum privado...
powershell -ExecutionPolicy Bypass -File "%~dp0start-eth-node.ps1"
echo Script finalizado.