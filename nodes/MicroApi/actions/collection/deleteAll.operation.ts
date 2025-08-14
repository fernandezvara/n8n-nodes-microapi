import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { apiRequest } from '../../transport';

export const description: INodeProperties[] = [
  {
    displayName: 'Set Name',
    name: 'setName',
    type: 'string',
    required: true,
    default: '',
    description: 'The name of the set',
    displayOptions: {
      show: {
        resource: ['collection'],
        operation: ['deleteAll'],
      },
    },
  },
  {
    displayName: 'Collection Name',
    name: 'collectionName',
    type: 'string',
    required: true,
    default: '',
    description: 'The name of the collection to delete',
    displayOptions: {
      show: {
        resource: ['collection'],
        operation: ['deleteAll'],
      },
    },
  },
  {
    displayName: 'Where (JSON)',
    name: 'where',
    type: 'json',
    default: '{}',
    description: 'Optional filter to conditionally delete documents',
    displayOptions: {
      show: {
        resource: ['collection'],
        operation: ['deleteAll'],
      },
    },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  const setName = this.getNodeParameter('setName', index) as string;
  const collectionName = this.getNodeParameter('collectionName', index) as string;
  const where = this.getNodeParameter('where', index) as IDataObject;

  const qs: IDataObject = {};
  if (where && Object.keys(where).length) qs.where = JSON.stringify(where);

  const response = await apiRequest.call(
    this,
    'DELETE',
    `/${encodeURIComponent(setName)}/${encodeURIComponent(collectionName)}`,
    undefined,
    qs,
  );

  const data = (response as IDataObject)?.data ?? response;
  const json: IDataObject =
    data !== null && typeof data === 'object' && !Array.isArray(data)
      ? (data as IDataObject)
      : { data };
  return [{ json }];
}
