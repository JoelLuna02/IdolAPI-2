const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(
	(tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
);

document.addEventListener("DOMContentLoaded", function () {
	const lazyElements = document.querySelectorAll(".lazy");

	const lazyLoad = (target) => {
		const observer = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const img = entry.target;
					const src = img.getAttribute("data-src");
					img.setAttribute("src", src);
					img.classList.remove("lazy");
					observer.disconnect();
				}
			});
		});

		observer.observe(target);
	};

	lazyElements.forEach(lazyLoad);
});
