const CreateAlbumForm = ({ genres, backendURL, refreshAlbums }) => {

    return (
        <>
            <h2>Create an Album</h2>

            <form className='cuForm'>
                <label htmlFor="create_album_name">Album: </label>
                <input
                    type="text"
                    name="create_album_name"
                    id="create_album_name"
                />

                <label htmlFor="create_album_price">Price: </label>
                <input
                    type="text"
                    name="create_album_price"
                    id="create_album_price"
                />

                <label htmlFor="create_album_amount_in_stock">Amount in Stock: </label>
                <input
                    type="number"
                    name="create_album_amount_in_stock"
                    id="create_album_amount_in_stock"
                />

                <label htmlFor="create_album_artist">Artist: </label>
                <input
                    type="text"
                    name="create_album_artist"
                    id="create_album_artist"
                />

                <label htmlFor="create_album_genre">Genre: </label>
                <select
                    name="create_album_genre"
                    id="create_album_genre"
                >
                    <option value="">Select a Genre</option>
                    {genres.map((genre, index) => (
                        <option value={genre.genreID} key={index}>{genre.genreID}</option>
                    ))}
                </select>

                <input type="submit" />
            </form>
        </>
    );
};

export default CreateAlbumForm;