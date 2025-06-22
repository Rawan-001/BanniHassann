@echo off
title Firebase Storage Status Check
echo.
echo ===================================
echo   Firebase Storage Status Check
echo ===================================
echo.
echo فحص سريع لحالة Firebase Storage...
echo.
powershell.exe -ExecutionPolicy Bypass -File "fix-cors.ps1" -CheckStatus
echo.
echo اضغط أي مفتاح للخروج...
pause >nul 