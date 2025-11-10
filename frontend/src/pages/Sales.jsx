import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/SalesComponents/SalesTableRow';
import CreateSalesForm from '../components/SalesComponents/CreateSalesForm';

function Sales({ backendURL }) {

    // Set up a state variable `sales` to store and display the backend response
    const [sales, setSales] = useState([]);

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/Sales');

            // Convert the response into JSON format
            const { sales } = await response.json();

            // Update the sales state with the response data
            setSales(sales);

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
            <h1>Sales</h1>

            <table>
                <thead>
                    <tr>
                        {sales.length > 0 && Object.keys(sales[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {sales.map((sale, index) => (
                        <TableRow key={index} rowObject={sale} backendURL={backendURL} refreshSales={getData} />
                    ))}

                </tbody>
            </table>

            <CreateSalesForm backendURL={backendURL} refreshSales={getData} />
        </>
    );

} export default Sales;