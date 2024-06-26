/** @param {string} markdown */
export function generateIndex(markdown) {
	const lines = markdown.split("\n");
	const index = [];
	lines.forEach((line, i) => {
		if (line.startsWith("#")) {
			const level = line.match(/^#+/)[0].length;
			const title = line.replace(/^#+/, "").trim();
			const id = title.replace(/\s+/g, "-").toLowerCase();
			index.push({ level, title, id });
			lines[i] = `${line} <a id="${id}"></a>`;
		}
	});
	return { index, markdown: lines.join("\n") };
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {any[]} array
 * @param {number} numb
 * @returns {any[]}
 */
export function shuffleArray(array, numb) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = getRandomInt(0, i);
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array.slice(0, numb);
}
