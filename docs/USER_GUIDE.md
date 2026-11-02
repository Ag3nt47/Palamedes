# Using Palamedes

Palamedes brings a scientific calculator, graphing studio, symbolic engine, worked solver, mathematical programming environment, and equation reference into one workspace. Most computation is local. The optional AI feature is a separate, explicitly enabled provider connection.

## Choose a workspace

The sidebar switches workspaces. **Regular** mode keeps the scientific calculator, graphs, worked solver, and handbook readily available. **Advanced** mode reveals symbolic math, matrices, statistics, numerical/engineering tools, the AI math lab, programming, and modules. The **Math mode** menu is searchable and scrollable.

The smart input at the top classifies a typed problem and opens a likely workspace when **Auto-select** is enabled. Classification is a routing hint, not a guarantee that the selected tool can solve the problem. Disable Auto-select to keep the selected workspace. `Ctrl`/`Cmd` + `K` focuses this input.

Use Settings to choose Optimus Cyber, Angerona Slate, or Retro CRT; select ice-blue, emerald, amber, or no backlight; and adjust screen brightness. These preferences save locally. The power control shows a shutdown/standby state; power-on restores the workspace shell. In the desktop edition the minimize control operates the native window.

## Scientific calculation

Enter an expression and press Enter or the equals key. Use `^` for powers, `*` for multiplication, and parentheses around function arguments. Some familiar Unicode characters such as π, ×, ÷, and squared/cubed superscripts are normalized.

| Input | Result or behavior |
| --- | --- |
| `sqrt(144) + 2^5` | 44 |
| `sin(pi/6)` in RAD | 0.5 |
| `sin(30)` in DEG | 0.5 |
| `log(32, 2)` | 5; plain `log(x)` means natural log |
| `fraction(1,3) + fraction(1,6)` | Exact fraction value 1/2 |
| `bignumber("9007199254740993") + bignumber(1)` | 9007199254740994 without first rounding the large input through a JavaScript number |
| `(3+2i)*(1-i)` | 5 − i |
| `5 cm to inch` | A converted unit quantity |
| `36 km/h to m/s` | 10 m/s |
| `x = 5` then `x^2` | Assign a session variable, then evaluate 25 |
| `f(x) = x^2+1` then `f(3)` | Define and use a session function; result 10 |
| `ans*2` | Use the previous answer |
| `det([1,2;3,4])` | −2 |

Scientific trig follows the selected RAD/DEG mode. Graphs and symbolic calculus use radians. The calculator’s percent key inserts `/100`: it represents a percentage value, rather than a hardware calculator’s context-dependent percent operation.

The latest 100 calculations appear in history. Click a history item to reuse its input; export history or clear it using the panel controls. Variables/functions belong to the current calculator session and should be recreated or saved as modules when needed after navigation/reload.

**Double-check results** attempts 64-digit BigNumber recomputation for supported real arithmetic. It can be unavailable for units, complex numbers, matrices, custom functions, or angle modes. Agreement is a numerical check, not a proof or a second independent CAS.

## Graphing studio

Choose a graph type before entering its expression:

| Mode | Example |
| --- | --- |
| Cartesian | `a*sin(x)+b` and `cos(x)` |
| Polar | `3*cos(4*theta)` over 0 through 2π |
| Parametric | First expression `cos(t)`, y(t) `sin(t)`, parameter 0 through 2π |
| Implicit | `x^2+y^2-9` represents F(x,y)=0, a radius-3 circle |
| 3D surface | `sin(sqrt(x^2+y^2))` |

For implicit mode, enter the expression moved to one side, not an equals sign. The minimum/maximum controls are the plotted independent-variable or parameter bounds; for surfaces/contours they bound both x and y. Adjust `a` and `b` with the sliders. Pan/zoom using the plot controls; rotate a surface with the mouse. Reset the view when needed.

The derivative overlay is numerical and applies to Cartesian curves. Curve analysis uses the **first Cartesian expression**: supply a starting guess to find one real root, or two finite bounds for a signed integral. A root’s residual is displayed. Try different guesses to investigate other roots.

