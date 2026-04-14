/** In-memory cache: same barcode in a session avoids repeat Open Food Facts calls. */
const MAX_BARCODE_CACHE_ENTRIES = 64;
const barcodeCache = new Map();

export const fetchProductByBarcode = async (barcode) => {
  // 1. Validation (Guard clause)
  if (!barcode || typeof barcode !== "string") {
    return { success: false, error: "Invalid barcode" };
  }

  const normalized = barcode.trim();
  if (normalized === "") {
    return { success: false, error: "Invalid barcode" };
  }

  if (barcodeCache.has(normalized)) {
    return barcodeCache.get(normalized);
  }

  try {
    // 2. API call
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(normalized)}.json`,
    );

    // 3. Network-level error
    if (!response.ok) {
      const errResult = { success: false, error: "Failed to fetch product" };
      return errResult;
    }

    const data = await response.json();

    // 4. API-level validation
    if (data.status !== 1) {
      const errResult = { success: false, error: "Product not found" };
      return errResult;
    }

    // 5. Transform data (IMPORTANT)
    const product = data.product || {};

    const name =
      product.product_name?.trim() ||
      product.generic_name?.trim() ||
      "Unknown product";

    // 6. Return clean object (NOT raw API)
    const result = {
      success: true,
      data: {
        barcode: normalized,
        name,
      },
    };

    if (barcodeCache.size >= MAX_BARCODE_CACHE_ENTRIES) {
      const oldest = barcodeCache.keys().next().value;
      barcodeCache.delete(oldest);
    }
    barcodeCache.set(normalized, result);

    return result;
  } catch (error) {
    console.error("Barcode API error:", error);
    return { success: false, error: "Something went wrong" };
  }
};
