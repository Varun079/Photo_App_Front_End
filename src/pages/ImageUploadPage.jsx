import React, { useState } from 'react';
// import { Navbar } from "../components/navbar"; // Not needed here

const ImageUploadPage = ({ onUploadSuccess }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;
    const data = new FormData();
    data.append('image', image);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/image`, {
      method: 'POST',
      body: data,
      credentials: 'include',
    });

    if (res.ok && onUploadSuccess) {
      onUploadSuccess();
    }
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md border border-gray-200">
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-lg text-gray-800">Upload Image</span>
            <label htmlFor="image" className="text-gray-600">1. Select an image file</label>
            <input
              type="file"
              id="image"
              name="image"
              required
              accept="image/*"
              onChange={handleChange}
              className="border rounded px-2 py-1"
            />
            {image && (
              <span className="text-sm text-gray-700 mt-1">Selected: {image.name}</span>
            )}
          </div>
          {preview && (
            <div className="flex flex-col items-center gap-2 border-t pt-4">
              <span className="text-gray-600">2. Preview</span>
              <img src={preview} alt="Preview" className="max-h-48 rounded shadow" />
            </div>
          )}
          <button
            type="submit"
            className="mt-4 bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
            disabled={!image}
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export { ImageUploadPage };
