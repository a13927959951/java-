# Java I/O 闯关游戏 - PowerShell 启动脚本
# 支持一键启动、停止、重启

param(
    [ValidateSet("start", "stop", "restart")]
    [string]$Action = "start"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

$FrontendDir = Join-Path $ScriptDir "frontend"
$BackendDir = Join-Path $ScriptDir "backend"
$FrontendPort = 5173
$BackendPort = 8080

function Write-Banner {
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║   🚀 Java I/O 闯关游戏 - 服务管理脚本      ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Kill-PortProcess {
    param([int]$Port)
    $conn = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($conn) {
        $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
        if ($proc) {
            Stop-Process -Id $conn.OwningProcess -Force
            Write-Host "✅ 已终止端口 $Port 上的进程 ($($proc.ProcessName):$($conn.OwningProcess))" -ForegroundColor Green
            Start-Sleep -Milliseconds 500
        }
    }
}

function Stop-Services {
    Write-Host "[1/2] 停止已有服务..." -ForegroundColor Yellow
    Kill-PortProcess -Port $FrontendPort
    Kill-PortProcess -Port $BackendPort
    Write-Host ""
}

function Install-Deps {
    param([string]$Dir, [string]$Name)
    
    if (-not (Test-Path (Join-Path $Dir "node_modules"))) {
        Write-Host "⏳ 安装 $Name 依赖..." -ForegroundColor Yellow
        Push-Location $Dir
        npm install
        Pop-Location
        Write-Host "✅ $Name 依赖安装完成" -ForegroundColor Green
    } else {
        Write-Host "✅ $Name 依赖已就绪" -ForegroundColor Green
    }
}

function Start-Services {
    Write-Banner

    Write-Host "[1/5] 检查 Node.js..." -ForegroundColor Cyan
    try {
        $nodeVersion = node -v
        Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ 未找到 Node.js！请访问 https://nodejs.org/ 安装" -ForegroundColor Red
        exit 1
    }
    Write-Host ""

    Write-Host "[2/5] 检查依赖..." -ForegroundColor Cyan
    Install-Deps -Dir $BackendDir -Name "后端"
    Install-Deps -Dir $FrontendDir -Name "前端"
    Write-Host ""

    Write-Host "[3/5] 启动后端服务..." -ForegroundColor Cyan
    $backendJob = Start-Process -FilePath "node" `
        -ArgumentList "server.js" `
        -WorkingDirectory $BackendDir `
        -WindowStyle Minimized `
        -PassThru
    Write-Host "✅ 后端服务 PID: $($backendJob.Id), 端口: $BackendPort" -ForegroundColor Green
    Write-Host ""

    Write-Host "[4/5] 启动前端服务..." -ForegroundColor Cyan
    $frontendJob = Start-Process -FilePath "npx" `
        -ArgumentList "vite","--host" `
        -WorkingDirectory $FrontendDir `
        -WindowStyle Minimized `
        -PassThru
    Write-Host "✅ 前端服务 PID: $($frontendJob.Id), 端口: $FrontendPort" -ForegroundColor Green
    Write-Host ""

    Start-Sleep -Seconds 3

    Write-Host "[5/5] 验证服务..." -ForegroundColor Cyan
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:$BackendPort/api/health" -TimeoutSec 5
        Write-Host "✅ 后端健康检查: $($health.status)" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  后端健康检查失败，请等待几秒后重试" -ForegroundColor Yellow
    }
    Write-Host ""

    Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║  🎉 启动成功！                              ║" -ForegroundColor Green
    Write-Host "║                                            ║" -ForegroundColor Green
    Write-Host "║  前端: http://localhost:$FrontendPort                  ║" -ForegroundColor Green
    Write-Host "║  后端: http://localhost:$BackendPort                  ║" -ForegroundColor Green
    Write-Host "║  AI:   http://localhost:$FrontendPort/ai-assistant     ║" -ForegroundColor Green
    Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""

    Start-Process "http://localhost:$FrontendPort"

    Write-Host "💡 使用方式:" -ForegroundColor White
    Write-Host "   .\start-all.ps1 stop     - 停止所有服务" -ForegroundColor Gray
    Write-Host "   .\start-all.ps1 restart  - 重启所有服务" -ForegroundColor Gray
    Write-Host ""
    Write-Host "按 Ctrl+C 可关闭所有服务..." -ForegroundColor Yellow
}

switch ($Action) {
    "stop" {
        Write-Banner
        Stop-Services
        Write-Host "✅ 所有服务已停止" -ForegroundColor Green
    }
    "restart" {
        Write-Banner
        Stop-Services
        Start-Services
    }
    default {
        Stop-Services
        Start-Services
    }
}
