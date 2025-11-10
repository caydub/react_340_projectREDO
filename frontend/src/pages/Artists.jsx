import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';
import CreateArtistForm from '../components/ArtistComponents/CreateArtistForm';

function Artists({ backendURL }) {

    // Set up a state variable `artists` to store and display the backend response
    const [artists, setArtists] = useState([]);

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/Artists');

            // Convert the response into JSON format
            const { artists } = await response.json();

            // Update the artists state with the response data
            setArtists(artists);

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
            <h1>Artists</h1>

            <table>
                <thead>
                    <tr>
                        {artists.length > 0 && Object.keys(artists[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {artists.map((artist, index) => (
                        <TableRow key={index} rowObject={artist} backendURL={backendURL} refreshArtists={getData} />
                    ))}

                </tbody>
            </table>

            <CreateArtistForm backendURL={backendURL} refreshArtists={getData} />
        </>
    );

} export default Artists;