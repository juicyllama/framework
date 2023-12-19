# Storage

The storage module abstracts away the saving of data (files, images, etc) to the cloud, this allows you to switch cloud providers without changing any code. Simply install a different cloud storage provider.

This module currently supports:

- [AWS S3](../../../apps/aws/modules/s3.md)

## Install

This module is part of our core framework and therefore does not need installing seperatly. 

### Api Backend

Import the module into your application:

```typescript
//app.module.ts
import { StorageModule } from '@juicyllama/core'

@Module({
	imports: [
		StorageModule,
	],
})
```

## Providers

### S3 Buckets

The system ships with the ability to have private and public buckets, alternativly you can pass any bucket name in the `permissions` param to override this.

- Private - Can only be read by the application and is not available online. This is helpful for storing client sensative data like invoices or document.
- Public - Can be both read by the application and the public internet. This is good for saving public facing user avatars or other public files.

Learn more about how to setup these buckets in the [AWS S3 docs](../../../apps/aws/modules/s3.md).

## Services

Use the following operations to read, write, list and delete data in the cloud.

First setup the service:

```typescript
// app.service.ts
import { StorageService, StorageFileType } from '@juicyllama/core'

@Injectable()
export class AppService {
	constructor(@Inject(StorageService) private readonly storageService: StorageService) {}
}
```

Then you can call the following functions:

### Write

Write files to the cloud

```typescript
async function writeSomething(file: Blob){
    const result = await this.storageService.write({
        location: '/path/to/save/file/to/file.ext',
		permissions: StorageFileType.PRIVATE,
		format: StorageFileFormat.BLOB,
		file: file,
    })
}
```

### Read

Read file from the cloud

```typescript
async function readSomething(){
    const result = await this.storageService.read({
        location: '/path/to/read/file/from/file.ext',
		permissions: StorageFileType.PRIVATE,
		format: StorageFileFormat.BLOB,
    })
}
```

### List

List files from the cloud

```typescript
async function listFiles(){
    const result = await this.storageService.list({
        location: '/path/to/read/file/from',
		permissions: StorageFileType.PRIVATE
    })
}
```

### Delete

Delete a file from the cloud

```typescript
async function readSomething(){
    const result = await this.storageService.del({
        location: '/path/to/delete/file/from/file.ext',
		permissions: StorageFileType.PRIVATE
    })
}
```