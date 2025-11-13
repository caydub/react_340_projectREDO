import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';
import CreateAlbumRatingsForm from "../components/AlbumRatingsComponents/CreateAlbumRatingsForm.jsx";

function AlbumRatings({ backendURL }) {

    // Set up a state variable `sales` to store and display the backend response
    const [albumRatings, setAlbumRatings] = useState([]);

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/AlbumRatings');

            // Convert the response into JSON format
            const { albumRatings } = await response.json();

            // Update the sales state with the response data
            setAlbumRatings(albumRatings);

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
            <h1>Album Ratings</h1>

            <table>
                <thead>
                <tr>
                    {albumRatings.length > 0 && Object.keys(albumRatings[0]).map((header, index) => (
                        <th key={index}>{header}</th>
                    ))}
                    <th></th>
                    <th></th>
                </tr>
                </thead>

                <tbody>
                    {albumRatings.map((rating, index) => (
                        <TableRow key={index} rowObject={rating} backendURL={backendURL} refreshAlbumRatings={getData} />
                    ))}

                </tbody>
            </table>

            <CreateAlbumRatingsForm backendURL={backendURL} refreshAlbumRatings={getData} />
        </>
    );

} export default AlbumRatings;