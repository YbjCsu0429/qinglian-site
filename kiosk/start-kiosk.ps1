# ===========================================================
#  QingLian Kiosk Launcher
#  Opens the local site full-screen and restarts it if closed.
#  Stop with stop-kiosk.bat (creates stop.flag).
# ===========================================================

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$site = Split-Path -Parent $here
$index = Join-Path $site 'index.html'
$stopFlag = Join-Path $here 'stop.flag'

if (-not (Test-Path $index)) {
    Write-Host "index.html not found: $index"
    exit 1
}

$url = 'file:///' + ($index -replace '\\', '/') + '?kiosk=1'
Remove-Item $stopFlag -Force -ErrorAction SilentlyContinue

# ---- locate browser ----
$candidates = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
)
$browser = $candidates | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
if (-not $browser) {
    Write-Host "Chrome or Edge not found. Please install one of them."
    exit 1
}
Write-Host "Browser: $browser"
Write-Host "URL: $url"

# ---- keep screen awake (ignore failures) ----
try { powercfg /change standby-timeout-ac 0 | Out-Null } catch {}
try { powercfg /change monitor-timeout-ac 0 | Out-Null } catch {}
try { powercfg /change hibernate-timeout-ac 0 | Out-Null } catch {}
try { powercfg /change disk-timeout-ac 0 | Out-Null } catch {}

# ---- browser flags ----
$flags = @(
    '--kiosk',
    ('"' + $url + '"'),
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-session-crashed-bubble',
    '--hide-crash-restore-bubble',
    '--disable-infobars',
    '--disable-pinch',
    '--overscroll-history-navigation=0',
    '--disable-features=Translate,TranslateUI,MediaRouter',
    '--noerrdialogs',
    '--disable-component-update',
    ('--user-data-dir="' + (Join-Path $env:LOCALAPPDATA 'QingLianKiosk') + '"')
)

# ---- loop: relaunch if the browser is closed ----
$launches = 0
while (-not (Test-Path $stopFlag)) {
    $launches++
    $p = Start-Process -FilePath $browser -ArgumentList $flags -PassThru
    $p.WaitForExit()
    if (Test-Path $stopFlag) { break }
    Start-Sleep -Seconds 2
}

Write-Host "Kiosk stopped after $launches launch(es)."
