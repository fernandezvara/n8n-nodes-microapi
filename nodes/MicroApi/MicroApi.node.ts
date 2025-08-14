import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import * as document from './actions/document';
import * as collection from './actions/collection';
import * as set from './actions/set';

export class MicroApi implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Micro API',
    name: 'microApi',
    icon: 'file:microapi.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Micro API for schema-less JSON storage',
    defaults: {
      name: 'Micro API',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'microApiApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Document',
            value: 'document',
          },
          { name: 'Collection', value: 'collection' },
          { name: 'Set', value: 'set' },
        ],
        default: 'document',
      },
      ...document.descriptions,
      ...collection.descriptions,
      ...set.descriptions,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter('resource', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: unknown;

        if (resource === 'document') {
          responseData = await document.execute.call(this, i);
        } else if (resource === 'collection') {
          responseData = await collection.execute.call(this, i);
        } else if (resource === 'set') {
          responseData = await set.execute.call(this, i);
        } else {
          throw new NodeOperationError(this.getNode(), `Resource "${resource}" is not supported yet.`, { itemIndex: i });
        }

        const normalize = (d: unknown): IDataObject =>
          d !== null && typeof d === 'object' && !Array.isArray(d) ? (d as IDataObject) : { data: d as never };

        if (Array.isArray(responseData)) {
          returnData.push(...responseData.map((d) => ({ json: normalize(d) })));
        } else if (responseData !== undefined) {
          returnData.push({ json: normalize(responseData) });
        } else {
          returnData.push({ json: { success: true } });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
