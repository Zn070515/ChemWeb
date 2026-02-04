document.addEventListener('DOMContentLoaded', () => {
	const container = document.querySelector('.container');
	if (!container) {
		return;
	}

	container.addEventListener('click', (event) => {
		const target = event.target;
		if (!(target instanceof Element)) {
			return;
		}

		if (target.closest('.point-detail')) {
			return;
		}

		const li = target.closest('li');
		if (!li || !container.contains(li)) {
			return;
		}

		const detail = li.querySelector('.point-detail');
		if (!detail) {
			return;
		}

		li.classList.toggle('is-open');
	});
});
