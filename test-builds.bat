@echo off
echo Starting build verification...

echo.
echo === Testing Frontend Build ===
cd social-spark-47-main
if exist node_modules (
    echo Node modules already installed
) else (
    echo Installing frontend dependencies...
    call npm install
    if errorlevel 1 (
        echo Frontend npm install failed!
        exit /b 1
    )
)

echo Building frontend...
call npm run build
if errorlevel 1 (
    echo Frontend build failed!
    exit /b 1
)
echo Frontend build successful!

echo.
echo === Testing Backend ===
cd ..\backend-project
if exist node_modules (
    echo Node modules already installed
) else (
    echo Installing backend dependencies...
    call npm install
    if errorlevel 1 (
        echo Backend npm install failed!
        exit /b 1
    )
)

echo Backend verification complete!

echo.
echo === Build Verification Complete ===
echo All builds successful! Jenkins pipeline should work.
pause