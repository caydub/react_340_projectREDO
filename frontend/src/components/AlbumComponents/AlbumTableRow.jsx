// The following prompts were utilized to update the components, TableRow.jsx
// and GenericUpdateButton.jsx, with functionality to edit row data in place. 
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

// This module adapted from the starter code provided in CS340 Modules/Explorations



import { useState } from 'react';
import AlbumDeleteButton from './AlbumDeleteButton';
import GenericUpdateButton from '../GenericUpdateButton';

const TableRow = ({ rowObject, backendURL, refreshRows }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState(rowObject);

    const handleInputChange = (key, value) => {
        setEditedValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <tr>
            {Object.entries(rowObject).map(([key, value], index) => (
                <td key={index}>
                    {isEditing && index !== 0 ? (
                        <input
                            type="text"
                            value={editedValues[key] || ''}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            style={{ width: '100%' }}
                        />
                    ) : (
                        value
                    )}
                </td>
            ))}

            <AlbumDeleteButton
                rowObject={rowObject}
                backendURL={backendURL}
                refreshRows={refreshRows}
            />
            <GenericUpdateButton
                rowObject={rowObject}
                editedValues={editedValues}
                backendURL={backendURL}
                refreshRows={refreshRows}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                setEditedValues={setEditedValues}
            />
        </tr>
    );
};

export default TableRow;