Export the plot as PNG, or open the table and export CSV. Graphs use finite samples and can miss small features, singularities, disconnected components, or roots. Three-dimensional rendering needs working WebGL. The graph expression language intentionally permits scalar elementary arithmetic/functions rather than code, allocations, or assignments.

## Symbolic & calculus

Choose an operation and variable, enter the expression, and calculate. Examples:

- **Factor:** `x^3-6*x^2+11*x-6` → `(x−1)(x−2)(x−3)` in the engine’s chosen factor order.
- **Differentiate:** `x^3*sin(x)` with respect to `x` → `3*x^2*sin(x)+x^3*cos(x)`.
- **Indefinite integral:** `x^2` with respect to `x` → `x^3/3`; include the arbitrary constant C.
- **Definite integral:** `sin(x)`, bounds `0` to `pi` → 2.
- **Solve equation:** `x^2-5*x+6=0` → candidates 2 and 3.
- **Limit:** `sin(x)/x` as x approaches 0 → 1.
- **Taylor:** `exp(x)` around 0, degree 5 → `1+x+x^2/2+x^3/6+x^4/24+x^5/120`.
- **Finite sum:** `x^2`, x from 1 through 10 → 385.
- **Laplace:** `sin(t)` from variable t to s → `1/(s^2+1)`.
- **Inverse Laplace:** `1/(s^2+1)` from variable s to t → `sin(t)`.

Closed-form coverage depends on Nerdamer. An unevaluated expression means the engine did not find the requested form. Numerical integration fallback is explicitly marked as approximate. Equation candidates need substitution and domain checks; solving can omit branches. A formal-looking expression is not evidence of convergence or completeness. Keep CAS inputs modest because symbolic operations do not have sandbox-style termination deadlines.

## Matrices, statistics, and math tools

The matrix editor uses JSON, for example `[[2,1],[1,-1]]`. Choose an operation such as determinant, inverse, transpose, RREF, eigenvalues, multiplication, or `Ax=b`. For that example and `b=[5,1]`, the solution is `[2,1]`. Arrays must be rectangular and contain finite real numbers. Square operations require a square matrix; inverse/system solving require appropriate rank. Near-singular systems may be unreliable even when a numerical answer exists.

For descriptive statistics, enter data separated by commas, spaces, or lines, such as `1,2,3,4,5`. The population variance is 2, sample variance 2.5, and mean/median 3. Quartiles use linear interpolation at positions `(n−1)p` in sorted data. Sample variance is unavailable for a singleton.

For polynomial regression, supply paired x/y lists and a degree. `x=[1,2,3,4]`, `y=[3,5,7,9]`, degree 1 gives `y=1+2x` and R²=1. Coefficients are ordered constant term first. A high R² alone does not establish a causal model or validate extrapolation.

Probability tools distinguish PDF/PMF, CDF, and inverse CDF. A standard normal CDF at zero is 0.5; its 0.975 quantile is approximately 1.959964. A binomial distribution with n=4 and p=0.5 has probability 0.375 at k=2. Success probabilities must lie in [0,1], standard deviations/rates/degrees of freedom must be positive, and binomial n must be an integer. A continuous density can exceed 1 without being a probability greater than 1.

The one-sample t tools produce an interval and a two-sided test relative to a null mean. They require at least two observations, nonzero sample variation, independent sampling, and a justified normal/large-sample model. Statistical assumptions remain the user’s responsibility.

Math tools include compatible-unit conversion, integer conversion among bases 2–36, compound interest, fixed-rate loan payments, triangle calculations, numerical roots/integrals, and first-order ODEs. Finance controls use **annual percentages** where labeled: enter `6` for 6%, not `0.06`. For ODEs, enter the slope `y` for y′=y with x₀=0, y₀=1, end=1 and a small positive step; the trajectory should approach e at x=1. This is RK4, not a solver for arbitrary symbolic differential equations or stiff PDEs.

## Worked solutions and images

The local worked solver supports explicit arithmetic; one-variable linear/quadratic equations; factor/expand/simplify/differentiate/integrate commands; and specific word templates. Try:

