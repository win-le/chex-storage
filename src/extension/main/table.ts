import { Optional, StorageKey } from "typing";

import ChexStorageWhereMethods from "./_where";

class ChexTable<TData, TKeyPropName extends keyof TData> {
  #tableName: string;
  #database: string;
  #keyName: TKeyPropName;
  #key: StorageKey<TKeyPropName>;

  constructor(
    database: string,
    name: string,
    keyName: StorageKey<TKeyPropName>
  ) {
    this.#database = database;
    this.#tableName = name;
    this.#keyName = (
      keyName.split("++").length === 2 ? keyName.split("++")[1] : keyName
    ) as TKeyPropName;
    this.#key = keyName;
  }

  /**
   * Get data database
   */
  private async getDatabase() {
    const data = await chrome.storage.local.get(this.#database);

    return data[this.#database] as {
      [key: string]: TData[];
    };
  }

  /**
   * Generate key
   * When add new data, it'll detect auto create or not key
   * @param data
   * @returns
   */
  private async generateKey(
    data: Optional<TData, TKeyPropName>
  ): Promise<TData[TKeyPropName]> {
    if (this.#key.indexOf("++") === 0) {
      const db = await this.getDatabase();
      const keyName = this.#key.split("++")[1];

      const tableData =
        db[this.#tableName]?.sort(
          (a: any, b: any) => a[keyName] - b[keyName]
        ) || [];

      return (((tableData?.[tableData.length - 1] as any)?.[keyName] || 0) +
        1) as TData[TKeyPropName];
    }

    if (!data?.[this.#keyName as TKeyPropName]) {
      throw new Error("Must have key in data");
    }

    return data[this.#keyName as TKeyPropName] as TData[TKeyPropName];
  }

  /**
   * Querying data with the specified key condition
   *
   * @param keyWhere
   * @returns ChexStorageWhereMethods
   */
  where(keyWhere: string): ChexStorageWhereMethods<TData> {
    const whereMethod = new ChexStorageWhereMethods<TData>(
      this.#database,
      this.#tableName,
      keyWhere as keyof TData
    );

    return whereMethod;
  }

  /**
   * Adds new data to the table and returns the key of the added data.
   *
   * @param data
   * @returns Key value
   */
  async add(data: Optional<TData, TKeyPropName>): Promise<TData[TKeyPropName]> {
    const db = await this.getDatabase();

    const tableData = db[this.#tableName] || [];

    const key = await this.generateKey(data);

    await chrome.storage.local.set({
      [this.#database]: {
        ...db,
        [this.#tableName]: [
          ...tableData,
          {
            [this.#keyName]: key,
            ...data,
          },
        ],
      },
    });

    return key;
  }

  /**
   * Adds multiple data entries to the table
   *
   * @param data
   */
  async bulkAdd(data: Optional<TData, TKeyPropName>[]) {
    const db = await this.getDatabase();

    const tableData = db[this.#tableName] || [];
    const addedItems: TData[] = [];

    for (const row of data) {
      const key = await this.generateKey(row);

      addedItems.push({
        [this.#keyName]: key,
        ...row,
      } as TData);
    }

    await chrome.storage.local.set({
      [this.#database]: {
        ...db,
        [this.#tableName]: [...tableData, ...addedItems],
      },
    });
  }

  /**
   * Gets all data from the table or gets data by a specific key
   *
   * @param key
   * @returns Data | undefined
   */
  async get(): Promise<TData[]>;
  async get(key: TData[TKeyPropName]): Promise<TData | undefined>;
  async get(key?: TData[TKeyPropName]): Promise<TData[] | TData | undefined> {
    const db = await this.getDatabase();

    const tableData = db?.[this.#tableName] || [];

    if (!key) {
      return tableData;
    }

    return tableData?.find((row) => row?.[this.#keyName] === key);
  }

  /**
   * Updates data in the table by key and returns the key of the updated data
   *
   * @param key
   * @param change
   */
  async update(
    keyValue: TData[TKeyPropName],
    change: Partial<Omit<TData, TKeyPropName>>
  ): Promise<TData[TKeyPropName]> {
    const db = await this.getDatabase();

    const tableData = db[this.#tableName];

    const rowNeedUpdate = tableData.find(
      (row) => row[this.#keyName] === keyValue
    );

    if (!rowNeedUpdate) {
      throw new Error("Don't find item with key");
    }

    await chrome.storage.local.set({
      [this.#database]: {
        ...db,
        [this.#tableName]: [
          ...tableData.filter((row) => row[this.#keyName] !== keyValue),
          {
            ...rowNeedUpdate,
            ...change,
          },
        ],
      },
    });

    return keyValue;
  }

  /**
   * Update data for create new record
   *
   * @param keyValue
   * @param change
   * @param defaultValue
   * @returns
   */
  async updateOrCreate(
    keyValue: TData[TKeyPropName],
    change: Partial<Omit<TData, TKeyPropName>>,
    defaultValue: Omit<TData, TKeyPropName>
  ): Promise<TData[TKeyPropName]> {
    const db = await this.getDatabase();

    const tableData = db[this.#tableName];

    const rowNeedUpdate = tableData.find(
      (row) => row[this.#keyName] === keyValue
    );

    if (!rowNeedUpdate) {
      return await this.add({
        [this.#keyName]: keyValue,
        ...defaultValue,
      } as Optional<TData, TKeyPropName>);
    }

    await chrome.storage.local.set({
      [this.#database]: {
        ...db,
        [this.#tableName]: [
          ...tableData.filter((row) => row[this.#keyName] !== keyValue),
          {
            ...rowNeedUpdate,
            ...change,
          },
        ],
      },
    });

    return keyValue;
  }

  /**
   * Updates all data in the table with the specified changes.
   *
   * @param change
   */
  async updateAll(change: Partial<Omit<TData, TKeyPropName>>) {
    const db = await this.getDatabase();

    const tableData = db[this.#tableName]?.map((row) => {
      return {
        ...row,
        ...change,
      };
    });

    await chrome.storage.local.set({
      [this.#database]: {
        ...db,
        [this.#tableName]: tableData,
      },
    });
  }

  /**
   * Deletes multiple data entries from the table by their keys
   *
   * @param keyValue
   */
  async delete(keyValue: TData[TKeyPropName]) {
    const db = await this.getDatabase();

    const tableData = db[this.#tableName];

    await chrome.storage.local.set({
      [this.#database]: {
        ...db,
        [this.#tableName]: tableData.filter(
          (row) => row[this.#keyName] !== keyValue
        ),
      },
    });
  }

  /**
   * Delete
   *
   * @param keyValues
   */
  async bulkDelete(keyValues: TData[TKeyPropName][]) {
    const db = await this.getDatabase();

    const tableData = db[this.#tableName];
    await chrome.storage.local.set({
      [this.#database]: {
        ...db,
        [this.#tableName]: tableData.filter(
          (row) => !(keyValues as any).includes(row[this.#keyName])
        ),
      },
    });
  }

  /**
   * Query data with the same of filter factory function
   *
   * @param callback
   * @returns TData[]
   */
  async filter(callback: (row: TData) => boolean) {
    const db = await this.getDatabase();

    const tableData = db[this.#tableName];

    return tableData.filter(callback);
  }
}

export default ChexTable;
