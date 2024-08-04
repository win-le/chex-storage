import ChexTable from "./table";

class ChexDatabase {
  databaseName: string;

  constructor(databaseName: string, initData?: { [key: string]: any[] }) {
    this.databaseName = databaseName;

    chrome.storage.local.get(databaseName).then((db) => {
      if (!db || !Object.keys(db).length) {
        chrome.storage.local.set({
          [databaseName]: {
            ...(initData || {}),
          },
        });
      }
    });
  }

  tables(tables: { [table: string]: string }) {
    const self = this as any;

    Object.keys(tables).forEach((table) => {
      const tableClass = new ChexTable<any, any>(
        self.databaseName,
        table,
        tables[table]
      ) as any;

      self[table] = tableClass;
    });
  }
}

export default ChexDatabase;

export { ChexTable };
