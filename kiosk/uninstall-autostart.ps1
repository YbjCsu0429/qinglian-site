# Removes the auto-start shortcut and stops the kiosk.
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$startup = [Environment]::GetFolderPath('Startup')
$lnk = Join-Path $startup 'QingLianKiosk.lnk'

if (Test-Path $lnk) { Remove-Item $lnk -Force; Write-Host "OK  removed: $lnk" }
else { Write-Host "Autostart shortcut not found (nothing to remove)." }

New-Item -ItemType File -Path (Join-Path $here 'stop.flag') -Force | Out-Null
Get-Process chrome, msedge -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "OK  kiosk stopped."
