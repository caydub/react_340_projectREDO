const GenericUpdateButton = ({
    rowObject,
    editedValues,
    backendURL,
    refreshRows,
    isEditing,
    setIsEditing,
    setEditedValues
}) => {

    const handleUpdateClick = (e) => {
        e.preventDefault();
        if (isEditing) {
            // When saving, you'll add your API call here later
            console.log('Saving values:', editedValues);
            // After successful save, exit edit mode
            setIsEditing(false);
        } else {
            // Enter edit mode
            setIsEditing(true);
        }
    };

    const handleCancelClick = (e) => {
        e.preventDefault();
        // Reset to original values and exit edit mode
        setEditedValues(rowObject);
        setIsEditing(false);
    };

    return (
        <td>
            <button type='button' onClick={handleUpdateClick}>
                {isEditing ? 'Save' : 'Update'}
            </button>
            {isEditing && (
                <button type='button' onClick={handleCancelClick} style={{ marginLeft: '5px' }}>
                    Cancel
                </button>
            )}
        </td>
    );
};

export default GenericUpdateButton;