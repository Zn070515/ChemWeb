const elements = [
	{ number: 1, symbol: "H", name: "氢", valence: "1s<sup>1</sup>", period: 1, group: 1 },
	{ number: 2, symbol: "He", name: "氦", valence: "1s<sup>2</sup>", period: 1, group: 18 },
	{ number: 3, symbol: "Li", name: "锂", valence: "2s<sup>1</sup>", period: 2, group: 1 },
	{ number: 4, symbol: "Be", name: "铍", valence: "2s<sup>2</sup>", period: 2, group: 2 },
	{ number: 5, symbol: "B", name: "硼", valence: "2s<sup>2</sup> 2p<sup>1</sup>", period: 2, group: 13 },
	{ number: 6, symbol: "C", name: "碳", valence: "2s<sup>2</sup> 2p<sup>2</sup>", period: 2, group: 14 },
	{ number: 7, symbol: "N", name: "氮", valence: "2s<sup>2</sup> 2p<sup>3</sup>", period: 2, group: 15 },
	{ number: 8, symbol: "O", name: "氧", valence: "2s<sup>2</sup> 2p<sup>4</sup>", period: 2, group: 16 },
	{ number: 9, symbol: "F", name: "氟", valence: "2s<sup>2</sup> 2p<sup>5</sup>", period: 2, group: 17 },
	{ number: 10, symbol: "Ne", name: "氖", valence: "2s<sup>2</sup> 2p<sup>6</sup>", period: 2, group: 18 },
	{ number: 11, symbol: "Na", name: "钠", valence: "3s<sup>1</sup>", period: 3, group: 1 },
	{ number: 12, symbol: "Mg", name: "镁", valence: "3s<sup>2</sup>", period: 3, group: 2 },
	{ number: 13, symbol: "Al", name: "铝", valence: "3s<sup>2</sup> 3p<sup>1</sup>", period: 3, group: 13 },
	{ number: 14, symbol: "Si", name: "硅", valence: "3s<sup>2</sup> 3p<sup>2</sup>", period: 3, group: 14 },
	{ number: 15, symbol: "P", name: "磷", valence: "3s<sup>2</sup> 3p<sup>3</sup>", period: 3, group: 15 },
	{ number: 16, symbol: "S", name: "硫", valence: "3s<sup>2</sup> 3p<sup>4</sup>", period: 3, group: 16 },
	{ number: 17, symbol: "Cl", name: "氯", valence: "3s<sup>2</sup> 3p<sup>5</sup>", period: 3, group: 17 },
	{ number: 18, symbol: "Ar", name: "氩", valence: "3s<sup>2</sup> 3p<sup>6</sup>", period: 3, group: 18 },
	{ number: 19, symbol: "K", name: "钾", valence: "4s<sup>1</sup>", period: 4, group: 1 },
	{ number: 20, symbol: "Ca", name: "钙", valence: "4s<sup>2</sup>", period: 4, group: 2 },
	{ number: 21, symbol: "Sc", name: "钪", valence: "4s<sup>2</sup> 3d<sup>1</sup>", period: 4, group: 3 },
	{ number: 22, symbol: "Ti", name: "钛", valence: "4s<sup>2</sup> 3d<sup>2</sup>", period: 4, group: 4 },
	{ number: 23, symbol: "V", name: "钒", valence: "4s<sup>2</sup> 3d<sup>3</sup>", period: 4, group: 5 },
	{ number: 24, symbol: "Cr", name: "铬", valence: "4s<sup>1</sup> 3d<sup>5</sup>", period: 4, group: 6 },
	{ number: 25, symbol: "Mn", name: "锰", valence: "4s<sup>2</sup> 3d<sup>5</sup>", period: 4, group: 7 },
	{ number: 26, symbol: "Fe", name: "铁", valence: "4s<sup>2</sup> 3d<sup>6</sup>", period: 4, group: 8 },
	{ number: 27, symbol: "Co", name: "钴", valence: "4s<sup>2</sup> 3d<sup>7</sup>", period: 4, group: 9 },
	{ number: 28, symbol: "Ni", name: "镍", valence: "4s<sup>2</sup> 3d<sup>8</sup>", period: 4, group: 10 },
	{ number: 29, symbol: "Cu", name: "铜", valence: "4s<sup>1</sup> 3d<sup>10</sup>", period: 4, group: 11 },
	{ number: 30, symbol: "Zn", name: "锌", valence: "4s<sup>2</sup> 3d<sup>10</sup>", period: 4, group: 12 },
	{ number: 31, symbol: "Ga", name: "镓", valence: "4s<sup>2</sup> 4p<sup>1</sup>", period: 4, group: 13 },
	{ number: 32, symbol: "Ge", name: "锗", valence: "4s<sup>2</sup> 4p<sup>2</sup>", period: 4, group: 14 },
	{ number: 33, symbol: "As", name: "砷", valence: "4s<sup>2</sup> 4p<sup>3</sup>", period: 4, group: 15 },
	{ number: 34, symbol: "Se", name: "硒", valence: "4s<sup>2</sup> 4p<sup>4</sup>", period: 4, group: 16 },
	{ number: 35, symbol: "Br", name: "溴", valence: "4s<sup>2</sup> 4p<sup>5</sup>", period: 4, group: 17 },
	{ number: 36, symbol: "Kr", name: "氪", valence: "4s<sup>2</sup> 4p<sup>6</sup>", period: 4, group: 18 },
	{ number: 37, symbol: "Rb", name: "铷", valence: "5s<sup>1</sup>", period: 5, group: 1 },
	{ number: 38, symbol: "Sr", name: "锶", valence: "5s<sup>2</sup>", period: 5, group: 2 },
	{ number: 39, symbol: "Y", name: "钇", valence: "5s<sup>2</sup> 4d<sup>1</sup>", period: 5, group: 3 },
	{ number: 40, symbol: "Zr", name: "锆", valence: "5s<sup>2</sup> 4d<sup>2</sup>", period: 5, group: 4 },
	{ number: 41, symbol: "Nb", name: "铌", valence: "5s<sup>1</sup> 4d<sup>4</sup>", period: 5, group: 5 },
	{ number: 42, symbol: "Mo", name: "钼", valence: "5s<sup>1</sup> 4d<sup>5</sup>", period: 5, group: 6 },
	{ number: 43, symbol: "Tc", name: "锝", valence: "5s<sup>2</sup> 4d<sup>5</sup>", period: 5, group: 7 },
	{ number: 44, symbol: "Ru", name: "钌", valence: "5s<sup>1</sup> 4d<sup>7</sup>", period: 5, group: 8 },
	{ number: 45, symbol: "Rh", name: "铑", valence: "5s<sup>1</sup> 4d<sup>8</sup>", period: 5, group: 9 },
	{ number: 46, symbol: "Pd", name: "钯", valence: "4d<sup>10</sup>", period: 5, group: 10 },
	{ number: 47, symbol: "Ag", name: "银", valence: "5s<sup>1</sup> 4d<sup>10</sup>", period: 5, group: 11 },
	{ number: 48, symbol: "Cd", name: "镉", valence: "5s<sup>2</sup> 4d<sup>10</sup>", period: 5, group: 12 },
	{ number: 49, symbol: "In", name: "铟", valence: "5s<sup>2</sup> 5p<sup>1</sup>", period: 5, group: 13 },
	{ number: 50, symbol: "Sn", name: "锡", valence: "5s<sup>2</sup> 5p<sup>2</sup>", period: 5, group: 14 },
	{ number: 51, symbol: "Sb", name: "锑", valence: "5s<sup>2</sup> 5p<sup>3</sup>", period: 5, group: 15 },
	{ number: 52, symbol: "Te", name: "碲", valence: "5s<sup>2</sup> 5p<sup>4</sup>", period: 5, group: 16 },
	{ number: 53, symbol: "I", name: "碘", valence: "5s<sup>2</sup> 5p<sup>5</sup>", period: 5, group: 17 },
	{ number: 54, symbol: "Xe", name: "氙", valence: "5s<sup>2</sup> 5p<sup>6</sup>", period: 5, group: 18 },
	{ number: 55, symbol: "Cs", name: "铯", valence: "6s<sup>1</sup>", period: 6, group: 1 },
	{ number: 56, symbol: "Ba", name: "钡", valence: "6s<sup>2</sup>", period: 6, group: 2 },
	{ number: 57, symbol: "La", name: "镧", valence: "6s<sup>2</sup> 5d<sup>1</sup>", period: 6, group: 3 },
	{ number: 58, symbol: "Ce", name: "铈", valence: "6s<sup>2</sup> 4f<sup>1</sup> 5d<sup>1</sup>", row: 8, group: 4 },
	{ number: 59, symbol: "Pr", name: "镨", valence: "6s<sup>2</sup> 4f<sup>3</sup>", row: 8, group: 5 },
	{ number: 60, symbol: "Nd", name: "钕", valence: "6s<sup>2</sup> 4f<sup>4</sup>", row: 8, group: 6 },
	{ number: 61, symbol: "Pm", name: "钷", valence: "6s<sup>2</sup> 4f<sup>5</sup>", row: 8, group: 7 },
	{ number: 62, symbol: "Sm", name: "钐", valence: "6s<sup>2</sup> 4f<sup>6</sup>", row: 8, group: 8 },
	{ number: 63, symbol: "Eu", name: "铕", valence: "6s<sup>2</sup> 4f<sup>7</sup>", row: 8, group: 9 },
	{ number: 64, symbol: "Gd", name: "钆", valence: "6s<sup>2</sup> 4f<sup>7</sup> 5d<sup>1</sup>", row: 8, group: 10 },
	{ number: 65, symbol: "Tb", name: "铽", valence: "6s<sup>2</sup> 4f<sup>9</sup>", row: 8, group: 11 },
	{ number: 66, symbol: "Dy", name: "镝", valence: "6s<sup>2</sup> 4f<sup>10</sup>", row: 8, group: 12 },
	{ number: 67, symbol: "Ho", name: "钬", valence: "6s<sup>2</sup> 4f<sup>11</sup>", row: 8, group: 13 },
	{ number: 68, symbol: "Er", name: "铒", valence: "6s<sup>2</sup> 4f<sup>12</sup>", row: 8, group: 14 },
	{ number: 69, symbol: "Tm", name: "铥", valence: "6s<sup>2</sup> 4f<sup>13</sup>", row: 8, group: 15 },
	{ number: 70, symbol: "Yb", name: "镱", valence: "6s<sup>2</sup> 4f<sup>14</sup>", row: 8, group: 16 },
	{ number: 71, symbol: "Lu", name: "镥", valence: "6s<sup>2</sup> 4f<sup>14</sup> 5d<sup>1</sup>", row: 8, group: 17 },
	{ number: 72, symbol: "Hf", name: "铪", valence: "6s<sup>2</sup> 5d<sup>2</sup>", period: 6, group: 4 },
	{ number: 73, symbol: "Ta", name: "钽", valence: "6s<sup>2</sup> 5d<sup>3</sup>", period: 6, group: 5 },
	{ number: 74, symbol: "W", name: "钨", valence: "6s<sup>2</sup> 5d<sup>4</sup>", period: 6, group: 6 },
	{ number: 75, symbol: "Re", name: "铼", valence: "6s<sup>2</sup> 5d<sup>5</sup>", period: 6, group: 7 },
	{ number: 76, symbol: "Os", name: "锇", valence: "6s<sup>2</sup> 5d<sup>6</sup>", period: 6, group: 8 },
	{ number: 77, symbol: "Ir", name: "铱", valence: "6s<sup>2</sup> 5d<sup>7</sup>", period: 6, group: 9 },
	{ number: 78, symbol: "Pt", name: "铂", valence: "6s<sup>1</sup> 5d<sup>9</sup>", period: 6, group: 10 },
	{ number: 79, symbol: "Au", name: "金", valence: "6s<sup>1</sup> 5d<sup>10</sup>", period: 6, group: 11 },
	{ number: 80, symbol: "Hg", name: "汞", valence: "6s<sup>2</sup> 5d<sup>10</sup>", period: 6, group: 12 },
	{ number: 81, symbol: "Tl", name: "铊", valence: "6s<sup>2</sup> 6p<sup>1</sup>", period: 6, group: 13 },
	{ number: 82, symbol: "Pb", name: "铅", valence: "6s<sup>2</sup> 6p<sup>2</sup>", period: 6, group: 14 },
	{ number: 83, symbol: "Bi", name: "铋", valence: "6s<sup>2</sup> 6p<sup>3</sup>", period: 6, group: 15 },
	{ number: 84, symbol: "Po", name: "钋", valence: "6s<sup>2</sup> 6p<sup>4</sup>", period: 6, group: 16 },
	{ number: 85, symbol: "At", name: "砹", valence: "6s<sup>2</sup> 6p<sup>5</sup>", period: 6, group: 17 },
	{ number: 86, symbol: "Rn", name: "氡", valence: "6s<sup>2</sup> 6p<sup>6</sup>", period: 6, group: 18 },
	{ number: 87, symbol: "Fr", name: "钫", valence: "7s<sup>1</sup>", period: 7, group: 1 },
	{ number: 88, symbol: "Ra", name: "镭", valence: "7s<sup>2</sup>", period: 7, group: 2 },
	{ number: 89, symbol: "Ac", name: "锕", valence: "7s<sup>2</sup> 6d<sup>1</sup>", period: 7, group: 3 },
	{ number: 90, symbol: "Th", name: "钍", valence: "7s<sup>2</sup> 6d<sup>2</sup>", row: 9, group: 4 },
	{ number: 91, symbol: "Pa", name: "镤", valence: "7s<sup>2</sup> 5f<sup>2</sup> 6d<sup>1</sup>", row: 9, group: 5 },
	{ number: 92, symbol: "U", name: "铀", valence: "7s<sup>2</sup> 5f<sup>3</sup> 6d<sup>1</sup>", row: 9, group: 6 },
	{ number: 93, symbol: "Np", name: "镎", valence: "7s<sup>2</sup> 5f<sup>4</sup> 6d<sup>1</sup>", row: 9, group: 7 },
	{ number: 94, symbol: "Pu", name: "钚", valence: "7s<sup>2</sup> 5f<sup>6</sup>", row: 9, group: 8 },
	{ number: 95, symbol: "Am", name: "镅", valence: "7s<sup>2</sup> 5f<sup>7</sup>", row: 9, group: 9 },
	{ number: 96, symbol: "Cm", name: "锔", valence: "7s<sup>2</sup> 5f<sup>7</sup> 6d<sup>1</sup>", row: 9, group: 10 },
	{ number: 97, symbol: "Bk", name: "锫", valence: "7s<sup>2</sup> 5f<sup>9</sup>", row: 9, group: 11 },
	{ number: 98, symbol: "Cf", name: "锎", valence: "7s<sup>2</sup> 5f<sup>10</sup>", row: 9, group: 12 },
	{ number: 99, symbol: "Es", name: "锿", valence: "7s<sup>2</sup> 5f<sup>11</sup>", row: 9, group: 13 },
	{ number: 100, symbol: "Fm", name: "镄", valence: "7s<sup>2</sup> 5f<sup>12</sup>", row: 9, group: 14 },
	{ number: 101, symbol: "Md", name: "钔", valence: "7s<sup>2</sup> 5f<sup>13</sup>", row: 9, group: 15 },
	{ number: 102, symbol: "No", name: "锘", valence: "7s<sup>2</sup> 5f<sup>14</sup>", row: 9, group: 16 },
	{ number: 103, symbol: "Lr", name: "铹", valence: "7s<sup>2</sup> 5f<sup>14</sup> 7p<sup>1</sup>", row: 9, group: 17 },
	{ number: 104, symbol: "Rf", name: "𬬻", valence: "7s<sup>2</sup> 6d<sup>2</sup>", period: 7, group: 4 },
	{ number: 105, symbol: "Db", name: "𬭊", valence: "7s<sup>2</sup> 6d<sup>3</sup>", period: 7, group: 5 },
	{ number: 106, symbol: "Sg", name: "𬭳", valence: "7s<sup>2</sup> 6d<sup>4</sup>", period: 7, group: 6 },
	{ number: 107, symbol: "Bh", name: "𬭛", valence: "7s<sup>2</sup> 6d<sup>5</sup>", period: 7, group: 7 },
	{ number: 108, symbol: "Hs", name: "𬭶", valence: "7s<sup>2</sup> 6d<sup>6</sup>", period: 7, group: 8 },
	{ number: 109, symbol: "Mt", name: "鿏", valence: "7s<sup>2</sup> 6d<sup>7</sup>", period: 7, group: 9 },
	{ number: 110, symbol: "Ds", name: "𫟼", valence: "7s<sup>2</sup> 6d<sup>8</sup>", period: 7, group: 10 },
	{ number: 111, symbol: "Rg", name: "𬬭", valence: "7s<sup>1</sup> 6d<sup>10</sup>", period: 7, group: 11 },
	{ number: 112, symbol: "Cn", name: "鎶", valence: "7s<sup>2</sup> 6d<sup>10</sup>", period: 7, group: 12 },
	{ number: 113, symbol: "Nh", name: "鉨", valence: "7s<sup>2</sup> 7p<sup>1</sup>", period: 7, group: 13 },
	{ number: 114, symbol: "Fl", name: "鈇", valence: "7s<sup>2</sup> 7p<sup>2</sup>", period: 7, group: 14 },
	{ number: 115, symbol: "Mc", name: "镆", valence: "7s<sup>2</sup> 7p<sup>3</sup>", period: 7, group: 15 },
	{ number: 116, symbol: "Lv", name: "鉝", valence: "7s<sup>2</sup> 7p<sup>4</sup>", period: 7, group: 16 },
	{ number: 117, symbol: "Ts", name: "鿬", valence: "7s<sup>2</sup> 7p<sup>5</sup>", period: 7, group: 17 },
	{ number: 118, symbol: "Og", name: "鿫", valence: "7s<sup>2</sup> 7p<sup>6</sup>", period: 7, group: 18 }
];

const table = document.getElementById("periodic_table");

if (!table) {
	console.warn("periodic_table container not found");
}

if (table) {
	table.innerHTML = "";

const addRowLabel = (text, row) => {
	const label = document.createElement("div");
	label.className = "row-label";
	label.textContent = text;
	label.style.gridRow = row;
	label.style.gridColumn = "1 / span 3";
	table.appendChild(label);
};

addRowLabel("镧系", 8);
addRowLabel("锕系", 9);

elements.forEach((element) => {
	const card = document.createElement("a");
	card.className = "element-card";
	card.href = `/elements/detail?symbol=${encodeURIComponent(element.symbol)}`;

	const row = element.row || element.period;
	card.style.gridRow = row;
	card.style.gridColumn = element.group;

	card.innerHTML = `
		<span class="element-number">${element.number}</span>
		<span class="element-symbol">${element.symbol}</span>
		<span class="element-name">${element.name}</span>
		<span class="element-valence">${element.valence}</span>
	`;

	table.appendChild(card);
});
}
