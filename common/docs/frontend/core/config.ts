import {extraLinks, homeLink} from "../../config";

export const frontendCoreTitle = 'JuicyLlama Frontend Core'
const root = '/frontend/core'

export const frontendCoreNavbar = [
	homeLink,
		{
			text: 'Getting Started',
			link: root,
		},
		{
			text: 'Components',
			children: [
				{
					text: 'Auth',
					children: [
						{
							text: 'Login',
							link: root+'/components/auth/login',
						},
					],
				},
				{
					text: 'Common',
					children: [
						{
							text: 'Form',
							link: root+'/components/common/form',
						},
						{
							text: 'Menu',
							link: root+'/components/common/menu',
						},
						{
							text: 'Table',
							link: root+'/components/common/table',
						},
						{
							text: 'Stats',
							link: root+'/components/common/stats',
						},
						{
							text: 'Chart',
							link: root+'/components/common/chart',
						},
					],
				},
				{
					text: 'Account',
					children: [
						{
							text: 'Avatar',
							link: root+'/components/account/avatar',
						},
						{
							text: 'Profile',
							link: root+'/components/account/profile',
						},
						{
							text: 'Switcher',
							link: root+'/components/account/switcher',
						},
					],
				},
				{
					text: 'Auth',
					children: [
						{
							text: 'Login',
							link: root+'/components/auth/login',
						},
						{
							text: 'OTP',
							link: root+'/components/auth/otp',
						},
						{
							text: 'Passwordless',
							link: root+'/components/auth/passwordless',
						},
						{
							text: 'Password Reset',
							link: root+'/components/auth/reset',
						},
						{
							text: 'Signup',
							link: root+'/components/auth/signup',
						},
					],
				},
				{
					text: 'Crm',
					children: [
						{
							text: 'Avatar',
							link: root+'/components/crm/avatar',
						},
					],
				},
				{
					text: 'User',
					children: [
						{
							text: 'Avatar',
							link: root+'/components/user/avatar',
						},
						{
							text: 'Avatar',
							link: root+'/components/user/avatar',
						},
						{
							text: 'Profile',
							link: root+'/components/user/profile',
						},
					],
				},
				{
					text: 'Users',
					children: [
						{
							text: 'Table',
							link: root+'/components/users/table',
						},
					],
				},
			],
		},
		{
			text: 'Helpers',
			children: [
				{
					text: 'Api',
					link: root+'/helpers/api',
				},
				{
					text: 'Auth',
					link: root+'/helpers/auth',
				},
				{
					text: 'Hooks',
					link: root+'/helpers/hooks',
				},
				{
					text: 'Locale',
					link: root+'/helpers/locale',
				},
				{
					text: 'Logger',
					link: root+'/helpers/logger',
				},
				{
					text: 'Pipes',
					link: root+'/helpers/pipes',
				},
				{
					text: 'Redirects',
					link: root+'/helpers/redirects',
				},
				{
					text: 'Strings',
					link: root+'/helpers/strings',
				},
				{
					text: 'Validators',
					link: root+'/helpers/validators',
				},
			],
		},
		{
			text: 'Plugins',
			children: [
				{
					text: 'Gravatar',
					link: root+'/plugins/gravatar',
				},
				{
					text: 'Pusher',
					link: root+'/plugins/pusher',
				},
			],
		},
		{
			text: 'Stores',
			children: [
				{
					text: 'Account',
					link: root+'/stores/account',
				},
				{
					text: 'Auth',
					link: root+'/stores/auth',
				},
				{
					text: 'Theme',
					link: root+'/stores/theme',
				},
				{
					text: 'Token',
					link: root+'/stores/token',
				},
			],
		},
		{
			text: 'Types',
			children: [
				{
					text: 'Common',
					link: root+'/types/common',
				},
				{
					text: 'Form',
					link: root+'/types/form',
				},
				{
					text: 'Table',
					link: root+'/types/table',
				},
			],
		},
	...extraLinks,
	]
