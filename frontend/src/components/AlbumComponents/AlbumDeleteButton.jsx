import React from 'react';

const AlbumDeleteButton = ({ albumID, backendURL, refreshRows }) => {
    const handleDelete = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${backendURL}/Albums/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ delete_album_ID: albumID }),
            });

            if (response.ok) {
                console.log('Album deleted successfully.');
                refreshRows();
            } else {
                console.error('Error deleting album.');
            }
        } catch (error) {
            console.error('Error during deletion:', error);
        }
    };

    return (
        <td>
            <button onClick={handleDelete}>Delete</button>
        </td>
    );
};

export default AlbumDeleteButton;
