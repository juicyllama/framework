# Getting Started

The QR Code package allows you to generate QR codes. 

This module will generate the QR Code based on a large number of options. It will then save it into your S3 bucket and return the details for passing back to the client.

You can also list all the QR Codes that have been generated, as well as delete them.

## Install

Follow these instructions to use the QR code tool in your project.

### Package

Install the package into your project:

```bash
npm install @juicyllama/tools-qrcodes
```

### Api Backend

Import the module into your application:

```typescript
//app.module.ts
import { QRCodeModule } from '@juicyllama/tools-qrcodes'

@Module({
	imports: [
		forwardRef(() => QRCodeModule),
	],
})
```

Add the documentation helper into your swagger config

```typescript
//main.ts
import { installToolsQRCodeDocs } from '@juicyllama/tools-qrcodes'

//place this below the swagger setup
redoc = installToolsQRCodeDocs(redoc)
```

Visit [usage](/tools/qrcodes/usage) for more details on how to use the package.