export enum AiSQLTypes {
	SELECT = 'SELECT',
}

export enum AiSuccessType {
	SUCCESS = 'SUCCESS', //The AI responses with a result
	SQL_ERROR = 'SQL_ERROR', //The SQL command failed and needs more training
	ERROR = 'ERROR', // Unknown error, we need to check the logs
	USER_HAPPY = 'USER_HAPPY', //User has signalled a successful response
	USER_NEUTRAL = 'USER_NEUTRAL', //User has signalled a neural response
	USER_SAD = 'USER_SAD', //User has signalled a negative response, more training needed
}
