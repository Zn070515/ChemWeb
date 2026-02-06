const OPENING_BRACKETS = {
    "(": ")",
    "[": "]",
    "{": "}"
};

const CLOSING_BRACKETS = new Set(Object.values(OPENING_BRACKETS));

const readNumber = (formula, startIndex) => {
    let index = startIndex;
    let digits = "";
    while (index < formula.length && /\d/.test(formula[index])) {
        digits += formula[index];
        index += 1;
    }
    if (!digits) {
        return { value: null, nextIndex: startIndex };
    }
    const value = Number.parseInt(digits, 10);
    if (!Number.isFinite(value) || value <= 0) {
        return { value: NaN, nextIndex: index };
    }
    return { value, nextIndex: index };
};

const parseFormula = (formula) => {
    if (typeof formula !== "string") {
        return null;
    }
    const text = formula.trim();
    if (!text) {
        return null;
    }

    const stack = [{ counts: {} }];
    const bracketStack = [];

    let index = 0;
    while (index < text.length) {
        const char = text[index];

        if (/\s/.test(char)) {
            index += 1;
            continue;
        }

        if (OPENING_BRACKETS[char]) {
            bracketStack.push(char);
            stack.push({ counts: {} });
            index += 1;
            continue;
        }

        if (CLOSING_BRACKETS.has(char)) {
            const lastBracket = bracketStack.pop();
            if (!lastBracket || OPENING_BRACKETS[lastBracket] !== char) {
                return null;
            }

            index += 1;
            const { value, nextIndex } = readNumber(text, index);
            if (Number.isNaN(value)) {
                return null;
            }
            const multiplier = value ?? 1;
            index = nextIndex;

            const group = stack.pop();
            if (!group) {
                return null;
            }
            const target = stack[stack.length - 1];
            if (!target) {
                return null;
            }

            Object.entries(group.counts).forEach(([symbol, count]) => {
                target.counts[symbol] = (target.counts[symbol] || 0) + count * multiplier;
            });
            continue;
        }

        if (/[A-Z]/.test(char)) {
            let symbol = char;
            const nextChar = text[index + 1];
            if (nextChar && /[a-z]/.test(nextChar)) {
                symbol += nextChar;
                index += 1;
            }

            index += 1;
            const { value, nextIndex } = readNumber(text, index);
            if (Number.isNaN(value)) {
                return null;
            }
            const count = value ?? 1;
            index = nextIndex;

            const current = stack[stack.length - 1];
            current.counts[symbol] = (current.counts[symbol] || 0) + count;
            continue;
        }

        return null;
    }

    if (bracketStack.length > 0 || stack.length !== 1) {
        return null;
    }

    return stack[0].counts;
};

const stripLeadingCoefficient = (species) => {
    const match = species.trim().match(/^\d+\s*/);
    if (!match) {
        return species.trim();
    }
    return species.trim().slice(match[0].length).trim();
};

const extractCharge = (species) => {
    const text = species.trim();
    const caretMatch = text.match(/^(.*)\^(\d+)?([+-])$/);
    if (caretMatch) {
        const base = caretMatch[1];
        const magnitude = caretMatch[2] ? Number.parseInt(caretMatch[2], 10) : 1;
        const sign = caretMatch[3] === "+" ? 1 : -1;
        return { base, charge: sign * magnitude };
    }

    if (/[+-]$/.test(text)) {
        const base = text.slice(0, -1);
        const sign = text.endsWith("+") ? 1 : -1;
        return { base, charge: sign };
    }

    return { base: text, charge: 0 };
};

const splitSpecies = (sideText) => {
    const tokens = [];
    let current = "";
    for (let i = 0; i < sideText.length; i += 1) {
        const char = sideText[i];
        if (char === "+") {
            const prev = sideText[i - 1];
            const next = sideText[i + 1];
            const isChargePlus = prev && /[\d\^\)\]]/.test(prev) && (!next || /\s/.test(next));
            if (isChargePlus) {
                current += char;
                continue;
            }
            if (current.trim()) {
                tokens.push(current.trim());
            }
            current = "";
            continue;
        }
        current += char;
    }
    if (current.trim()) {
        tokens.push(current.trim());
    }
    return tokens.filter(Boolean);
};

const parseEquation = (input) => {
    const normalized = input.replace(/→|=/g, "->");
    const parts = normalized.split("->");
    if (parts.length !== 2) {
        return null;
    }
    const left = splitSpecies(parts[0]);
    const right = splitSpecies(parts[1]);
    if (left.length === 0 || right.length === 0) {
        return null;
    }

    const parseSide = (side, sign) => side.map((raw) => {
        const withoutCoeff = stripLeadingCoefficient(raw);
        const { base, charge } = extractCharge(withoutCoeff);

        if (base === "e") {
            return {
                display: withoutCoeff,
                counts: {},
                charge,
                sign
            };
        }

        const counts = parseFormula(base);
        if (!counts) {
            return null;
        }
        return {
            display: withoutCoeff,
            counts,
            charge,
            sign
        };
    });

    const leftParsed = parseSide(left, 1);
    const rightParsed = parseSide(right, -1);

    if (leftParsed.some((item) => item === null) || rightParsed.some((item) => item === null)) {
        return null;
    }

    return {
        left: leftParsed,
        right: rightParsed
    };
};

