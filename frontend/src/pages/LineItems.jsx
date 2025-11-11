import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';
import CreateLineItemForm from "../components/LineItemComponents/CreateLineItemForm.jsx";

function LineItem({ backendURL }) {

    // Set up a state variable `sales` to store and display the backend response
    const [lineitem, setLineItem] = useState([]);

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/Lineitem');

            // Convert the response into JSON format
            const { lineitem } = await response.json();

            // Update the sales state with the response data
            setLineItem(lineitem);

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
                    {lineitem.length > 0 && Object.keys(lineitem[0]).map((header, index) => (
                        <th key={index}>{header}</th>
                    ))}
                    <th></th>
                    <th></th>
                </tr>
                </thead>

                <tbody>
                {lineitem.map((sale, index) => (
                    <TableRow key={index} rowObject={lineitem} backendURL={backendURL} refreshLineItems={getData} />
                ))}

                </tbody>
            </table>

            <CreateLineItemForm backendURL={backendURL} refreshLineItems={getData} />
        </>
    );

} export default LineItem;