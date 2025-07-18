import React, { useEffect, useState } from "react";
import { useAppContext } from "../contexts/appContext";
import { Navbar } from "../components/navbar";
import { Sidebar } from "../components/Sidebar";
import { ImageGrid } from "./HomePage";
import ImageUploadPage from "./ImageUploadPage";

const CATEGORY_RULES = [
  {
    name: "Person",
    keywords: [
      "person", "people", "man", "woman", "boy", "girl", "face", "portrait", "selfie", "child", "adult", "men", "women"
    ],
  },
  {
    name: "Nature",
    keywords: ["nature", "tree", "forest", "mountain", "hill", "valley", "desert", "beach", "flower", "sun", "cloud", "sky", "plant", "grass", "leaf", "earth", "outdoor"],
  },
  {
    name: "Water",
    keywords: ["water", "river", "lake", "sea", "ocean", "pond", "stream", "wave", "pool", "aqua", "aquatic"],
  },
  {
    name: "Animals",
    keywords: ["animal", "dog", "cat", "bird", "fish", "horse", "lion", "tiger", "bear", "wolf", "rabbit", "deer", "cow", "sheep", "goat", "duck", "chicken", "pig", "pet", "wildlife"],
  },
  {
    name: "Car",
    keywords: ["car", "vehicle", "automobile", "sedan", "suv", "truck", "jeep", "van", "auto", "motor", "engine", "wheel", "drive", "roadster", "convertible"],
  },
  {
    name: "Music",
    keywords: ["music", "guitar", "piano", "violin", "drum", "instrument", "song", "singer", "band", "melody", "note", "flute", "saxophone", "trumpet", "keyboard", "musician", "concert", "orchestra"],
  },
];

function categorizeImage(img) {
  const desc = (img.desc || "").toLowerCase();
  const words = desc.split(/\W+/); // split on non-word characters
  for (const cat of CATEGORY_RULES) {
    if (cat.keywords.some(word => words.includes(word))) {
      console.log(`Image "${img.name}" desc: "${desc}" => Category: ${cat.name}`);
      return cat.name;
    }
  }
  console.log(`Image "${img.name}" desc: "${desc}" => Category: Other`);
  return "Other";
}

const AlbumsPage = () => {
  const { favourites, toggleLike } = useAppContext();
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showUpload, setShowUpload] = useState(false); // <-- add upload modal state

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/image`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items ?? []);
      }
    };
    fetchImages();
  }, []);

  // Categorize images
  const albums = items.reduce((acc, img) => {
    const cat = categorizeImage(img);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(img);
    return acc;
  }, {});

  // Filter images in album by search
  const filteredImages = selectedAlbum
    ? (albums[selectedAlbum] || []).filter(img =>
        !searchValue.trim() ||
        (img.name && img.name.toLowerCase().includes(searchValue.toLowerCase())) ||
        (img.desc && img.desc.toLowerCase().includes(searchValue.toLowerCase()))
      )
    : [];

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/image/${imageId}`, { method: 'DELETE' });
    setFullscreenImage(null);
    // Optionally, refresh images here
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #18181b 0%, #23272f 100%)' }}>
      <Navbar searchValue={searchValue} setSearchValue={setSearchValue} onUploadClick={() => setShowUpload(true)} />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px 24px' }}>
          <h1 style={{ color: '#fff', marginBottom: 24 }}>Albums</h1>
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
                {/* Import and use your ImageUploadPage component here */}
                <ImageUploadPage onUploadSuccess={() => { setShowUpload(false); window.location.reload(); }} />
              </div>
            </div>
          )}
          {!selectedAlbum ? (
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {Object.keys(albums).length === 0 && <p style={{ color: '#fff' }}>No albums found.</p>}
              {Object.keys(albums).map(album => (
                <div
                  key={album}
                  style={{
                    background: '#23272f',
                    color: '#fff',
                    borderRadius: 12,
                    padding: '32px 48px',
                    minWidth: 180,
                    minHeight: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    transition: 'background 0.2s',
                  }}
                  onClick={() => setSelectedAlbum(album)}
                >
                  {album}
                  <div style={{ fontSize: 14, fontWeight: 400, marginTop: 8, color: '#aaa' }}>{albums[album].length} images</div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <button
                style={{ marginBottom: 24, background: '#23272f', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer', fontWeight: 500 }}
                onClick={() => setSelectedAlbum(null)}
              >
                ← Back to Albums
              </button>
              <h2 style={{ color: '#fff', marginBottom: 16 }}>{selectedAlbum} ({filteredImages.length} images)</h2>
              {filteredImages.length === 0 ? (
                <p style={{ color: '#fff' }}>No images in this album.</p>
              ) : (
                <ImageGrid
                  images={filteredImages}
                  onImageClick={(img, idx) => setFullscreenImage({ image: img, index: idx })}
                  favourites={favourites}
                  toggleLike={toggleLike}
                />
              )}
            </>
          )}
        </main>
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
              onClick={e => { e.stopPropagation(); if (fullscreenImage.index > 0) setFullscreenImage({ image: filteredImages[fullscreenImage.index - 1], index: fullscreenImage.index - 1 }); }}
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
                cursor: fullscreenImage.index === filteredImages.length - 1 ? "not-allowed" : "pointer",
                zIndex: 1100,
                padding: 8,
              }}
              onClick={e => { e.stopPropagation(); if (fullscreenImage.index < filteredImages.length - 1) setFullscreenImage({ image: filteredImages[fullscreenImage.index + 1], index: fullscreenImage.index + 1 }); }}
              disabled={fullscreenImage.index === filteredImages.length - 1}
            >
              &#8594;
            </button>
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/image/${fullscreenImage.image._id}/raw`}
              alt={fullscreenImage.image.name || ""}
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
    </div>
  );
};

export { AlbumsPage }; 