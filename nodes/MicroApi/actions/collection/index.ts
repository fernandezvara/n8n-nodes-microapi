import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import * as listOp from './list.operation';
import * as deleteAllOp from './deleteAll.operation';

export const descriptions: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['collection'],
      },
    },
    options: [
      {
        name: 'List',
        value: 'list',
        description: 'List collections and stats for a set',
        action: 'List collections',
      },
      {
        name: 'Delete All',
        value: 'deleteAll',
        description: 'Delete all documents in a collection',
        action: 'Delete all documents in collection',
      },
    ],
    default: 'list',
  },
  ...listOp.description,
  ...deleteAllOp.description,
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[] | object> {
  const operation = this.getNodeParameter('operation', index) as string;

  if (operation === 'list') {
    return await listOp.execute.call(this, index);
  }
  if (operation === 'deleteAll') {
    return await deleteAllOp.execute.call(this, index);
  }

  throw new Error(`Operation "${operation}" is not implemented for collection.`);
}
