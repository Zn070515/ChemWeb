const setupTopicDetails = () => {
	const items = document.querySelectorAll(".container ol li");
	items.forEach((item) => {
		const detail = item.querySelector(".point-detail");
		if (detail) {
			item.classList.add("topic-item");
			item.addEventListener("click", (event) => {
				if (event.target.closest("a")) {
					return;
				}
				item.classList.toggle("is-open");
			});
			return;
		}
		const text = item.textContent.trim();
		if (!text) {
			return;
		}
		item.textContent = "";
		item.classList.add("topic-item");

		const button = document.createElement("button");
		button.type = "button";
		button.className = "topic-toggle";
		button.setAttribute("aria-expanded", "false");
		button.textContent = text;

		const generatedDetail = document.createElement("p");
		generatedDetail.className = "topic-detail";
		generatedDetail.textContent = "（待补充：点击此条目展开具体知识点）";

		button.addEventListener("click", () => {
			const isOpen = item.classList.toggle("is-open");
			button.setAttribute("aria-expanded", String(isOpen));
		});

		item.appendChild(button);
		item.appendChild(generatedDetail);
	});
};

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", setupTopicDetails);
} else {
	setupTopicDetails();
}
