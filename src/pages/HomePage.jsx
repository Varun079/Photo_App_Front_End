import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "../components/navbar";
import { ImageUploadPage } from "./ImageUploadPage";
import { Sidebar } from "../components/Sidebar";
import { useAppContext } from "../contexts/appContext";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const HomePage = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState(null); // {image, index}
  const [showInfo, setShowInfo] = useState(false);
  const [imgMeta, setImgMeta] = useState({ width: null, height: null, size: null });
  const imgRef = useRef();
  const { favourites, toggleLike } = useAppContext();

  // Fetch images from backend on mount or after upload
  const fetchImages = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/image`); // use VITE_BACKEND_URL
    if (res.ok) {
      const data = await res.json();
      setItems(data.items ?? []);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Callback to refetch images after upload
  const handleUploadSuccess = () => {
    fetchImages();
    setShowUpload(false); // Optionally hide form after upload
  };

  // Filter images by name or description
  const filteredItems = items.filter(img => {
    if (!searchValue.trim()) return true;
    const q = searchValue.toLowerCase();
    return (
      (img.name && img.name.toLowerCase().includes(q)) ||
      (img.desc && img.desc.toLowerCase().includes(q))
    );
  });

  // Fullscreen navigation
  const openFullscreen = (image, index) => {
    setFullscreenImage({ image, index });
    setShowInfo(false);
  };
  const goPrev = () => {
    if (fullscreenImage && fullscreenImage.index > 0) {
      openFullscreen(filteredItems[fullscreenImage.index - 1], fullscreenImage.index - 1);
    }
  };
  const goNext = () => {
    if (fullscreenImage && fullscreenImage.index < filteredItems.length - 1) {
      openFullscreen(filteredItems[fullscreenImage.index + 1], fullscreenImage.index + 1);
    }
  };

  // Delete image handler
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/image/${imageId}`, {
      method: 'DELETE',
    });
    setFullscreenImage(null);
    fetchImages();
  };

  // Get image meta (resolution, size)
  useEffect(() => {
    if (fullscreenImage && imgRef.current) {
      const img = imgRef.current;
      if (img.complete) {
        setImgMeta({
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: img.fileSize || null, // fallback if available
        });
      } else {
        img.onload = () => {
          setImgMeta({
            width: img.naturalWidth,
            height: img.naturalHeight,
            size: img.fileSize || null,
          });
        };
      }
    }
  }, [fullscreenImage]);

  // Try to get file size from Content-Length header
  useEffect(() => {
    if (fullscreenImage) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/image/${fullscreenImage.image._id}/raw`, { method: 'HEAD' })
        .then(res => {
          const size = res.headers.get('Content-Length');
          setImgMeta(meta => ({ ...meta, size: size ? Number(size) : null }));
        });
    }
  }, [fullscreenImage]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #18181b 0%, #23272f 100%)' }}>
      <Navbar searchValue={searchValue} setSearchValue={setSearchValue} onUploadClick={() => setShowUpload(true)} />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px 24px' }}>
          {/* Upload modal overlay */}
          {showUpload && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.6)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
              onClick={() => setShowUpload(false)}
            >
              <div onClick={e => e.stopPropagation()}>
                <ImageUploadPage onUploadSuccess={handleUploadSuccess} />
              </div>
            </div>
          )}
          <div>
            {filteredItems.length === 0 ? (
              <p>No images uploaded yet.</p>
            ) : (
              <ImageGrid
                images={filteredItems}
                onImageClick={openFullscreen}
                favourites={favourites}
                toggleLike={toggleLike}
              />
            )}
          </div>
        </main>
      </div>
      {/* Fullscreen overlay */}
      {fullscreenImage && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.95)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
          onClick={() => setFullscreenImage(null)}
        >
          {/* Info button */}
          <button
            style={{
              position: "absolute",
              top: 30,
              left: 30,
              background: "rgba(0,0,0,0.7)",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              fontSize: 22,
              cursor: "pointer",
              zIndex: 1100,
            }}
            onClick={e => { e.stopPropagation(); setShowInfo(true); }}
            title="Show info"
          >
            i
          </button>
          {/* Prev/Next navigation */}
          <button
            style={{
              position: "absolute",
              top: "50%",
              left: 10,
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.7)",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              fontSize: 32,
              cursor: fullscreenImage.index === 0 ? "not-allowed" : "pointer",
              zIndex: 1100,
              padding: 8,
            }}
            onClick={e => { e.stopPropagation(); goPrev(); }}
            disabled={fullscreenImage.index === 0}
          >
            &#8592;
          </button>
          <button
            style={{
              position: "absolute",
              top: "50%",
              right: 10,
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.7)",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              fontSize: 32,
              cursor: fullscreenImage.index === filteredItems.length - 1 ? "not-allowed" : "pointer",
              zIndex: 1100,
              padding: 8,
            }}
            onClick={e => { e.stopPropagation(); goNext(); }}
            disabled={fullscreenImage.index === filteredItems.length - 1}
          >
            &#8594;
          </button>
          <img
            ref={imgRef}
            alt={fullscreenImage.image.name}
            src={`${import.meta.env.VITE_BACKEND_URL}/image/${fullscreenImage.image._id}/raw`}
            style={{ maxWidth: "90vw", maxHeight: "80vh", marginBottom: 20, boxShadow: "0 0 20px #000" }}
            onClick={e => e.stopPropagation()}
          />
          <button
            style={{
              padding: "10px 20px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: 5,
              fontSize: 18,
              cursor: "pointer",
              marginBottom: 10,
            }}
            onClick={e => {
              e.stopPropagation();
              handleDeleteImage(fullscreenImage.image._id);
            }}
          >
            Delete Image
          </button>
          <button
            style={{
              padding: "8px 16px",
              background: "#333",
              color: "white",
              border: "none",
              borderRadius: 5,
              fontSize: 16,
              cursor: "pointer",
            }}
            onClick={e => {
              e.stopPropagation();
              setFullscreenImage(null);
            }}
          >
            Close
          </button>
          {/* Info Modal */}
          {showInfo && (
            <div
              style={{
                position: "absolute",
                top: 80,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#222",
                color: "#fff",
                padding: 24,
                borderRadius: 10,
                zIndex: 1200,
                minWidth: 300,
                boxShadow: "0 0 20px #000",
              }}
              onClick={e => e.stopPropagation()}
            >
              <h3>Image Info</h3>
              <p><b>Name:</b> {fullscreenImage.image.name || 'N/A'}</p>
              <p><b>Size:</b> {imgMeta.size ? (imgMeta.size / 1024).toFixed(2) + ' KB' : 'N/A'}</p>
              <p><b>Resolution:</b> {imgMeta.width && imgMeta.height ? `${imgMeta.width} x ${imgMeta.height}` : 'N/A'}</p>
              <p><b>Description:</b> {fullscreenImage.image.desc || 'N/A'}</p>
              <button
                style={{
                  marginTop: 10,
                  padding: "6px 14px",
                  background: "#444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 5,
                  fontSize: 15,
                  cursor: "pointer",
                }}
                onClick={() => setShowInfo(false)}
              >
                Close Info
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Extract image grid for reuse
export function ImageGrid({ images, onImageClick, favourites, toggleLike }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      justifyItems: 'center',
      alignItems: 'start',
    }}>
      {images.map((image, idx) => (
        <div key={image._id} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}>
          <img
            alt={image.name}
            style={{
              width: '100%',
              maxWidth: 400,
              aspectRatio: '16/9',
              objectFit: 'cover',
              borderRadius: 8,
              cursor: 'pointer',
              background: '#18181b',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
            src={`${import.meta.env.VITE_BACKEND_URL}/image/${image._id}/raw`}
            onClick={() => onImageClick(image, idx)}
          />
          {/* Like button */}
          <button
            onClick={() => toggleLike(image)}
            style={{
              position: 'absolute',
              top: 12,
              right: 18,
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              borderRadius: '50%',
              padding: 8,
              cursor: 'pointer',
              zIndex: 10,
              color: favourites.includes(image._id) ? '#e0245e' : '#fff',
              fontSize: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              transition: 'color 0.2s',
            }}
            title={favourites.includes(image._id) ? 'Unlike' : 'Like'}
          >
            {favourites.includes(image._id) ? <AiFillHeart /> : <AiOutlineHeart />}
          </button>
          <div style={{ marginTop: 10 }}>
            <h5 style={{ color: '#fff', textAlign: 'center', fontWeight: 500 }}>{image.name}</h5>
          </div>
        </div>
      ))}
    </div>
  );
}

export { HomePage };
