# n8n Nodes for Micro API

Custom n8n community node to interact with Micro API (schema-less JSON storage).

- Base URL-only credentials (no auth)
 - Resources: Document, Collection, Set
 - Document operations: Create, Query, Get, Update (PUT/PATCH), Delete
 - Collection operations: List, Delete All (optional where filter)
 - Set operations: List, Delete
 - Designed as Phase 5 of the project plan (n8n integration) for Micro API

## Install (Manual)

```bash
npm install
npm run build
```

Link to n8n custom directory:

```bash
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
npm init -y
npm install /absolute/path/to/n8n-nodes-microapi
```

Restart n8n. The node "Micro API" should appear. Configure credentials with your Micro API Base URL.

### Install in Docker (bind mount)

If you run n8n in Docker, bind-mount this folder into the container custom nodes path (build first so `dist/` exists):

```bash
# Build the node locally
npm install && npm run build

# Example docker run
docker run -it --rm \
  -p 5678:5678 \
  -v "$HOME/.n8n:/home/node/.n8n" \
  -v "/absolute/path/to/n8n-nodes-microapi:/home/node/.n8n/custom/n8n-nodes-microapi" \
  n8nio/n8n
```

## Usage

 - Resource: Document
   - Create → setName, collectionName, documentData (JSON)
   - Query → setName, collectionName, where (JSON), orderBy, limit, offset
   - Get → setName, collectionName, id
   - Update → updateMode (put|patch), setName, collectionName, id, documentData (JSON)
   - Delete → setName, collectionName, id
 - Resource: Collection
   - List → setName
   - Delete All → setName, collectionName, where (JSON, optional)
 - Resource: Set
   - List → (no parameters)
   - Delete → setName

Requests use `this.helpers.httpRequest` with JSON headers and Base URL from credentials. Expected Micro API response format:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

### Credentials

- Name: `Micro API`
- Field: `API URL` (e.g. `http://localhost:8080`)
- No authentication required.
 - Common URLs when using Docker:
   - Inside Docker network: `http://microapi:8080`
   - From host (outside): `http://localhost:8080`

### HTTP endpoint mapping

- Document
  - Create: `POST /{set}/{collection}` — body: document JSON
  - Query: `GET /{set}/{collection}` — qs: `where` (JSON string), `order_by`, `limit`, `offset`
  - Get: `GET /{set}/{collection}/{id}`
  - Update (PUT): `PUT /{set}/{collection}/{id}` — body: document JSON
  - Update (PATCH): `PATCH /{set}/{collection}/{id}` — body: partial JSON
  - Delete: `DELETE /{set}/{collection}/{id}`
- Collection
  - List: `GET /{set}`
  - Delete All: `DELETE /{set}/{collection}` — qs: `where` (JSON string, optional)
- Set
  - List: `GET /_sets`
  - Delete: `DELETE /{set}`

### Output behavior

- Responses unwrap Micro API’s standard wrapper. If `response.data` exists, that is used.
- Document Create/Query output one n8n item per returned document.
- Get/Update/Delete return a single item with the API response (often the document or an ack).

### Examples

- Import the demo workflow: `examples/workflows/microapi-demo.json`
  1) In n8n, click "Import from File".
  2) Select the JSON file above.
  3) Create credentials "Micro API" and set API URL.
  4) Execute the workflow.

See `examples/README.md` for a step-by-step guide and tips for running Micro API and n8n (including Docker-based setups).

## Development

```bash
npm run dev
npm run lint
npm run format
```

Structure:
- `credentials/MicroApiApi.credentials.ts`
- `nodes/MicroApi/MicroApi.node.ts`
- `nodes/MicroApi/transport/index.ts`
- `nodes/MicroApi/actions/document/*`
- `nodes/MicroApi/actions/collection/*`
- `nodes/MicroApi/actions/set/*`
- `nodes/MicroApi/microapi.svg`
- `dist/` (built output published by the package)

### Architecture (summary)

- Node: `Micro API` with resources `document`, `collection`, `set`.
- Transport: `nodes/MicroApi/transport/index.ts` uses Base URL from credentials and `this.helpers.httpRequest` with JSON.
- Error handling: throws by default; respects n8n’s "Continue On Fail" setting to output `{ error: message }` instead.
- Compatibility: `n8nNodesApiVersion: 1`, built with TypeScript, tested against `n8n-workflow ^1.25.0`.

License: MIT
