import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { apiRequest } from '../../transport';

export const description: INodeProperties[] = [];

export async function execute(this: IExecuteFunctions, _index: number): Promise<INodeExecutionData[]> {
  // Mark parameter as intentionally unused for linting
  void _index;
  // Maps to GET /_sets
  const response = await apiRequest.call(this, 'GET', '/_sets');
  const data = (response as IDataObject)?.data ?? response;
  const json: IDataObject =
    data !== null && typeof data === 'object' && !Array.isArray(data)
      ? (data as IDataObject)
      : Array.isArray(data)
        ? { data }
        : { data: data };
  return [{ json }];
}
