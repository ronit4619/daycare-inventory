import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, Barcode, CheckCircle2, AlertTriangle, Plus, Minus, Search, Volume2 } from 'lucide-react';
import { playScanBeep } from '../utils/audioBeep';

export default function BarcodeScannerModal({ 
  isOpen, 
  onClose, 
  items, 
  onLogUsage, 
  onRestock,
  onAddNewWithBarcode 
}) {
  const [scannedCode, setScannedCode] = useState('');
  const [matchedItem, setMatchedItem] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const scannerRef = useRef(null);
  const qrRegionId = "html5qr-code-full-region";

  // Stop camera when modal closes
  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
      } catch (err) {
        console.warn("Failed to stop scanner", err);
      }
      scannerRef.current = null;
    }
    setCameraActive(false);
  };

  // Start camera scanning
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (scannerRef.current) {
        await stopCamera();
      }

      const html5Qrcode = new Html5Qrcode(qrRegionId);
      scannerRef.current = html5Qrcode;

      const config = {
        fps: 10,
        qrbox: { width: 260, height: 160 },
        aspectRatio: 1.777778
      };

      await html5Qrcode.start(
        { facingMode: "environment" }, // Prefer rear camera on mobile
        config,
        (decodedText) => {
          handleBarcodeDetected(decodedText);
        },
        (errorMessage) => {
          // ignore frame decode errors
        }
      );
      setCameraActive(true);
    } catch (err) {
      console.warn("Camera start error:", err);
      setCameraError("Camera access denied or unavailable. You can use manual entry or demo simulator buttons below!");
      setCameraActive(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setScannedCode('');
      setMatchedItem(null);
      // Small delay to allow DOM element to render
      const timer = setTimeout(() => {
        startCamera();
      }, 300);
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Process barcode detection
  const handleBarcodeDetected = (code) => {
    const cleanCode = code.trim();
    if (!cleanCode) return;

    playScanBeep();
    setScannedCode(cleanCode);

    const found = items.find(i => i.barcode === cleanCode);
    setMatchedItem(found || null);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleBarcodeDetected(manualCode.trim());
      setManualCode('');
    }
  };

  // Preset Barcode Simulator options for easy testing
  const demoBarcodes = [
    { name: "Diapers (Size 3)", code: "036000291452" },
    { name: "Baby Wipes", code: "036000312010" },
    { name: "Formula Can", code: "300871365412" },
    { name: "Toddler Snacks", code: "852657003014" },
    { name: "Whole Milk", code: "070038300012" }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={22} color="var(--accent-primary)" />
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 600 }}>
              Camera Barcode Scanner
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Viewfinder Region */}
        <div style={{ position: 'relative', width: '100%', minHeight: '220px', background: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1rem', border: '1px solid var(--glass-border)' }}>
          <div id={qrRegionId} style={{ width: '100%' }} />

          {/* Viewfinder Overlay scanning reticle */}
          {cameraActive && !scannedCode && (
            <div style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '240px',
                height: '140px',
                border: '2px dashed #10b981',
                borderRadius: 'var(--radius-sm)',
                boxShadow: '0 0 0 4000px rgba(0, 0, 0, 0.4)',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'scanLine 2s infinite ease-in-out' }} />
              </div>
              <span style={{ fontSize: '0.78rem', color: '#fff', background: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', marginTop: '0.6rem' }}>
                Position barcode within frame
              </span>
            </div>
          )}

          {cameraError && (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Camera size={32} color="var(--accent-amber)" style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.85rem' }}>{cameraError}</p>
            </div>
          )}
        </div>

        {/* Matched Result Card */}
        {scannedCode && (
          <div style={{ background: 'var(--bg-primary)', border: '1.5px solid var(--accent-primary)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem', animation: 'slideDown 0.2s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Barcode size={16} />
                SCANNED UPC: {scannedCode}
              </span>
              <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setScannedCode('')}>
                Scan Again
              </button>
            </div>

            {matchedItem ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '0.4rem 0' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', uppercase: true }}>{matchedItem.category}</span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{matchedItem.name}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 700, color: matchedItem.current_quantity <= matchedItem.par_level ? 'var(--accent-amber)' : 'var(--text-primary)' }}>
                      {matchedItem.current_quantity}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.2rem' }}>{matchedItem.unit}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '0.8rem' }}>
                  <button 
                    className="btn btn-danger-subtle" 
                    onClick={() => {
                      onLogUsage(matchedItem.id, 1);
                      setMatchedItem(prev => prev ? { ...prev, current_quantity: Math.max(0, prev.current_quantity - 1) } : null);
                    }}
                    disabled={matchedItem.current_quantity <= 0}
                  >
                    <Minus size={16} />
                    <span>Log -1 Used</span>
                  </button>

                  <button 
                    className="btn btn-success-subtle" 
                    onClick={() => {
                      onRestock(matchedItem.id, 1);
                      setMatchedItem(prev => prev ? { ...prev, current_quantity: prev.current_quantity + 1 } : null);
                    }}
                  >
                    <Plus size={16} />
                    <span>Restock +1</span>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: '0.5rem 0' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  No supply item currently matches barcode <strong style={{ color: 'var(--text-primary)' }}>{scannedCode}</strong>.
                </p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    onAddNewWithBarcode(scannedCode);
                    onClose();
                  }}
                >
                  <Plus size={16} />
                  <span>Add New Item with this Barcode</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Manual Barcode Input Form */}
        <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <div className="search-input-wrapper" style={{ flex: 1 }}>
            <Barcode className="search-icon" size={18} />
            <input 
              type="text"
              placeholder="Or type / paste barcode number..."
              value={manualCode}
              onChange={e => setManualCode(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary" disabled={!manualCode.trim()}>
            Match
          </button>
        </form>

        {/* Test Barcode Simulator Buttons */}
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
            ⚡ Demo Barcode Simulator (Click to test scanning):
          </span>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {demoBarcodes.map(demo => (
              <button
                key={demo.code}
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                onClick={() => handleBarcodeDetected(demo.code)}
              >
                {demo.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
