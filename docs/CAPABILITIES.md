# Palamedes capabilities

Palamedes is an extensible mathematics workspace for school, university, engineering, and mathematical programming. It combines local numerical computation, a computer algebra system, interactive graphs, worked solutions, and a program sandbox. It is a broad toolkit, not an exhaustive implementation of all mathematics or a firmware emulator for any calculator.

## Available workspaces

| Workspace | Implemented capabilities | Important limits |
| --- | --- | --- |
| Scientific calculator | Arithmetic, powers, roots, logarithms, trigonometry and inverse/hyperbolic functions; degrees and radians; factorials, permutations/combinations, GCD/LCM; complex numbers, explicit fractions and BigNumbers; units, matrices, variables, named functions, previous answer, local history | Standard numbers use IEEE-754 doubles. `bignumber()` and `fraction()` opt into other numeric types. Definitions live in the current calculator session. History retains the latest 100 results. |
| Graphing studio | Up to six Cartesian curves; polar curves; parametric x(t), y(t); implicit F(x,y) = 0 contours; rotatable 3D surfaces z=f(x,y); a/b parameter sliders; derivative overlay; numerical roots and signed integrals; values table; PNG and CSV export | Graphs use radians and finite sampling. Surface plots require WebGL. No exhaustive root enumeration, certified geometry, implicit inequalities, or arbitrary 3D solids. |
| Symbolic & calculus | Simplify, expand, factor, derivatives through order 12, indefinite/definite integrals, equation solving, limits, Taylor polynomials through degree 12, finite sums, Laplace and inverse Laplace transforms | Powered by Nerdamer; some expressions remain unevaluated or fail. A displayed formula does not supply all domain/branch conditions. Numerical fallback is labeled. |
| Matrices & vectors | JSON matrix input, multiplication, addition, transpose, determinant, inverse, RREF/rank, eigenvalues/eigenvectors, LU decomposition, linear-system solving | Matrix editor accepts real finite entries and up to 100 rows/columns. Square/invertibility requirements apply to relevant operations. Numerical rank depends on tolerance. |
| Statistics & probability | Mean/median, extrema/range, population/sample variance and standard deviation, quartiles/IQR; linear and polynomial least squares; probability density/mass, CDF and quantiles; one-sample t interval and two-sided t test; data/result CSV export | Polynomial degree 1–10. Data editor accepts up to 10,000 observations. Inference requires independent sampling and justified distribution assumptions; no universal inference wizard. |
| Math tools | Unit conversion, exact integer base conversion for bases 2–36, compound interest, loan payments, triangle properties, numerical integration/root solving, first-order ODE trajectories | Base conversion handles integers. Finance assumes fixed rates and specified payment timing. ODE solving is explicit RK4, not a stiff/PDE solver. |
| Worked solver | Deterministic arithmetic steps; one-variable linear/quadratic equations including complex roots; selected algebra/calculus commands; percentages, simple data summaries, geometry and rate word templates; local printed-text OCR | Unsupported wording is rejected. The local solver is not a general language model or theorem prover. OCR must be reviewed and corrected. |
| AI math lab | Dense Wx+b layers; linear/ReLU/sigmoid/tanh/softmax activations; MSE and binary/multiclass cross-entropy; backpropagation through a dense layer; inspectable SGD/Adam updates; full-batch linear-regression training with editable weights/bias; scaled dot-product attention with causal masking; learned-weight JSON export | Educational CPU implementations. No pretrained language models, GPU training, automatic differentiation of arbitrary programs, or full production neural-network framework. |
| Equation handbook | 75 curated equations in 10 categories, conditions, original worked examples, search/topic filters, references, and calculator handoff | Extensible source data; not a complete textbook or every possible equation. Each runnable example is checked by automated tests. |
| Code sandbox | JavaScript with math.js, `print`, returned results, and plot output; Python via Pyodide; code editor, examples, import/export, saved programs, manual Run and Stop | Fresh isolated worker for each run; five-second execution limit. Python requires an external runtime download. No host filesystem or native-package execution. |
| Modules & programs | Versioned JSON modules containing validated expression functions and JavaScript/Python programs; import/export; built-in engineering and ML examples; explicit program execution | A module is a local manifest, not an npm/pip installer or proprietary calculator program. Import does not execute program code. |

The probability engine includes normal, Student t, chi-square, F, binomial, Poisson, exponential, uniform, beta, and gamma families. Individual controls expose their relevant parameters. Discrete inverse CDF uses a bounded integer search. A PDF value is a density; a discrete PMF value is a probability.

## Verification means a specific check

Calculator double-checking recomputes supported real arithmetic with math.js BigNumber mode at 64 digits, then compares the result. This uses a different numeric mode of the same library, not an independent mathematical proof. Units, complex/matrix outputs, functions, and degree mode can report that this check is unavailable.

The deterministic worked solver substitutes roots into the original equation, uses a separate elementary arithmetic evaluator where supported, compares derivatives with finite differences at suitable sample points, or differentiates antiderivatives. Equivalence checks retain the warning that original domain exclusions still apply. A passed sample check does not prove a global identity or the completeness of a solution set.

Optional AI has its own labels. An AI-proposed arithmetic expression can be evaluated locally, but that alone does not establish that the expression represents the original problem. A second AI review is another fallible model request. Failed and inconclusive checks are shown separately from passed checks.

## Numerical and resource limits

- Numeric quadrature uses adaptive Simpson integration on finite intervals and rejects detected singularities/non-convergence. Sampling can still miss pathological behavior; split difficult intervals and inspect the domain.
- Numerical root finding finds one converged real root near a guess; it does not prove uniqueness or find every root. Change the guess and examine a graph.
- ODE trajectories use RK4 with at most 10,000 steps. Smaller steps are not always stable for stiff problems.
- Calculator expressions are limited to 1,000 characters and 512 syntax nodes, with bounds on generated collections, factorials, and combinatoric inputs. Graph expressions use a smaller scalar-only allowlist, 500 characters, and 128 nodes.
- Graphs sample 800 intervals for ordinary curves and a 61×61 grid for surfaces/contours. Discontinuity heuristics do not guarantee detection of every pole or feature.
- CAS transformations can be expensive and run locally. They do not currently have the same terminable execution deadline as sandbox programs; keep symbolic inputs modest.
- ML training allows up to 10,000 epochs with a 30-million sample×feature×epoch work cap. Learning rates and feature scaling still determine convergence.

## Local data, networking, and updates

History, installed modules, appearance preferences, and sandbox source are stored locally in the current browser/desktop origin. Export a workspace backup before clearing browser data. Browser storage is not encrypted storage or cloud synchronization.

Ordinary math does not require an API. Optional AI is disabled by default and holds its key in session memory only. When enabled, submitting a worked-solver problem sends text and any attached image to the configured provider. Double-checking can make a second provider request. OCR downloads its engine/language data, and Python downloads Pyodide from jsDelivr; these features therefore need network access for runtime assets.

The desktop edition checks the configured GitHub release feed while running, at most once per day automatically; manual checks can run sooner. Download and installation/restart each require explicit approval. Update checks do not mean an update was downloaded or installed. An optional Windows scheduled-task helper is supplied but is not registered automatically. Updates require compatible published release assets. No code-signing certificate is included.

## Out of scope

Palamedes does not claim exam approval, certified safety-critical calculations, arbitrary theorem proving, full dynamic Euclidean construction tools, sensor/classroom hardware integrations, spreadsheet parity, all statistical procedures, or TI/HP/Casio program-file compatibility. See [the benchmark](BENCHMARKS.md) for the feature inspiration and [the guide](USER_GUIDE.md) for practical examples.
