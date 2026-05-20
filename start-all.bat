@echo off
chcp 65001 >nul
title Java I/O 闯关游戏 - 启动器

echo.
echo ╔══════════════════════════════════════════════╗
echo ║   🚀 Java I/O 闯关游戏 - 一键启动脚本      ║
echo ╚══════════════════════════════════════════════╝
echo.

set SCRIPT_DIR=%~dp0

echo [1/4] 检查 Node.js...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 未找到 Node.js，请先安装 Node.js！
    echo    下载地址: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do echo ✅ Node.js 版本: %%v

echo.
echo [2/4] 检查后端依赖...
if not exist "%SCRIPT_DIR%backend\node_modules\" (
    echo ⏳ 正在安装后端依赖...
    cd /d "%SCRIPT_DIR%backend"
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ 后端依赖安装失败！
        pause
        exit /b 1
    )
    echo ✅ 后端依赖安装完成
) else (
    echo ✅ 后端依赖已就绪
)

echo.
echo [3/4] 检查前端依赖...
if not exist "%SCRIPT_DIR%frontend\node_modules\" (
    echo ⏳ 正在安装前端依赖...
    cd /d "%SCRIPT_DIR%frontend"
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ 前端依赖安装失败！
        pause
        exit /b 1
    )
    echo ✅ 前端依赖安装完成
) else (
    echo ✅ 前端依赖已就绪
)

echo.
echo [4/4] 正在启动服务...

echo 🔥 启动后端服务 (端口 8080)...
start "Java I/O - 后端服务" cmd /c "cd /d "%SCRIPT_DIR%backend" && echo 🚀 Java I/O 后端服务启动中... && echo. && node server.js && pause"

echo 🎨 启动前端服务 (端口 5173)...
start "Java I/O - 前端服务" cmd /c "cd /d "%SCRIPT_DIR%frontend" && echo 🎨 Java I/O 前端服务启动中... && echo. && npx vite --host && pause"

echo.
echo ╔══════════════════════════════════════════════╗
echo ║  🎉 启动成功！                              ║
echo ║                                            ║
echo ║  前端地址: http://localhost:5173           ║
echo ║  后端地址: http://localhost:8080           ║
echo ║  AI 助手 : http://localhost:5173/ai-assistant║
echo ║                                            ║
echo ║  按任意键在浏览器中打开前端...              ║
echo ╚══════════════════════════════════════════════╝

timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo 按任意键关闭此窗口...
pause >nul