const gcd = (a, b) => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
        [x, y] = [y, x % y];
    }
    return x;
};

const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);

const fraction = (n, d = 1) => {
    if (d === 0) {
        throw new Error("Invalid fraction");
    }
    const sign = d < 0 ? -1 : 1;
    const nn = n * sign;
    const dd = Math.abs(d);
    const g = gcd(nn, dd) || 1;
    return { n: nn / g, d: dd / g };
};

const addFrac = (a, b) => fraction(a.n * b.d + b.n * a.d, a.d * b.d);
const subFrac = (a, b) => fraction(a.n * b.d - b.n * a.d, a.d * b.d);
const mulFrac = (a, b) => fraction(a.n * b.n, a.d * b.d);
const divFrac = (a, b) => fraction(a.n * b.d, a.d * b.n);

const isZeroFrac = (value) => value.n === 0;

const addVector = (a, b) => a.map((value, index) => value + b[index]);
const scaleVector = (vector, factor) => vector.map((value) => value * factor);

const isAllPositive = (values) => values.every((value) => value > 0);
const isAllNegative = (values) => values.every((value) => value < 0);

const normalizeVectorSign = (values) => (isAllNegative(values) ? values.map((value) => -value) : values);

const reduceVector = (values) => {
    const nonZero = values.filter((value) => value !== 0).map((value) => Math.abs(value));
    if (nonZero.length === 0) {
        return values;
    }
    const divisor = nonZero.reduce((acc, value) => gcd(acc, value), nonZero[0]);
    return values.map((value) => value / divisor);
};

const ensurePositiveCoefficients = (values) => {
    if (values.some((value) => value === 0)) {
        return null;
    }
    if (isAllPositive(values)) {
        return values;
    }
    if (isAllNegative(values)) {
        return values.map((value) => -value);
    }
    return null;
};

const normalizePositiveSolution = (values) => {
    if (!values || values.length === 0) {
        return null;
    }
    if (values.some((value) => value === 0)) {
        return null;
    }
    if (!isAllPositive(values) && !isAllNegative(values)) {
        return null;
    }
    const normalized = normalizeVectorSign(values);
    return reduceVector(normalized);
};

const toFraction = (n, d = 1) => fraction(n, d);

const multiplyFractions = (a, b) => fraction(a.n * b.n, a.d * b.d);

const scaleFraction = (value, factor) => fraction(value.n * factor.n, value.d * factor.d);

const formatFraction = (value) => {
    if (value.d === 1) {
        return String(value.n);
    }
    return `<span class="fraction"><span class="num">${value.n}</span><span class="bar"></span><span class="den">${value.d}</span></span>`;
};

const formatCoeffText = (value, showFraction, hideOne) => {
    if (!value) {
        return "";
    }
    if (value.d === 1) {
        if (hideOne && value.n === 1) {
            return "";
        }
        return String(value.n);
    }
    return showFraction ? formatFraction(value) : String(value.n / value.d);
};

const rref = (matrix) => {
    const rows = matrix.length;
    const cols = matrix[0]?.length || 0;
    let lead = 0;

    for (let r = 0; r < rows; r += 1) {
        if (lead >= cols) {
            return matrix;
        }
        let i = r;
        while (i < rows && isZeroFrac(matrix[i][lead])) {
            i += 1;
        }
        if (i === rows) {
            lead += 1;
            r -= 1;
            continue;
        }
        if (i !== r) {
            [matrix[i], matrix[r]] = [matrix[r], matrix[i]];
        }

        const leadVal = matrix[r][lead];
        matrix[r] = matrix[r].map((value) => divFrac(value, leadVal));

        for (let j = 0; j < rows; j += 1) {
            if (j === r) {
                continue;
            }
            if (isZeroFrac(matrix[j][lead])) {
                continue;
            }
            const factor = matrix[j][lead];
            matrix[j] = matrix[j].map((value, col) => subFrac(value, mulFrac(factor, matrix[r][col])));
        }
        lead += 1;
    }
    return matrix;
};

