import bitapSearch from "../extension/main/bitap-search";

test("Bitap search", () => {
  expect(bitapSearch("hello worxd", "world", 0.7)).toBe("worxd");
  expect(bitapSearch(" helo worxd", "halo", 0.7)).toBe("helo");
});
