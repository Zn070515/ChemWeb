const ATOMIC_MASS_TABLE = {
	exact: {
	H: 1.0079,
	He: 4.0026,
	Li: 6.9410,
	Be: 9.0122,
	B: 10.8110,
	C: 12.0107,
	N: 14.0067,
	O: 15.9994,
	F: 18.9984,
	Ne: 20.1797,
	Na: 22.9898,
	Mg: 24.3050,
	Al: 26.9815,
	Si: 28.0855,
	P: 30.9738,
	S: 32.0650,
	Cl: 35.4530,
	Ar: 39.9480,
	K: 39.0983,
	Ca: 40.0780,
	Sc: 44.9559,
	Ti: 47.8670,
	V: 50.9415,
	Cr: 51.9961,
	Mn: 54.9380,
	Fe: 55.8450,
	Co: 58.9332,
	Ni: 58.6934,
	Cu: 63.5460,
	Zn: 65.3800,
	Ga: 69.7230,
	Ge: 72.6300,
	As: 74.9216,
	Se: 78.9710,
	Br: 79.9040,
	Kr: 83.7980,
	Rb: 85.4678,
	Sr: 87.6200,
	Y: 88.9058,
	Zr: 91.2240,
	Nb: 92.9064,
	Mo: 95.9500,
	Tc: 98.0000,
	Ru: 101.0700,
	Rh: 102.9055,
	Pd: 106.4200,
	Ag: 107.8682,
	Cd: 112.4140,
	In: 114.8180,
	Sn: 118.7100,
	Sb: 121.7600,
	Te: 127.6000,
	I: 126.9045,
	Xe: 131.2930,
	Cs: 132.9055,
	Ba: 137.3270,
	La: 138.9055,
	Ce: 140.1160,
	Pr: 140.9077,
	Nd: 144.2420,
	Pm: 145.0000,
	Sm: 150.3600,
	Eu: 151.9640,
	Gd: 157.2500,
	Tb: 158.9254,
	Dy: 162.5000,
	Ho: 164.9303,
	Er: 167.2590,
	Tm: 168.9342,
	Yb: 173.0540,
	Lu: 174.9668,
	Hf: 178.4900,
	Ta: 180.9479,
	W: 183.8400,
	Re: 186.2070,
	Os: 190.2300,
	Ir: 192.2170,
	Pt: 195.0840,
	Au: 196.9666,
	Hg: 200.5920,
	Tl: 204.3833,
	Pb: 207.2000,
	Bi: 208.9804,
	Po: 209.0000,
	At: 210.0000,
	Rn: 222.0000,
	Fr: 223.0000,
	Ra: 226.0000,
	Ac: 227.0000,
	Th: 232.0381,
	Pa: 231.0359,
	U: 238.0289,
	Np: 237.0000,
	Pu: 244.0000,
	Am: 243.0000,
	Cm: 247.0000,
	Bk: 247.0000,
	Cf: 251.0000,
	Es: 252.0000,
	Fm: 257.0000,
	Md: 258.0000,
	No: 259.0000,
	Lr: 262.0000,
	Rf: 267.0000,
	Db: 270.0000,
	Sg: 271.0000,
	Bh: 270.0000,
	Hs: 277.0000,
	Mt: 278.0000,
	Ds: 281.0000,
	Rg: 282.0000,
	Cn: 285.0000,
	Nh: 286.0000,
	Fl: 289.0000,
	Mc: 290.0000,
	Lv: 293.0000,
	Ts: 294.0000,
	Og: 294.0000
    }
};

ATOMIC_MASS_TABLE.approx = {
	H: 1,
	He: 4,
	Li: 7,
	Be: 9,
	B: 11,
	C: 12,
	N: 14,
	O: 16,
	F: 19,
	Ne: 20,
	Na: 23,
	Mg: 24,
	Al: 27,
	Si: 28,
	P: 31,
	S: 32,
	Cl: 35.5,
	Ar: 40,
	K: 39,
	Ca: 40,
	Sc: 45,
	Ti: 48,
	V: 51,
	Cr: 52,
	Mn: 55,
	Fe: 56,
	Co: 59,
	Ni: 59,
	Cu: 64,
	Zn: 65,
	Ga: 70,
	Ge: 73,
	As: 75,
	Se: 79,
	Br: 80,
	Kr: 84,
	Rb: 85,
	Sr: 88,
	Y: 89,
	Zr: 91,
	Nb: 93,
	Mo: 96,
	Tc: 98,
	Ru: 101,
	Rh: 103,
	Pd: 106,
	Ag: 108,
	Cd: 112,
	In: 115,
	Sn: 119,
	Sb: 122,
	Te: 128,
	I: 127,
	Xe: 131,
	Cs: 133,
	Ba: 137,
	La: 139,
	Ce: 140,
	Pr: 141,
	Nd: 144,
	Pm: 145,
	Sm: 150,
	Eu: 152,
	Gd: 157,
	Tb: 159,
	Dy: 163,
	Ho: 165,
	Er: 167,
	Tm: 169,
	Yb: 173,
	Lu: 175,
	Hf: 178,
	Ta: 181,
	W: 184,
	Re: 186,
	Os: 190,
	Ir: 192,
	Pt: 195,
	Au: 197,
	Hg: 201,
	Tl: 204,
	Pb: 207,
	Bi: 209,
	Po: 210,
	At: 210,
	Rn: 222,
	Fr: 223,
	Ra: 226,
	Ac: 227,
	Th: 232,
	Pa: 231,
	U: 238,
	Np: 237,
	Pu: 244,
	Am: 243,
	Cm: 247,
	Bk: 247,
	Cf: 251,
	Es: 252,
	Fm: 257,
	Md: 258,
	No: 259,
	Lr: 262,
	Rf: 267,
	Db: 270,
	Sg: 271,
	Bh: 270,
	Hs: 277,
	Mt: 278,
	Ds: 281,
	Rg: 282,
	Cn: 285,
	Nh: 286,
	Fl: 289,
	Mc: 290,
	Lv: 293,
	Ts: 294,
	Og: 294
};

