import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { apiRequest } from '../../transport';

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'hidden',
    default: 'create',
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
        operation: ['create'],
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
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Document Data',
    name: 'documentData',
    type: 'json',
    required: true,
    default: '{}',
    description: 'The JSON data for the document',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['create'],
      },
    },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  const setName = this.getNodeParameter('setName', index) as string;
  const collectionName = this.getNodeParameter('collectionName', index) as string;
  const documentData = this.getNodeParameter('documentData', index) as object;

  const response = await apiRequest.call(this, 'POST', `/${encodeURIComponent(setName)}/${encodeURIComponent(collectionName)}`, documentData);

  const data = (response && response.data !== undefined) ? response.data : response;
  const items = Array.isArray(data) ? data : [data];
  return items.map((d) => ({ json: d }));
}
