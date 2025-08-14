import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { apiRequest } from '../../transport';

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'hidden',
    default: 'query',
    displayOptions: {
      show: {
        resource: ['document'],
      },
    },
  },
  {
    displayName: 'Set Name',
    name: 'setName',
    type: 'string',
    required: true,
    default: '',
    description: 'The name of the set',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['query'],
      },
    },
  },
  {
    displayName: 'Collection Name',
    name: 'collectionName',
    type: 'string',
    required: true,
    default: '',
    description: 'The name of the collection',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['query'],
      },
    },
  },
  {
    displayName: 'Where (JSON)',
    name: 'where',
    type: 'json',
    default: '{}',
    description: 'MongoDB-like filter object (e.g. {"age": {"$gt": 25}})',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['query'],
      },
    },
  },
  {
    displayName: 'Order By',
    name: 'orderBy',
    type: 'string',
    default: '',
    description: 'Field to order by (e.g. created_at)',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['query'],
      },
    },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    description: 'Maximum number of results to return',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['query'],
      },
    },
  },
  {
    displayName: 'Offset',
    name: 'offset',
    type: 'number',
    typeOptions: { minValue: 0 },
    default: 0,
    description: 'Number of results to skip',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['query'],
      },
    },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  const setName = this.getNodeParameter('setName', index) as string;
  const collectionName = this.getNodeParameter('collectionName', index) as string;
  const whereParam = this.getNodeParameter('where', index) as unknown;
  const orderBy = this.getNodeParameter('orderBy', index) as string;
  const limit = this.getNodeParameter('limit', index) as number;
  const offset = this.getNodeParameter('offset', index) as number;

  const qs: Record<string, any> = {};
  // Accept both object value and JSON string; only send when non-empty object
  let whereObj: unknown = undefined;
  if (typeof whereParam === 'string') {
    const trimmed = whereParam.trim();
    if (trimmed) {
      try {
        whereObj = JSON.parse(trimmed);
      } catch {
        // Not valid JSON; do not send `where`
      }
    }
  } else if (whereParam && typeof whereParam === 'object') {
    whereObj = whereParam;
  }

  const isPlainObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null && !Array.isArray(v);

  if (isPlainObject(whereObj) && Object.keys(whereObj).length > 0) {
    qs.where = JSON.stringify(whereObj);
  }
  if (orderBy) qs.order_by = orderBy;
  if (typeof limit === 'number') qs.limit = limit;
  if (typeof offset === 'number') qs.offset = offset;

  const response = await apiRequest.call(this, 'GET', `/${encodeURIComponent(setName)}/${encodeURIComponent(collectionName)}`, undefined, qs);

  // Expect Micro API standard wrapper { success, data, error }
  const data = Array.isArray(response?.data) ? response.data : response?.data ?? response;
  const items = Array.isArray(data) ? data : [data];
  return items.map((d) => ({ json: d }));
}