```text
2*(x + 3) = 5*x - 9
x^2 - 5*x + 6 = 0
differentiate x^3 * sin(x)
integrate x^2
What is 18% of 250?
increase 80 by 15%
mean of 4, 7, 9, 12, 18
hypotenuse of a right triangle with legs 3 and 4
convert 5 km to m
A car travels 120 miles in 2 hours. What is its speed?
```

Click **Show me the working** or press `Ctrl`/`Cmd` + Enter. Each result states its interpretation, mathematical transformations, answer, and supported checks. Local language support is intentionally bounded: rewrite unsupported wording as an equation or select a specialist workspace. Some CAS transformations expose only the resulting transformation and verification, not every internal derivation.

Upload, drop, or paste an image. **Read text** uses Tesseract printed-text OCR locally after downloading its runtime/language assets. Correct the extracted text and confirm that it matches the image before local solving. Handwriting, stacked fractions, superscripts, radicals, and diagrams are frequent sources of OCR errors. OCR confidence is not mathematical confidence. The attachment control accepts browser-readable images up to 12 MB; optional AI vision accepts PNG/JPEG/WebP up to 10 MB.

Checks can pass, fail, or remain inconclusive. Equation substitution checks the original sides, derivative checks compare local samples, and antiderivatives can be differentiated back. Numerical samples and AI reviews do not amount to formal proof.

## Optional AI assistance

AI is off by default. In Settings, enable it, choose OpenAI Responses or an OpenAI-compatible Chat endpoint, enter an available model, and provide your own API key. A loopback endpoint can be used without a key when its local server supports that setup. HTTPS is required except for loopback HTTP.

The key stays in this app session’s memory, is cleared by reload or **Disable & clear key**, and is not included in workspace exports. Direct browser requests send the key to the endpoint you configure. Verify that endpoint before entering credentials. A compatible provider must support the requested structured-output schema, image input if used, and browser CORS; “OpenAI-compatible” does not guarantee every model/server accepts the same options.

Submitting a problem while AI is enabled sends the problem text and any attached image to that provider. Double-checking also attempts local checks and a separate provider review, which may incur another request/charge. Provider failures, incompatible schemas, refusals, and timeouts are surfaced. The source labels distinguish AI assistance from deterministic calculation. An AI-selected verification expression checks arithmetic consistency only; its relevance to the original problem may be unverified.

There is no bundled API key or free provider entitlement. Automated tests validate request construction, disabled-feature behavior, input/schema checks, and error handling with mocked responses. They do **not** establish that a live provider/model/key currently works; that requires your actual provider configuration. For a shared hosted deployment, use an authenticated server-side proxy rather than distributing a shared secret to browsers.

## AI & machine learning math lab

These tools teach and inspect the mathematics directly, without calling an AI provider:

- **Dense layers:** edit x, weights W, bias b, and an activation. Inspect the products, preactivations Wx+b, and output. For weights `(2,−1)`, x=`(3,4)`, b=`0.5`, the preactivation is 2.5.
- **Activations/losses:** stable softmax subtracts the maximum logit. Softmax of `(0,ln 2)` is `(1/3,2/3)`. MSE averages squared errors; binary cross-entropy averages its components; multiclass cross-entropy sums class terms using natural logs and clips probabilities at epsilon=10⁻¹⁵.
- **Backpropagation:** inspect MSE gradients through one dense layer, including the full softmax Jacobian. ReLU uses derivative 0 at exactly zero. This is a worked educational layer, not automatic differentiation of arbitrary programs.
- **Training:** full-batch multivariate linear regression starts from editable weights and bias. Select a learning rate and epochs; inspect training loss, learned weights, predictions, residuals, RMSE, and R². Export learned weights as JSON. Scale inputs and lower the learning rate if the run diverges.
- **Optimizers:** inspect one SGD or bias-corrected Adam step and the moment estimates. Continuing Adam requires carrying its moments and step count forward.
- **Attention:** supply Q, K, and V to see scaled scores, softmax weights, and mixed values. The optional causal mask excludes future positions and requires matching sequence lengths in this lab. This is a single attention calculation, not a complete transformer or language model.

