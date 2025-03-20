import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [diseaseName, setDiseaseName] = useState('');
  const [resultImageUrl, setResultImageUrl] = useState('');

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedImage) {
      alert('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);

    axios.post('http://localhost:5000/getdiseases', formData)
      .then(response => {
        setDiseaseName(response.data.disease_name);
        setResultImageUrl(response.data.image_url);
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
  };

  return (
    <div>
      <h2>Upload an Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Upload</button>
      </form>
      {resultImageUrl && (
        <div>
          <h3>Detected Disease:</h3>
          <p>{diseaseName}</p>
          <img src={`http://localhost:5000${resultImageUrl}`} alt="Detection Result" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;