import { SortByField } from "typing";

function ChexStorageResult<TData>(items: TData[]) {
  const newArray = new Array(...items);

  Object.setPrototypeOf(Array.prototype, ChexStorageResult.prototype);

  ChexStorageResult.prototype.sortBy = function (
    fieldName: SortByField<keyof TData>
  ) {
    const field = fieldName.slice(0, -1);

    const self = this;

    if (fieldName.indexOf("+") > 0) {
      return self.sort(
        (a: { [x: string]: number }, b: { [x: string]: number }) =>
          a[field] > b[field] ? 1 : -1
      );
    }

    return self.sort((a: { [x: string]: number }, b: { [x: string]: number }) =>
      a[field] > b[field] ? -1 : 1
    );
  };

  return newArray;
}

export default ChexStorageResult;
