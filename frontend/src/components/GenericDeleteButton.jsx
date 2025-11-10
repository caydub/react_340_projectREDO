const GenericDeleteButton = ({ rowObject, backendURL, refreshRows }) => {

    return (
        <td>
            <form>
                <button type='submit'>
                    Delete
                </button>
            </form>
        </td>

    );
};

export default GenericDeleteButton;