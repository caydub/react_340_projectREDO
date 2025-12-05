/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Form structure and patterns
   Summary: Base form structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Updated CreateAlbumRatingsForm to use customer name parsing
   Summary: Changed from dropdown to single text input for customer name. 
            Parses full name into firstName/lastName before sending to backend.
   AI Source URL: https://claude.ai/
*/

import { useState } from 'react';

const CreateAlbumRatingsForm = ({ backendURL, refreshAlbumRatings }) => {
    const [formData, setFormData] = useState({
        albumName: '',
        customerName: '',
        albumRating: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.albumName || !formData.customerName || !formData.albumRating) {
            alert("All fields are required");
            return;
        }

        // Parse customer name into firstName and lastName
        const nameParts = formData.customerName.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || nameParts[0]; // Use first name if no last name

        try {
            const response = await fetch(`${backendURL}/AlbumRatings/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    albumName: formData.albumName,
                    firstName: firstName,
                    lastName: lastName,
                    albumRating: parseFloat(formData.albumRating)
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert('Album rating created successfully!');
                refreshAlbumRatings();
                // Reset form
                setFormData({
                    albumName: '',
                    customerName: '',
                    albumRating: ''
                });
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error creating album rating:', error);
            alert('An error occurred while creating the album rating.');
        }
    };

    return (
        <>
            <h2>Create an Album Rating</h2>

            <form className='cuForm' onSubmit={handleSubmit}>
                <label htmlFor="albumName">Album Name: </label>
                <input
                    type="text"
                    name="albumName"
                    id="albumName"
                    value={formData.albumName}
                    onChange={handleChange}
                    placeholder="Enter album name"
                    required
                />

                <label htmlFor="customerName">Customer Name: </label>
                <input
                    type="text"
                    name="customerName"
                    id="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="First Last"
                    required
                />

                <label htmlFor="albumRating">Rating: </label>
                <select
                    name="albumRating"
                    id="albumRating"
                    value={formData.albumRating}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a Rating</option>
                    <option value="0">0</option>
                    <option value="0.5">0.5</option>
                    <option value="1.0">1.0</option>
                    <option value="1.5">1.5</option>
                    <option value="2.0">2.0</option>
                    <option value="2.5">2.5</option>
                    <option value="3.0">3.0</option>
                    <option value="3.5">3.5</option>
                    <option value="4.0">4.0</option>
                    <option value="4.5">4.5</option>
                    <option value="5.0">5.0</option>
                </select>

                <input type="submit" value="Create Rating" />
            </form>
        </>
    );
};

export default CreateAlbumRatingsForm;