import DeleteAlbumForm from './DeleteAlbumForm';

const TableRow = ({ rowObject, backendURL, refreshAlbums }) => {
    return (
        <tr>
            {Object.values(rowObject).map((value, index) => (
                <td key={index}>{value}</td>
            ))}

            <DeleteAlbumForm rowObject={rowObject} backendURL={backendURL} refreshAlbums={refreshAlbums} />
        </tr>
    );
};

export default TableRow;