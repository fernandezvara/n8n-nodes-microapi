import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { apiRequest } from '../../transport';

export const description: INodeProperties[] = [
  {
    displayName: 'Set Name',
    name: 'setName',
    type: 'string',
    required: true,
    default: '',
    description: 'The name of the set to list collections for',
    displayOptions: {
      show: {
        resource: ['collection'],
        operation: ['list'],
      },
    },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  const setName = this.getNodeParameter('setName', index) as string;

  // Maps to GET /{set}
  const response = await apiRequest.call(this, 'GET', `/${encodeURIComponent(setName)}`);
  const data = (response as IDataObject)?.data ?? response;
  const json: IDataObject =
    data !== null && typeof data === 'object' && !Array.isArray(data)
      ? (data as IDataObject)
      : { data };
  return [{ json }];
}
