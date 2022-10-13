function promiseCache<T>() {
	const _promiseCache = new Map<string, Promise<T>>();

	return function (key: string, func: (k: string) => Promise<T>): Promise<T> {
		const cached = _promiseCache.get(key);
		if (cached !== undefined) {
			return cached;
		}

		const promise = func(key).then((res) => {
			_promiseCache.delete(key);
			return res;
		});
		_promiseCache.set(key, promise);
		return promise;
	};
}

export default function cache<T>(fetchFunction: (key: string) => Promise<T>) {
	const _promiseCache = promiseCache<T>();

	return async function (key: string): Promise<T> {
		const result = await _promiseCache(key, fetchFunction);
		if (typeof result === `object`) {
			return { ...result };
		}
		return result;
	};
}
