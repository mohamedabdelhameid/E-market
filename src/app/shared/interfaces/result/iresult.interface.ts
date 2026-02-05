export interface Iresult<T> {
  results: number;
  metadata: Metadata;
  data: T;
}

export interface Metadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage: number;
}
