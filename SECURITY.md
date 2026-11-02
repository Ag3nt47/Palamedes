# Security and data handling

Core mathematics is computed locally. History, preferences, modules, and saved editor text use local browser storage; export a backup before clearing it. Credentials are session-only, excluded from exports, and never embedded in the app bundle.

Optional AI makes requests only after the user enables it. The chosen endpoint receives the submitted problem, any attached image, and the runtime authorization key. Shared deployments should use an authenticated server proxy with quotas; never place an organizational secret in a public build. The direct client mode is intended for a person supplying their own key. A separate AI review is advisory and is not a mathematical proof.

OCR runs locally after loading its worker, WebAssembly and language data. Python runs locally after downloading a pinned Pyodide runtime. These first-use downloads need connectivity and disclose ordinary connection metadata to their CDNs. Images are not uploaded to an OCR service. Enabling AI vision does send the image to the configured provider.

JavaScript runs in a fresh blob worker inside an opaque-origin sandboxed iframe with a no-network Content Security Policy. Python has a separate iframe policy permitting only its runtime CDN. Neither receives the app’s storage, DOM, Electron bridge, or API settings. Programs are never run on module import. Output is rendered as text or validated numeric plots. Five-second execution deadlines terminate workers; initial Python runtime loading has its own limit. Browser/OS memory exhaustion is still possible with hostile programs; this is an educational sandbox, not a multi-tenant hostile-code service.

Scalar graph expressions and module functions are validated and bounded. General symbolic algebra still runs synchronously and hard expressions can take time; avoid pasting adversarially large CAS inputs. Numeric checks have stated tolerances and do not establish global correctness.

Electron disables Node integration, enables renderer sandboxing and context isolation, restricts IPC and external navigation, and serves only the packaged static app on loopback. Automatic updater checks are throttled. No version is downloaded or installed without the end user’s explicit native-dialog approval. Update checks rely on the maintainer-controlled GitHub release channel and checksummed artifacts; production distribution should add platform code signing.

Please report vulnerabilities privately to the repository owner through GitHub’s available private reporting channel; do not include API keys or sensitive workspaces in public issues.
