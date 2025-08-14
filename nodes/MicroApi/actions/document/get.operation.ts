import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { apiRequest } from '../../transport';

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'hidden',
    default: 'get',
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
        operation: ['get'],
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
        operation: ['get'],
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
        operation: ['get'],
      },
    },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  const setName = this.getNodeParameter('setName', index) as string;
  const collectionName = this.getNodeParameter('collectionName', index) as string;
  const id = this.getNodeParameter('id', index) as string;

  const response = await apiRequest.call(
    this,
    'GET',
    `/${encodeURIComponent(setName)}/${encodeURIComponent(collectionName)}/${encodeURIComponent(id)}`,
  );

  const data = (response as IDataObject)?.data ?? response;
  const json: IDataObject =
    data !== null && typeof data === 'object' && !Array.isArray(data)
      ? (data as IDataObject)
      : { data };
  return [{ json }];
}
