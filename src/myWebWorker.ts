import ToFetchImgOnWorker from "./interfaces/custom-events-types/ToFetchImgOnWorker";
import WorkerFetchedDoneEvent from "./interfaces/custom-events-types/WorkerFetchedDoneEvent";
import IMovieResultItem from "./interfaces/app-types/IMovieResultItem";
import appProperties from "./appProperties";

const {getPosterSrcPathPrefix} = appProperties;

// @ts-ignore
// eslint-disable-next-line no-restricted-globals
const ctx: DedicatedWorkerGlobalScope = self as any;


ctx.onmessage = event => {
	const URLsToFetch: ToFetchImgOnWorker[] | ToFetchImgOnWorker = getUrlsToFetch(event.data);

	if (Array.isArray(URLsToFetch))
		URLsToFetch.forEach(obj =>
			fetchMovieBlob(obj.url)
				.then(blob => postMessage(blob, obj.id))
		);
	else fetchMovieBlob(URLsToFetch.url)
			.then(blob => postMessage(blob, URLsToFetch.id))
};


function postMessage(blob: Blob, id: number) {
	ctx.postMessage({
		blobUrl: URL.createObjectURL(blob),
		id,
	} as WorkerFetchedDoneEvent['data'])
}

function getUrlsToFetch(item_s_: IMovieResultItem[] | IMovieResultItem): ToFetchImgOnWorker[] | ToFetchImgOnWorker {
	if (Array.isArray(item_s_))
		return item_s_.map(({poster_path, id}) => ({
			url: `${getPosterSrcPathPrefix()}${poster_path}`,
			id
		})) as ToFetchImgOnWorker[];
	else return {
		id: item_s_.id,
		url: `${getPosterSrcPathPrefix()}${item_s_.poster_path}`
	}
}

function fetchMovieBlob(url: string): Promise<Blob> {
	return new Promise<Blob>(resolve => {
		fetch(url)
			.then(res => res.blob())
			.then(resolve)
			.catch(console.error)
	})
}