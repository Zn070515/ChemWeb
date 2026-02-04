const params = new URLSearchParams(window.location.search);
const symbol = params.get("symbol") || "H";

const cleanValue = (value) => {
	if (value === null || value === undefined) {
		return "";
	}
	const text = String(value).trim();
	if (!text || text === "null" || text === "undefined") {
		return "";
	}
	return text;
};

const pickValue = (...values) => {
	for (const value of values) {
		const cleaned = cleanValue(value);
		if (cleaned) {
			return cleaned;
		}
	}
	return "-";
};

const parseNumber = (value) => {
	const match = String(value ?? "").match(/-?\d+(\.\d+)?/);
	return match ? Number(match[0]) : null;
};

const escapeHtml = (value) =>
	String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");

const formatExtensionText = (text) => {
	if (!text) {
		return "";
	}
	let safe = escapeHtml(text).replace(/\r\n?/g, "\n");
	// subscripts for element counts (e.g. H2O, (SO4)3)
	safe = safe.replace(/([A-Z][a-z]?|\)|\])(\d+)/g, (_, prefix, digits) => {
		return `${prefix}<sub>${digits}</sub>`;
	});
	// superscripts for ionic charges (e.g. Na+, SO4-)
	safe = safe.replace(/(<sub>\d+<\/sub>|[A-Z][a-z]?|\)|\])([+-])/g, (_, prefix, sign) => {
		return `${prefix}<sup>${sign}</sup>`;
	});
	return safe.replace(/\n/g, "<br>");
};

const formatShells = (shells) => {
	if (!Array.isArray(shells) || shells.length === 0) {
		return "-";
	}
	const labels = ["K", "L", "M", "N", "O", "P", "Q"];
	return shells
		.map((count, index) => `${labels[index] ?? "?"}${count}`)
		.join("-");
};

const loadLocalData = async () => {
	const response = await fetch("./elements-data.json");
	return response.json();
};


const render = async () => {
	const data = await loadLocalData();
	const elements = data?.elements ?? [];
	const current = elements.find((item) => item.symbol === symbol) || elements[0] || {};

	const number = current.number ?? "-";
	const name = current.name ?? symbol;
	const valence = current.valence ?? "-";
	const period = current.period ?? "-";
	const group = current.group ?? "-";

	const rawProperties = current.properties || {};
	const properties = {
		...rawProperties
	};

	const card = document.getElementById("detail_card");
	card.innerHTML = `
		<div class="detail_main">
			<div class="detail_symbol">${symbol}</div>
			<div class="detail_name">${name}</div>
			<div class="detail_number">原子序数：${number}</div>
			<div class="detail_valence">价电子排布：${valence}</div>
			<div class="detail_meta">周期：${period}，族：${group}</div>
		</div>
	`;

	const getValue = (key) => properties[key] ?? "-";
	const propertiesContainer = document.getElementById("detail_properties");
	propertiesContainer.innerHTML = `
	<div class="detail_property-group">
		<h4>基础信息</h4>
		<ul class="detail_property-list">
			<li><span>发现者</span><strong>${getValue("discoverer")}</strong></li>
			<li><span>每100g成本</span><strong>${getValue("costPer100g")}</strong></li>
			<li><span>单质CAS编号</span><strong>${getValue("casNumber")}</strong></li>
			<li><span>电子层</span><strong>${getValue("electronShell")}</strong></li>
			<li><span>元素简介</span><strong>${getValue("summary")}</strong></li>
		</ul>
	</div>
	<div class="detail_property-group">
		<h4>性质</h4>
		<ul class="detail_property-list">
			<li><span>原子量</span><strong>${getValue("atomicWeight")}</strong></li>
			<li><span>单质密度</span><strong>${getValue("density")}</strong></li>
			<li><span>熔点</span><strong>${getValue("meltingPoint")}</strong></li>
			<li><span>沸点</span><strong>${getValue("boilingPoint")}</strong></li>
			<li><span>常见化合价</span><strong>${getValue("oxidationStates")}</strong></li>
			<li><span>常温物态</span><strong>${getValue("stateAtRoom")}</strong></li>
			<li><span>熔化潜热</span><strong>${getValue("fusionHeat")}</strong></li>
			<li><span>比热容</span><strong>${getValue("specificHeat")}</strong></li>
			<li><span>热膨胀系数</span><strong>${getValue("thermalExpansion")}</strong></li>
			<li><span>气化潜热</span><strong>${getValue("vaporizationHeat")}</strong></li>
		</ul>
	</div>
	<div class="detail_property-group">
		<h4>原子半径</h4>
		<ul class="detail_property-list">
			<li><span>原子半径</span><strong>${getValue("atomicRadius")}</strong></li>
			<li><span>共价半径</span><strong>${getValue("covalentRadius")}</strong></li>
			<li><span>范德华半径</span><strong>${getValue("vdwRadius")}</strong></li>
		</ul>
	</div>
	<div class="detail_property-group">
		<h4>电离能</h4>
		<ul class="detail_property-list">
			<li><span>第一电离能</span><strong>${getValue("ionizationEnergy1")}</strong></li>
			<li><span>第二电离能</span><strong>${getValue("ionizationEnergy2")}</strong></li>
			<li><span>第三电离能</span><strong>${getValue("ionizationEnergy3")}</strong></li>
			<li><span>第四电离能</span><strong>${getValue("ionizationEnergy4")}</strong></li>
		</ul>
	</div>
	<div class="detail_property-group">
		<h4>晶体性质</h4>
		<ul class="detail_property-list">
			<li><span>堆积方式</span><strong>${getValue("crystalPacking")}</strong></li>
			<li><span>晶胞参数</span><strong>${getValue("crystalCell")}</strong></li>
		</ul>
	</div>
	<div class="detail_property-group">
		<h4>电极电势</h4>
		<ul class="detail_property-list">
			<li><span>常见离子标准氧化电极电势</span><strong>${getValue("standardElectrodePotential")}</strong></li>
		</ul>
	</div>
`;

	const extensionContainer = document.getElementById("detail_extension");
	if (extensionContainer) {
		const extensionText = pickValue(properties.extension);
		const html = formatExtensionText(extensionText || "暂无详细介绍，敬请期待。");
		extensionContainer.innerHTML = html;
	}
};

render();
