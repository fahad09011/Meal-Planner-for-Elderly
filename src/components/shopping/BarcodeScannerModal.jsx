import React, { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { fetchProductByBarcode } from "../../services/barcodeService";

function escapeRegexSpecialChars(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isPhraseWholeWordInText(phrase, fullText) {
  const normalizedPhrase = phrase?.trim().toLowerCase();
  const normalizedText = fullText?.trim().toLowerCase();
  if (!normalizedPhrase || !normalizedText) return false;
  const pattern = new RegExp(
    `(^|[^a-z0-9])${escapeRegexSpecialChars(normalizedPhrase)}([^a-z0-9]|$)`,
    "i"
  );
  return pattern.test(normalizedText);
}

function ingredientMatchesProductName(ingredientName, productName) {
  const ingredient = ingredientName?.trim();
  const product = productName?.trim();
  if (!ingredient || !product) return false;
  return (
    isPhraseWholeWordInText(ingredient, product) ||
    isPhraseWholeWordInText(product, ingredient));

}

function findShoppingListItemForProduct(product, shoppingListRows) {
  if (!product?.name) return undefined;
  return shoppingListRows.find((row) =>
  ingredientMatchesProductName(row.ingredient_name, product.name)
  );
}

async function stopScannerSafely(scanner) {
  if (!scanner) return;
  try {
    await scanner.stop();
  } catch {
    void 0;
  }
  try {
    await scanner.clear();
  } catch {
    void 0;
  }
}

function BarcodeScannerModal({
  show,
  onClose,
  mealPlanId,
  shoppingItems,
  onMarkMatchedItemBought,
  onAddProductToShoppingList
}) {
  const [barcodeValue, setBarcodeValue] = useState("");
  const [scanStatus, setScanStatus] = useState("idle");
  const [productResult, setProductResult] = useState(null);
  const [addBusy, setAddBusy] = useState(false);
  const [addError, setAddError] = useState(null);
  const [listAddNotice, setListAddNotice] = useState(null);

  const [scannerSession, setScannerSession] = useState(0);

  const scannerRef = useRef(null);
  const mountedRef = useRef(true);
  const noticeClearRef = useRef(null);

  const matchedShoppingItem = findShoppingListItemForProduct(
    productResult,
    shoppingItems
  );

  const lookupBarcodeAndSetProduct = useCallback(
    async (barcode) => {
      if (!barcode) return;

      setScanStatus("loading");
      setAddError(null);

      const result = await fetchProductByBarcode(barcode);

      if (!result.success) {
        setScanStatus("error");
        setProductResult(null);
        return;
      }

      const productFromApi = result.data;

      setProductResult(productFromApi);
      setScanStatus("found");
    },
    []
  );

  useEffect(() => {
    mountedRef.current = true;
    if (!show) return;

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    scanner.
    start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 150 } },
      (scannedBarcode) => {
        stopScannerSafely(scanner).then(() => {
          if (!mountedRef.current) return;
          setBarcodeValue(scannedBarcode);
          lookupBarcodeAndSetProduct(scannedBarcode);
        });
      },
      () => {}
    ).
    catch(() => {});

    return () => {
      mountedRef.current = false;
      const activeScanner = scannerRef.current;
      scannerRef.current = null;
      stopScannerSafely(activeScanner);
    };
  }, [show, lookupBarcodeAndSetProduct, scannerSession]);

  async function handleManualBarcodeLookup() {
    if (!barcodeValue.trim()) return;
    lookupBarcodeAndSetProduct(barcodeValue);
  }

  async function handleMarkAsBought() {
    if (!matchedShoppingItem) return;

    await onMarkMatchedItemBought(matchedShoppingItem.id, true);
    handleCloseModal();
  }

  async function handleAddToShoppingList() {
    if (!productResult?.name || !onAddProductToShoppingList) return;
    setAddError(null);
    setListAddNotice(null);
    if (noticeClearRef.current) {
      clearTimeout(noticeClearRef.current);
      noticeClearRef.current = null;
    }
    setAddBusy(true);
    try {
      const result = await onAddProductToShoppingList(productResult);
      if (!result?.success) {
        setAddError(
          result?.error?.message ||
          "Could not add this item. Check your connection and try again."
        );
        return;
      }
      const label = String(productResult.name).trim();
      setListAddNotice(`“${label}” was added to your shopping list.`);
      setBarcodeValue("");
      setScanStatus("idle");
      setProductResult(null);
      setScannerSession((n) => n + 1);
      noticeClearRef.current = setTimeout(() => {
        if (mountedRef.current) setListAddNotice(null);
        noticeClearRef.current = null;
      }, 4500);
    } finally {
      setAddBusy(false);
    }
  }

  function handleCloseModal() {
    if (noticeClearRef.current) {
      clearTimeout(noticeClearRef.current);
      noticeClearRef.current = null;
    }
    setBarcodeValue("");
    setScanStatus("idle");
    setProductResult(null);
    setAddError(null);
    setAddBusy(false);
    setListAddNotice(null);
    onClose();
  }

  if (!show) return null;

  return (
    <>
      <div className="modal show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Scan barcode</h5>
              <button className="btn-close" onClick={handleCloseModal}></button>
            </div>

            <div className="modal-body">
              <div id="reader" style={{ width: "100%", marginBottom: "15px" }} />

              {listAddNotice ?
              <div className="alert alert-success py-2 mb-3" role="status" aria-live="polite">
                  {listAddNotice}
                </div> :
              null}

              <input
                id="barcode-manual-input"
                name="barcode"
                type="text"
                className="form-control mb-2"
                placeholder="Enter barcode manually"
                aria-label="Barcode (manual entry)"
                value={barcodeValue}
                onChange={(event) => setBarcodeValue(event.target.value)}
                autoComplete="off" />
              

              <button
                className="btn btn-primary mb-3"
                onClick={handleManualBarcodeLookup}>
                
                Check barcode
              </button>

              {scanStatus === "loading" && <p>Checking barcode...</p>}

              {scanStatus === "error" &&
              <p className="text-danger">No product found for this barcode.</p>
              }

              {scanStatus === "found" && productResult &&
              <div>
                  <p>
                    <strong>Product:</strong> {productResult.name}
                  </p>
                </div>
              }

              {scanStatus === "found" && matchedShoppingItem &&
              <div className="mt-2">
                  <p className="text-success">Match found in your shopping list.</p>
                  <button
                  type="button"
                  className="btn btn-success me-2 mb-2"
                  onClick={handleMarkAsBought}>
                  
                    Mark as bought
                  </button>
                </div>
              }

              {scanStatus === "found" && productResult &&
              <div className="mt-2">
                  {!matchedShoppingItem ?
                <p className="text-warning">No match in your shopping list.</p> :
                null}
                  {!mealPlanId ?
                <p className="text-muted small mb-2">
                      Save a meal plan for this week first so a shopping list exists.
                    </p> :
                null}
                  {addError ?
                <p className="text-danger small" role="alert">
                      {addError}
                    </p> :
                null}
                  <button
                  type="button"
                  className="btn btn-outline-primary"
                  disabled={
                  addBusy ||
                  !mealPlanId ||
                  !onAddProductToShoppingList ||
                  !productResult?.name?.trim()
                  }
                  onClick={handleAddToShoppingList}>
                  
                    {addBusy ? "Adding…" : "Add to shopping list"}
                  </button>
                </div>
              }
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop show"></div>
    </>);

}

export default BarcodeScannerModal;