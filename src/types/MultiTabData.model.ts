import {ReduxState} from "./State";

export interface MultiTabData<T> {
    id: string,
    data: T,
    status: ReduxState
}