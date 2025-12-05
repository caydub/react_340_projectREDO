/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Update button pattern for inline editing
   Summary: Base update button structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created update button for Customers entity with inline editing
   Summary: Implemented update functionality with save/cancel buttons, backend API call to /Customers/update,
            and error handling. Parses customer full name into firstName/lastName before sending to backend.
   AI Source URL: https://claude.ai/
*/

const CustomerUpdateButton = ({
    customerID,
    backendURL,
    refreshCustomers,
    editedValues,
    setEditedValues,
    isEditing,
    setIsEditing,
    originalCustomer
}) => {
    const handleSave = async () => {
        // Validate customer name exists
        if (!editedValues.customer || !editedValues.customer.trim()) {
            alert("Customer name is required");
            return;
        }

        // Parse customer name into firstName and lastName
        const nameParts = editedValues.customer.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || nameParts[0]; // If no last name, use first name

        try {
            const response = await fetch(`${backendURL}/Customers/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerID: customerID,
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: editedValues.phoneNumber || null,
                    email: editedValues.email || null
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert('Customer updated successfully!');
                setIsEditing(false);
                refreshCustomers();
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error("Error updating customer:", error);
            alert("An error occurred while updating the customer.");
        }
    };

    const handleCancel = () => {
        setEditedValues(originalCustomer); // reset edits to original values
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

export default CustomerUpdateButton;