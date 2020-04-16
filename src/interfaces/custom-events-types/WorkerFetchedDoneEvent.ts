interface WorkerFetchedDoneEvent extends MessageEvent {
    data: WorkerFetchedDoneEventData
}

interface WorkerFetchedDoneEventData {
    blobUrl: string,
    id: number
}

export default WorkerFetchedDoneEvent;