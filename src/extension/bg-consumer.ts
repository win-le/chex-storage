import ChexDatabase, { ChexTable } from "./index";

import { event } from "../constant";

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
      const config = message.config;

      if (config?.debug) {
        console.log("[ChexDatabaseWeb]: Consumer", {
          type,
          payload,
        });
      }

      switch (type) {
        case event.INIT: {
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

        case event.DEFINE_TABLE: {
          database.tables(payload.tables);

          sendResponse({
            status: true,
          });
          break;
        }

        case event.WHERE_EQUAL: {
          const data = await database[payload.table]
            .where(payload.keyWhere)
            .equals(payload.value);

          sendResponse({ data, status: true });
          break;
        }

        case event.GET: {
          const data = await database[payload.table].get(payload.key);

          sendResponse({ data, status: true });
          break;
        }

        case event.ADD: {
          const data = await database[payload.table].add(payload.data);

          sendResponse({ data, status: true });
          break;
        }

        case event.BULK_ADD: {
          const data = await database[payload.table].bulkAdd(payload.data);

          sendResponse({ data, status: true });
          break;
        }

        case event.UPDATE: {
          const data = await database[payload.table].update(
            payload.keyValue,
            payload.change
          );

          sendResponse({ data, status: true });
          break;
        }

        case event.UPDATE_OR_CREATE: {
          const data = await database[payload.table].updateOrCreate(
            payload.keyValue,
            payload.change,
            payload.defaultValue
          );

          sendResponse({ data, status: true });
          break;
        }

        case event.UPDATE_ALL: {
          const data = await database[payload.table].updateAll(payload.change);

          sendResponse({ data, status: true });
          break;
        }

        case event.DELETE: {
          await database[payload.table].delete(payload.keyValue);

          sendResponse({ status: true });
          break;
        }

        case event.BULK_DELETE: {
          await database[payload.table].bulkDelete(payload.keyValues);

          sendResponse({ status: true });
          break;
        }

        case event.SEARCH: {
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
