import React, { useState } from "react";
import { fetchProductByBarcode } from "../../services/barcodeService";

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * True if `needle` appears in `haystack` as a whole phrase: start/end of string
 * or surrounded by non-alphanumeric characters. Stops short tokens like "milk"
 * matching inside "milkshake".
 */
function phraseBoundedInHaystack(needle, haystack) {
  const n = needle?.trim().toLowerCase();
  const h = haystack?.trim().toLowerCase();
  if (!n || !h) return false;
  const re = new RegExp(`(^|[^a-z0-9])${escapeRegExp(n)}([^a-z0-9]|$)`, "i");
  return re.test(h);
}

/** Match list line to Open Food Facts product title (either direction). */
function ingredientMatchesProductName(ingredientName, productName) {
  const ing = ingredientName?.trim();
  const prod = productName?.trim();
  if (!ing || !prod) return false;
  return (
    phraseBoundedInHaystack(ing, prod) || phraseBoundedInHaystack(prod, ing)
  );
}

function findMatchedListItem(product, items) {
  if (!product?.name) return undefined;
  return items.find((item) =>
    ingredientMatchesProductName(item.ingredient_name, product.name),
  );
}

function BarcodeScannerModal({
  show,
  onClose,
  mealPlanId,
  shoppingItems,
  onMarkMatchedItemBought
}) {
  const [barcodeValue, setBarcodeValue] = useState("");
  const [scanStatus, setScanStatus] = useState("idle");
  const [productResult, setProductResult] = useState(null);

  const matchedItem = findMatchedListItem(productResult, shoppingItems);
 const handleMarkAsBought= async ()=>{
    if(!matchedItem) return;
    await onMarkMatchedItemBought(matchedItem.id, true);
    handleCloseModal();
 };
 async function handleTestLookup() {
  if (!barcodeValue.trim()) {
    setScanStatus("error");
    setProductResult(null);
    return;
  }

  setScanStatus("loading");

  const result = await fetchProductByBarcode(barcodeValue);
  if (!result.success) {
    setScanStatus("error");
    setProductResult(null);
    return;
  }

  const apiProduct = result.data;
  const matched = findMatchedListItem(apiProduct, shoppingItems);
  console.log("[BarcodeScanner] API product:", apiProduct);
  console.log("[BarcodeScanner] Matched shopping list item:", matched ?? null);
  console.log("[BarcodeScanner] Matched item created date:", matched?.created_at ?? null);

  setProductResult(apiProduct);
  setScanStatus("found");
}

  function handleCloseModal() {
    setBarcodeValue("");
    setScanStatus("idle");
    setProductResult(null);
    onClose();
  }

  if (!show) return null;

  return (
    <>
      <div
        id="shopping-barcode-dialog"
        className="modal show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shopping-barcode-dialog-title"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 id="shopping-barcode-dialog-title" className="modal-title">
                Scan barcode
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleCloseModal}
              />
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Enter barcode for testing</label>
                <input
                  type="text"
                  className="form-control"
                  value={barcodeValue}
                  onChange={(e) => setBarcodeValue(e.target.value)}
                  placeholder="Type barcode here"
                />
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleTestLookup}
              >
                Test Lookup
              </button>

              {scanStatus === "loading" && (
                <p className="mt-3">Looking up product...</p>
              )}

{scanStatus === "error" && (
  <p className="mt-3 text-danger">
    Product not found or failed to fetch.
  </p>
)}

              {scanStatus === "found" && productResult && (
                <div className="mt-3">
                  <p>
                    <strong>Product:</strong> {productResult.name}
                  </p>
                </div>
              )}

              {scanStatus === "found" && productResult && matchedItem && (
                <div className="mt-3">
                  <p className="text-success">
                    This product matches an item already in your shopping list.
                  </p>

                  <button type="button" className="btn btn-success" onClick={handleMarkAsBought}>
                    Mark as bought
                  </button>
                </div>
              )}

              {scanStatus === "found" && productResult && !matchedItem && (
                <div className="mt-3">
                  <p className="text-warning">
                    This product is not in your shopping list.
                  </p>
                  <button type="button" className="btn btn-outline-primary">
                    Add to shopping list
                  </button>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop show"></div>
    </>
  );
}

export default BarcodeScannerModal;