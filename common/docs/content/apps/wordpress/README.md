# Getting Started

The WordPress app is a nestjs wrapper around the [WordPress Rest API](https://developer.wordpress.org/rest-api/). It provides a consistent interface for interacting with WordPress within the confines of our framework.

::alert{type="info"}
Checkout the WordPress [documentation](https://developer.wordpress.org/rest-api/reference/) for more information.
::

### Integration

This app has two options for integration with your project, depending on the context:

#### Environment Variables

If you require direct integration into one WordPress site you can use the following environment variables:

```bash
WORDPRESS_URL=https://your-wordpress-site.com
WORDPRESS_USERNAME=your_wordpress_username
WORDPRESS_APPLICATION_PASSWORD=your_wordpress_application_password
```
#### App Store

If you would like to allow your users to connect their own WordPress sites and perform action via their accounts, you can use the [app store](/backend/app-store/readme) integration.

You will need to add the app to your database:

::alert{type="danger"}
We could look to seed this as per of the app-wordpress package in the future, but for now you will need to add this manually.
::

```mysql
INSERT INTO `apps` (`name`, `url`, `integration_type`, `integration_name`, `category`, `hexcode`, `active`, `hidden`, `settings`) VALUES ('WordPress', 'https://wordpress.org', 'CREDENTIALS', 'wordpress', 'cms', NULL, 1, 0, '[{\"key\": \"WORDPRESS_URL\", \"name\": \"WordPress Website URL\", \"input\": {\"type\": \"text\", \"required\": true}, \"description\": \"Your WordPress URL, including http(s):// but without a trailing slash.\"}, {\"key\": \"WORDPRESS_USERNAME\", \"name\": \"WordPress Username\", \"input\": {\"type\": \"text\", \"required\": true}, \"description\": \"Your WordPress username which can be found in the users section of your WordPress admin area.\"}, {\"key\": \"WORDPRESS_APPLICATION_PASSWORD\", \"name\": \"WordPress Application Password\", \"input\": {\"type\": \"text\", \"required\": true}, \"private\": true, \"description\": \"This is a specific application password (not your normal login password) which can be created on the user management page in the WordPress admin.\"}]');
```

### Modules

Each endpoint (e.g. posts, users) has been separated into its own module. You can import the modules you need into your project.

The following modules are currently supported:

<!-- * [Categories](/apps/wordpress/modules/categories) -->
* [Posts](/apps/wordpress/modules/posts)
<!-- * [Users](/apps/wordpress/modules/users) -->

::alert{type="warning"}
If you are missing a module, please [open an issue](https://github.com/juicyllama-npm/app-wordpress/issues) or submit a pull request.

You can copy an existing module and update it to reflect another endpoint and submit the code as a pull request.
::