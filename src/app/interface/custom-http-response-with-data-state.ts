import { DataState } from "../enum/datastate.enum";

export interface CustomHttpResponseWithDataState<T> {
  dataState: DataState;
  responseData: T;
}
