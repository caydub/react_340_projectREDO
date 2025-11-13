// The following prompts were utilized to update the components, TableRow.jsx
// and GenericUpdateButton.jsx, with functionality to edit row data in place 
// when the update button is clicked.
//
// Citations for use of AI Tools:
// AI Model: Claude 3
// Date: 11/13/2025
// Prompts used to generate JavaScript XML
//
// Prompt 1:
// Hey Claude, I am trying to implement a way to make the update button in the
// table row to allow the user # to update the row values in place. The update
// values will be from server.js, but you do not need to worry about that for
// now. We do not need to implement any actual CRUD implementation at this time,
// just make the update button present the values already in place and make
// them editable.
//
// Prompt 2:
// Can you make it to where the first attribute/column is not editable?
// 
// AI Source URL: https://claude.ai/share/5669c902-16cc-44ae-9829-9b2f824b14c0

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