import { Buffer } from 'buffer';
import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

export class TM1Node implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TM1 Node',
		name: 'tm1Node',
		group: ['transform'],
		version: 1,
		description: 'Node to interact with TM1 API',
		defaults: {
			name: 'TM1 Node',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'tm1Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Caminho da API',
				name: 'endpoint',
				type: 'string',
				default: '/Cubes',
				placeholder: '/Cubes?$select=Name',
				description: 'Endpoint da API do TM1',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Pega as credenciais
		const credentials = await this.getCredentials('tm1Api');

		for (let i = 0; i < items.length; i++) {
			const endpoint = this.getNodeParameter('endpoint', i) as string;

			const authorizationHeader =
				credentials.security_mode === '5'
					? `CAMNamespace ${Buffer.from(`${credentials.user}:${credentials.password}:${credentials.namespace}`).toString('base64')}`
					: `Basic ${Buffer.from(`${credentials.user}:${credentials.password}`).toString('base64')}`;

			const options = {
				method: 'GET' as 'GET',
				url: `${credentials.base_url}${endpoint}`,
				headers: {
					'Content-Type': 'application/json',
					Authorization: authorizationHeader,
				},
			};

			try {
				const response = await this.helpers.request(options);
				returnData.push({ json: authorizationHeader ? JSON.parse(response) : { message: 'No data returned' } });
			} catch (error) {
				returnData.push({ json: { error: error.message } });
			}
		}

		return [returnData];
	}
}
