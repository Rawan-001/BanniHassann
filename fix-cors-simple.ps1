# Firebase CORS Fix Script
Write-Host "🔧 Starting CORS Fix..." -ForegroundColor Yellow

# Check files
if (!(Test-Path "cors-fix.json")) {
    Write-Host "❌ cors-fix.json file not found!" -ForegroundColor Red
    exit 1
}

# Check login
Write-Host "🔐 Checking login..." -ForegroundColor Yellow
$account = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
if (!$account) {
    Write-Host "Logging into Google Cloud..." -ForegroundColor Cyan
    gcloud auth login
}

# Set project
Write-Host "🎯 Setting project..." -ForegroundColor Yellow
gcloud config set project bannihassan-e4c61

# Apply CORS
Write-Host "🌐 Applying CORS settings..." -ForegroundColor Yellow
gsutil cors set cors-fix.json gs://bannihassan-e4c61.firebasestorage.app

# Check result
Write-Host "🔍 Checking CORS settings..." -ForegroundColor Yellow
gsutil cors get gs://bannihassan-e4c61.firebasestorage.app

Write-Host ""
Write-Host "🎉 CORS Fixed Successfully!" -ForegroundColor Green
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Wait 5 minutes" -ForegroundColor White
Write-Host "   2. Clear browser cache" -ForegroundColor White  
Write-Host "   3. Test uploading from your app" -ForegroundColor White 