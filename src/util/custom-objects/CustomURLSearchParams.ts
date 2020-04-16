import SearchParamsMap from "../../interfaces/app-types/SearchParamsMap";

class CustomURLSearchParams extends URLSearchParams {
	get<K extends keyof SearchParamsMap>(name: K): SearchParamsMap[K] | null {
		const param = super.get(name);
		if(param === null) return null;

		let paramNum = Number(param);
		return (paramNum >= 0 ? paramNum : param) as SearchParamsMap[K] | null;
	}
	set<K extends keyof SearchParamsMap>(name: K, value: SearchParamsMap[K]): void {
		super.set(name, String(value));
	}
}

export default CustomURLSearchParams;