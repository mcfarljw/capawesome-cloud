# @mcfarljw/capawesome-cloud

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/mcfarljw/capawesome-cloud?color=yellow)](https://npmjs.com/package/mcfarljw/capawesome-cloud)
[![npm downloads](https://img.shields.io/npm/dm/mcfarljw/capawesome-cloud?color=yellow)](https://npm.chart.dev/mcfarljw/capawesome-cloud)

<!-- /automd -->

## Usage

Install the package:

```sh
npx nypm install @mcfarljw/capawesome-cloud

```

Create a client:

```ts
import { createCapawesomeClient } from "@mcfarljw/capawesome-cloud";

const client = createCapawesomeClient({
  token: process.env.CAPAWESOME_TOKEN,
});
```

Call endpoints with typed `path`, `query`, and `body` options inferred from the
OpenAPI-generated types in `src/types/capawesome.ts`:

```ts
const apps = await client.get("/v1/apps", {
  query: { limit: "20" },
});

await client.post("/v1/apps/{appId}/channels", {
  path: { appId: "app_123" },
  body: { name: "production" },
});
```

Responses currently default to `unknown` because the generated OpenAPI operation
types expose `responses: never`. You can provide a response type when you call
the client:

```ts
const app = await client.get<{ data: { id: string; name: string } }>("/v1/apps/{appId}", {
  path: { appId: "app_123" },
});
```

You can also use the generic `request` method if you prefer passing an explicit
HTTP method:

```ts
const builds = await client.request("get", "/v1/apps/{appId}/builds", {
  path: { appId: "app_123" },
  query: { limit: "10" },
});
```

## Development

<details>

<summary>local development</summary>

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

</details>

## License

Published under the [MIT](https://github.com/mcfarljw/capawesome-cloud/blob/main/LICENSE) license 💛.
