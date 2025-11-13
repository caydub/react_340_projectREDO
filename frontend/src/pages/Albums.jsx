import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';
import CreateAlbumForm from '../components/AlbumComponents/CreateAlbumForm';

function Albums({ backendURL }) {

    // Set up a state variable `albums` to store and display the backend response
    const [albums, setAlbums] = useState([]);
    const [genres, setGenres] = useState([]);


    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/Albums');

            // Convert the response into JSON format
            const { albums, genres } = await response.json();

            // Update the albums state with the response data
            setAlbums(albums);
            setGenres(genres);

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
            <h1>Albums</h1>

            <table>
                <thead>
                    <tr>
                        {albums.length > 0 && Object.keys(albums[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {albums.map((album, index) => (
                        <TableRow key={index} rowObject={album} backendURL={backendURL} refreshRows={getData} />
                    ))}

                </tbody>
            </table>

            <CreateAlbumForm genres={genres} backendURL={backendURL} refreshAlbums={getData} />
        </>
    );

} export default Albums;