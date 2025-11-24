@echo off
REM =============================================================================
REM VYBZZ - Environment Variables Setup Script (Windows)
REM =============================================================================
REM یہ script تمام services کے لیے .env files بناتا ہے
REM This script creates .env files for all services
REM
REM USAGE / استعمال:
REM   scripts\setup-env-files.bat
REM =============================================================================

echo 🚀 Vybzz Environment Setup
echo ==========================
echo.

REM =============================================================================
REM API Gateway .env
REM =============================================================================
echo Creating API Gateway .env...
if exist "Backend\api-gateway\.env" (
    echo ⚠️  Backend\api-gateway\.env already exists. Skipping...
) else (
    (
        echo # API Gateway Environment Variables
        echo PORT=3000
        echo.
        echo # Microservice URLs
        echo AUTH_URL=http://auth-service:3001
        echo USER_URL=http://user-service:3002
        echo POST_URL=http://post-service:3003
        echo LIVESTREAM_URL=http://live-streaming-service:3004
        echo.
        echo # Clerk Keys - REPLACE WITH YOUR ACTUAL KEYS
        echo CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
        echo CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
        echo.
        echo # CORS Origins
        echo CORS_ORIGINS=http://localhost:5173,http://localhost:80,http://localhost:3000
        echo.
        echo # Environment
        echo NODE_ENV=development
        echo DOCKER=true
    ) > Backend\api-gateway\.env
    echo ✅ Created: Backend\api-gateway\.env
)

REM =============================================================================
REM Auth Service .env
REM =============================================================================
echo Creating Auth Service .env...
if exist "Backend\services\auth-service\.env" (
    echo ⚠️  Backend\services\auth-service\.env already exists. Skipping...
) else (
    (
        echo # Auth Service Environment Variables
        echo PORT=3001
        echo.
        echo # Database
        echo DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz?schema=auth
        echo.
        echo # Clerk Keys - REPLACE WITH YOUR ACTUAL KEYS
        echo CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
        echo CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
        echo CLERK_WEBHOOK_SIGNING_SECRET=whsec_YOUR_SECRET_HERE
        echo.
        echo # Environment
        echo NODE_ENV=development
    ) > Backend\services\auth-service\.env
    echo ✅ Created: Backend\services\auth-service\.env
)

REM =============================================================================
REM User Service .env
REM =============================================================================
echo Creating User Service .env...
if exist "Backend\services\user-service\.env" (
    echo ⚠️  Backend\services\user-service\.env already exists. Skipping...
) else (
    (
        echo # User Service Environment Variables
        echo PORT=3002
        echo.
        echo # Database
        echo DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz?schema=users
        echo.
        echo # Clerk Keys - REPLACE WITH YOUR ACTUAL KEYS
        echo CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
        echo CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
        echo CLERK_WEBHOOK_SIGNING_SECRET=whsec_YOUR_SECRET_HERE
        echo.
        echo # Cloudinary - REPLACE WITH YOUR ACTUAL CREDENTIALS
        echo CLOUDINARY_CLOUD_NAME=your_cloud_name
        echo CLOUDINARY_API_KEY=your_api_key
        echo CLOUDINARY_API_SECRET=your_api_secret
        echo.
        echo # Environment
        echo NODE_ENV=development
    ) > Backend\services\user-service\.env
    echo ✅ Created: Backend\services\user-service\.env
)

REM =============================================================================
REM Post Service .env
REM =============================================================================
echo Creating Post Service .env...
if exist "Backend\services\post-service\.env" (
    echo ⚠️  Backend\services\post-service\.env already exists. Skipping...
) else (
    (
        echo # Post Service Environment Variables
        echo PORT=3003
        echo.
        echo # Database
        echo DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz?schema=posts
        echo.
        echo # Cloudinary - REPLACE WITH YOUR ACTUAL CREDENTIALS
        echo CLOUDINARY_CLOUD_NAME=your_cloud_name
        echo CLOUDINARY_API_KEY=your_api_key
        echo CLOUDINARY_API_SECRET=your_api_secret
        echo.
        echo # Mux - REPLACE WITH YOUR ACTUAL CREDENTIALS
        echo MUX_TOKEN_ID=your_mux_token_id
        echo MUX_TOKEN_SECRET=your_mux_token_secret
        echo MUX_WEBHOOK_SECRET=your_mux_webhook_secret
        echo.
        echo # Environment
        echo NODE_ENV=development
    ) > Backend\services\post-service\.env
    echo ✅ Created: Backend\services\post-service\.env
)

REM =============================================================================
REM Live Streaming Service .env
REM =============================================================================
echo Creating Live Streaming Service .env...
if exist "Backend\services\live-streaming-service\.env" (
    echo ⚠️  Backend\services\live-streaming-service\.env already exists. Skipping...
) else (
    (
        echo # Live Streaming Service Environment Variables
        echo PORT=3004
        echo.
        echo # Database
        echo DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz?schema=livestreams
        echo.
        echo # Mux - REPLACE WITH YOUR ACTUAL CREDENTIALS
        echo MUX_TOKEN_ID=your_mux_token_id
        echo MUX_TOKEN_SECRET=your_mux_token_secret
        echo.
        echo # Environment
        echo NODE_ENV=development
    ) > Backend\services\live-streaming-service\.env
    echo ✅ Created: Backend\services\live-streaming-service\.env
)

REM =============================================================================
REM Frontend .env (Optional)
REM =============================================================================
echo Creating Frontend .env...
if exist "Frontend\.env" (
    echo ⚠️  Frontend\.env already exists. Skipping...
) else (
    (
        echo # Frontend Environment Variables
        echo VITE_API_URL=http://localhost:3000
        echo VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
    ) > Frontend\.env
    echo ✅ Created: Frontend\.env
)

echo.
echo ✅ All .env files created!
echo.
echo ⚠️  IMPORTANT / اہم:
echo.
echo 1. ہر .env file کو edit کریں اور placeholder values کو اپنی actual credentials سے replace کریں
echo    Edit each .env file and replace placeholder values with your actual credentials
echo.
echo 2. Required Credentials:
echo    - Clerk Keys: https://clerk.com
echo    - Cloudinary: https://cloudinary.com
echo    - Mux: https://mux.com
echo.
echo 3. Refer to ENV_VARIABLES_GUIDE.md for detailed instructions
echo    تفصیلی ہدایات کے لیے ENV_VARIABLES_GUIDE.md دیکھیں
echo.
echo 📚 Next Steps:
echo    1. Update all .env files with your actual credentials
echo    2. Run: docker-compose up
echo    3. Test your application
echo.
pause

