export enum NoticeType {
	INFO = 'info',
	SUCCESS = 'success',
	WARNING = 'warning',
	ERROR = 'error',
}

export interface NoticeProps {
	type: NoticeType
	message: string
}
