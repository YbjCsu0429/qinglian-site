@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo. > "%~dp0stop.flag"
taskkill /F /IM chrome.exe >nul 2>&1
taskkill /F /IM msedge.exe >nul 2>&1
echo.
echo 导览已停止。要恢复，请双击「启动导览.bat」。
timeout /t 3 >nul
exit
