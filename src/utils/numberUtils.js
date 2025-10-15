


const safeNumber = (value, defaultValue = 0) => {
	const num = Number(value);
	return isNaN(num) ? defaultValue : num;
}

export { safeNumber }