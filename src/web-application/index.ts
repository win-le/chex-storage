import ChexStorageProvider from "./provider";
import ChexTableWeb from "./table";
import { event } from "constant";

class ChexDatabaseWeb extends ChexStorageProvider {
  databaseName: string;

  constructor(
    databaseName: string,
    extensionId: string,
    initData?: { [key: string]: any[] }
  ) {
    try {
      console.log("[ChexDatabaseWeb]: constructor");

      super(extensionId);
      this.databaseName = databaseName;

      this.sendMessage(event.INIT, {
        databaseName,
        initData,
      });
    } catch (error) {
      console.error("[Chex storage] Initial fail: ", error);
      super("");
      this.databaseName = "";
    }
  }

  async tables(tables: { [table: string]: string }) {
    const self = this as any;

    await this.sendMessage(event.DEFINE_TABLE, {
      tables,
    });

    Object.keys(tables).forEach((table) => {
      const tableClass = new ChexTableWeb<any, any>(
        self.databaseName,
        table,
        this.extensionId
      ) as any;

      self[table] = tableClass;
    });
  }
}

export default ChexDatabaseWeb;
