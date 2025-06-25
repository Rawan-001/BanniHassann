
param(
    [switch]$DeployRules,
    [switch]$CheckStatus,
    [switch]$TestUpload,
    [switch]$Help
)

function Show-Help {
    Write-Host " سكريبت إصلاح Firebase Storage - دليل الاستخدام" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "الاستخدام:" -ForegroundColor Yellow
    Write-Host "  .\fix-cors.ps1                 # تشغيل كامل (CORS + نشر القواعد)"
    Write-Host "  .\fix-cors.ps1 -DeployRules     # نشر قواعد Storage فقط"
    Write-Host "  .\fix-cors.ps1 -CheckStatus     # فحص حالة الإعدادات"
    Write-Host "  .\fix-cors.ps1 -TestUpload      # اختبار رفع ملف"
    Write-Host "  .\fix-cors.ps1 -Help            # عرض هذه المساعدة"
    Write-Host ""
    Write-Host "المتطلبات:" -ForegroundColor Yellow
    Write-Host "  - Google Cloud SDK"
    Write-Host "  - Firebase CLI"
    Write-Host "  - تسجيل الدخول إلى Google Cloud"
    Write-Host ""
}

function Test-Prerequisites {
    Write-Host " فحص المتطلبات..." -ForegroundColor Yellow
    
    try {
        $gcloudVersion = gcloud version 2>$null
        if (-not $gcloudVersion) {
            Write-Host " Google Cloud SDK غير مثبت!" -ForegroundColor Red
            Write-Host " يرجى تثبيته من: https://cloud.google.com/sdk/docs/install" -ForegroundColor Cyan
            return $false
        }
        Write-Host " Google Cloud SDK موجود" -ForegroundColor Green
    } catch {
        Write-Host " خطأ في التحقق من Google Cloud SDK" -ForegroundColor Red
        return $false
    }

    try {
        $firebaseVersion = firebase --version 2>$null
        if (-not $firebaseVersion) {
            Write-Host " Firebase CLI غير مثبت" -ForegroundColor Yellow
            Write-Host " لتثبيته: npm install -g firebase-tools" -ForegroundColor Cyan
        } else {
            Write-Host " Firebase CLI موجود" -ForegroundColor Green
        }
    } catch {
        Write-Host " لا يمكن التحقق من Firebase CLI" -ForegroundColor Yellow
    }

    if (-not (Test-Path "cors-fix.json")) {
        Write-Host " ملف cors-fix.json غير موجود!" -ForegroundColor Red
        return $false
    }
    Write-Host " ملف CORS موجود" -ForegroundColor Green

    if (-not (Test-Path "storage.rules")) {
        Write-Host " ملف storage.rules غير موجود!" -ForegroundColor Red
        return $false
    }
    Write-Host " ملف قواعد التخزين موجود" -ForegroundColor Green

    return $true
}

function Set-GoogleCloudAuth {
    Write-Host " تسجيل الدخول إلى Google Cloud..." -ForegroundColor Yellow
    try {
        $currentAccount = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
        if ($currentAccount) {
            Write-Host " مسجل دخول باستخدام: $currentAccount" -ForegroundColor Green
        } else {
            gcloud auth login
            Write-Host " تم تسجيل الدخول بنجاح" -ForegroundColor Green
        }
    } catch {
        Write-Host " فشل تسجيل الدخول" -ForegroundColor Red
        return $false
    }
    return $true
}

function Set-ProjectConfig {
    Write-Host " تعيين مشروع Firebase..." -ForegroundColor Yellow
    try {
        gcloud config set project bannihassan-e4c61
        Write-Host " تم تعيين المشروع: bannihassan-e4c61" -ForegroundColor Green
        return $true
    } catch {
        Write-Host " فشل تعيين المشروع" -ForegroundColor Red
        return $false
    }
}

function Set-CorsPolicy {
    Write-Host " تطبيق إعدادات CORS..." -ForegroundColor Yellow
    try {
        gsutil cors set cors-fix.json gs://bannihassan-e4c61.appspot.com
        Write-Host " تم تطبيق إعدادات CORS بنجاح!" -ForegroundColor Green
        return $true
    } catch {
        Write-Host " فشل تطبيق إعدادات CORS" -ForegroundColor Red
        Write-Host " تأكد من تثبيت gsutil" -ForegroundColor Cyan
        return $false
    }
}

