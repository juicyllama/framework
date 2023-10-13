import instance from './index'

type UploadAPIResponse = {
	data: object
}

const UPLOAD_URL = '/users/upload_csv'

const uploadFile = async (fileData: object): Promise<UploadAPIResponse> => {
	return await instance.post(UPLOAD_URL, fileData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})
}

export { uploadFile }
