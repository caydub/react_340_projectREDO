/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Table row component with inline editing pattern
   Summary: Base table row structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created AlbumRatingTableRow with inline editing and customer name parsing
   Summary: Single text input for customer name that parses into firstName/lastName on save.
            Inline editing for albumName, customer, and albumRating.
   AI Source URL: https://claude.ai/
*/

import { useState, useEffect } from "react";

const AlbumRatingTableRow = ({ rating, backendURL, refreshAlbumRatings }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState({
        albumRatingID: rating.albumRatingID,
        albumName: rating.albumName,
        customer: rating.customer,
        albumRating: rating.albumRating
    });

    // Sync with rating prop when it changes
    useEffect(() => {
        setEditedValues({
            albumRatingID: rating.albumRatingID,
            albumName: rating.albumName,
            customer: rating.customer,
            albumRating: rating.albumRating
        });
    }, [rating]);

    const handleInputChange = (key, value) => {
        setEditedValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleUpdate = async () => {
        // Validate required fields
        if (!editedValues.albumName || !editedValues.customer || !editedValues.albumRating) {
            alert("All fields are required");
            return;
        }

        // Parse customer name into firstName and lastName
        const nameParts = editedValues.customer.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || nameParts[0];

        try {
            const response = await fetch(`${backendURL}/AlbumRatings/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    albumRatingID: editedValues.albumRatingID,
                    albumName: editedValues.albumName,
                    firstName: firstName,
                    lastName: lastName,
                    albumRating: parseFloat(editedValues.albumRating)
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert('Album rating updated successfully!');
                setIsEditing(false);
                refreshAlbumRatings();
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error("Error updating album rating:", error);
            alert("An error occurred while updating the album rating.");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete this rating?`)) {
            return;
        }

        try {
            const response = await fetch(`${backendURL}/AlbumRatings/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    albumRatingID: rating.albumRatingID
                })
            });

            const result = await response.json();

            if (result.success) {
                alert('Album rating deleted successfully!');
                refreshAlbumRatings();
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error deleting album rating:', error);
            alert('An error occurred while deleting the album rating.');
        }
    };

    const handleCancel = () => {
        setEditedValues(rating); // reset to original
        setIsEditing(false);
    };

    return (
        <tr>
            {/* albumRatingID - not editable */}
            <td>{rating.albumRatingID}</td>

            {/* albumRating - editable */}
            <td>
                {isEditing ? (
                    <select
                        value={editedValues.albumRating}
                        onChange={(e) => handleInputChange("albumRating", e.target.value)}
                        style={{ width: '100%' }}
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
                ) : (
                    rating.albumRating
                )}
            </td>

            {/* albumName - editable */}
            <td>
                {isEditing ? (
                    <input
                        type="text"
                        value={editedValues.albumName}
                        onChange={(e) => handleInputChange("albumName", e.target.value)}
                        placeholder="Album name"
                        style={{ width: '100%' }}
                    />
                ) : (
                    rating.albumName
                )}
            </td>

            {/* customer - editable, parses on save */}
            <td>
                {isEditing ? (
                    <input
                        type="text"
                        value={editedValues.customer}
                        onChange={(e) => handleInputChange("customer", e.target.value)}
                        placeholder="First Last"
                        style={{ width: '100%' }}
                    />
                ) : (
                    rating.customer
                )}
            </td>

            {/* Delete button */}
            <td>
                <button onClick={handleDelete}>Delete</button>
            </td>

            {/* Update button */}
            <td>
                {isEditing ? (
                    <>
                        <button onClick={handleUpdate}>Save</button>
                        <button onClick={handleCancel} style={{ marginLeft: "5px" }}>Cancel</button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)}>Update</button>
                )}
            </td>
        </tr>
    );
};

export default AlbumRatingTableRow;