function Deploy-StorageRules {
    Write-Host "📋 نشر قواعد Firebase Storage..." -ForegroundColor Yellow
    
    if (Test-Path "BanniHassan") {
        Set-Location "BanniHassan"
        Write-Host " تم الانتقال إلى مجلد المشروع" -ForegroundColor Green
    }
    
    try {
        firebase deploy --only storage
        Write-Host " تم نشر قواعد Storage بنجاح!" -ForegroundColor Green
        return $true
    } catch {
        Write-Host " فشل نشر قواعد Storage" -ForegroundColor Red
        Write-Host " تأكد من تسجيل الدخول في Firebase: firebase login" -ForegroundColor Cyan
        return $false
    } finally {
        if (Test-Path "../") {
            Set-Location "../"
        }
    }
}

function Test-CorsSettings {
    Write-Host " التحقق من إعدادات CORS..." -ForegroundColor Yellow
    try {
        $corsSettings = gsutil cors get gs://bannihassan-e4c61.appspot.com
        Write-Host " إعدادات CORS الحالية:" -ForegroundColor Green
        Write-Host $corsSettings -ForegroundColor White
        return $true
    } catch {
        Write-Host " لا يمكن التحقق من إعدادات CORS" -ForegroundColor Yellow
        return $false
    }
}

function Test-StorageUpload {
    Write-Host "🧪 اختبار رفع ملف تجريبي..." -ForegroundColor Yellow
    
    $testFile = "test-upload.txt"
    $testContent = "Firebase Storage Test - $(Get-Date)"
    $testContent | Out-File -FilePath $testFile -Encoding UTF8
    
    try {
        gsutil cp $testFile gs://bannihassan-e4c61.appspot.com/test/
        Write-Host " نجح رفع الملف التجريبي!" -ForegroundColor Green
        
        gsutil rm gs://bannihassan-e4c61.appspot.com/test/$testFile
        Write-Host " تم حذف الملف التجريبي من Storage" -ForegroundColor Green
        
        return $true
    } catch {
        Write-Host " فشل اختبار رفع الملف" -ForegroundColor Red
        return $false
    } finally {
        if (Test-Path $testFile) {
            Remove-Item $testFile -Force
        }
    }
}

function Show-Status {
    Write-Host " حالة إعدادات Firebase Storage" -ForegroundColor Cyan
    Write-Host "=================================" -ForegroundColor Cyan
    
    Write-Host " معلومات المشروع:" -ForegroundColor Yellow
    Write-Host "   Project ID: bannihassan-e4c61"
    Write-Host "   Storage Bucket: bannihassan-e4c61.appspot.com"
    Write-Host "   Console: https://console.firebase.google.com/project/bannihassan-e4c61"
    Write-Host ""
    
    Test-Prerequisites
    Write-Host ""
    
    Test-CorsSettings
    Write-Host ""
    
    Test-StorageUpload
}

function Main {
    Write-Host " بدء إصلاح مشكلة CORS في Firebase Storage..." -ForegroundColor Yellow
    Write-Host "=================================================" -ForegroundColor Yellow
    Write-Host ""

    if ($Help) {
        Show-Help
        return
    }

    if ($CheckStatus) {
        Show-Status
        return
    }

    if (-not (Test-Prerequisites)) {
        Write-Host " فشل فحص المتطلبات. يرجى إصلاح المشاكل والمحاولة مرة أخرى." -ForegroundColor Red
        return
    }

    if (-not (Set-GoogleCloudAuth)) {
        return
    }

    if (-not (Set-ProjectConfig)) {
        return
    }

    if (-not (Set-CorsPolicy)) {
        return
    }

    if ($DeployRules -or (-not $TestUpload)) {
        if (-not (Deploy-StorageRules)) {
            Write-Host "⚠️ فشل نشر قواعد Storage، لكن CORS تم تطبيقه" -ForegroundColor Yellow
        }
    }

    if ($TestUpload) {
        Test-StorageUpload
        return
    }

    Write-Host ""
    Write-Host " التحقق النهائي..." -ForegroundColor Yellow
    Test-CorsSettings

    Write-Host ""
    Write-Host " تم إصلاح مشكلة CORS بنجاح!" -ForegroundColor Green
    Write-Host " يرجى إعادة نشر التطبيق لتطبيق التغييرات" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 الخطوات التالية:" -ForegroundColor Yellow
    Write-Host "   1. انتظر 5-10 دقائق لتطبيق التغييرات"
    Write-Host "   2. امسح cache المتصفح (Ctrl+Shift+Delete)"
    Write-Host "   3. جرب رفع ملف من التطبيق"
    Write-Host "   4. إذا لم تنجح، شغل: .\fix-cors.ps1 -TestUpload"
    Write-Host ""
}

Main 