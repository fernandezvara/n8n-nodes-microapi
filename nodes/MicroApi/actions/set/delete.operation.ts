import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { apiRequest } from '../../transport';

export const description: INodeProperties[] = [
  {
    displayName: 'Set Name',
    name: 'setName',
    type: 'string',
    required: true,
    default: '',
    description: 'The name of the set to delete',
    displayOptions: {
      show: {
        resource: ['set'],
        operation: ['delete'],
      },
    },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  const setName = this.getNodeParameter('setName', index) as string;

  // Maps to DELETE /{set}
  const response = await apiRequest.call(this, 'DELETE', `/${encodeURIComponent(setName)}`);
  const data = response?.data ?? response;
  return [{ json: data }];
}
