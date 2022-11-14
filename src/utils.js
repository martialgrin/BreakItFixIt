export const mapPos = (target, max) => {
	return toFixed(map(target, 0, max, 0, 1), 2);
};

export const map = (n, start1, stop1, start2, stop2) => {
	const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
	return newval;
};

function toFixed(num, fixed) {
	fixed = fixed || 0;
	fixed = Math.pow(10, fixed);
	return Math.floor(num * fixed) / fixed;
}
