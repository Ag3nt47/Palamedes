# Platforms, desktop releases, and security checks

Palamedes has a browser application and desktop packages. The browser calculation engine is shared across platforms; each desktop release wraps the same built application in Electron. A packaged target is considered verified only after its GitHub build and relevant platform checks succeed.

## Supported release targets

| Platform | Published target | Notes |
| --- | --- | --- |
| Windows | x64 NSIS `.exe` installer | Per-user installation with Start menu and desktop shortcuts. |
| macOS | Universal `.dmg` and `.zip` | One application includes native Intel x64 and Apple Silicon arm64 executables; CI checks both slices with `lipo`. |
| Linux | x64 `.AppImage` and `.deb` | Built on Ubuntu 22.04. AppImage is portable; DEB is intended for compatible Debian/Ubuntu systems. |
| Browser | Current Chrome, Edge, Firefox, or Safari | Works on Windows, macOS, Linux, and other systems with a compatible browser. File paste, clipboard, OCR, WebGL graphs, and sandbox capabilities depend on browser support. |

Linux ARM64, Windows ARM64, 32-bit desktops, and mobile-native installers are not release targets yet. The browser app is the available path on those systems. An architecture appearing in Electron’s supported list does not establish that Palamedes has been tested there.

Desktop OS minimums follow the bundled Electron version, rather than the OS used to build the package. Electron 45 does not support Windows 7/8/8.1 or macOS 10.15 Catalina; use a currently supported OS. Linux requires a compatible 64-bit glibc/GTK desktop environment, not a musl-only distribution. AppImage systems may need their distribution’s FUSE compatibility package; use the DEB package on compatible systems if AppImage cannot mount. System graphics drivers and WebGL availability affect 3D plotting.

## Installation and updates

Download the appropriate file from [GitHub Releases](https://github.com/Ag3nt47/Palamedes/releases).

- **Windows:** run the NSIS installer. Builds currently lack a publisher signing certificate, so Windows may show a SmartScreen or publisher prompt. Inspect the source/release and verify the downloaded file before deciding to run it.
- **macOS:** open the DMG and drag Palamedes into Applications, or extract the ZIP. Current builds are unsigned and are not Apple notarized. Gatekeeper may block opening them; macOS Privacy & Security provides an explicit Open Anyway action for software the user has decided to trust. The project does not disable Gatekeeper or change system security settings.
- **Linux AppImage:** mark the downloaded file executable, then run it. Keep the AppImage in a user-writable location if using the AppImage updater.
- **Linux DEB:** install with the system package manager, for example `sudo apt install ./Palamedes-<version>-linux-x64.deb`. Updating an installed DEB is a package-management operation and may require administrator approval.

Update-capable installed editions check at most once per 24 hours while they run. A manual check bypasses that interval. Update attempts, including failed network checks, are recorded locally. Available updates require a separate explicit approval before downloading, installing, and restarting. Windows updater releases need their installer, `latest.yml`, and blockmap; Linux AppImage releases need the AppImage and `latest-linux.yml`; macOS releases need ZIP update artifacts and `latest-mac.yml`. Unsupported installation formats return an actionable manual-update message instead of attempting an installation they cannot perform.

**macOS automatic updates require a properly code-signed application.** The current unsigned packages can be updated by downloading a new release; a published ZIP and metadata alone do not make unsigned automatic updating work. Signing and notarization need maintainer-provided Apple credentials and must be configured and tested before enabling `palamedesDesktop.signedMacUpdates: true` in the packaged application metadata. The default is false. The DEB package should be updated through a package manager or by installing a newer downloaded DEB. The optional daily scheduled-task scripts apply only to Windows and are never registered during normal installation or source checkout.

Desktop files are served by a loopback-only HTTP server with a stable per-user port. This preserves browser-local workspaces across launches. A port conflict produces a startup error rather than silently connecting to an unrelated service. Closing the last desktop window quits the app on all platforms, including macOS; no background tray service is installed.

## Building from source

Use Node.js **22.12 or newer**, npm, and the checked-in lockfile. `npm ci` downloads Electron’s matching host binary. Build the macOS package on macOS; use the appropriate Windows/Linux host for those packages.

```sh
npm ci
npm test
npm run build
npm run desktop
```

Package commands after the application build:

```sh
# On Windows
npx electron-builder --win nsis --x64 --publish never

# On macOS: requires Xcode command-line tools for lipo and platform tooling
npx electron-builder --mac dmg zip --universal --publish never

# On Ubuntu/Linux: requires the distribution's desktop packaging tools
npx electron-builder --linux AppImage deb --x64 --publish never
```

Outputs are written to `release/`. Current packaging does not enable code-signing discovery. Maintainers adding signed distribution should configure certificates and notarization secrets in CI, then validate the actual installed update path. Do not store signing credentials or API keys in source files.

## Release and scan workflows

The [desktop release workflow](../.github/workflows/release.yml) runs on `v*` tags. The tag must match `package.json` exactly, such as `v1.0.0`. Each Windows/macOS/Linux job installs the lockfile, runs tests, builds the browser application, and produces its native packages and updater metadata. Artifacts are retained per platform. A final job publishes the combined release only after every platform job succeeds, so a failure does not silently publish an incomplete new desktop release. Re-running a successful release upload replaces matching assets with artifacts built from that tag.

The [security workflow](../.github/workflows/security.yml) runs on pushes to `main`, pull requests targeting `main`, manual dispatch, and a weekly schedule:

1. **CodeQL** scans JavaScript/TypeScript, including the Electron main/preload code, without a compiler build. It uses the official CodeQL action v4 and the `security-extended` query suite. Results appear under GitHub Security → Code scanning. An action completing successfully means analysis ran; it does not mean the repository has no alerts.
2. **Runtime audit** runs `npm audit --omit=dev --audit-level=high`, failing the job on high/critical published runtime dependency advisories. This is a registry advisory check, not proof that a dependency is safe.
3. **Complete audit inventory** retains `dependency-audit.json`, including development and packaging dependencies. This step records findings without suppressing them; it does not make known build-tool findings a permanent failure of the runtime gate.

At initial development, the current stable electron-builder dependency chain had moderate `minimatch` advisory findings. Those are visible in the full audit artifact. A blanket override to minimatch 11 is incompatible with older consumers expecting its earlier callable API; `npm audit fix --force` may also propose an inappropriate downgrade of electron-builder. Track upstream fixes, use narrow compatible updates, and rerun native packaging before changing build-tool dependency overrides. Runtime Electron and KaTeX versions were upgraded separately to current patched releases.

Repository owners must allow GitHub Actions, allow the official GitHub actions used by the workflows, and grant the workflow token `security-events: write` for CodeQL upload and `contents: write` for release publication. Public repositories support CodeQL scanning; private repositories require the appropriate GitHub Code Security entitlement. If GitHub default CodeQL setup is already enabled, switch to the repository’s advanced workflow setup rather than running conflicting configurations. Fork pull requests may require a maintainer to approve their first workflow run; they do not receive release credentials.

References: [GitHub CodeQL workflow configuration](https://docs.github.com/en/code-security/reference/code-scanning/workflow-configuration-options), [electron-builder platform architectures](https://www.electron.build/v26/docs/architecture/), [Electron release schedule](https://releases.electronjs.org/schedule), [electron-builder AppImage updates](https://www.electron.build/v26/docs/appimage/).
