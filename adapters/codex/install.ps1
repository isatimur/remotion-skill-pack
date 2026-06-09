# Windows PowerShell stub — wraps the bash install.sh via WSL or Git Bash
param([string]$Mode = "full")
$bash = if (Get-Command bash -ErrorAction SilentlyContinue) { "bash" } else { "wsl" }
$script = Join-Path $PSScriptRoot "install.sh"
& $bash $script $Mode
