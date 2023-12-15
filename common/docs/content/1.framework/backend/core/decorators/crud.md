## CRUD Decorators

A set of prebuilt abstract decorators to help with basic CRUD controller endpoints.

They are built to reduce the number of decorators you need and therefore simplify your code.

They have the added benefit of building automated documentation for your endpoints.

### Create

Takes two arguments, the entity/dto class type and the name of the endpoint (optional).

```typescript
@CreateDecorator({entity: T, name: 'example'})
```

Resulting in an `POST` endpoint `/` with documentation for type `T`.

::alert{type="info"}
Set the URL at the controller level using `@Controller('/example')`
::

### Read

We have three decorators for reading data:

#### Get

This decorator takes 5 arguments, the entity class, the primary key, the selectable fields enum, the relations enum and the name of the endpoint (optional).

```typescript
@ReadOneDecorator({
    entity: E,
    primaryKey: PRIMARY_KEY,
    selectEnum: ExampleSelect,
    relationsEnum: ExampleRelations,
    name: NAME
})
```

This results in a `GET` endpoint `/:id` with swagger documentation for returning a single entity of type `E`.

#### List

The 5 arguments for the list decorator are the entity class, the selectable fields enum, the order by enum, the relations enum and the name of the endpoint (optional).

```typescript
@ReadManyDecorator({
    entity: E,
    selectEnum: ExampleSelect,
    orderByEnum: ExampleOrderBy,
    relationsEnum: ExampleRelations,
    name: NAME
})
```

This results in a `GET` endpoint `/` with swagger documentation for returning an array of entities of type `E`.

#### Stats

The stats decorator optionally takes the name of the endpoint.

```typescript
@ReadStatsDecorator({name: NAME})
```

This results in a `GET` endpoint `/stats` with swagger documentation for returning a count/sum/avg result on the database.

#### Charts

The charts decorator optionally takes the name of the endpoint.

```typescript
@ReadChartsDecorator({
    entity: E,
    name: NAME,
    selectEnum: ExampleSelect
})
```

This results in a `GET` endpoint `/charts` with swagger documentation for returning datasets for pie/line charts from the database grouped by a field and optionally by time period.

### Update

The update decorator takes the entity class, the primary key and the name of the endpoint (optional).

```typescript
@UpdateDecorator({entity: E, primaryKey: PRIMARY_KEY, name: NAME})
```

This results in a `PATCH` endpoint `/:id` with swagger documentation for updating a single entity of type `E`.

### Delete

The delete decorator takes the entity class, the primary key and the name of the endpoint (optional).

```typescript
@DeleteDecorator({entity: E, primaryKey: PRIMARY_KEY, name: NAME})
```

This results in a `DELETE` endpoint `/:id` with swagger documentation for deleting a single entity of type `E`.
