Keep AGENTS.md updated with project status

## Project status (2026-03-25)

- Added a typed API client core in `src/client.ts` using `ofetch`.
- Endpoint method/path validity and `path`/`query`/`body` typing are derived from `src/types/capawesome.ts`.
- Added method helpers (`get`, `post`, `put`, `patch`, `delete`, `head`, `options`, `trace`) and a generic `request` method.
- `src/index.ts` now exports client APIs and generated OpenAPI types.
- Updated tests in `test/index.test.ts` for path interpolation, query/body forwarding, auth headers, and missing path params.
- Updated `README.md` with client usage examples and response typing notes.
