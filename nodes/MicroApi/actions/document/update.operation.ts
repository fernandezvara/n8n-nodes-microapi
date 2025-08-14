import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { apiRequest } from '../../transport';

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'hidden',
    default: 'update',
    displayOptions: {
      show: {
        resource: ['document'],
      },
    },
  },
  {
    displayName: 'Update Mode',
    name: 'updateMode',
    type: 'options',
    options: [
      { name: 'Replace (PUT)', value: 'put' },
      { name: 'Merge (PATCH)', value: 'patch' },
    ],
    default: 'patch',
    description: 'Choose PUT to replace or PATCH to merge',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['update'],
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
        operation: ['update'],
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
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Document ID',
    name: 'id',
    type: 'string',
    required: true,
    default: '',
    description: 'The unique document ID',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Document Data',
    name: 'documentData',
    type: 'json',
    required: true,
    default: '{}',
    description: 'The JSON data for the update',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['update'],
      },
    },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  const setName = this.getNodeParameter('setName', index) as string;
  const collectionName = this.getNodeParameter('collectionName', index) as string;
  const id = this.getNodeParameter('id', index) as string;
  const updateMode = this.getNodeParameter('updateMode', index) as 'put' | 'patch';
  const documentData = this.getNodeParameter('documentData', index) as object;

  const method = updateMode === 'put' ? 'PUT' : 'PATCH';
  const response = await apiRequest.call(
    this,
    method,
    `/${encodeURIComponent(setName)}/${encodeURIComponent(collectionName)}/${encodeURIComponent(id)}`,
    documentData,
  );

  const data = response?.data ?? response;
  return [{ json: data }];
}
