import {extraLinks, homeLink} from "../../config";

export const coreTitle = 'JuicyLlama Core'
const root = '/backend/core'
export const coreNavbar = [
	homeLink,
	{
			text: 'Getting Started',
			link: root,
		},
		{
			text: 'Decorators',
			children: [
				{
					text: 'Security', // accountID && userAuth
					link: root+'/decorators/security',
				},
				{
					text: 'CRUD',
					link: root+'/decorators/crud',
				},
				{
					text: 'Swagger',
					link: root+'/decorators/swagger',
				},
			],
		},
		{
			text: 'Helpers',
			children: [
				{
					text: 'Entity',
					link: root+'/helpers/entity',
				},
				{
					text: 'Service',
					link: root+'/helpers/service',
				},
				{
					text: 'Controller',
					link: root+'/helpers/controller',
				},
				{
					text: 'Cron',
					link: root+'/helpers/cron',
				},
			],
		},
		{
			text: 'Middlewares',
			link: root+'/middlewares',
		},
		{
			text: 'Modules',
			children: [
				{
					text: 'Auth',
					link: root+'/modules/auth',
				},
				{
				text: 'Beacon',
				link: root+'/modules/beacon',
			},
			],
		},
		{
			text: 'Testing',
			link: root+'/testing',
		},
		{
			text: 'Utils',
			children: [
				{
					text: 'RabbitMQ',
					link: root+'/utils/rabbitmq',
				},
				{
					text: 'TypeORM',
					link: root+'/utils/typeorm',
				},
			],
		},
	...extraLinks,
	]