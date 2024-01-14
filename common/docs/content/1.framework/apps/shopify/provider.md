# Using the Shopify Instance Directly

To make use of the `Shopify` instance directly, import the module into your project:

```ts
// foo.module.ts
import { ShopifyProviderModule } from '@juicyllamma/app-shopify'

@Module({
	imports: [ShopifyProviderModule],
	providers: [FooService],
})
export class FooModule {}
```

Now inside of `FooService` you can use the `@InjectShopify()` decorator to get the `Shopify` instance

```ts
// foo.service.ts
import { InjectShopify } from '@juicyllama/app-shopify'
import { Shopify } from '@shopify/shopify-api'

@Injectable()
export class FooService {
	constructor(@InjectShopify() private readonly shopify: Shopify) {}

	...
}
```
