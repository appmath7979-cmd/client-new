import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "";

const baseApi = axios.create({
	baseURL,
	withCredentials: true,
	headers: { "Content-Type": "application/json" },
});

baseApi.interceptors.response.use(
	(response) => {
		return response.data ?? null;
	},

	(error) => {
		const apiMessage =
			error.response?.data?.message || "Đã có lỗi hệ thống xảy ra!";
		error.message = apiMessage;

		return Promise.reject(error);
	},
);

export { baseApi };
