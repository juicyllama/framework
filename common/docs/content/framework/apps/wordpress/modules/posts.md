# Posts

Import the module into your project:

```ts
// app.module.ts
import { WordpressPostsModule } from '@juicyllama/app-wordpress'

@Module({
	imports: [WordpressPostsModule],
})
export class AppModule {}
```

Inject the service into your project:

```ts
// app.service.ts
import { WordpressPostsService } from '@juicyllama/app-wordpress'

@Injectable()
export class AppService {
	constructor(
		@Inject(forwardRef(() => WordpressPostsService)) private readonly wordpressPostsService: WordpressPostsService,
	) {}
}
```

## Methods

The following methods are available:

### Create

```ts
const result = await this.wordpressPostsService.create({
	data: WordpressCreatePost,
	config: wordpressConfigDto,
})
```

#### Example

```ts
const options = {
	data: <WordpressCreatePost>{
		title: 'Hello World',
		content: 'This is my first post!',
	},
	config: <wordpressConfigDto>{
		WORDPRESS_URL: 'https://example.com',
		WORDPRESS_USERNAME: 'username',
		WORDPRESS_APPLICATION_PASSWORD: 'password',
	},
}

const result = await this.wordpressPostsService.create(data)
//do your thing with the result
```

### FindAll

```ts
const result = await this.wordpressPostsService.findAll({
	arguments: WordpressListPosts,
	config: wordpressConfigDto,
})
```

### FindOne

```ts
const result = await this.wordpressPostsService.findOne({
	postId: number,
	arguments: WordpressGetPost,
	config: wordpressConfigDto,
})
```

### Update

```ts
const result = await this.wordpressPostsService.update({
	postId: number,
	data: WordpressUpdatePost,
	config: wordpressConfigDto,
})
```

### Remove

```ts
const result = await this.wordpressPostsService.remove({
	postId: number,
	config: wordpressConfigDto,
})
```