const getNullSpaceBasis = (matrix) => {
    const rows = matrix.length;
    const cols = matrix[0]?.length || 0;
    const rrefMatrix = rref(matrix.map((row) => row.map((value) => fraction(value, 1))));

    const pivotCols = new Set();
    const pivotRowForCol = {};
    for (let i = 0; i < rows; i += 1) {
        const row = rrefMatrix[i];
        const pivot = row.findIndex((value) => !isZeroFrac(value));
        if (pivot >= 0) {
            pivotCols.add(pivot);
            pivotRowForCol[pivot] = i;
        }
    }

    const freeCols = [];
    for (let col = 0; col < cols; col += 1) {
        if (!pivotCols.has(col)) {
            freeCols.push(col);
        }
    }
    if (freeCols.length === 0) {
        return [];
    }

    const buildBasisVector = (freeCol) => {
        const solution = Array.from({ length: cols }, () => fraction(0, 1));
        solution[freeCol] = fraction(1, 1);

        Array.from(pivotCols).forEach((col) => {
            const rowIndex = pivotRowForCol[col];
            const row = rrefMatrix[rowIndex];
            let sum = fraction(0, 1);
            for (let c = col + 1; c < cols; c += 1) {
                if (!isZeroFrac(row[c])) {
                    sum = addFrac(sum, mulFrac(row[c], solution[c]));
                }
            }
            solution[col] = mulFrac(fraction(-1, 1), sum);
        });

        const denominators = solution.map((value) => value.d);
        const commonDen = denominators.reduce((acc, val) => lcm(acc, val), 1);
        const integers = solution.map((value) => (value.n * commonDen) / value.d);
        return reduceVector(integers);
    };

    return freeCols.map((col) => buildBasisVector(col));
};

const solvePositiveSolutions = (matrix, options = {}) => {
    const basisVectors = getNullSpaceBasis(matrix);
    const maxCoeff = options.maxCoeff ?? 6;
    const maxSolutions = options.maxSolutions ?? 12;

    if (basisVectors.length === 0) {
        return { solutions: [] };
    }

    if (basisVectors.length === 1) {
        const normalized = normalizePositiveSolution(basisVectors[0]);
        return { solutions: normalized ? [normalized] : [] };
    }

    const solutions = new Map();
    let infinite = false;

    const search = (index, current, usedAny) => {
        if (infinite) {
            return;
        }
        if (index === basisVectors.length) {
            if (!usedAny || !current) {
                return;
            }
            const normalized = normalizePositiveSolution(current);
            if (!normalized) {
                return;
            }
            const key = normalized.join(",");
            if (!solutions.has(key)) {
                solutions.set(key, normalized);
                if (solutions.size > maxSolutions) {
                    infinite = true;
                }
            }
            return;
        }

        for (let coeff = 0; coeff <= maxCoeff; coeff += 1) {
            const scaled = coeff === 0 ? null : scaleVector(basisVectors[index], coeff);
            const next = scaled ? (current ? addVector(current, scaled) : scaled) : current;
            search(index + 1, next, usedAny || coeff !== 0);
        }
    };

    search(0, null, false);

    if (infinite) {
        return { infinite: true };
    }

    return { solutions: Array.from(solutions.values()) };
};

const formatBalancedEquation = (parsed, coefficients) => {
    const left = parsed.left.map((item, index) => {
        const coeff = coefficients[index];
        return `${coeff === 1 ? "" : coeff}${item.display}`;
    });
    const right = parsed.right.map((item, index) => {
        const coeff = coefficients[index + parsed.left.length];
        return `${coeff === 1 ? "" : coeff}${item.display}`;
    });
    return `${left.join(" + ")} -> ${right.join(" + ")}`;
};

const balanceEquation = (input) => {
    const parsed = parseEquation(input);
    if (!parsed) {
        return { error: "方程式格式有误，请检查输入。" };
    }

    const species = [...parsed.left, ...parsed.right];
    const elements = new Set();
    species.forEach((item) => {
        Object.keys(item.counts).forEach((key) => elements.add(key));
    });

    const elementList = Array.from(elements);
    const matrix = elementList.map(() => []);

    species.forEach((item) => {
        elementList.forEach((element, rowIndex) => {
            const count = item.counts[element] || 0;
            matrix[rowIndex].push(count * item.sign);
        });
    });

    const hasCharge = species.some((item) => item.charge !== 0);
    if (hasCharge) {
        const chargeRow = species.map((item) => item.charge * item.sign);
        matrix.push(chargeRow);
    }

    const solutionResult = solvePositiveSolutions(matrix);
    if (solutionResult.infinite) {
        return { infinite: true };
    }
    if (!solutionResult.solutions || solutionResult.solutions.length === 0) {
        return { error: "方程式输入有误" };
    }
    if (solutionResult.solutions.length === 1) {
        return { balanced: formatBalancedEquation(parsed, solutionResult.solutions[0]) };
    }
    return {
        balancedList: solutionResult.solutions.map((coeffs) => formatBalancedEquation(parsed, coeffs))
    };
};

const balanceEquationWithCoefficients = (input) => {
    const parsed = parseEquation(input);
    if (!parsed) {
        return { error: "方程式格式有误，请检查输入。" };
    }

    const species = [...parsed.left, ...parsed.right];
    const elements = new Set();
    species.forEach((item) => {
        Object.keys(item.counts).forEach((key) => elements.add(key));
    });

    const elementList = Array.from(elements);
    const matrix = elementList.map(() => []);

    species.forEach((item) => {
        elementList.forEach((element, rowIndex) => {
            const count = item.counts[element] || 0;
            matrix[rowIndex].push(count * item.sign);
        });
    });

    const hasCharge = species.some((item) => item.charge !== 0);
    if (hasCharge) {
        const chargeRow = species.map((item) => item.charge * item.sign);
        matrix.push(chargeRow);
    }

    const solutionResult = solvePositiveSolutions(matrix);
    if (solutionResult.infinite) {
        return { infinite: true };
    }
    if (!solutionResult.solutions || solutionResult.solutions.length === 0) {
        return { error: "方程式输入有误" };
    }

    return {
        solutions: solutionResult.solutions,
        parsed
    };
};

