import { describe, it, expect, vi, beforeEach } from "vitest";

let resolvedValue = { data: null, error: null };

function createInsertSelectBuilder(res) {
  const promise = Promise.resolve(res);
  return {
    single: () => promise,
    then: (onFulfilled, onRejected) => promise.then(onFulfilled, onRejected),
    catch: (onRejected) => promise.catch(onRejected),
  };
}

const mockSingle = vi.fn(() => resolvedValue);
const mockMaybeSingle = vi.fn(() => resolvedValue);
/** Supports `await insert().select()` and `await insert().select().single()`. */
const mockSelectAfterInsert = vi.fn(() => createInsertSelectBuilder(resolvedValue));
const mockSelectAfterUpsert = vi.fn(() => ({ single: mockSingle }));
const mockInsert = vi.fn(() => ({ select: mockSelectAfterInsert }));
const mockUpsert = vi.fn(() => ({ select: mockSelectAfterUpsert }));
const mockDeleteEq = vi.fn(() => resolvedValue);
const mockDelete = vi.fn(() => ({ eq: mockDeleteEq }));
const mockSelectEq2 = vi.fn(() => resolvedValue);
const mockSelectEq1 = vi.fn(() => ({ eq: mockSelectEq2, maybeSingle: mockMaybeSingle }));
const mockSelectAll = vi.fn(() => ({ eq: mockSelectEq1 }));
const mockUpdateSelectSingle = vi.fn(() => resolvedValue);
const mockUpdateSelect = vi.fn(() => ({ single: mockUpdateSelectSingle }));
const mockUpdateEq = vi.fn(() => ({ select: mockUpdateSelect }));
const mockUpdate = vi.fn(() => ({ eq: mockUpdateEq }));

const mockFrom = vi.fn(() => ({
  upsert: mockUpsert,
  insert: mockInsert,
  delete: mockDelete,
  select: mockSelectAll,
  update: mockUpdate,
}));

vi.mock("./supabaseClient", () => ({
  supabase: { from: (...args) => mockFrom(...args) },
}));

const {
  createOrGetShoppingList,
  replaceShoppingListItems,
  getShoppingListItems,
  updateShoppingListItemChecked,
  addShoppingListItemFromBarcodeProduct,
} = await import("./shoppingListService");

beforeEach(() => {
  vi.clearAllMocks();
  resolvedValue = { data: null, error: null };
  mockSelectAfterInsert.mockImplementation(() => createInsertSelectBuilder(resolvedValue));
});

