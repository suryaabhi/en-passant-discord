
export class Database {

	static #url = Deno.env.get('REPLIT_DB_URL');

	static async get(key) {
		return await fetch(this.#url + '/' + encodeURIComponent(key))
		.then(e => e.text())
		.then(value => {
			if (!value) return null;
			try { value = JSON.parse(value); }
			catch { return null; }
			if (value === undefined) return null;
			return value;
		});
	}

	static async set(key, value) {
		value = JSON.stringify(value);
		await fetch(this.#url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: encodeURIComponent(key) + '=' + encodeURIComponent(value),
		});
	}

	static async delete(key) {
		await fetch(this.#url + '/' + encodeURIComponent(key), { method: "DELETE" });
	}

	static async keys() {
		return await fetch(this.#url + '?encode=true&prefix=')
		.then(r => r.text())
		.then(t => t.length === 0 ? [ ] : t.split(/[\n\r]+/).map(decodeURIComponent));
	}

	static async dictionary() {
		let output = { };
		const keys = await this.keys();
		for (const key of keys) output[key] = await this.get(key);
		return output;
	}

}
