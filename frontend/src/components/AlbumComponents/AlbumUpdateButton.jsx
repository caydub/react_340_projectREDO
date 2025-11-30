// WORK IN PROGRESS - No routing in place yet for this.
// Following Module 8 REACT tutorial for AlbumUpdateButton.jsx
// 11/20

const AlbumUpdateButton = ({ album, backendURL, refreshRows, editedValues, setEditedValues, isEditing, setIsEditing, genres }) => {
    const handleSave = async () => {
        try {
            const response = await fetch(`${backendURL}/Albums/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    albumID: editedValues.albumID,
                    albumName: editedValues.albumName,
                    albumPrice: parseFloat(editedValues.albumPrice),
                    amountInStock: parseInt(editedValues.amountInStock),
                    artistID: editedValues.artistID,
                    genreID: editedValues.genreID
                }),
            });

            if (response.ok) {
                console.log(`Album updated successfully.`);
                refreshRows();
                setIsEditing(false);
            } else {
                alert(`Error updating album`);
            }
        } catch (error) {
            console.error("Error updating album:", error);
            alert("An error occurred while updating the album.");
        }
    };

    const handleCancel = () => {
        setEditedValues(album); // reset edits
        setIsEditing(false);
    };

    return (
        <td>
            {isEditing ? (
                <>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel} style={{ marginLeft: "5px" }}>Cancel</button>
                </>
            ) : (
                <button onClick={() => setIsEditing(true)}>Update</button>
            )}
        </td>
    );
};

export default AlbumUpdateButton;
