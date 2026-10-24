# Installs an auto-start shortcut for the kiosk (current user, at sign-in).
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$startup = [Environment]::GetFolderPath('Startup')
$lnk = Join-Path $startup 'QingLianKiosk.lnk'
$vbs = Join-Path $here 'start-kiosk.vbs'

$ws = New-Object -ComObject WScript.Shell
$s = $ws.CreateShortcut($lnk)
$s.TargetPath = 'wscript.exe'
$s.Arguments = '"' + $vbs + '"'
$s.WorkingDirectory = $here
$s.Description = 'QingLian Kiosk (auto start)'
$s.Save()

Write-Host "OK  autostart created:"
Write-Host "    $lnk"
Write-Host "It will run after the next sign-in."
