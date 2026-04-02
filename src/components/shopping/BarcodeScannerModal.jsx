import React, { useState } from "react";

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

  const matchedItem = shoppingItems.find(
    (item) =>
      item.ingredient_name?.toLowerCase().trim() ===
      productResult?.name?.toLowerCase().trim()
  );
 const handleMarkAsBought= async ()=>{
    if(!matchedItem) return;
    await onMarkMatchedItemBought(matchedItem.id, true);
    handleCloseModal();
 };
  function handleTestLookup() {
    if (!barcodeValue.trim()) {
      setScanStatus("error");
      setProductResult(null);
      return;
    }

    setScanStatus("loading");

    const fakeProduct = {
      barcode: barcodeValue,
      name: "Pumpkin Seeds",
    };

    setTimeout(() => {
      setProductResult(fakeProduct);
      setScanStatus("found");
    }, 500);
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
        className="modal show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Scan Barcode</h5>
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
                  Please enter a barcode first.
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