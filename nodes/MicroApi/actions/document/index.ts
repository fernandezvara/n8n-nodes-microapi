import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import * as createOp from './create.operation';
import * as queryOp from './query.operation';
import * as getOp from './get.operation';
import * as updateOp from './update.operation';
import * as deleteOp from './delete.operation';

export const descriptions: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['document'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new document',
        action: 'Create document',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a document by ID',
        action: 'Delete document',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a document by ID',
        action: 'Get document',
      },
      {
        name: 'Query',
        value: 'query',
        description: 'Query documents in a collection',
        action: 'Query documents',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a document (PUT/PATCH)',
        action: 'Update document',
      },
    ],
    default: 'create',
  },
  ...createOp.description,
  ...queryOp.description,
  ...getOp.description,
  ...updateOp.description,
  ...deleteOp.description,
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[] | object> {
  const operation = this.getNodeParameter('operation', index) as string;

  if (operation === 'create') {
    return await createOp.execute.call(this, index);
  }
  if (operation === 'query') {
    return await queryOp.execute.call(this, index);
  }
  if (operation === 'get') {
    return await getOp.execute.call(this, index);
  }
  if (operation === 'update') {
    return await updateOp.execute.call(this, index);
  }
  if (operation === 'delete') {
    return await deleteOp.execute.call(this, index);
  }

  throw new Error(`Operation "${operation}" is not implemented yet.`);
}
