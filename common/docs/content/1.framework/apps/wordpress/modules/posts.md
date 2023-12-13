# Posts

Import the module into your project:

```typescript
// app.module.ts
import { WordpressPostsModule } from '@juicyllama/app-wordpress'

@Module({
	imports: [WordpressPostsModule],
})
export class AppModule {}
```

Inject the service into your project:

```typescript
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

```typescript
const result = await this.wordpressPostsService.create({
	data: WordpressCreatePost,
	config: wordpressConfigDto,
})
```

#### Example

```typescript
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

```typescript
const result = await this.wordpressPostsService.findAll({
	arguments: WordpressListPosts,
	config: wordpressConfigDto,
})
```

### FindOne

```typescript
const result = await this.wordpressPostsService.findOne({
	postId: number,
	arguments: WordpressGetPost,
	config: wordpressConfigDto,
})
```

### Update

```typescript
const result = await this.wordpressPostsService.update({
	postId: number,
	data: WordpressUpdatePost,
	config: wordpressConfigDto,
})
```

### Remove

```typescript
const result = await this.wordpressPostsService.remove({
	postId: number,
	config: wordpressConfigDto,
})
```
