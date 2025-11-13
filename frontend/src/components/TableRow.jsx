import { useState } from 'react';
import GenericDeleteButton from './GenericDeleteButton';
import GenericUpdateButton from './GenericUpdateButton';

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

            <GenericDeleteButton
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