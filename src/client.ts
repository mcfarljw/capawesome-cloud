import { ofetch } from "ofetch";
import type { $Fetch, FetchOptions } from "ofetch";
import type { paths } from "./types/capawesome.js";

const CAPAWESOME_API_BASE_URL = "https://api.cloud.capawesome.io";

type ApiPath = keyof paths & string;

export type CapawesomeHttpMethod =
  | "delete"
  | "get"
  | "head"
  | "options"
  | "patch"
  | "post"
  | "put"
  | "trace";

type OperationForMethod<Path extends ApiPath, Method extends CapawesomeHttpMethod> = NonNullable<
  paths[Path][Method]
>;

export type CapawesomePathForMethod<Method extends CapawesomeHttpMethod> = {
  [Path in ApiPath]: [OperationForMethod<Path, Method>] extends [never] ? never : Path;
}[ApiPath];

type OperationParameters<Operation> = Operation extends { parameters: infer Params }
  ? Params
  : never;

type NormalizeOptional<T> = [NonNullable<T>] extends [never] ? never : NonNullable<T>;

type PathParameters<Operation> =
  OperationParameters<Operation> extends { path: infer Params }
    ? NormalizeOptional<Params>
    : OperationParameters<Operation> extends { path?: infer Params }
      ? NormalizeOptional<Params>
      : never;

type QueryParameters<Operation> =
  OperationParameters<Operation> extends { query: infer Params }
    ? NormalizeOptional<Params>
    : OperationParameters<Operation> extends { query?: infer Params }
      ? NormalizeOptional<Params>
      : never;

type RequestBody<Operation> = Operation extends { requestBody?: infer Body }
  ? NormalizeOptional<Body> extends { content: infer Content }
    ? Content[keyof Content]
    : never
  : never;

type PathOptions<Operation> = [PathParameters<Operation>] extends [never]
  ? { path?: never }
  : { path: PathParameters<Operation> };

type QueryOptions<Operation> = [QueryParameters<Operation>] extends [never]
  ? { query?: never }
  : { query?: QueryParameters<Operation> };

type BodyOptions<Operation> = [RequestBody<Operation>] extends [never]
  ? { body?: never }
  : { body?: RequestBody<Operation> };

type RequestExecutionOptions = Omit<FetchOptions, "baseURL" | "body" | "method" | "query">;

export type CapawesomeRequestOptions<
  Method extends CapawesomeHttpMethod,
  Path extends CapawesomePathForMethod<Method>,
> = RequestExecutionOptions &
  PathOptions<OperationForMethod<Path, Method>> &
  QueryOptions<OperationForMethod<Path, Method>> &
  BodyOptions<OperationForMethod<Path, Method>>;

export interface CapawesomeClientOptions {
  baseURL?: string;
  fetch?: typeof globalThis.fetch;
  fetchOptions?: RequestExecutionOptions;
  headers?: HeadersInit;
  token?: string;
}

const PATH_PARAMETER_PATTERN = /\{([^}]+)\}/g;

function resolvePath(pathTemplate: string, pathParameters?: Record<string, unknown>): string {
  return pathTemplate.replace(
    PATH_PARAMETER_PATTERN,
    (_match: string, parameterName: string): string => {
      const value = pathParameters?.[parameterName];
      if (value === undefined || value === null) {
        throw new Error(`Missing path parameter "${parameterName}" for "${pathTemplate}"`);
      }
      return encodeURIComponent(String(value));
    },
  );
}

export class CapawesomeClient {
  private readonly fetcher: $Fetch;

  constructor(options: CapawesomeClientOptions = {}) {
    const headers = new Headers(options.headers);

    if (options.token) {
      headers.set("authorization", `Bearer ${options.token}`);
    }

    this.fetcher = ofetch.create(
      {
        ...options.fetchOptions,
        baseURL: options.baseURL ?? CAPAWESOME_API_BASE_URL,
        headers,
      },
      options.fetch ? { fetch: options.fetch } : undefined,
    );
  }

  request<
    Response = unknown,
    Method extends CapawesomeHttpMethod = CapawesomeHttpMethod,
    Path extends CapawesomePathForMethod<Method> = CapawesomePathForMethod<Method>,
  >(
    method: Method,
    path: Path,
    options?: CapawesomeRequestOptions<Method, Path>,
  ): Promise<Response> {
    const {
      body,
      path: pathParameters,
      query,
      ...fetchOptions
    } = (options ?? {}) as {
      body?: FetchOptions["body"];
      path?: Record<string, unknown>;
      query?: Record<string, unknown>;
    } & RequestExecutionOptions;

    return this.fetcher(resolvePath(path, pathParameters), {
      ...fetchOptions,
      body,
      method: method.toUpperCase(),
      query,
    }) as Promise<Response>;
  }

  get<
    Response = unknown,
    Path extends CapawesomePathForMethod<"get"> = CapawesomePathForMethod<"get">,
  >(path: Path, options?: CapawesomeRequestOptions<"get", Path>): Promise<Response> {
    return this.request<Response, "get", Path>("get", path, options);
  }

  post<
    Response = unknown,
    Path extends CapawesomePathForMethod<"post"> = CapawesomePathForMethod<"post">,
  >(path: Path, options?: CapawesomeRequestOptions<"post", Path>): Promise<Response> {
    return this.request<Response, "post", Path>("post", path, options);
  }

  put<
    Response = unknown,
    Path extends CapawesomePathForMethod<"put"> = CapawesomePathForMethod<"put">,
  >(path: Path, options?: CapawesomeRequestOptions<"put", Path>): Promise<Response> {
    return this.request<Response, "put", Path>("put", path, options);
  }

  patch<
    Response = unknown,
    Path extends CapawesomePathForMethod<"patch"> = CapawesomePathForMethod<"patch">,
  >(path: Path, options?: CapawesomeRequestOptions<"patch", Path>): Promise<Response> {
    return this.request<Response, "patch", Path>("patch", path, options);
  }

  delete<
    Response = unknown,
    Path extends CapawesomePathForMethod<"delete"> = CapawesomePathForMethod<"delete">,
  >(path: Path, options?: CapawesomeRequestOptions<"delete", Path>): Promise<Response> {
    return this.request<Response, "delete", Path>("delete", path, options);
  }

  head<
    Response = unknown,
    Path extends CapawesomePathForMethod<"head"> = CapawesomePathForMethod<"head">,
  >(path: Path, options?: CapawesomeRequestOptions<"head", Path>): Promise<Response> {
    return this.request<Response, "head", Path>("head", path, options);
  }

  options<
    Response = unknown,
    Path extends CapawesomePathForMethod<"options"> = CapawesomePathForMethod<"options">,
  >(path: Path, options?: CapawesomeRequestOptions<"options", Path>): Promise<Response> {
    return this.request<Response, "options", Path>("options", path, options);
  }

  trace<
    Response = unknown,
    Path extends CapawesomePathForMethod<"trace"> = CapawesomePathForMethod<"trace">,
  >(path: Path, options?: CapawesomeRequestOptions<"trace", Path>): Promise<Response> {
    return this.request<Response, "trace", Path>("trace", path, options);
  }
}

export function createCapawesomeClient(options?: CapawesomeClientOptions): CapawesomeClient {
  return new CapawesomeClient(options);
}
