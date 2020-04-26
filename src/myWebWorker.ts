import ToFetchImgOnWorker from "./interfaces/custom-events-types/ToFetchImgOnWorker";
import WorkerFetchedDoneEvent from "./interfaces/custom-events-types/WorkerFetchedDoneEvent";
import IMovieResultItem from "./interfaces/app-types/IMovieResultItem";
import appProperties from "./appProperties";

const {getPosterSrcPathPrefix} = appProperties;

// @ts-ignore
// eslint-disable-next-line no-restricted-globals
const ctx: DedicatedWorkerGlobalScope = self as any;


ctx.onmessage = event => {
	const URLsToFetch: ToFetchImgOnWorker[] = getUrlsToFetch(event.data);

	URLsToFetch.forEach(obj =>
		fetchMovieBlob(obj.url)
			.then(blob => postMessage(blob, obj.id))
	);
};


function postMessage(blob: Blob, id: number) {
	ctx.postMessage({
		blobUrl: URL.createObjectURL(blob),
		id,
	} as WorkerFetchedDoneEvent['data'])
}

function getUrlsToFetch(item_s_: IMovieResultItem[]): ToFetchImgOnWorker[] {
	return item_s_.map(({poster_path, id}) => ({
		url: `${getPosterSrcPathPrefix()}${poster_path}`,
		id
	})) as ToFetchImgOnWorker[];
}

function fetchMovieBlob(url: string): Promise<Blob> {
	return new Promise<Blob>(resolve => {
		fetch(url)
			.then(res => res.blob())
			.then(resolve)
			.catch(console.error)
	})
}