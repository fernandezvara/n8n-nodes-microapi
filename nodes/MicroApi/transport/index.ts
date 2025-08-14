import type { IExecuteFunctions, IHttpRequestMethods, IHttpRequestOptions, IDataObject } from 'n8n-workflow';

export async function apiRequest(
  this: IExecuteFunctions,
  method: string,
  path: string,
  body?: unknown,
  qs?: IDataObject,
): Promise<IDataObject> {
  const credentials = await this.getCredentials('microApiApi');
  const base = (credentials.apiUrl as string).replace(/\/$/, '');
  const urlPath = path.startsWith('/') ? path : `/${path}`;

  const options: IHttpRequestOptions = {
    method: method as IHttpRequestMethods,
    url: `${base}${urlPath}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    json: true,
  };

  if (body !== undefined) options.body = body as object;
  if (qs !== undefined) options.qs = qs;

  // Use built-in helper (no auth required)
  const response = await this.helpers.httpRequest(options);
  return response;
}
