const INIT = "chex-storage-init";
const DEFINE_TABLE = "chex-storage-define-table";
const ADD = "chex-storage-add";
const GET = "chex-storage-get";
const GET_TABLE = "chex-storage-get-table";
const WHERE_EQUAL = "chex-storage-where-equal";
const UPDATE = "chex-storage-update";
const UPDATE_ALL = "chex-storage-update-all";
const DELETE = "chex-storage-delete";

const BULK_ADD = "chex-storage-bulk-add";
const BULK_DELETE = "chex-storage-bulk-delete";
const SEARCH = "chex-storage-where-search";

import ChexDatabase, { ChexTable } from "./index";

let database: ChexDatabase & {
  [key: string]: ChexTable<any, any>;
};
// console.log("[ChexDatabaseConsumer]: Init");

chrome.runtime.onMessageExternal.addListener(
  async (reqMessage, sender, sendResponse) => {
    try {
      const message = JSON.parse(reqMessage);
      const type = message.type;
      const payload = message.payload;

      switch (type) {
        case INIT: {
          database = new ChexDatabase(
            payload.databaseName,
            payload?.initData
          ) as ChexDatabase & {
            [key: string]: ChexTable<any, any>;
          };

          sendResponse({
            status: true,
          });
          break;
        }

        case DEFINE_TABLE: {
          database.tables(payload.tables);

          sendResponse({
            status: true,
          });
          break;
        }

        case WHERE_EQUAL: {
          const data = await database[payload.table]
            .where(payload.keyWhere)
            .equals(payload.value);

          sendResponse({ data, status: true });
          break;
        }

        case GET: {
          const data = await database[payload.table].get(payload.key);

          sendResponse({ data, status: true });
          break;
        }

        case ADD: {
          const data = await database[payload.table].add(payload.data);

          sendResponse({ data, status: true });
          break;
        }

        case BULK_ADD: {
          const data = await database[payload.table].bulkAdd(payload.data);

          sendResponse({ data, status: true });
          break;
        }

        case UPDATE: {
          const data = await database[payload.table].update(
            payload.keyValue,
            payload.change
          );

          sendResponse({ data, status: true });
          break;
        }

        case UPDATE_ALL: {
          const data = await database[payload.table].updateAll(payload.change);

          sendResponse({ data, status: true });
          break;
        }

        case DELETE: {
          await database[payload.table].delete(payload.keyValue);

          sendResponse({ status: true });
          break;
        }

        case BULK_DELETE: {
          await database[payload.table].bulkDelete(payload.keyValues);

          sendResponse({ status: true });
          break;
        }

        case SEARCH: {
          const data = await database[payload.table]
            .where(payload.keyWhere)
            .search(payload.pattern);

          sendResponse({ status: true, data });
          break;
        }

        default:
          sendResponse({ status: false });
          break;
      }
    } catch (error) {
      console.log(error);
      sendResponse({ status: false, error });
    }
  }
);
