/*
   Citations:
   
   Original Source: CS340 Course Template
   Date: October-November 2025
   Purpose: Base template for create forms with dropdown population
   Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/07/2025
   Purpose: Updated Artist input to dropdown to prevent foreign key constraint errors
   Summary: Changed artistID from text input to dropdown populated from Artists table.
            Fetches both artists and genres on component mount. Dropdowns display just the
            artistID and genreID values. Prevents users from entering invalid IDs that don't 
            exist in the database.
   AI Source URL: https://claude.ai/
*/

import React, { useEffect, useState } from 'react';

const CreateAlbumForm = ({ backendURL, refreshAlbums }) => {
    const [formData, setFormData] = useState({
        albumName: '',
        albumPrice: '',
        amountInStock: '',
        artistID: '',
        genreID: ''
    });

    const [artists, setArtists] = useState([]);
    const [genres, setGenres] = useState([]);

    // Fetch artists on component mount
    useEffect(() => {
        async function fetchArtists() {
            try {
                const response = await fetch(`${backendURL}/Artists`);
                const data = await response.json();
                setArtists(data.artists || []);
            } catch (error) {
                console.error("Failed to fetch Artists", error);
            }
        }
        fetchArtists();
    }, [backendURL]);

    // Fetch genres on component mount
    useEffect(() => {
        async function fetchGenres() {
            try {
                const response = await fetch(`${backendURL}/Genres`);
                const data = await response.json();
                setGenres(data.genres || []);
            } catch (error) {
                console.error("Failed to fetch Genres", error);
            }
        }
        fetchGenres();
    }, [backendURL]);

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
                body: JSON.stringify({
                    albumName: formData.albumName,
                    albumPrice: parseFloat(formData.albumPrice),
                    amountInStock: parseInt(formData.amountInStock),
                    artistID: formData.artistID,
                    genreID: formData.genreID
                }),
            });

            if (response.ok) {
                alert("Album created successfully!");
                refreshAlbums();
                // Reset form
                setFormData({
                    albumName: '',
                    albumPrice: '',
                    amountInStock: '',
                    artistID: '',
                    genreID: ''
                });
            } else {
                const errorData = await response.json();
                alert(`Error creating album: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            alert(`Error creating album: ${error.message}`);
        }
    };

    return (
        <>
            <h2>Create an Album</h2>

            <form className='cuForm' onSubmit={handleSubmit}>
                <label htmlFor="albumName">Album Name: </label>
                <input
                    type="text"
                    name="albumName"
                    id="albumName"
                    value={formData.albumName}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="albumPrice">Price: </label>
                <input
                    type="number"
                    step="0.01"
                    name="albumPrice"
                    id="albumPrice"
                    value={formData.albumPrice}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="amountInStock">Amount in Stock: </label>
                <input
                    type="number"
                    name="amountInStock"
                    id="amountInStock"
                    value={formData.amountInStock}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="artistID">Artist: </label>
                <select
                    name="artistID"
                    id="artistID"
                    value={formData.artistID}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select an Artist</option>
                    {artists.map((artist) => (
                        <option value={artist.artistID} key={artist.artistID}>
                            {artist.artistID}
                        </option>
                    ))}
                </select>

                <label htmlFor="genreID">Genre: </label>
                <select
                    name="genreID"
                    id="genreID"
                    value={formData.genreID}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a Genre</option>
                    {genres.map((genre) => (
                        <option value={genre.genreID} key={genre.genreID}>
                            {genre.genreID}
                        </option>
                    ))}
                </select>

                <input type="submit" value="Create Album" />
            </form>
        </>
    );
};

export default CreateAlbumForm;