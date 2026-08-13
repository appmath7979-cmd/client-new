function formatDate(date: Date) {
	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
}

function convertDate(value: string) {
	const [day, month, year] = value.split("/").map(Number);
	return new Date(year, month - 1, day).getDay();
}

export { formatDate, convertDate };
