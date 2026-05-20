@echo off
chcp 65001 >nul
title Java I/O - 前端服务

set SCRIPT_DIR=%~dp0

cd /d "%SCRIPT_DIR%frontend"

echo.
echo ╔══════════════════════════════════════╗
echo ║   🎨 Java I/O 前端服务             ║
echo ╚══════════════════════════════════════╝
echo.

if not exist "node_modules\" (
    echo ⏳ 安装依赖中...
    call npm install
)

echo 🎨 前端启动: http://localhost:5173
echo.
npx vite --host

pause
