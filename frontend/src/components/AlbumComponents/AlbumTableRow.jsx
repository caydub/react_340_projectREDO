import { useState } from 'react';
import AlbumDeleteButton from './AlbumDeleteButton';
import GenericUpdateButton from '../GenericUpdateButton';

const AlbumTableRow = ({ album, backendURL, refreshRows }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState(album);

    const handleInputChange = (key, value) => {
        setEditedValues(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <tr>
            {Object.entries(album).map(([key, value], index) => (
                <td key={index}>
                    {isEditing && index !== 0 ? ( // first column (ID) not editable
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
                albumID={album.albumID}
                backendURL={backendURL}
                refreshRows={refreshRows}
            />

            <GenericUpdateButton
                rowObject={album}
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

export default AlbumTableRow;
