@echo off
chcp 65001 >nul
title Java I/O - 后端服务

set SCRIPT_DIR=%~dp0

cd /d "%SCRIPT_DIR%backend"

echo.
echo ╔══════════════════════════════════════╗
echo ║   🚀 Java I/O 后端服务             ║
echo ╚══════════════════════════════════════╝
echo.

if not exist "node_modules\" (
    echo ⏳ 安装依赖中...
    call npm install
)

echo 🔥 后端启动: http://localhost:8080
echo.
node server.js

pause
