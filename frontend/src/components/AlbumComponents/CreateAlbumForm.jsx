// WORK IN PROGRESS - No routing in place yet for this.
// Following Module 8 REACT tutorial for AlbumUpdateButton.jsx
// 11/20

import React, { useState } from 'react';

const CreateAlbumForm = ({ genres, backendURL, refreshAlbums }) => {
    const [formData, setFormData] = useState({
        create_album_name: '',
        create_album_price: '',
        create_album_amount_in_stock: '',
        create_album_artist: '',
        create_album_genre: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const response = await fetch(`${backendURL}/Albums/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log("Album created successfully.");
                refreshAlbums();
            } else {
                console.error("Error creating album.");
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <>
        <h2>Create an Album</h2>

        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="create_album_name">Album Name: </label>
            <input
                type="text"
                name="create_album_name"
                id="create_album_name"
                value={formData.create_album_name}
                onChange={handleChange}
            />

            <label htmlFor="create_album_price">Price: </label>
            <input
                type="number"
                step="0.01"
                name="create_album_price"
                id="create_album_price"
                value={formData.create_album_price}
                onChange={handleChange}
            />

            <label htmlFor="create_album_amount_in_stock">Amount in Stock: </label>
            <input
                type="number"
                name="create_album_amount_in_stock"
                id="create_album_amount_in_stock"
                value={formData.create_album_amount_in_stock}
                onChange={handleChange}
            />

            <label htmlFor="create_album_artist">Artist: </label>
            <input
                type="text"
                name="create_album_artist"
                id="create_album_artist"
                value={formData.create_album_artist}
                onChange={handleChange}
            />

            <label htmlFor="create_album_genre">Genre: </label>
            <select
                name="create_album_genre"
                id="create_album_genre"
                value={formData.create_album_genre}
                onChange={handleChange}
            >
                <option value="">Select a Genre</option>
                {genres.map((genre, index) => (
                    <option value={genre.genreID} key={index}>{genre.genreID}</option>
                ))}
            </select>

            <input type="submit" />
        </form>
        </>
    );
};

export default CreateAlbumForm;