const ATOMIC_SYMBOLS = new Set(Object.keys(ATOMIC_MASS_TABLE.exact));

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

			if (!ATOMIC_SYMBOLS.has(symbol)) {
				return null;
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

const isFormulaValid = (formula) => parseFormula(formula) !== null;

const calculateRelativeMass = (formula, mode = "exact") => {
	const counts = parseFormula(formula);
	if (!counts) {
		return null;
	}
	const table = mode === "approx" ? ATOMIC_MASS_TABLE.approx : ATOMIC_MASS_TABLE.exact;
	return Object.entries(counts).reduce((total, [symbol, count]) => {
		return total + table[symbol] * count;
	}, 0);
};

const outputRelativeMass = (formula, mode = "exact") => {
	const mass = calculateRelativeMass(formula, mode);
	if (mass === null) {
		const message = "化学式输入有误";
		console.log(message);
		return message;
	}
	const result = Number(mass.toFixed(4));
	console.log(result);
	return result;
};

window.ChemCalculation = {
	isFormulaValid,
	calculateRelativeMass,
	outputRelativeMass
};

const initFormulaCalculator = () => {
	const container = document.getElementById("calculation_content");
	if (!container) {
		return;
	}

	const card = document.createElement("div");
	card.className = "calculation_card";
	card.id = "formula_calculation_card";
	card.innerHTML = `
		<h3>化学式计算</h3>
		<p>输入化学式，自动计算相对分子/离子质量。</p>
        <p>示例：H2O、Ca(OH)2、Al2(SO4)3</p>
        <p>注意：精确计算时大分子的结果和取整后再计算会有一定误差，其结果多用于分析化学领域。</p>
        <p>输入离子时忽略电荷数，如SO<sub>4</sub><sup>2-</sup>视为SO4。</p>
		<div style="margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
			<input id="formula_input" type="text" placeholder="如：H2O、Ca(OH)2" style="flex: 1 1 200px; padding: 8px 10px; border-radius: 8px; border: 1px solid #d6dbe5; font-size: 14px;" />
			<select id="formula_mode" style="padding: 8px 10px; border-radius: 8px; border: 1px solid #d6dbe5; font-size: 14px;">
				<option value="exact">精确计算</option>
				<option value="approx">近似计算</option>
			</select>
			<button id="formula_calc_btn" type="button" style="padding: 8px 14px; border-radius: 8px; border: none; background: #3b82f6; color: #fff; cursor: pointer; font-size: 14px;">计算</button>
		</div>
		<div id="formula_result" style="margin-top: 10px; color: #2c3e50; font-size: 15px;"></div>
	`;

	container.prepend(card);

	const input = card.querySelector("#formula_input");
	const modeSelect = card.querySelector("#formula_mode");
	const button = card.querySelector("#formula_calc_btn");
	const result = card.querySelector("#formula_result");

	const runCalculation = () => {
		const formula = input.value.trim();
		if (!formula) {
			result.textContent = "化学式输入有误";
			result.style.color = "#e11d48";
			return;
		}
		const mode = modeSelect.value === "approx" ? "approx" : "exact";
		const output = outputRelativeMass(formula, mode);
		if (output === "化学式输入有误") {
			result.textContent = output;
			result.style.color = "#e11d48";
			return;
		}
		result.textContent = `相对质量：${output}`;
		result.style.color = "#2c3e50";
	};

	button.addEventListener("click", runCalculation);
	input.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
			runCalculation();
		}
	});
};

const initBalanceNavigation = () => {
	const balanceCard = document.getElementById("balance_card");
	if (!balanceCard) {
		return;
	}
	balanceCard.style.cursor = "pointer";
	balanceCard.addEventListener("click", () => {
		window.location.href = "./balancing.html";
	});
};

initFormulaCalculator();
initBalanceNavigation();
