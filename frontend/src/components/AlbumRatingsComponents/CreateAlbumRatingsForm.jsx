// This module adapted from the starter code provided in CS340 Modules/Explorations

const CreateAlbumRatingsForm = ({ backendURL, refreshAlbumRatings }) => {

    return (
        <>
            <h2>Create an Album Rating</h2>

            <form className='cuForm'>
                <label htmlFor="create_album_name">Album: </label>
                <input
                    type="text"
                    name="create_album_name"
                    id="create_album_name"
                />
                <label htmlFor="create_customer_fname">Customer First Name: </label>
                <input
                    type="text"
                    name="create_customer_fname"
                    id="create_customer_fname"
                />
                <label htmlFor="create_customer_lname">Customer Last Name: </label>
                <input
                    type="text"
                    name="create_customer_lname"
                    id="create_customer_lname"
                />
                <label htmlFor="create_album_rating">Rating: </label>
                <select
                    name="create_album_rating"
                    id="create_album_rating"
                >
                    <option value="">Select a Rating</option>
                    <option value="0">0</option>
                    <option value="0.5">0.5</option>
                    <option value="1.0">1.0</option>
                    <option value="1.5">1.5</option>
                    <option value="2.0">2.0</option>
                    <option value="2.5">2.5</option>
                    <option value="3.0">3.0</option>
                    <option value="3.5">3.5</option>
                    <option value="4.0">4.0</option>
                    <option value="4.5">4.5</option>
                    <option value="5.0">5.0</option>
                </select>

                <input type="submit" />
            </form>
        </>
    );
};

export default CreateAlbumRatingsForm;