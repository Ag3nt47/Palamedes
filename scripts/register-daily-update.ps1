[CmdletBinding(SupportsShouldProcess = $true, ConfirmImpact = 'Medium')]
param(
    [string]$AppPath,
    [string]$DailyAt = '10:00',
    [switch]$Remove
)

$ErrorActionPreference = 'Stop'
$taskName = "Palamedes Daily Update - $env:USERNAME"
if ($Remove) {
    if ($PSCmdlet.ShouldProcess($taskName, 'Remove the current user daily update task')) {
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction Stop
        Write-Output 'The Palamedes daily update task was removed.'
    }
    return
}

$dailyTime = [DateTime]::ParseExact($DailyAt, 'HH:mm', [Globalization.CultureInfo]::InvariantCulture)
$resolvedAppPath = & (Join-Path $PSScriptRoot 'check-updates.ps1') -AppPath $AppPath -ResolveOnly
$currentUser = [Security.Principal.WindowsIdentity]::GetCurrent().Name
$action = New-ScheduledTaskAction -Execute $resolvedAppPath -Argument '--check-updates'
$trigger = New-ScheduledTaskTrigger -Daily -At $dailyTime
$principal = New-ScheduledTaskPrincipal -UserId $currentUser -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 10) -MultipleInstances IgnoreNew -Hidden
if ($PSCmdlet.ShouldProcess("$taskName at $DailyAt local time", 'Register an opt-in daily Palamedes update check')) {
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description 'Checks Palamedes GitHub releases while this user is signed in. Downloads and installation always require a separate in-app approval.' -Force | Out-Null
    Write-Output "Registered $taskName at $DailyAt local time. Updates still require your approval."
}
