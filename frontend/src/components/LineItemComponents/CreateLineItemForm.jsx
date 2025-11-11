const CreateLineItemForm = ({ backendURL, refreshAlbums }) => {

    return (
        <>
            <h2>Create a Line Item</h2>

            <form className='cuForm'>
                <label htmlFor="create_salesID">SalesID: </label>
                <input
                    type="number"
                    name="create_salesID"
                    id="create_salesID"
                />
                <label htmlFor="create_album_name">Album Name: </label>
                <input
                    type="text"
                    name="create_album_name"
                    id="create_album_name"
                />
                <label htmlFor="create_quantity">Quantity: </label>
                <input
                    type="number"
                    name="create_quantity"
                    id="create_quantity"
                />
                <input type="submit"/>
            </form>
        </>
    );
};

export default CreateLineItemForm;