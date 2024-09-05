import ChexStorageResult from "../../utils/result";
import bitapSearch from "./bitap-search";

class ChexStorageWhereMethods<TData> {
  #database: string;
  #tableName: string;
  #keyWhere: keyof TData;

  constructor(database: string, tableName: string, keyWhere: keyof TData) {
    this.#database = database;
    this.#tableName = tableName;
    this.#keyWhere = keyWhere;
  }

  /**
   * Query data where the specified key equals the given value
   *
   * @param val
   * @returns TData[]
   */
  async equals(val: any): Promise<TData[]> {
    const tableData = ((await chrome.storage.local.get(this.#database))?.[
      this.#database
    ]?.[this.#tableName] || []) as TData[];

    return tableData.filter((row) => row[this.#keyWhere] === val);
  }

  /**
   * Search with fuzzy search algorithm
   *
   * @param pattern
   * @returns TData[]
   */
  async search(pattern: string): Promise<ChexStorageResult<TData>> {
    const tableData = ((await chrome.storage.local.get(this.#database))?.[
      this.#database
    ]?.[this.#tableName] || []) as TData[];

    return new ChexStorageResult(
      tableData.filter((row) =>
        bitapSearch(row[this.#keyWhere] as string, pattern)
      )
    );
  }
}

export default ChexStorageWhereMethods;
