/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Form structure and state management patterns
   Summary: Base form structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Made CreateArtistForm functional with state management and backend integration
   Summary: Implemented state management, form validation, and submit handler that calls /Artists/create endpoint.
   AI Source URL: https://claude.ai/
*/

import { useState } from 'react';

const CreateArtistForm = ({ backendURL, refreshArtists }) => {
    const [formData, setFormData] = useState({
        artistID: '',
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.artistID || !formData.description) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const response = await fetch(`${backendURL}/Artists/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    artistID: formData.artistID,
                    description: formData.description
                })
            });

            const result = await response.json();

            if (result.success) {
                alert('Artist created successfully!');
                refreshArtists(); // Refresh the table
                // Reset form
                setFormData({
                    artistID: '',
                    description: ''
                });
            } else {
                alert(`Error: ${result.message}`);
            }

        } catch (error) {
            console.error("Error creating artist:", error);
            alert("An error occurred while creating the artist");
        }
    };

    return (
        <>
            <h2>Create an Artist</h2>

            <form className='cuForm' onSubmit={handleSubmit}>
                <label htmlFor="artistID">Artist: </label>
                <input
                    type="text"
                    name="artistID"
                    id="artistID"
                    value={formData.artistID}
                    onChange={handleInputChange}
                    required
                />

                <label htmlFor="description">Description: </label>
                <input
                    type="text"
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                />

                <input type="submit" value="Create Artist" />
            </form>
        </>
    );
};

export default CreateArtistForm;