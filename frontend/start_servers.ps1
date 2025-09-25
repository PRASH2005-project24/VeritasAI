#!/usr/bin/env pwsh
Write-Host "🚀 VeritasAI Server Startup Script" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Stop any existing Node processes
Write-Host "`n🛑 Stopping existing Node processes..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# Check directories
$backendDir = "C:\Users\Abhishek choure\Veritasai 2.5\backend"
$frontendDir = "C:\Users\Abhishek choure\Veritasai 2.5\frontend"

Write-Host "`n📁 Checking directories..." -ForegroundColor Blue
if (-not (Test-Path $backendDir)) {
    Write-Host "❌ Backend directory not found: $backendDir" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $frontendDir)) {
    Write-Host "❌ Frontend directory not found: $frontendDir" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Both directories found" -ForegroundColor Green

# Start Backend Server
Write-Host "`n🚀 Starting Backend Server..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList @(
    "-NoExit", 
    "-Command", 
    "cd '$backendDir'; Write-Host '🔥 BACKEND SERVER' -ForegroundColor Green; Write-Host 'Port: 3001' -ForegroundColor Cyan; Write-Host 'Keep this window open!' -ForegroundColor Red; Write-Host ''; node server.js"
) -WindowStyle Normal

Start-Sleep -Seconds 5

# Test backend
Write-Host "`n🧪 Testing backend connection..." -ForegroundColor Blue
$maxAttempts = 10
$attempt = 0
$backendReady = $false

while ($attempt -lt $maxAttempts -and -not $backendReady) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3001/health" -TimeoutSec 3
        Write-Host "✅ Backend is running: $($response.status)" -ForegroundColor Green
        $backendReady = $true
    } catch {
        $attempt++
        Write-Host "⏳ Waiting for backend... ($attempt/$maxAttempts)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $backendReady) {
    Write-Host "❌ Backend failed to start after $maxAttempts attempts" -ForegroundColor Red
    exit 1
}

# Start Frontend Server
Write-Host "`n🚀 Starting Frontend Server..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList @(
    "-NoExit", 
    "-Command", 
    "cd '$frontendDir'; Write-Host '🔥 FRONTEND SERVER' -ForegroundColor Green; Write-Host 'Port: 5173' -ForegroundColor Cyan; Write-Host 'Keep this window open!' -ForegroundColor Red; Write-Host ''; npm run dev"
) -WindowStyle Normal

Start-Sleep -Seconds 8

# Test frontend
Write-Host "`n🧪 Testing frontend connection..." -ForegroundColor Blue
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Frontend is running on port 5173" -ForegroundColor Green
} catch {
    try {
        $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5174" -UseBasicParsing -TimeoutSec 5
        Write-Host "✅ Frontend is running on port 5174" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Frontend may still be starting..." -ForegroundColor Yellow
    }
}

Write-Host "`n🎉 SERVERS STARTED!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host "📍 Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host "📍 Frontend: http://localhost:5173 (or 5174)" -ForegroundColor Cyan
Write-Host "📍 Health:   http://localhost:3001/health" -ForegroundColor Cyan
Write-Host "`n⚠️  Keep both PowerShell windows open!" -ForegroundColor Red
Write-Host "`nPress any key to exit this script..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")