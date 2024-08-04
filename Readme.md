# Chex storage

`chex-storage` is a wrapper library for Chrome extension storage local - the standard storage in the chrome extension.

## Install

```cmd
  # Yarn
  yarn add chex-storage

  # npm
  npm install chex-storage
```

## Get started

```js
  // db.ts
  import ChexDatabase, { ChexTable } from "chex-storage";
  import { ConfigureLLM, Conversation, Marking, Message, Note } from "typing";

  const store = new ChexDatabase("chex-storage") as ChexDatabase & {
    user: ChexTable<Marking, "id">;
  };

  store.tables({
    user: "++id",
  });

  export { store };
```

## API-Reference

### Type Parameters

* `TData`: The type of data stored in the table.
* `TKeyPropName extends keyof TData`: The key property name of the data.

### Constructor

#### `constructor(database: string, name: string, keyName: StorageKey<TKeyPropName>)`

Creates a new instance of the `ChexTable` class.

* **Parameters:**
  * `database` (string): The name of the database.
  * `name` (string): The name of the table.
  * `keyName` (StorageKey<TKeyPropName>): The key name for the table.

### Methods

#### `add(data: Optional<TData, TKeyPropName>): Promise<TData[TKeyPropName]>`
>
> Adds new data to the table and returns the key of the added data.
>
> **Parameters:**
>
> * `data` (Optional<TData, TKeyPropName>): The data to add.
>
> **Returns:**
>
> * `Promise<TData[TKeyPropName]>`: A promise that resolves to the key of the added data.
>
<br>

#### `bulkAdd(data: Optional<TData, TKeyPropName>[]): Promise<void>`
>
> Adds multiple data entries to the table.
>
> **Parameters:**
>
> * `data` (Optional<TData, TKeyPropName>\[\]): An array of data to add.
>
> **Returns:**
>
> * `Promise<void>`: A promise that resolves when the data is added.
>
<br>

#### `get(): Promise<TData[]>`

#### `get(key: TData[TKeyPropName]): Promise<TData | undefined>`
>
> Gets all data from the table or gets data by a specific key.
>
> **Parameters:**
>
> * `key` (TData\[TKeyPropName\], optional): The key of the data to retrieve.
>
> **Returns:**
>
> * `Promise<TData[]>`: A promise that resolves to an array of all data (when no key is provided).
> * `Promise<TData | undefined>`: A promise that resolves to the data with the specified key or `undefined` if not found.
>
<br>

#### `update(keyValue: TData[TKeyPropName], change: Partial<Omit<TData, TKeyPropName>>): Promise<TData[TKeyPropName]>`
>
> Updates data in the table by key and returns the key of the updated data.
>
> **Parameters:**
>
> * `keyValue` (TData\[TKeyPropName\]): The key of the data to update.
> * `change` (Partial<Omit<TData, TKeyPropName>>): The changes to apply.
>
> **Returns:**
>
> * `Promise<TData[TKeyPropName]>`: A promise that resolves to the key of the updated data.
>
<br>

#### `updateAll(change: Partial<Omit<TData, TKeyPropName>>): Promise<void>`
>
> Updates all data in the table with the specified changes.
>
> **Parameters:**
>
> * `change` (Partial<Omit<TData, TKeyPropName>>): The changes to apply to all data.
>
> **Returns:**
>
> * `Promise<void>`: A promise that resolves when the data is updated.
>
<br>

#### `delete(keyValue: TData[TKeyPropName]): Promise<void>`
>
> Deletes data from the table by key.
>
> **Parameters:**
>
> * `keyValue` (TData\[TKeyPropName\]): The key of the data to delete.
>
> **Returns:**
>
> * `Promise<void>`: A promise that resolves when the data is deleted.
>
<br>

#### `bulkDelete(keyValues: TData[TKeyPropName][]): Promise<void>`
>
> Deletes multiple data entries from the table by their keys.
>
> **Parameters:**
>
> * `keyValues` (TData\[TKeyPropName\]\[\]): An array of keys of the data to delete.
>
> **Returns:**
>
> * `Promise<void>`: A promise that resolves when the data is deleted.
>
<br>

#### `filter filter(callback: (row: TData) => boolean):Promise<TData[]>`
>
> Query data with the same of filter factory function
>
> **Parameters:**
>
> * `callback` ((row: TData) => boolean): A filter function to apply to each row of data.
>
> **Returns:**
>
> * `Promise<void>`: A promise that resolves when the data is deleted.
>
<br>

#### `where(keyWhere: string): ChexStorageWhereMethods<TData>`
>
>Returns a `ChexStorageWhereMethods` instance for querying data with the specified key condition.
>
>**Parameters:**
>
>* `keyWhere` (string): The key condition for querying data.
>
>**Returns:**
>
> * `Promise<TData[]>`: A promise that resolves to an array of data matching the filter criteria.
>
> ---------------
>
> ### ChexStorageWhereMethods
>
> #### `equals(val: any): Promise<TData[]>`
>
> Queries the table for data where the specified key equals the given value.
>
> **Parameters:**
>
> * `val` (any): The value to compare against the key.
>
> **Returns:**
>
> * `Promise<TData[]>`: A promise that resolves to an array of data matching the condition.
>