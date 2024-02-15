export enum ChatSelect {
	chat_id = 'chat_id',
}

export enum ChatOrderBy {
	chat_id = 'chat_id',
	last_message_at = 'last_message_at',
	created_at = 'created_at',
	updated_at = 'updated_at',
}

export enum ChatRelations {
	account = 'account',
	users = 'users',
	messages = 'messages',
}
