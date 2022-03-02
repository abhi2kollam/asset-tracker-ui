import axios from "axios";
export default class SettingsService {
	getSettingsList() {
		return axios
			.get("/api/inventory-settings/list")
			.then((res) => res.data)
			.catch((d) => d.data);
	}
	getFontIcons() {
		return axios
			.get("data/font-icons.json")
			.then((res) => res.data)
			.catch((d) => d.data);
	}
	saveSettings(setting) {
		return axios
			.post("/api/inventory-settings/save", setting)
			.then((res) => res.data)
			.catch((d) => d.data);
	}
}
