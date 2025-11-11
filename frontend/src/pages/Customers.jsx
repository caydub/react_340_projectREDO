import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';
import CreateCustomerForm from "../components/CustomerComponents/CreateCustomerForm.jsx";

function Customer({ backendURL }) {

    // Set up a state variable `sales` to store and display the backend response
    const [customer, setCustomer] = useState([]);

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/Customer');

            // Convert the response into JSON format
            const { customer } = await response.json();

            // Update the sales state with the response data
            setCustomer(customer);

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
            <h1>Customer</h1>

            <table>
                <thead>
                    <tr>
                        {customer.length > 0 && Object.keys(customer[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {customer.map((sale, index) => (
                        <TableRow key={index} rowObject={customer} backendURL={backendURL} refreshCustomers={getData} />
                    ))}

                </tbody>
            </table>

            <CreateCustomerForm backendURL={backendURL} refreshCustomers={getData} />
        </>
    );

} export default Customer;