import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import * as listOp from './list.operation';
import * as deleteOp from './delete.operation';

export const descriptions: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['set'],
      },
    },
    options: [
      {
        name: 'List',
        value: 'list',
        description: 'List all sets and stats',
        action: 'List sets',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a set (requires server flag)',
        action: 'Delete set',
      },
    ],
    default: 'list',
  },
  ...listOp.description,
  ...deleteOp.description,
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[] | object> {
  const operation = this.getNodeParameter('operation', index) as string;

  if (operation === 'list') {
    return await listOp.execute.call(this, index);
  }
  if (operation === 'delete') {
    return await deleteOp.execute.call(this, index);
  }

  throw new Error(`Operation "${operation}" is not implemented for set.`);
}
