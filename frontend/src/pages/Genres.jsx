/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Page structure and data fetching patterns
   Summary: Base page structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561
*/

import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/NakedTableRow';

function Genres({ backendURL }) {

    // Set up a state variable `genres` to store and display the backend response
    const [genres, setGenres] = useState([]);

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/Genres');

            // Convert the response into JSON format
            const { genres } = await response.json();

            // Update the genres state with the response data
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
            <h1>Genres</h1>

            <table>
                <thead>
                    <tr>
                        {genres.length > 0 && Object.keys(genres[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {genres.map((genre, index) => (
                        <TableRow key={index} rowObject={genre} backendURL={backendURL} refreshGenres={getData} />
                    ))}

                </tbody>
            </table>

        </>
    );

} export default Genres;