import * as url from "node:url";

const GenericDeleteButton = ({ rowObject, backendURL, refreshRows, deleteIdField, deleteRoute }) => {

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            [deleteIdField]: rowObject[deleteIdField],
        };

        try {
            console.log("URL: ", `${backendURL}${deleteRoute}`);
            console.log("formData: ", formData);

            const response = await fetch(`${backendURL}${deleteRoute}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log("Row deleted successfully.");
                refreshRows();
            } else {
                console.error("Error deleting row.");
            }
        } catch (error) {
            console.error('Error during deletion:', error);
        }
    };

    return (
        <td>
            <form onSubmit={handleSubmit}>
                <button type='submit'>
                    Delete
                </button>
            </form>
        </td>
    );
};

export default GenericDeleteButton;
