// This module adapted from the starter code provided in CS340 Modules/Explorations

const CreateArtistForm = ({ backendURL, refreshArtists }) => {

    return (
        <>
            <h2>Create an Artist</h2>

            <form className='cuForm'>
                <label htmlFor="create_artist_name">Artist: </label>
                <input
                    type="text"
                    name="create_artist_name"
                    id="create_artist_name"
                />

                <label htmlFor="create_artist_description">Description: </label>
                <input
                    type="text"
                    name="create_artist_description"
                    id="create_artist_description"
                />

                <input type="submit" />
            </form>
        </>
    );
};

export default CreateArtistForm;