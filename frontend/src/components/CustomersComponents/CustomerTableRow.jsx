/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Table row component with inline editing pattern
   Summary: Base table row structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created CustomerTableRow with inline editing for Customers entity
   Summary: Displays concatenated customer name. When editing, shows single text input
            that parses full name into firstName/lastName on save. Only shows 
            customerID, customer, phoneNumber, email columns.
   AI Source URL: https://claude.ai/
*/

import { useState, useEffect } from "react";
import CustomerDeleteButton from "./CustomerDeleteButton";
import CustomerUpdateButton from "./CustomerUpdateButton";

const CustomerTableRow = ({ customer, backendURL, refreshCustomers }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState({
        customerID: customer.customerID,
        customer: customer.customer,
        phoneNumber: customer.phoneNumber,
        email: customer.email
    });

    // Sync with customer prop when it changes
    useEffect(() => {
        setEditedValues({
            customerID: customer.customerID,
            customer: customer.customer,
            phoneNumber: customer.phoneNumber,
            email: customer.email
        });
    }, [customer]);

    const handleInputChange = (key, value) => {
        setEditedValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <tr>
            {/* customerID - not editable (primary key) */}
            <td>{customer.customerID}</td>

            {/* customer (full name) - single input when editing, parsed on save */}
            <td>
                {isEditing ? (
                    <input
                        type="text"
                        value={editedValues.customer || ''}
                        onChange={(e) => handleInputChange("customer", e.target.value)}
                        placeholder="First Last"
                        style={{ width: '100%' }}
                    />
                ) : (
                    customer.customer
                )}
            </td>

            {/* phoneNumber - editable */}
            <td>
                {isEditing ? (
                    <input
                        type="text"
                        value={editedValues.phoneNumber || ''}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        style={{ width: '100%' }}
                        placeholder="Optional"
                    />
                ) : (
                    customer.phoneNumber || ''
                )}
            </td>

            {/* email - editable */}
            <td>
                {isEditing ? (
                    <input
                        type="email"
                        value={editedValues.email || ''}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        style={{ width: '100%' }}
                        placeholder="Optional"
                    />
                ) : (
                    customer.email || ''
                )}
            </td>

            <CustomerDeleteButton
                customerID={customer.customerID}
                backendURL={backendURL}
                refreshCustomers={refreshCustomers}
            />
            <CustomerUpdateButton
                customerID={customer.customerID}
                editedValues={editedValues}
                backendURL={backendURL}
                refreshCustomers={refreshCustomers}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                setEditedValues={setEditedValues}
                originalCustomer={customer}
            />
        </tr>
    );
};

export default CustomerTableRow;