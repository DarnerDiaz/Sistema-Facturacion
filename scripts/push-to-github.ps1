#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Push Sistema-Facturacion project to GitHub
.DESCRIPTION
    Interactive script to setup GitHub remote and push project
#>

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Sistema-Facturacion - GitHub Push" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the repository URL from user
$repoUrl = Read-Host "Ingresa el URL del repositorio GitHub (ej: https://github.com/tu-usuario/Sistema-Facturacion.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "Error: URL requerida" -ForegroundColor Red
    exit 1
}

# Check if remote already exists
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    Write-Host "Remote 'origin' ya existe: $remoteExists" -ForegroundColor Yellow
    $overwrite = Read-Host "¿Deseas sobrescribir? (s/n)"
    if ($overwrite -eq "s") {
        git remote remove origin
        Write-Host "Remote 'origin' removido." -ForegroundColor Green
    } else {
        Write-Host "Operación cancelada." -ForegroundColor Yellow
        exit 0
    }
}

# Add remote
Write-Host "Agregando remote 'origin'..." -ForegroundColor Cyan
git remote add origin $repoUrl
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al agregar remote" -ForegroundColor Red
    exit 1
}

# Rename branch to main
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "Renombrando rama '$currentBranch' a 'main'..." -ForegroundColor Cyan
    git branch -M main
}

# Push
Write-Host "Empujando a GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ Push completado exitosamente" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Tu proyecto está disponible en:" -ForegroundColor Green
    Write-Host "  $repoUrl" -ForegroundColor Cyan
} else {
    Write-Host "Error durante el push" -ForegroundColor Red
    exit 1
}
