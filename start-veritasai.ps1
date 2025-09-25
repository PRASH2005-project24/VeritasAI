param(
    [switch]$ShowWindows = $false
)

Write-Host "🚀 Starting VeritasAI Application..." -ForegroundColor Green
Write-Host ""

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Kill any existing node processes
Write-Host "🛑 Stopping any existing servers..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Start Backend Server
Write-Host "🔧 Starting Backend Server..." -ForegroundColor Cyan
$backendPath = Join-Path $scriptDir "backend"
if ($ShowWindows) {
    $backendProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory $backendPath -PassThru
} else {
    $backendProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory $backendPath -WindowStyle Hidden -PassThru
}

Write-Host "   Backend PID: $($backendProcess.Id)" -ForegroundColor Gray

# Wait for backend to start
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if backend is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend server is running on http://localhost:3001" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Backend server failed to start or is not responding" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Start Frontend Server
Write-Host ""
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Cyan
$frontendPath = Join-Path $scriptDir "frontend"
if ($ShowWindows) {
    $frontendProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory $frontendPath -PassThru
} else {
    $frontendProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory $frontendPath -WindowStyle Hidden -PassThru
}

Write-Host "   Frontend PID: $($frontendProcess.Id)" -ForegroundColor Gray

# Wait for frontend to start
Write-Host "⏳ Waiting for frontend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Check if frontend is running (check for listening port)
$frontendRunning = $false
for ($i = 0; $i -lt 10; $i++) {
    $port5173 = netstat -ano | Select-String ":5173.*LISTENING"
    $port5174 = netstat -ano | Select-String ":5174.*LISTENING"
    
    if ($port5173 -or $port5174) {
        $port = if ($port5173) { "5173" } else { "5174" }
        Write-Host "✅ Frontend server is running on http://localhost:$port" -ForegroundColor Green
        $frontendRunning = $true
        break
    }
    Start-Sleep -Seconds 1
}

if (-not $frontendRunning) {
    Write-Host "❌ Frontend server may not be running or took too long to start" -ForegroundColor Red
}

# Display summary
Write-Host ""
Write-Host "📋 Server Status Summary:" -ForegroundColor White
Write-Host "   🔧 Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host "   🎨 Frontend: http://localhost:5173 (or 5174)" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 VeritasAI is ready to use!" -ForegroundColor Green
Write-Host ""
Write-Host "To stop the servers, run: Get-Process -Name node | Stop-Process -Force" -ForegroundColor Yellow