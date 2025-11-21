// WORK IN PROGRESS - No routing in place yet for this.
// Following Module 8 REACT tutorial for AlbumUpdateButton.jsx
// 11/20
import { useState } from "react";
import AlbumDeleteButton from "./AlbumDeleteButton";
import GenericUpdateButton from "../GenericUpdateButton";

const AlbumTableRow = ({ album, backendURL, refreshRows }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState(album);

    const handleInputChange = (key, value) => {
        setEditedValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <tr>
            {Object.entries(album).map(([key, value]) => (
                <td key={key}>
                    {isEditing && key !== "albumID" ? (
                        <input
                            type={
                                key.toLowerCase().includes("price") ||
                                    key.toLowerCase().includes("amount")
                                    ? "number"
                                    : "text"
                            }
                            name={key}
                            value={editedValues[key]}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            style={{ width: "100%" }}
                        />
                    ) : (
                        value
                    )}
                </td>
            ))}

            {/* Delete button */}
            <AlbumDeleteButton
                albumID={album.albumID}
                backendURL={backendURL}
                refreshRows={refreshRows}
            />

            {/* Update button */}
            <GenericUpdateButton
                rowObject={album}
                editedValues={editedValues}
                setEditedValues={setEditedValues}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                backendURL={backendURL}
                updateRoute="/Albums/update"
                editableFields={Object.keys(album).filter(k => k !== "albumID")}
                refreshRows={refreshRows}
            />
        </tr>
    );
};

export default AlbumTableRow;
