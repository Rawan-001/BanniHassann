@echo off
title Firebase Storage CORS Fix
echo.
echo ===================================
echo   Firebase Storage CORS Fix
echo ===================================
echo.
echo التشغيل السريع لإصلاح مشاكل CORS...
echo.
powershell.exe -ExecutionPolicy Bypass -File "fix-cors.ps1"
echo.
echo اضغط أي مفتاح للخروج...
pause >nul 