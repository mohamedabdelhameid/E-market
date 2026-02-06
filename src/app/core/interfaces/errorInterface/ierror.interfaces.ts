export interface Ierror {
  headers: Headers;
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  redirected: boolean;
  responseType: string;
  name: string;
  message: string;
  error: Error;
}

export interface Headers {
  headers: Headers2;
  normalizedNames: NormalizedNames;
  lazyUpdate: any;
}

export interface Headers2 {}

export interface NormalizedNames {}

export interface Error {
  statusMsg: string;
  message: string;
  errors?: {
    location: string;
    msg: string;
    param: string;
    value: string;
  };
}
