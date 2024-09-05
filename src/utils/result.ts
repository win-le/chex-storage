import { SortByField } from "typing";

class ChexStorageResult<TData> extends Array {
  constructor(items: any[]) {
    super(...items);
  }

  sortBy(fieldName: SortByField<keyof TData>) {
    const field = fieldName.slice(0, -1);

    const self = this;

    if (fieldName.indexOf("+") > 0) {
      return self.sort((a, b) => (a[field] > b[field] ? 1 : -1));
    }

    return self.sort((a, b) => (a[field] > b[field] ? -1 : 1));
  }
}

export default ChexStorageResult;
