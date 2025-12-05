/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Page structure and data fetching patterns
   Summary: Base page structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Updated AlbumRatings page to use custom table row with name parsing
   Summary: Changed from generic TableRow to AlbumRatingTableRow with customer name parsing.
   AI Source URL: https://claude.ai/
*/

import { useState, useEffect } from 'react';
import AlbumRatingTableRow from '../components/AlbumRatingsComponents/AlbumRatingTableRow';
import CreateAlbumRatingsForm from "../components/AlbumRatingsComponents/CreateAlbumRatingsForm";

function AlbumRatings({ backendURL }) {

    const [albumRatings, setAlbumRatings] = useState([]);

    const getData = async function () {
        try {
            const response = await fetch(backendURL + '/AlbumRatings');
            const { albumRatings } = await response.json();
            setAlbumRatings(albumRatings);
        } catch (error) {
            console.log(error);
        }
    };

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
                        <AlbumRatingTableRow
                            key={index}
                            rating={rating}
                            backendURL={backendURL}
                            refreshAlbumRatings={getData}
                        />
                    ))}
                </tbody>
            </table>

            <CreateAlbumRatingsForm backendURL={backendURL} refreshAlbumRatings={getData} />
        </>
    );
}

export default AlbumRatings;