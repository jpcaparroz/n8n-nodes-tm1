import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class TM1Api implements ICredentialType {
	name = 'tm1Api';
	displayName = 'TM1 API Credentials';
	documentationUrl = 'https://www.ibm.com/docs/en/planning-analytics/2.0.0?topic=analytics-tm1-rest-api';

	properties: INodeProperties[] = [
		{
			displayName: 'Security Mode',
			name: 'security_mode',
			type: 'options',
			default: '5',
			options: [
				{ name: '1', value: '1', description: 'Basic Auth (TM1 Integrated Login)' },
				{ name: '5', value: '5', description: 'CAM Namespace Auth (LDAP)' },
			],
		},
		{
			displayName: 'Base URL',
			name: 'base_url',
			type: 'string',
			default: '',
			placeholder: 'http://localhost:12354/api/v1',
		},
		{
			displayName: 'Namespace',
			name: 'namespace',
			type: 'string',
			default: '',
			placeholder: 'LDAP',
			displayOptions: {
				show: { security_mode: ['5'] },
			},
		},
		{
			displayName: 'Username',
			name: 'user',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'SSL',
			name: 'ssl',
			type: 'boolean',
			default: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{ "Basic " + $base64Encode(`${$credentials.user}:${$credentials.password}`) }}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.base_url}}',
			url: '/Configuration/ProductVersion',
			method: 'GET',
		},
	};
}
