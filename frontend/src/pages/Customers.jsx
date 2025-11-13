import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';
import CreateCustomersForm from "../components/CustomersComponents/CreateCustomersForm.jsx";

function Customers({ backendURL }) {

    // Set up a state variable `sales` to store and display the backend response
    const [customers, setCustomers] = useState([]);

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/Customers');

            // Convert the response into JSON format
            const { customers } = await response.json();

            // Update the sales state with the response data
            setCustomers(customers);

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
            <h1>Customers</h1>

            <table>
                <thead>
                    <tr>
                        {customers.length > 0 && Object.keys(customers[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {customers.map((customer, index) => (
                        <TableRow key={index} rowObject={customer} backendURL={backendURL} refreshCustomers={getData} />
                    ))}

                </tbody>
            </table>

            <CreateCustomersForm backendURL={backendURL} refreshCustomers={getData} />
        </>
    );

} export default Customers;