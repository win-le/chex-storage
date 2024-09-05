import ChexStorageResult from "utils/result";
import ChexStorageWorker from "./provider";
import { event } from "../constant";

class ChexStorageWhereForOutsideMethods<TData> extends ChexStorageWorker {
  #tableName: string;
  #keyWhere: keyof TData;

  constructor(tableName: string, keyWhere: keyof TData, extensionId: string) {
    super(extensionId);
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
    const data = await this.sendMessage(event.WHERE_EQUAL, {
      value: val,
      table: this.#tableName,
      keyWhere: this.#keyWhere,
    });

    return data as any;
  }

  async search(pattern: string): Promise<TData[]> {
    const data = await this.sendMessage(event.SEARCH, {
      pattern,
      table: this.#tableName,
      keyWhere: this.#keyWhere,
    });

    return new ChexStorageResult(data as any);
  }
}

export default ChexStorageWhereForOutsideMethods;
