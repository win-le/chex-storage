import type { Optional, StorageKey } from "../typing";

import ChexStorageWebWhereMethods from "./_where";
import ChexStorageWorker from "./provider";
import { event } from "constant";

class ChexTableWeb<
  TData,
  TKeyPropName extends keyof TData
> extends ChexStorageWorker {
  #tableName: string;
  #database: string;

  constructor(database: string, name: string, extensionId: string) {
    super(extensionId);

    this.#database = database;
    this.#tableName = name;
  }

  /**
   * Querying data with the specified key condition
   *
   * @param keyWhere
   * @returns ChexStorageWhereMethods
   */
  where(keyWhere: string): ChexStorageWebWhereMethods<TData> {
    const whereMethod = new ChexStorageWebWhereMethods<TData>(
      this.#tableName,
      keyWhere as keyof TData,
      this.extensionId
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
    const key = (await this.sendMessage(event.ADD, {
      data,
      table: this.#tableName,
    })) as TData[TKeyPropName];

    return key;
  }

  /**
   * Adds multiple data entries to the table
   *
   * @param data
   */
  async bulkAdd(data: Optional<TData, TKeyPropName>[]) {
    const res = await this.sendMessage(event.BULK_ADD, {
      data,
      table: this.#tableName,
    });

    return res as any;
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
    const data = await this.sendMessage(event.GET, {
      key,
      table: this.#tableName,
    });

    return data as any;
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
    const data = await this.sendMessage(event.UPDATE, {
      keyValue,
      change,
      table: this.#tableName,
    });

    return data as any;
  }

  /**
   * Updates all data in the table with the specified changes.
   *
   * @param change
   */
  async updateAll(change: Partial<Omit<TData, TKeyPropName>>) {
    const data = await this.sendMessage(event.UPDATE_ALL, {
      change,
      table: this.#tableName,
    });
    return data as any;
  }

  /**
   * Deletes multiple data entries from the table by their keys
   *
   * @param keyValue
   */
  async delete(keyValue: TData[TKeyPropName]) {
    const data = await this.sendMessage(event.DELETE, {
      keyValue,
      table: this.#tableName,
    });
    return data as any;
  }

  /**
   * Delete
   *
   * @param keyValues
   */
  async bulkDelete(keyValues: TData[TKeyPropName][]) {
    const data = await this.sendMessage(event.DELETE, {
      keyValues,
      table: this.#tableName,
    });
    return data as any;
  }

  /**
   * Query data with the same of filter factory function
   *
   * @param callback
   * @returns TData[]
   */
  async filter(callback: (row: TData) => boolean) {}
}

export default ChexTableWeb;