const COMMON_SPECIES = {
    molecules: [
        "H2",
        "O2",
        "N2",
        "Cl2",
        "Br2",
        "I2",
        "H2O",
        "CO2",
        "CO",
        "SO2",
        "SO3",
        "NH3",
        "CH4",
        "C2H6",
        "C2H4",
        "C2H2",
        "H2O2",
        "CaCO3",
        "Fe2O3",
        "Fe3O4",
        "MnO2",
        "Fe",
        "Cu",
        "Zn",
        "Ag",
        "Mg",
        "Al",
        "Ca",
        "Na",
        "K"
    ],
    cations: [
        "H 1+",
        "NH4 1+",
        "Na 1+",
        "K 1+",
        "Ag 1+",
        "Mg 2+",
        "Ca 2+",
        "Ba 2+",
        "Mn 2+",
        "Zn 2+",
        "Cu 2+",
        "Fe 2+",
        "Fe 3+",
        "Al 3+"
    ],
    anions: [
        "e 1-",
        "F 1-",
        "Cl 1-",
        "Br 1-",
        "I 1-",
        "OH 1-",
        "NO3 1-",
        "NO2 1-",
        "ClO3 1-",
        "ClO4 1-",
        "CH3COO 1-",
        "MnO4 1-",
        "CrO4 2-",
        "Cr2O7 2-",
        "SO4 2-",
        "SO3 2-",
        "CO3 2-",
        "PO4 3-",
        "HSO4 1-",
        "HSO3 1-",
        "HCO3 1-",
        "H2PO4 1-",
        "HPO4 2-"
    ]
};

const formatWithSubscripts = (text) => text.replace(/(\d+)/g, "<sub>$1</sub>");

const normalizeChargeText = (charge) => {
    if (!charge) {
        return "";
    }
    const cleaned = charge.replace(/^1(?=[+-])/, "");
    return cleaned;
};

const normalizeChargeInput = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) {
        return "";
    }
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
        return parts[0];
    }
    const base = parts[0];
    const charge = normalizeChargeText(parts.slice(1).join(""));
    return `${base}^${charge}`;
};

const formatChargeSuperscript = (raw) => {
    const parts = raw.trim().split(/\s+/).filter(Boolean);
    if (parts.length <= 1) {
        return formatWithSubscripts(raw);
    }
    const base = parts[0];
    const charge = normalizeChargeText(parts.slice(1).join(""));
    return `${formatWithSubscripts(base)}<sup>${charge}</sup>`;
};

const createEquationItem = (raw, displayCoeff, controlCoeff, onCoeffChange, removeHandler, showFraction, isThermoTarget) => {
    const wrapper = document.createElement("div");
    wrapper.className = "equation_item";
    if (isThermoTarget) {
        wrapper.classList.add("is-thermo-target");
    }
    const coeffBox = document.createElement("div");
    coeffBox.className = "equation_coeff";

    const minusBtn = document.createElement("button");
    minusBtn.type = "button";
    minusBtn.className = "coeff_btn";
    minusBtn.textContent = "-";

    const plusBtn = document.createElement("button");
    plusBtn.type = "button";
    plusBtn.className = "coeff_btn";
    plusBtn.textContent = "+";

    const coeffValue = document.createElement("span");
    coeffValue.className = "coeff_value";
    coeffValue.innerHTML = formatCoeffText(displayCoeff, showFraction, false);

    const updateCoeff = (value) => {
        const next = Number.parseInt(value, 10);
        if (!Number.isFinite(next) || next < 1) {
            return;
        }
        onCoeffChange(next);
    };

    minusBtn.addEventListener("click", () => updateCoeff((controlCoeff ?? 1) - 1));
    plusBtn.addEventListener("click", () => updateCoeff((controlCoeff ?? 1) + 1));

    coeffBox.appendChild(minusBtn);
    coeffBox.appendChild(coeffValue);
    coeffBox.appendChild(plusBtn);

    const label = document.createElement("span");
    label.className = "equation_label";
    label.innerHTML = formatChargeSuperscript(raw);

    wrapper.appendChild(coeffBox);
    wrapper.appendChild(label);
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.innerHTML = "&times;";
    removeBtn.addEventListener("click", removeHandler);
    wrapper.appendChild(removeBtn);
    return wrapper;
};

