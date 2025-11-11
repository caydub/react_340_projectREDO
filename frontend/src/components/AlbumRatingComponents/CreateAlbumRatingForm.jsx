const CreateAlbumRatingForm = ({ backendURL, refreshAlbums }) => {

    return (
        <>
            <h2>Create a Line Item</h2>

            <form className='cuForm'>
                <label htmlFor="create_album_name">Album Name: </label>
                <input
                    type="text"
                    name="create_album_name"
                    id="create_album_name"
                />
                <label htmlFor="create_customer_name">Customer Name: </label>
                <input
                    type="text"
                    name="create_customer_name"
                    id="create_customer_name"
                />
                <label htmlFor="create_album_rating">Album Rating: </label>
                <input
                    type="decimal"
                    name="create_album_rating"
                    id="create_album_rating"
                />
                <input type="submit"/>
            </form>
        </>
    );
};

export default CreateAlbumRatingForm;