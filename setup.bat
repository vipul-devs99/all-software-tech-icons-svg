@echo off
echo Setting up Tech Icons Collection...
echo.

echo Installing dependencies...
npm install

if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install dependencies. Make sure Node.js is installed.
    pause
    exit /b 1
)

echo.
echo Generating preview...
node generate-preview.js

if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to generate preview.
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
echo You can now open preview.html in your browser to see all icons.
pause