const initBalancingUI = () => {
    const leftContent = document.getElementById("left_content");
    const rightContent = document.getElementById("right_content");
    const leftZone = document.getElementById("left_zone");
    const rightZone = document.getElementById("right_zone");
    const moleculesContainer = document.getElementById("species_molecules");
    const cationsContainer = document.getElementById("species_cations");
    const anionsContainer = document.getElementById("species_anions");
    const preview = document.getElementById("equation_preview");
    const input = document.getElementById("custom_species");
    const sideSelect = document.getElementById("custom_side");
    const addBtn = document.getElementById("add_species_btn");
    const balanceBtn = document.getElementById("balance_btn");
    const resetBtn = document.getElementById("reset_btn");
    const result = document.getElementById("balance_result");
    const error = document.getElementById("balance_error");
    const suggestionModal = document.getElementById("suggestion_modal");
    const suggestionCards = document.getElementById("suggestion_cards");
    const suggestionClose = document.getElementById("suggestion_close");
    const lockToggle = document.getElementById("lock_coeffs");
    const thermoToggle = document.getElementById("thermo_toggle");
    const thermoList = document.getElementById("thermo_list");
    const thermoSelector = document.getElementById("thermo_selector");
    const thermoEmpty = document.getElementById("thermo_empty");

    if (!leftContent || !rightContent || !leftZone || !rightZone || !moleculesContainer || !cationsContainer || !anionsContainer || !preview || !input || !sideSelect || !addBtn || !balanceBtn || !resetBtn || !result || !error || !suggestionModal || !suggestionCards || !suggestionClose || !lockToggle || !thermoToggle || !thermoList || !thermoSelector || !thermoEmpty) {
        return;
    }

    let leftList = [];
    let rightList = [];
    let thermoTargetIndex = null;
    let lastBaseSolutions = null;

    const showFraction = () => lockToggle.checked || thermoToggle.checked;

    const clearDisplayCoeffs = () => {
        leftList = leftList.map((item) => ({ ...item, displayCoeff: null }));
        rightList = rightList.map((item) => ({ ...item, displayCoeff: null }));
    };

    const getDisplayCoeff = (item) => item.displayCoeff || toFraction(item.userCoeff, 1);

    const renderEquation = () => {
        const totalItems = leftList.length + rightList.length;
        if (thermoTargetIndex != null && (thermoTargetIndex < 0 || thermoTargetIndex >= totalItems)) {
            thermoTargetIndex = null;
        }

        leftContent.innerHTML = "";
        rightContent.innerHTML = "";

        leftList.forEach((item, index) => {
            const element = createEquationItem(
                item.raw,
                getDisplayCoeff(item),
                item.userCoeff,
                (value) => {
                    leftList[index].userCoeff = value;
                    leftList[index].userSet = true;
                    leftList[index].displayCoeff = null;
                    lastBaseSolutions = null;
                    result.textContent = "";
                    error.textContent = "";
                    renderEquation();
                },
                () => {
                    leftList = leftList.filter((_, i) => i !== index);
                    lastBaseSolutions = null;
                    thermoTargetIndex = null;
                    result.textContent = "";
                    error.textContent = "";
                    renderEquation();
                },
                showFraction(),
                thermoToggle.checked && thermoTargetIndex === index
            );
            leftContent.appendChild(element);
        });

        rightList.forEach((item, index) => {
            const element = createEquationItem(
                item.raw,
                getDisplayCoeff(item),
                item.userCoeff,
                (value) => {
                    rightList[index].userCoeff = value;
                    rightList[index].userSet = true;
                    rightList[index].displayCoeff = null;
                    lastBaseSolutions = null;
                    result.textContent = "";
                    error.textContent = "";
                    renderEquation();
                },
                () => {
                    rightList = rightList.filter((_, i) => i !== index);
                    lastBaseSolutions = null;
                    thermoTargetIndex = null;
                    result.textContent = "";
                    error.textContent = "";
                    renderEquation();
                },
                showFraction(),
                thermoToggle.checked && thermoTargetIndex === index + leftList.length
            );
            rightContent.appendChild(element);
        });

        const leftText = leftList.map((item) => {
            const coeff = getDisplayCoeff(item);
            const coeffText = formatCoeffText(coeff, showFraction(), true);
            return `${coeffText}${formatChargeSuperscript(item.raw)}`;
        }).join(" + ");
        const rightText = rightList.map((item) => {
            const coeff = getDisplayCoeff(item);
            const coeffText = formatCoeffText(coeff, showFraction(), true);
            return `${coeffText}${formatChargeSuperscript(item.raw)}`;
        }).join(" + ");

        preview.innerHTML = leftText || rightText ? `${leftText || "?"} = ${rightText || "?"}` : "";

        if (thermoToggle.checked) {
            renderThermoSelector();
        }
    };

    const parseCoefficientInput = (raw) => {
        const parts = raw.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) {
            return null;
        }
        const possibleCoeff = Number.parseInt(parts[0], 10);
        if (Number.isFinite(possibleCoeff) && possibleCoeff > 0 && String(possibleCoeff) === parts[0]) {
            const rest = parts.slice(1).join(" ");
            if (!rest) {
                return null;
            }
            return { coeff: possibleCoeff, raw: rest, userSet: true };
        }
        return { coeff: 1, raw: raw.trim(), userSet: false };
    };

    const addSpecies = (raw, side) => {
        if (!raw) {
            return;
        }
        const parsed = parseCoefficientInput(raw);
        if (!parsed) {
            return;
        }
        const target = side === "right" ? rightList : leftList;
        const existing = target.find((item) => item.raw === parsed.raw);
        if (existing) {
            existing.userCoeff += parsed.coeff;
            existing.userSet = existing.userSet || parsed.userSet;
        } else {
            target.push({
                raw: parsed.raw,
                userCoeff: parsed.coeff,
                userSet: parsed.userSet,
                displayCoeff: null
            });
        }
        lastBaseSolutions = null;
        thermoTargetIndex = null;
        result.textContent = "";
        error.textContent = "";
        renderEquation();
    };

    const attachQuickActions = (card, raw) => {
        const actions = document.createElement("div");
        actions.className = "species_actions";
        const leftBtn = document.createElement("button");
        leftBtn.type = "button";
        leftBtn.textContent = "加入反应物";
        leftBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            addSpecies(raw, "left");
        });
        const rightBtn = document.createElement("button");
        rightBtn.type = "button";
        rightBtn.textContent = "加入生成物";
        rightBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            addSpecies(raw, "right");
        });
        actions.appendChild(leftBtn);
        actions.appendChild(rightBtn);
        card.appendChild(actions);
    };

    const openSuggestionModal = (items) => {
        suggestionCards.innerHTML = "";
        items.forEach((item) => {
            const card = document.createElement("div");
            card.className = "species_card";
            card.dataset.raw = item;
            card.innerHTML = `<span class="species_label">${formatChargeSuperscript(item)}</span>`;
            attachQuickActions(card, item);
            suggestionCards.appendChild(card);
        });
        suggestionModal.classList.remove("modal_hidden");
        suggestionModal.setAttribute("aria-hidden", "false");
    };

    const closeSuggestionModal = () => {
        suggestionModal.classList.add("modal_hidden");
        suggestionModal.setAttribute("aria-hidden", "true");
    };

    const handleDrop = (event, side) => {
        event.preventDefault();
        const raw = event.dataTransfer.getData("text/plain");
        addSpecies(raw, side);
        leftZone.classList.remove("drag_over");
        rightZone.classList.remove("drag_over");
    };

    [leftZone, rightZone].forEach((zone) => {
        zone.addEventListener("dragover", (event) => {
            event.preventDefault();
            zone.classList.add("drag_over");
        });
        zone.addEventListener("dragleave", () => {
            zone.classList.remove("drag_over");
        });
    });

    leftZone.addEventListener("drop", (event) => handleDrop(event, "left"));
    rightZone.addEventListener("drop", (event) => handleDrop(event, "right"));

    const renderGroup = (items, container) => {
        items.forEach((item) => {
            const card = document.createElement("div");
            card.className = "species_card";
            card.draggable = true;
            card.dataset.raw = item;
            card.innerHTML = `<span class="species_label">${formatChargeSuperscript(item)}</span>`;
            attachQuickActions(card, item);
            card.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("text/plain", item);
                card.classList.add("show_actions");
            });
            card.addEventListener("dragend", () => {
                card.classList.remove("show_actions");
            });
            container.appendChild(card);
        });
    };

    renderGroup(COMMON_SPECIES.molecules, moleculesContainer);
    renderGroup(COMMON_SPECIES.cations, cationsContainer);
    renderGroup(COMMON_SPECIES.anions, anionsContainer);

    addBtn.addEventListener("click", () => {
        const value = input.value.trim();
        if (!value) {
            return;
        }
        addSpecies(value, sideSelect.value);
        input.value = "";
        input.focus();
    });

    const toEquationText = () => {
        const left = leftList.map((item) => normalizeChargeInput(item.raw)).join(" + ");
        const right = rightList.map((item) => normalizeChargeInput(item.raw)).join(" + ");
        return `${left} = ${right}`;
    };

    const collectElements = (items) => {
        const elements = new Set();
        items.forEach((item) => {
            const normalized = normalizeChargeInput(item);
            const { base } = extractCharge(normalized);
            if (base === "e") {
                return;
            }
            const counts = parseFormula(base);
            if (!counts) {
                return;
            }
            Object.keys(counts).forEach((key) => elements.add(key));
        });
        return elements;
    };

    const buildSuggestions = () => {
        const present = new Set([...leftList, ...rightList].map((item) => item.raw.trim()));
        const elements = collectElements([...leftList, ...rightList].map((item) => item.raw));
        const pool = [
            ...COMMON_SPECIES.molecules,
            ...COMMON_SPECIES.cations,
            ...COMMON_SPECIES.anions
        ];

        const sumCharge = (items) => items.reduce((total, item) => {
            const normalized = normalizeChargeInput(item.raw);
            const { charge } = extractCharge(normalized);
            return total + charge;
        }, 0);

        const leftCharge = sumCharge(leftList);
        const rightCharge = sumCharge(rightList);
        const chargeDelta = leftCharge - rightCharge;

        const isAcidic = [...leftList, ...rightList].some((item) => /\bH\s*1\+/.test(item.raw));
        const isBasic = [...leftList, ...rightList].some((item) => /\bOH\s*1-/.test(item.raw));

        const redoxHints = [
            "MnO4 1-",
            "Cr2O7 2-",
            "CrO4 2-",
            "H2O2",
            "Cl2",
            "Br2",
            "I2",
            "O2",
            "Fe 2+",
            "Fe 3+",
            "Cu 2+",
            "Cu",
            "Zn 2+",
            "Zn"
        ];

        const acidBaseHints = [];
        if (isAcidic) {
            acidBaseHints.push("H 1+", "H2O");
        } else if (isBasic) {
            acidBaseHints.push("OH 1-", "H2O");
        } else {
            acidBaseHints.push("H 1+", "OH 1-", "H2O");
        }

        if (elements.has("O") && !elements.has("H")) {
            acidBaseHints.push("H2O", "H 1+");
        }

        if (elements.has("H") && !elements.has("O")) {
            acidBaseHints.push("H2O", "OH 1-");
        }

        const chargeHints = [];
        if (chargeDelta !== 0) {
            if (chargeDelta > 0) {
                chargeHints.push("e-", "e 1-", "Cl 1-", "NO3 1-");
            } else {
                chargeHints.push("e+", "e 1+", "H 1+");
            }
        }

        const candidates = new Set();

        pool.forEach((item) => {
            if (present.has(item)) {
                return;
            }
            const normalized = normalizeChargeInput(item);
            const { base } = extractCharge(normalized);
            if (base === "e") {
                return;
            }
            const counts = parseFormula(base);
            if (!counts) {
                return;
            }
            if (Object.keys(counts).some((key) => elements.has(key))) {
                candidates.add(item);
            }
        });

        redoxHints.forEach((item) => {
            if (!present.has(item)) {
                candidates.add(item);
            }
        });

        acidBaseHints.forEach((item) => {
            if (!present.has(item)) {
                candidates.add(item);
            }
        });

        chargeHints.forEach((item) => {
            if (!present.has(item)) {
                candidates.add(item);
            }
        });

        return Array.from(candidates).slice(0, 20);
    };

    const applyLockScaling = (solution) => {
        if (!lockToggle.checked) {
            return solution.map((value) => toFraction(value, 1));
        }
        const allItems = [...leftList, ...rightList];
        const locked = allItems
            .map((item, index) => ({ index, item }))
            .filter(({ item }) => item.userCoeff > 1);

        if (locked.length === 0) {
            return solution.map((value) => toFraction(value, 1));
        }

        const first = locked[0];
        const baseCoeff = solution[first.index];
        if (baseCoeff === 0) {
            return null;
        }
        const factor = toFraction(first.item.userCoeff, baseCoeff);

        for (let i = 1; i < locked.length; i += 1) {
            const { index, item } = locked[i];
            const compare = item.userCoeff * baseCoeff;
            const expected = first.item.userCoeff * solution[index];
            if (compare !== expected) {
                return null;
            }
        }

        return solution.map((value) => toFraction(value * factor.n, factor.d));
    };

    const applyThermoScaling = (coeffs, targetIndex) => {
        if (targetIndex == null) {
            return coeffs;
        }
        const target = coeffs[targetIndex];
        if (!target || target.n === 0) {
            return null;
        }
        const scale = toFraction(target.d, target.n);
        return coeffs.map((value) => scaleFraction(value, scale));
    };

    const formatEquationFromFractions = (coeffs) => {
        const left = leftList.map((item, index) => {
            const coeffText = formatCoeffText(coeffs[index], showFraction(), true);
            return `${coeffText}${formatChargeSuperscript(item.raw)}`;
        }).join(" + ");
        const right = rightList.map((item, index) => {
            const coeffText = formatCoeffText(coeffs[index + leftList.length], showFraction(), true);
            return `${coeffText}${formatChargeSuperscript(item.raw)}`;
        }).join(" + ");
        return `${left} -> ${right}`;
    };

    const renderSolutionCoeffs = (coeffs) => {
        leftList = leftList.map((item, index) => ({
            ...item,
            displayCoeff: coeffs[index]
        }));
        rightList = rightList.map((item, index) => ({
            ...item,
            displayCoeff: coeffs[index + leftList.length]
        }));
        renderEquation();
    };

    const applyThermoFromBase = () => {
        if (!thermoToggle.checked || thermoTargetIndex == null || !lastBaseSolutions) {
            return;
        }
        const scaled = lastBaseSolutions.map((coeffs) => applyThermoScaling(coeffs, thermoTargetIndex)).filter(Boolean);
        if (scaled.length === 0) {
            error.textContent = "方程式输入有误";
            clearDisplayCoeffs();
            renderEquation();
            return;
        }
        if (scaled.length > 1) {
            const lines = scaled.map((coeffs, index) => `解 ${index + 1}: ${formatEquationFromFractions(coeffs)}`);
            result.innerHTML = lines.join("<br>");
            renderSolutionCoeffs(scaled[0]);
            return;
        }
        renderSolutionCoeffs(scaled[0]);
        result.textContent = "配平完成，系数已自动填充。";
    };

    const renderThermoSelector = () => {
        thermoList.innerHTML = "";
        const allItems = [...leftList.map((item) => ({ ...item, side: "反应物" })), ...rightList.map((item) => ({ ...item, side: "生成物" }))];
        thermoEmpty.style.display = allItems.length === 0 ? "block" : "none";
        allItems.forEach((item, index) => {
            const option = document.createElement("button");
            option.type = "button";
            option.className = "thermo_option";
            option.innerHTML = `${item.side}<br>${formatChargeSuperscript(item.raw)}`;
            option.addEventListener("click", () => {
                thermoTargetIndex = index;
                result.textContent = "";
                error.textContent = "";
                renderEquation();
                applyThermoFromBase();
            });
            thermoList.appendChild(option);
        });
    };

    balanceBtn.addEventListener("click", () => {
        result.textContent = "";
        error.textContent = "";
        if (leftList.length === 0 || rightList.length === 0) {
            error.textContent = "请先拖拽或输入反应物与生成物。";
            return;
        }

        const equationText = toEquationText();
        const output = balanceEquationWithCoefficients(equationText);
        if (output.error) {
            lastBaseSolutions = null;
            error.textContent = output.error;
            const suggestions = buildSuggestions();
            if (suggestions.length > 0) {
                openSuggestionModal(suggestions);
            }
            return;
        }

        if (output.infinite) {
            lastBaseSolutions = null;
            error.textContent = "配平结果为无穷多解";
            clearDisplayCoeffs();
            renderEquation();
            return;
        }

        if (!output.solutions || output.solutions.length === 0) {
            lastBaseSolutions = null;
            error.textContent = "方程式输入有误";
            clearDisplayCoeffs();
            renderEquation();
            return;
        }

        const lockedSolutions = output.solutions
            .map((solution) => applyLockScaling(solution))
            .filter(Boolean);

        if (lockedSolutions.length === 0) {
            lastBaseSolutions = null;
            error.textContent = "方程式输入有误";
            clearDisplayCoeffs();
            renderEquation();
            return;
        }

        lastBaseSolutions = lockedSolutions;

        if (thermoToggle.checked) {
            if (thermoTargetIndex == null) {
                renderThermoSelector();
                return;
            }
            applyThermoFromBase();
            return;
        }

        if (lockedSolutions.length > 1) {
            const lines = lockedSolutions.map((solution, index) => {
                const label = `解 ${index + 1}`;
                return `${label}: ${formatEquationFromFractions(solution)}`;
            });
            result.innerHTML = lines.join("<br>");
            renderSolutionCoeffs(lockedSolutions[0]);
            return;
        }

        renderSolutionCoeffs(lockedSolutions[0]);
        result.textContent = "配平完成，系数已自动填充。";
    });

    resetBtn.addEventListener("click", () => {
        leftList = [];
        rightList = [];
        thermoTargetIndex = null;
        lastBaseSolutions = null;
        result.textContent = "";
        error.textContent = "";
        closeSuggestionModal();
        if (thermoToggle.checked) {
            thermoSelector.classList.remove("is-hidden");
            thermoSelector.setAttribute("aria-hidden", "false");
            renderThermoSelector();
        } else {
            thermoSelector.classList.add("is-hidden");
            thermoSelector.setAttribute("aria-hidden", "true");
        }
        renderEquation();
    });

    suggestionClose.addEventListener("click", closeSuggestionModal);
    suggestionModal.querySelector(".modal_overlay").addEventListener("click", closeSuggestionModal);

    lockToggle.addEventListener("change", () => {
        result.textContent = "";
        error.textContent = "";
        if (lockToggle.checked && thermoToggle.checked) {
            thermoToggle.checked = false;
            thermoSelector.classList.add("is-hidden");
            thermoSelector.setAttribute("aria-hidden", "true");
        }
        lastBaseSolutions = null;
        clearDisplayCoeffs();
        renderEquation();
    });

    thermoToggle.addEventListener("change", () => {
        result.textContent = "";
        error.textContent = "";
        if (thermoToggle.checked && lockToggle.checked) {
            lockToggle.checked = false;
            clearDisplayCoeffs();
        }
        if (!thermoToggle.checked) {
            thermoSelector.classList.add("is-hidden");
            thermoSelector.setAttribute("aria-hidden", "true");
            clearDisplayCoeffs();
            renderEquation();
            return;
        }
        thermoSelector.classList.remove("is-hidden");
        thermoSelector.setAttribute("aria-hidden", "false");
        renderThermoSelector();
        renderEquation();
        applyThermoFromBase();
    });

    renderEquation();
};

initBalancingUI();

window.ChemEquationBalancer = {
    balanceEquation,
    balanceEquationWithCoefficients
};
