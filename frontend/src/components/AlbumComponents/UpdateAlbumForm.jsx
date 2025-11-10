const UpdateAlbumForm = ({ albums, genres, backendURL, refreshAlbums }) => {

    return (
        <>
            <h2>Update an Album</h2>
            <form className='cuForm'>
                <label htmlFor="update_album_id">Album to Update: </label>
                <select
                    name="update_album_id"
                    id="update_album_id"
                >
                    <option value="">Select an Album</option>
                    {albums.map((album) => (
                        <option key={album.id} value={album.id}>
                            {album.id} - {album.title}
                        </option>
                    ))}
                </select>

                <label htmlFor="update_album_genre">Genre: </label>
                <select
                    name="update_album_genre"
                    id="update_album_genre"
                >
                    <option value="">Select a Genre</option>
                    <option value="NULL">&lt; None &gt;</option>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                            {genre.name}
                        </option>
                    ))}
                </select>

                <label htmlFor="update_album_year">Year: </label>
                <input
                    type="number"
                    name="update_album_year"
                    id="update_album_year"
                />

                <input type="submit" />
            </form>
        </>
    );
};

export default UpdateAlbumForm;