describe("shoppingListService", () => {

  
  describe("createOrGetShoppingList", () => {
    it("returns error when mealPlanId is falsy", async () => {
      const result = await createOrGetShoppingList(null);
      expect(result.success).toBe(false);
      expect(result.error.message).toMatch(/required/i);
    });

    it("calls upsert on 'shopping_lists' with correct conflict key", async () => {
      mockSingle.mockReturnValue({ data: { id: "sl-1" }, error: null });
      await createOrGetShoppingList("plan-1");

      expect(mockFrom).toHaveBeenCalledWith("shopping_lists");
      const payload = mockUpsert.mock.calls[0][0][0];
      expect(payload.meal_plan_id).toBe("plan-1");
      expect(mockUpsert.mock.calls[0][1].onConflict).toBe("meal_plan_id");
    });

    it("returns { success: true, data } on success", async () => {
      mockSingle.mockReturnValue({ data: { id: "sl-1" }, error: null });
      const result = await createOrGetShoppingList("plan-1");
      expect(result.success).toBe(true);
      expect(result.data.id).toBe("sl-1");
    });

    it("returns { success: false, error } on DB error", async () => {
      mockSingle.mockReturnValue({ data: null, error: { message: "fail" } });
      const result = await createOrGetShoppingList("plan-1");
      expect(result.success).toBe(false);
    });
  });

  
  describe("replaceShoppingListItems", () => {
    it("returns error when shoppingListId is falsy", async () => {
      const result = await replaceShoppingListItems(null, [], "user-1");
      expect(result.success).toBe(false);
      expect(result.error.message).toMatch(/Shopping list ID/i);
    });

    it("returns error when items is not an array", async () => {
      const result = await replaceShoppingListItems("sl-1", "not-array", "user-1");
      expect(result.success).toBe(false);
      expect(result.error.message).toMatch(/array/i);
    });

    it("deletes old items then returns empty data when items array is empty", async () => {
      mockDeleteEq.mockReturnValue({ error: null });
      const result = await replaceShoppingListItems("sl-1", [], "user-1");
      expect(mockFrom).toHaveBeenCalledWith("shopping_list_items");
      expect(mockDelete).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it("inserts mapped item payloads after delete", async () => {
      mockDeleteEq.mockReturnValue({ error: null });
      const items = [
        { name: "Milk", category: "Dairy", aisle: "Dairy Aisle", amount: 500, unit: "ml" },
      ];
      mockSelectAfterInsert.mockImplementation(() =>
        createInsertSelectBuilder({ data: [{ id: "item-1" }], error: null }),
      );

      const result = await replaceShoppingListItems("sl-1", items, "user-1");
      expect(result.success).toBe(true);

      const insertPayload = mockInsert.mock.calls[0][0][0];
      expect(insertPayload.shopping_list_id).toBe("sl-1");
      expect(insertPayload.ingredient_name).toBe("Milk");
      expect(insertPayload.category).toBe("Dairy");
      expect(insertPayload.amount).toBe(500);
      expect(insertPayload.unit).toBe("ml");
      expect(insertPayload.checked).toBe(false);
      expect(insertPayload.updated_by).toBe("user-1");
    });

    it("returns error when delete fails", async () => {
      mockDeleteEq.mockReturnValue({ error: { message: "delete failed" } });
      const result = await replaceShoppingListItems("sl-1", [{ name: "X" }], "user-1");
      expect(result.success).toBe(false);
    });

    it("returns error when insert fails", async () => {
      mockDeleteEq.mockReturnValue({ error: null });
      mockSelectAfterInsert.mockImplementation(() =>
        createInsertSelectBuilder({ data: null, error: { message: "insert fail" } }),
      );
      const result = await replaceShoppingListItems("sl-1", [{ name: "Milk" }], "user-1");
      expect(result.success).toBe(false);
    });
  });

  
  describe("getShoppingListItems", () => {
    it("returns error when mealPlanId is falsy", async () => {
      const result = await getShoppingListItems(null);
      expect(result.success).toBe(false);
      expect(result.error.message).toMatch(/Meal Plan ID/i);
    });

    it("returns empty array when no shopping list exists", async () => {
      mockMaybeSingle.mockReturnValue({ data: null, error: null });
      const result = await getShoppingListItems("plan-1");
      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it("queries items by shopping_list_id when list exists", async () => {
      
      
      mockMaybeSingle.mockReturnValueOnce({ data: { id: "sl-1" }, error: null });
      
      
      
      
      mockSelectEq1.mockReturnValueOnce({ eq: mockSelectEq2, maybeSingle: mockMaybeSingle })
                    .mockReturnValueOnce({ data: [{ id: "item-1", ingredient_name: "Egg" }], error: null });

      const result = await getShoppingListItems("plan-1");
      expect(result.success).toBe(true);
      expect(result.data[0].ingredient_name).toBe("Egg");
    });

    it("returns error when parent query fails", async () => {
      mockMaybeSingle.mockReturnValue({ data: null, error: { message: "fail" } });
      const result = await getShoppingListItems("plan-1");
      expect(result.success).toBe(false);
    });
  });

  
  describe("updateShoppingListItemChecked", () => {
    it("returns error when itemId is falsy", async () => {
      const result = await updateShoppingListItemChecked(null, true);
      expect(result.success).toBe(false);
      expect(result.error.message).toMatch(/Item ID/i);
    });

    it("updates checked field and returns data", async () => {
      mockUpdateSelectSingle.mockReturnValue({ data: { id: "item-1", checked: true }, error: null });
      const result = await updateShoppingListItemChecked("item-1", true);

      expect(mockFrom).toHaveBeenCalledWith("shopping_list_items");
      expect(mockUpdate).toHaveBeenCalledWith({ checked: true });
      expect(result.success).toBe(true);
      expect(result.data.checked).toBe(true);
    });

    it("returns error on DB failure", async () => {
      mockUpdateSelectSingle.mockReturnValue({ data: null, error: { message: "fail" } });
      const result = await updateShoppingListItemChecked("item-1", true);
      expect(result.success).toBe(false);
    });
  });

  describe("addShoppingListItemFromBarcodeProduct", () => {
    it("returns error when mealPlanId or userId is missing", async () => {
      const r1 = await addShoppingListItemFromBarcodeProduct(null, "u1", { name: "Milk" });
      expect(r1.success).toBe(false);
      const r2 = await addShoppingListItemFromBarcodeProduct("p1", null, { name: "Milk" });
      expect(r2.success).toBe(false);
    });

    it("returns error when product name is empty", async () => {
      const result = await addShoppingListItemFromBarcodeProduct("p1", "u1", { name: "  " });
      expect(result.success).toBe(false);
    });

    it("upserts list then inserts item with added_by_barcode true", async () => {
      mockSingle.mockReturnValueOnce({ data: { id: "sl-1" }, error: null });
      resolvedValue = {
        data: {
          id: "item-new",
          ingredient_name: "Test Product",
          added_by_barcode: true,
        },
        error: null,
      };

      const result = await addShoppingListItemFromBarcodeProduct("plan-1", "user-1", {
        name: "Test Product",
        barcode: "123",
      });

      expect(result.success).toBe(true);
      expect(result.data.id).toBe("item-new");
      expect(mockFrom).toHaveBeenCalledWith("shopping_lists");
      expect(mockFrom).toHaveBeenCalledWith("shopping_list_items");
      const insertArg = mockInsert.mock.calls[mockInsert.mock.calls.length - 1][0][0];
      expect(insertArg.ingredient_name).toBe("Test Product");
      expect(insertArg.added_by_barcode).toBe(true);
      expect(insertArg.shopping_list_id).toBe("sl-1");
      expect(insertArg.updated_by).toBe("user-1");
    });
  });
});
