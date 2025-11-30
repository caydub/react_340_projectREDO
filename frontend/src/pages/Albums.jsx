import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import AlbumTableRow from '../components/AlbumComponents/AlbumTableRow';
import CreateAlbumForm from '../components/AlbumComponents/CreateAlbumForm';

function Albums({ backendURL }) {
    const [albums, setAlbums] = useState([]);
    const [genres, setGenres] = useState([]);

    const getData = async function () {
        try {
            const response = await fetch(`${backendURL}/Albums`);
            const { albums, genres } = await response.json();

            setAlbums(albums);
            setGenres(genres);
        } catch (error) {
            console.log(error);
        }
    };

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
                        <AlbumTableRow
                            key={index}
                            album={album}
                            backendURL={backendURL}
                            refreshRows={getData}
                            genres={genres}
                        />
                    ))}
                </tbody>
            </table>

            <CreateAlbumForm
                genres={genres}
                backendURL={backendURL}
                refreshAlbums={getData}
            />
        </>
    );
}

export default Albums;
