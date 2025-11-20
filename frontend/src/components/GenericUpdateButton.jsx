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

import React, { useState } from 'react';

const GenericUpdateButton = ({
    rowObject,
    backendURL,
    refreshRows,
    updateRoute,
    editableFields
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(
        editableFields.reduce((acc, field) => {
            acc[field] = rowObject[field];
            return acc;
        }, {})
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendURL}${updateRoute}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, id: rowObject.id }),
            });

            if (response.ok) {
                console.log('Row updated successfully.');
                refreshRows();
                setIsEditing(false);
            } else {
                console.error('Error updating row.');
            }
        } catch (err) {
            console.error('Error during update:', err);
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        // Reset values
        const resetData = editableFields.reduce((acc, field) => {
            acc[field] = rowObject[field];
            return acc;
        }, {});
        setFormData(resetData);
        setIsEditing(false);
    };

    return (
        <td>
            {isEditing ? (
                <>
                    {editableFields.map((field) => (
                        <input
                            key={field}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                        />
                    ))}
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel} style={{ marginLeft: '5px' }}>Cancel</button>
                </>
            ) : (
                <button onClick={() => setIsEditing(true)}>Update</button>
            )}
        </td>
    );
};

export default GenericUpdateButton;
