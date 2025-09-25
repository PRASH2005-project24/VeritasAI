# VeritasAI Deployment Script
# Automates the deployment of both frontend and backend

param(
    [switch]$Frontend,
    [switch]$Backend,
    [switch]$All,
    [string]$BackendService = "vercel"  # vercel, render, or railway
)

Write-Host "🚀 VeritasAI Deployment Script" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""

# Function to check if command exists
function Test-Command($command) {
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

# Function to install required tools
function Install-DeploymentTools {
    Write-Host "🔧 Checking deployment tools..." -ForegroundColor Yellow
    
    # Check for npm
    if (-not (Test-Command "npm")) {
        Write-Host "❌ npm not found. Please install Node.js first." -ForegroundColor Red
        exit 1
    }
    
    # Check for git
    if (-not (Test-Command "git")) {
        Write-Host "❌ git not found. Please install Git first." -ForegroundColor Red
        exit 1
    }
    
    # Install Vercel CLI if needed
    if ($BackendService -eq "vercel" -and -not (Test-Command "vercel")) {
        Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
        npm install -g vercel
    }
    
    Write-Host "✅ All tools ready!" -ForegroundColor Green
}

# Function to deploy frontend
function Deploy-Frontend {
    Write-Host "🎨 Deploying Frontend to GitHub Pages..." -ForegroundColor Cyan
    
    # Check if frontend build works locally
    Write-Host "Building frontend locally to check for errors..." -ForegroundColor Yellow
    Push-Location frontend
    
    try {
        npm install
        npm run build
        Write-Host "✅ Frontend build successful!" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Frontend build failed: $($_.Exception.Message)" -ForegroundColor Red
        Pop-Location
        return $false
    }
    finally {
        Pop-Location
    }
    
    # Push to GitHub to trigger deployment
    Write-Host "Pushing to GitHub to trigger deployment..." -ForegroundColor Yellow
    git add .
    git commit -m "🚀 Deploy frontend to GitHub Pages" -ErrorAction SilentlyContinue
    git push origin main
    
    Write-Host "✅ Frontend deployment initiated!" -ForegroundColor Green
    Write-Host "🌐 Your frontend will be available at:" -ForegroundColor Green
    Write-Host "   https://prash2005-project24.github.io/VeritasAI/" -ForegroundColor Cyan
    Write-Host "📊 Check deployment status at:" -ForegroundColor Green
    Write-Host "   https://github.com/PRASH2005-project24/VeritasAI/actions" -ForegroundColor Cyan
    
    return $true
}

# Function to deploy backend to Vercel
function Deploy-Backend-Vercel {
    Write-Host "🔧 Deploying Backend to Vercel..." -ForegroundColor Cyan
    
    Push-Location backend
    
    try {
        # Login to Vercel (will prompt if not logged in)
        Write-Host "Checking Vercel authentication..." -ForegroundColor Yellow
        vercel whoami 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Please login to Vercel..." -ForegroundColor Yellow
            vercel login
        }
        
        # Deploy to Vercel
        Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
        $deployment = vercel --prod --confirm
        
        Write-Host "✅ Backend deployed successfully!" -ForegroundColor Green
        Write-Host "🔧 Backend URL: $deployment" -ForegroundColor Cyan
        
        # Update frontend configuration with new backend URL
        $backendUrl = ($deployment -split "`n")[-1].Trim()
        Update-FrontendConfig -BackendUrl $backendUrl
        
        return $true
    }
    catch {
        Write-Host "❌ Backend deployment failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    finally {
        Pop-Location
    }
}

# Function to update frontend configuration with backend URL
function Update-FrontendConfig {
    param([string]$BackendUrl)
    
    Write-Host "🔄 Updating frontend configuration..." -ForegroundColor Yellow
    
    $configPath = "frontend/src/config/api.js"
    if (Test-Path $configPath) {
        $content = Get-Content $configPath -Raw
        $content = $content -replace 'https://veritasai-backend\.onrender\.com', $BackendUrl
        Set-Content $configPath $content
        
        Write-Host "✅ Frontend configuration updated with backend URL: $BackendUrl" -ForegroundColor Green
    }
}

# Function to show deployment status
function Show-DeploymentStatus {
    Write-Host ""
    Write-Host "📊 Deployment Status Summary" -ForegroundColor White
    Write-Host "============================" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Frontend (GitHub Pages):" -ForegroundColor Green
    Write-Host "   URL: https://prash2005-project24.github.io/VeritasAI/" -ForegroundColor Cyan
    Write-Host "   Status: Check GitHub Actions" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 Backend:" -ForegroundColor Green
    Write-Host "   Service: $BackendService" -ForegroundColor Cyan
    Write-Host "   Status: Check deployment logs above" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🎉 Next Steps:" -ForegroundColor Magenta
    Write-Host "1. Wait for GitHub Actions to complete (2-3 minutes)" -ForegroundColor White
    Write-Host "2. Test your live application" -ForegroundColor White
    Write-Host "3. Share your public URL!" -ForegroundColor White
}

# Main deployment logic
try {
    Install-DeploymentTools
    
    if ($All -or $Frontend) {
        if (-not (Deploy-Frontend)) {
            Write-Host "❌ Frontend deployment failed" -ForegroundColor Red
            exit 1
        }
    }
    
    if ($All -or $Backend) {
        if ($BackendService -eq "vercel") {
            if (-not (Deploy-Backend-Vercel)) {
                Write-Host "❌ Backend deployment failed" -ForegroundColor Red
                exit 1
            }
        }
        else {
            Write-Host "🔧 Backend service '$BackendService' configuration ready" -ForegroundColor Yellow
            Write-Host "Please follow manual deployment steps in DEPLOYMENT.md" -ForegroundColor Yellow
        }
    }
    
    Show-DeploymentStatus
    
    Write-Host ""
    Write-Host "🎊 Deployment process completed!" -ForegroundColor Green
    Write-Host "Visit your live application and share it with the world!" -ForegroundColor Green
}
catch {
    Write-Host "💥 Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}