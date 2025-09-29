# VeritasAI Quick Start Script
# Last Updated: 2025-09-25 23:14:59 UTC

Write-Host "🚀 Starting VeritasAI Application..." -ForegroundColor Green

# Set paths
$BackendPath = "C:\Users\Abhishek choure\Veritasai 2.5\backend"
$FrontendPath = "C:\Users\Abhishek choure\Veritasai 2.5\frontend"

# Function to check if port is in use
function Test-Port($Port) {
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

Write-Host "📊 Checking current status..." -ForegroundColor Yellow

# Check if Node.js processes are running
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "⚠️  Found existing Node.js processes. You may need to stop them first." -ForegroundColor Yellow
    $nodeProcesses | Format-Table Name, Id, CPU
}

# Check ports
if (Test-Port 3001) {
    Write-Host "✅ Backend port 3001 is active" -ForegroundColor Green
} else {
    Write-Host "❌ Backend port 3001 is not active" -ForegroundColor Red
}

if (Test-Port 5173) {
    Write-Host "✅ Frontend port 5173 is active" -ForegroundColor Green
} elseif (Test-Port 5174) {
    Write-Host "✅ Frontend port 5174 is active" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend ports 5173/5174 are not active" -ForegroundColor Red
}

Write-Host "`n🔧 Starting servers..." -ForegroundColor Cyan

# Start Backend in new window
Write-Host "Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BackendPath'; Write-Host '🚀 Starting VeritasAI Backend...' -ForegroundColor Green; npm start"

# Wait a moment for backend to start
Start-Sleep 3

# Start Frontend in new window  
Write-Host "Starting frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FrontendPath'; Write-Host '🎨 Starting VeritasAI Frontend...' -ForegroundColor Blue; npm run dev"

Write-Host "`n✨ Application startup initiated!" -ForegroundColor Green
Write-Host "📝 Check the two new PowerShell windows that opened"
Write-Host "🌐 Frontend will be available at: http://localhost:5173 or http://localhost:5174"
Write-Host "🔗 Backend API available at: http://localhost:3001"
Write-Host "❤️  Health check: http://localhost:3001/health"

Write-Host "`n⏱️  Waiting 5 seconds for services to start..." -ForegroundColor Yellow
Start-Sleep 5

# Test connections
Write-Host "`n🔍 Testing connections..." -ForegroundColor Cyan
try {
    $healthCheck = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 10
    if ($healthCheck.StatusCode -eq 200) {
        Write-Host "✅ Backend is responding!" -ForegroundColor Green
        $healthData = $healthCheck.Content | ConvertFrom-Json
        Write-Host "   📊 Certificates: $($healthData.certificatesCount)" -ForegroundColor White
        Write-Host "   👥 Users: $($healthData.usersCount)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Backend health check failed. It may still be starting..." -ForegroundColor Red
}

Write-Host "`n🎉 Startup complete!" -ForegroundColor Green
Write-Host "📋 See PROJECT_STATUS.md for detailed information and troubleshooting"
Write-Host "🛑 To stop servers: Close the PowerShell windows or press Ctrl+C in each"

# Open browser (optional)
$openBrowser = Read-Host "`n🌐 Open browser to application? (y/n)"
if ($openBrowser -eq 'y' -or $openBrowser -eq 'Y') {
    Start-Process "http://localhost:5173"
}

Write-Host "`n✅ All done! Happy developing! 🚀" -ForegroundColor Green