The handbook has matching explanations and original examples for weights, forward passes, activations, cross-entropy, MSE, backpropagation, gradient descent, momentum, Adam, and attention.

## Sandbox and modules

In **Code sandbox**, select JavaScript or Python. Use Tab for indentation and `Ctrl`/`Cmd` + Enter to run. Every run starts a fresh worker. Source code is saved locally per language; import/export `.js` or `.py` files, or save a named program to a module.

JavaScript provides the full math.js library plus output helpers:

```js
const xs = math.range(0, 6.3, 0.05).toArray();
const ys = xs.map(x => Math.sin(x));
print('Samples:', xs.length);
plot(xs, ys, 'Sine wave');
return { mean: math.mean(ys), maximum: math.max(ys) };
```

`print()` sends text/results to the console. `plot(xs,ys,title)` accepts equal-length arrays and displays up to 2,000 finite points. Return a value to show a final result. Programs are limited to 50,000 characters and five seconds of execution; output is bounded. **Stop** terminates the worker.

Python downloads Pyodide 0.27.7 from jsDelivr and supports its standard library:

```python
import math
import statistics
values = [2, 4, 5, 8, 11, 14]
print(statistics.mean(values))
math.factorial(10)
```

The final expression is displayed. Runtime loading can take up to 120 seconds; program execution has its own five-second deadline. Network/CDN availability can prevent loading. This edition does not offer unrestricted pip/native package installation or host filesystem access.

The program runtime is a worker inside an opaque-origin sandboxed iframe. JavaScript’s policy blocks network access; Python’s policy permits its runtime CDN. Program code cannot read this app’s DOM, local storage, or API-key state. This is a browser isolation boundary, not a guarantee against browser vulnerabilities or unlimited CPU/memory use before termination.

**Modules & programs** accepts versioned JSON manifests. Import is passive; a program runs only after you open it in the sandbox and press Run. Expression functions become reusable calculator functions. Example:

```json
{
  "schemaVersion": 1,
  "id": "my-physics",
  "name": "My physics",
  "version": "1.0.0",
  "description": "A reusable kinetic energy function.",
  "functions": [
    {"name": "myKinetic", "args": ["mass", "speed"], "expression": "mass*speed^2/2"}
  ],
  "programs": [
    {"name": "Energy example", "language": "javascript", "code": "print(math.myKinetic(2,3)); return math.myKinetic(2,3);"}
  ]
}
```

After installation, `myKinetic(2,3)` evaluates to 9 in the calculator, and `math.myKinetic(2,3)` is available to JavaScript programs. Manifest expressions accept validated built-ins and named arguments; they cannot contain assignments, object/accessor code, or ranges. A function cannot call another custom function through the manifest validator. Built-in names cannot be replaced. Each module permits up to 100 functions and 30 programs, with unique names and semantic versions. Imported programs do not gain native filesystem/network privileges.

## Handbook, backups, and desktop updates

The **Textbook** button opens 75 curated equations across arithmetic, algebra, geometry, trigonometry, calculus, linear algebra, probability/statistics, finance, numerical methods, and ML. Search, choose a topic, and expand a card for conditions and a solved example. **Try in calculator** transfers its runnable expression. References link to authoritative further reading. The handbook is intentionally extensible rather than exhaustive.

Settings can export/import a workspace JSON containing history, modules, and preferences. API credentials are excluded. Sandbox drafts are stored separately per language; export important source files or save them as module programs before moving between devices.

The desktop edition checks GitHub releases while running, with automatic attempts at most once per day. Manual **Check updates** can run sooner. Download, installation, and restart require explicit native approval; canceling keeps the existing installation. A real update requires published installer/update metadata in the configured repository. The optional Windows daily task script is supplied for users who want a signed-in daily launch/check; installing the app does not automatically register that task. Unsigned installers can trigger Windows SmartScreen because this repository includes no code-signing certificate.

For API/CORS, OCR/Python CDN, WebGL, or numerical errors, the application reports the operation’s limitation. Preserve your input, try a smaller/simpler example, inspect domains and units, and consult [capabilities](CAPABILITIES.md) before assuming a displayed result is complete.
