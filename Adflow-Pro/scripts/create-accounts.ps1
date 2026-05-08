# Create Test Accounts Script for PowerShell
# Make sure dev server is running on localhost:3001

Write-Host "Creating test accounts..." -ForegroundColor Cyan
Write-Host ""

$accounts = @(
    @{
        name = "Test Client"
        email = "client@adflow.test"
        password = "Client123!"
        role = "Client"
    },
    @{
        name = "Test Moderator"
        email = "moderator@adflow.test"
        password = "Moderator123!"
        role = "Moderator"
    },
    @{
        name = "Test Admin"
        email = "admin@adflow.test"
        password = "Admin123!"
        role = "Admin"
    },
    @{
        name = "Test Super Admin"
        email = "superadmin@adflow.test"
        password = "SuperAdmin123!"
        role = "Super Admin"
    }
)

foreach ($account in $accounts) {
    Write-Host "Creating $($account.role) account..." -ForegroundColor Yellow
    
    $body = @{
        full_name = $account.name
        email = $account.email
        password = $account.password
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" -Method Post -ContentType "application/json" -Body $body -ErrorAction Stop
        Write-Host "Created: $($account.email)" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed: $($account.email)" -ForegroundColor Red
    }
    
    Write-Host ""
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Go to Supabase SQL Editor"
Write-Host "2. Run: scripts/seed-test-users.sql"
Write-Host ""
Write-Host "Done!" -ForegroundColor Green
