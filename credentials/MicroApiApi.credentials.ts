import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class MicroApiApi implements ICredentialType {
  name = 'microApiApi';
  displayName = 'Micro API';
  documentationUrl = 'https://github.com/fernandezvara/microapi';

  properties: INodeProperties[] = [
    {
      displayName: 'API URL',
      name: 'apiUrl',
      type: 'string',
      default: 'http://localhost:8080',
      placeholder: 'https://api.example.com',
      required: true,
      description: 'Base URL of your Micro API instance. No authentication required.',
    },
  ];
}
