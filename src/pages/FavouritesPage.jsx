import React, { useEffect, useState } from "react";
import { useAppContext } from "../contexts/appContext";
import { Navbar } from "../components/navbar";
import { Sidebar } from "../components/Sidebar";
import { ImageGrid } from "./HomePage";
import ImageUploadPage from "./ImageUploadPage";

const FavouritesPage = () => {
  const { favourites, toggleLike } = useAppContext();
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showUpload, setShowUpload] = useState(false); // Add upload modal state

  // Refetch images when favourites change or after upload
  const fetchImages = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/image`, { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setItems(data.items ?? []);
      // Debugging logs
      console.log('Fetched images:', data.items);
      console.log('Current favourites:', favourites);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [favourites]);

  const filteredItems = items.filter(img => favourites.includes(img._id) && (
    !searchValue.trim() ||
    (img.name && img.name.toLowerCase().includes(searchValue.toLowerCase())) ||
    (img.desc && img.desc.toLowerCase().includes(searchValue.toLowerCase()))
  ));

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #18181b 0%, #23272f 100%)' }}>
      <Navbar searchValue={searchValue} setSearchValue={setSearchValue} onUploadClick={() => setShowUpload(true)} />
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
            <ImageUploadPage onUploadSuccess={() => { setShowUpload(false); fetchImages(); }} />
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px 24px' }}>
          <h1 style={{ color: '#fff', marginBottom: 24 }}>Favourites</h1>
          {filteredItems.length === 0 ? (
            <p style={{ color: '#fff' }}>No favourite images yet.</p>
          ) : (
            <ImageGrid
              images={filteredItems}
              onImageClick={(img, idx) => setFullscreenImage({ image: img, index: idx })}
              favourites={favourites}
              toggleLike={toggleLike}
            />
          )}
        </main>
      </div>
      {fullscreenImage && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            flexDirection: 'column',
          }}
          onClick={() => setFullscreenImage(null)}
        >
          <button
            style={{ position: 'absolute', top: 20, right: 30, background: '#333', color: '#fff', border: 'none', borderRadius: 5, fontSize: 18, padding: '8px 16px', cursor: 'pointer', zIndex: 1100 }}
            onClick={e => { e.stopPropagation(); setFullscreenImage(null); }}
          >Close</button>
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/image/${fullscreenImage.image._id}/raw`}
            alt={fullscreenImage.image.name || ""}
            style={{ maxHeight: "80vh", maxWidth: "90vw", borderRadius: 12, marginBottom: 20 }}
            onClick={e => e.stopPropagation()}
          />
          <button
            style={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: 5, fontSize: 32, cursor: fullscreenImage.index === 0 ? 'not-allowed' : 'pointer', zIndex: 1100, padding: 8 }}
            onClick={e => { e.stopPropagation(); if (fullscreenImage.index > 0) setFullscreenImage({ image: filteredItems[fullscreenImage.index - 1], index: fullscreenImage.index - 1 }); }}
            disabled={fullscreenImage.index === 0}
          >&#8592;</button>
          <button
            style={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: 5, fontSize: 32, cursor: fullscreenImage.index === filteredItems.length - 1 ? 'not-allowed' : 'pointer', zIndex: 1100, padding: 8 }}
            onClick={e => { e.stopPropagation(); if (fullscreenImage.index < filteredItems.length - 1) setFullscreenImage({ image: filteredItems[fullscreenImage.index + 1], index: fullscreenImage.index + 1 }); }}
            disabled={fullscreenImage.index === filteredItems.length - 1}
          >&#8594;</button>
          <button
            style={{ position: 'absolute', bottom: 30, right: 30, background: '#444', color: '#fff', border: 'none', borderRadius: 5, fontSize: 16, padding: '6px 14px', cursor: 'pointer', zIndex: 1100 }}
            onClick={e => { e.stopPropagation(); setShowInfo(true); }}
          >Info</button>
          {showInfo && (
            <div
              style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', background: '#222', color: '#fff', padding: 24, borderRadius: 10, zIndex: 1200, minWidth: 300, boxShadow: '0 0 20px #000' }}
              onClick={e => e.stopPropagation()}
            >
              <h3>Image Info</h3>
              <p><b>Name:</b> {fullscreenImage.image.name || 'N/A'}</p>
              <p><b>Description:</b> {fullscreenImage.image.desc || 'N/A'}</p>
              <button
                style={{ marginTop: 10, padding: '6px 14px', background: '#444', color: '#fff', border: 'none', borderRadius: 5, fontSize: 15, cursor: 'pointer' }}
                onClick={() => setShowInfo(false)}
              >Close Info</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { FavouritesPage }; 