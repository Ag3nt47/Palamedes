[CmdletBinding()]
param(
    [string]$AppPath,
    [switch]$ResolveOnly
)

$ErrorActionPreference = 'Stop'
$candidates = [System.Collections.Generic.List[string]]::new()
if ($AppPath) {
    $candidates.Add($AppPath)
} else {
    foreach ($basePath in @($env:LOCALAPPDATA, $env:ProgramFiles, ${env:ProgramFiles(x86)})) {
        if ($basePath) {
            $candidates.Add((Join-Path $basePath 'Programs\Palamedes\Palamedes.exe'))
            $candidates.Add((Join-Path $basePath 'Palamedes\Palamedes.exe'))
        }
    }
    foreach ($registryPath in @('HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*', 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*')) {
        Get-ItemProperty -Path $registryPath -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -eq 'Palamedes' -and $_.InstallLocation } | ForEach-Object {
            $candidates.Add((Join-Path $_.InstallLocation 'Palamedes.exe'))
        }
    }
}

$resolvedAppPath = $null
foreach ($candidatePath in $candidates) {
    if (Test-Path -LiteralPath $candidatePath -PathType Leaf) {
        $candidateItem = Get-Item -LiteralPath $candidatePath
        if ($candidateItem.Name -ieq 'Palamedes.exe') { $resolvedAppPath = $candidateItem.FullName; break }
    }
}
if (-not $resolvedAppPath) {
    throw 'Palamedes.exe was not found. Install a GitHub release first or pass -AppPath with its full path.'
}
if ($ResolveOnly) { Write-Output $resolvedAppPath; return }

# The installed app enforces one automatic check per 24 hours. It asks before
# downloading, installing, or restarting. This script never downloads installers.
Start-Process -FilePath $resolvedAppPath -ArgumentList '--check-updates' -WindowStyle Hidden
Write-Output 'Palamedes update check requested. Any available update will ask for approval.'
