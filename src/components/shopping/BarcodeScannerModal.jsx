import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { fetchProductByBarcode } from "../../services/barcodeService";

/* ---------------- MATCHING LOGIC (unchanged - GOOD) ---------------- */

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function phraseBoundedInHaystack(needle, haystack) {
  const n = needle?.trim().toLowerCase();
  const h = haystack?.trim().toLowerCase();
  if (!n || !h) return false;
  const re = new RegExp(`(^|[^a-z0-9])${escapeRegExp(n)}([^a-z0-9]|$)`, "i");
  return re.test(h);
}

function ingredientMatchesProductName(ingredientName, productName) {
  const ing = ingredientName?.trim();
  const prod = productName?.trim();
  if (!ing || !prod) return false;
  return (
    phraseBoundedInHaystack(ing, prod) ||
    phraseBoundedInHaystack(prod, ing)
  );
}

function findMatchedListItem(product, items) {
  if (!product?.name) return undefined;
  return items.find((item) =>
    ingredientMatchesProductName(item.ingredient_name, product.name)
  );
}

async function stopScannerSafely(scanner) {
  if (!scanner) return;
  try {
    await scanner.stop();
  } catch (_) {
    // Ignore when scanner is already stopped/not yet started.
  }
  try {
    await scanner.clear();
  } catch (_) {
    // Ignore cleanup errors; scanner container may already be gone.
  }
}

/* ---------------- COMPONENT ---------------- */

function BarcodeScannerModal({
  show,
  onClose,
  shoppingItems,
  onMarkMatchedItemBought
}) {
  const [barcodeValue, setBarcodeValue] = useState("");
  const [scanStatus, setScanStatus] = useState("idle");
  const [productResult, setProductResult] = useState(null);

  const scannerRef = useRef(null);
  const mountedRef = useRef(true);

  const matchedItem = findMatchedListItem(productResult, shoppingItems);

  /* ---------------- CAMERA LIFECYCLE ---------------- */

  useEffect(() => {
    mountedRef.current = true;
    if (!show) return;

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          console.log("📦 Scanned barcode:", decodedText);
          stopScannerSafely(scanner).then(() => {
            if (!mountedRef.current) return;
            setBarcodeValue(decodedText);
            handleAutoLookup(decodedText);
          });
        },
        () => {}
      )
      .catch((err) => {
        console.error("Camera start error:", err);
      });

    return () => {
      mountedRef.current = false;
      const currentScanner = scannerRef.current;
      scannerRef.current = null;
      stopScannerSafely(currentScanner);
    };
  }, [show]);

  /* ---------------- LOOKUP ---------------- */

  async function handleAutoLookup(barcode) {
    if (!barcode) return;

    setScanStatus("loading");

    const result = await fetchProductByBarcode(barcode);

    if (!result.success) {
      setScanStatus("error");
      setProductResult(null);
      return;
    }

    const apiProduct = result.data;
    const matched = findMatchedListItem(apiProduct, shoppingItems);

    console.log("🔍 API PRODUCT:", apiProduct);
    console.log("🛒 MATCHED ITEM:", matched ?? null);

    setProductResult(apiProduct);
    setScanStatus("found");
  }

  async function handleTestLookup() {
    if (!barcodeValue.trim()) return;
    handleAutoLookup(barcodeValue);
  }

  async function handleMarkAsBought() {
    if (!matchedItem) return;

    await onMarkMatchedItemBought(matchedItem.id, true);
    handleCloseModal();
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
      <div className="modal show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title">Scan barcode</h5>
              <button className="btn-close" onClick={handleCloseModal}></button>
            </div>

            {/* BODY */}
            <div className="modal-body">

              {/* CAMERA */}
              <div id="reader" style={{ width: "100%", marginBottom: "15px" }} />

              {/* MANUAL INPUT (fallback) */}
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Enter barcode manually"
                value={barcodeValue}
                onChange={(e) => setBarcodeValue(e.target.value)}
              />

              <button className="btn btn-primary mb-3" onClick={handleTestLookup}>
                Test Lookup
              </button>

              {/* STATES */}
              {scanStatus === "loading" && <p>Looking up product...</p>}

              {scanStatus === "error" && (
                <p className="text-danger">Product not found.</p>
              )}

              {scanStatus === "found" && productResult && (
                <div>
                  <p><strong>Product:</strong> {productResult.name}</p>
                </div>
              )}

              {/* MATCH FOUND */}
              {scanStatus === "found" && matchedItem && (
                <div className="mt-2">
                  <p className="text-success">
                    Item found in your shopping list
                  </p>
                  <button className="btn btn-success" onClick={handleMarkAsBought}>
                    Mark as bought
                  </button>
                </div>
              )}

              {/* NOT FOUND */}
              {scanStatus === "found" && !matchedItem && (
                <div className="mt-2">
                  <p className="text-warning">
                    Not in your shopping list
                  </p>
                  <button className="btn btn-outline-primary">
                    Add to shopping list
                  </button>
                </div>
              )}

            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseModal}>
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