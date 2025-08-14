import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { apiRequest } from '../../transport';

export const description: INodeProperties[] = [];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  // Maps to GET /_sets
  const response = await apiRequest.call(this, 'GET', '/_sets');
  const data = response?.data ?? response;
  return [{ json: data }];
}
