const GenericUpdateButton = ({ rowObject, backendURL, refreshRows }) => {

    return (
        <td>
            <form>
                <button type='submit'>
                    Update
                </button>
            </form>
        </td>

    );
};

export default GenericUpdateButton;