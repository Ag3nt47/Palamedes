# Premium calculator feature benchmark

Research checked against manufacturer and licensed-product documentation on November 2, 2026. This is a feature-design benchmark, not a current retail-price ranking, performance comparison, certification, or compatibility claim. Prices vary by retailer and region, so “most expensive” is interpreted as the established premium graphing/CAS class.

## Manufacturer references

| Product | Documented features that informed Palamedes | Primary source |
| --- | --- | --- |
| TI-Nspire CX II CAS | Symbolic algebra; function, parametric, polar, sequence and 3D graphs; graph analysis; matrices/eigenvalues; regressions, distributions and inference; geometry; notes/spreadsheets; Python/TI-Basic programs and libraries | [Texas Instruments product specifications](https://education.ti.com/en/products/calculators/graphing-calculators/ti-nspire-cx-ii-cx-ii-cas/) |
| HP Prime G2 | Dedicated symbolic/graphical/numerical views; CAS; implicit/advanced graphs; RPN; equation solving; differential equations; dynamic geometry; app-oriented extensibility | [HP Calcs / licensed product page](https://hpcalcs.com/product/hp-prime-graphing-calculator/) and [product user guide](https://hpcalcs.com/downloads/HP-Prime_user_guide_EN.pdf) |
| Casio ClassPad II / fx-CP400 | Symbolic transformations, calculus, equations/inequalities, conics, sequences, matrices, distributions, finance, geometry, user functions and programs | [Casio product page](https://www.casio.com/intl/scientific-calculators/product.FX-CP400/) and [detailed specifications](https://www.casio-intl.com/asia/en/calc/products/ClassPadIIfx-CP400/) |
| Casio fx-CG100 | Color 3D graphing, Python, statistics/distributions, and a navigation model bridging scientific and graphing work | [Casio US product specifications](https://www.casio.com/us/scientific-calculators/product.FX-CG100/) |

The fx-CG100 specifically does **not** include CAS. Palamedes’ symbolic tools are inspired by CAS-equipped products, not a feature attributed to the CG100.

## What Palamedes implements

| Benchmark area | Palamedes implementation | Coverage boundary |
| --- | --- | --- |
| Scientific calculation | math.js expression engine; units, complex numbers, matrices, explicit exact fractions/BigNumbers, scoped functions | Not bit-for-bit firmware arithmetic or an RPN stack interface |
| CAS | Nerdamer algebra, calculus, equation solving, limits, Taylor and transforms | CAS engines differ; domain assumptions and completeness need review |
| Graphing | Cartesian, polar, parametric, implicit contours, 3D surfaces, derivative overlays, sliders and numerical analysis | Finite sampling; no arbitrary 3D solid/intersection system or general inequality-region engine |
| Linear algebra | Editor, RREF/rank, matrix operations, eigenvalues, LU and systems | Numerical conditioning/tolerances apply; no full symbolic tensor package |
| Data/statistics | Descriptive statistics, polynomial regression, ten distribution families, one-sample t inference | Not every regression, test, interval, ANOVA, or experimental-design feature in premium hardware |
| Geometry/finance | Triangle calculator, handbook formulas, graphable conics through implicit expressions, interest/payment tools | No full dynamic construction system, bond/depreciation suite, or finance certification |
| Programming and extension | Isolated JavaScript/Python programs, reusable manifest functions, import/export | No TI-Basic, HP PPL, Casio BASIC, or proprietary file emulation |
| Education/workflow | Worked solver, OCR-assisted input, optional AI interpretation, original equation handbook, inspectable ML lab | Local word templates are bounded; AI/OCR can be wrong; not a proof assistant |
| Persistence/distribution | Local history/modules/preferences, workspace backup, browser build, desktop packaging and approval-based updates | Not a cloud collaboration system or calculator-hardware connectivity kit |

Features deliberately added for a desktop/browser workspace include searchable worked examples, programmable extensions without hardware transfer, inspectable machine-learning math, optional provider-based interpretation, themes/backlight controls, and exportable graph/data artifacts.

## Accuracy expectations

Compare **specific supported operations with known examples**, not blanket “does everything” claims. Automated tests cover algebra, calculus, units, complex numbers, matrix operations, numerical convergence/error cases, probability parameters, regressions, ML gradients, module validation, AI request construction, and every runnable handbook example. Browser tests check actual interactions and rendering where available. Live provider calls, every symbolic branch, every external runtime download, unsigned-installer acceptance, and future GitHub update delivery require their respective real environments; mocked/unit tests do not prove those outcomes.

Manufacturer trademarks identify the reference products only. Palamedes is independent and does not include or emulate their firmware.
