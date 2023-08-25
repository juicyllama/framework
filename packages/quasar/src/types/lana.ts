export enum LanaSuccessType {
	SUCCESS = 'SUCCESS', //The AI responses with a result
	SQL_ERROR = 'SQL_ERROR', //The SQL command failed and needs more training
	ERROR = 'ERROR', // Unknown error, we need to check the logs
	USER_HAPPY = 'USER_HAPPY', //User has signalled a successful response
	USER_NEUTRAL = 'USER_NEUTRAL', //User has signalled a neural response
	USER_SAD = 'USER_SAD', //User has signalled a negative response, more training needed
}
export interface Lana {
	readonly lana_id: number

	//The value the user passes to Lana
	request: string

	//Is this a general AI question?
	is_general?: boolean

	//Is this a SQL question?
	is_sql?: boolean

	app_integration_name?: string

	//The response from the AI model
	response?: string

	//If SQL, what is the response form the query
	sql_result?: string

	//the natural language Q&A version of the SQL result
	sql_result_nl?: string

	//Manually added training data to help the model improve
	training_response?: string

	//Did the AI generate the correct answer?
	success?: LanaSuccessType

	error_message?: string

	readonly created_at?: Date

	updated_at?: Date

	deleted_at?: Date

	is_error: boolean
}
