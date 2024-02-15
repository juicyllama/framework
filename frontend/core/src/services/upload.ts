import instance from './index'
import { accountStore } from '../index'

type UploadAPIResponse = {
	data: object
}

const UPLOAD_FIELDS = '/upload/fields'

const uploadFile = async (UPLOAD_URL: string, fileData: object): Promise<UploadAPIResponse> => {
	return await instance.post(UPLOAD_URL, fileData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})
}

// const uploadMetadata = async (obj: object): Promise<UploadAPIResponse> => {
// 	instance.defaults.headers.common['account-id'] = accountStore.selected_account?.account_id
// 	return await instance.post(UPLOAD_URL, obj)
// }

const getUploadFields = async (): Promise<{
	data: string[]
}> => {
	instance.defaults.headers.common['account-id'] = accountStore.selected_account?.account_id
	return await instance.get(UPLOAD_FIELDS)
}

export { uploadFile, getUploadFields }
