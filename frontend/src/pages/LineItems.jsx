import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';
import CreateLineItemsForm from "../components/LineItemsComponents/CreateLineItemsForm.jsx";

function LineItems({ backendURL }) {

    // Set up a state variable `sales` to store and display the backend response
    const [lineItems, setLineItems] = useState([]);

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/LineItems');

            // Convert the response into JSON format
            const { lineItems } = await response.json();

            // Update the sales state with the response data
            setLineItems(lineItems);

        } catch (error) {
            // If the API call fails, print the error to the console
            console.log(error);
        }

    };

    // Load table on page load
    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <h1>Line Items</h1>

            <table>
                <thead>
                    <tr>
                        {lineItems.length > 0 && Object.keys(lineItems[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {lineItems.map((lineItem, index) => (
                        <TableRow key={index} rowObject={lineItem} backendURL={backendURL} refreshRows={getData} />
                    ))}

                </tbody>
            </table>

            <CreateLineItemsForm backendURL={backendURL} refreshLineItems={getData} />
        </>
    );

} export default LineItems;