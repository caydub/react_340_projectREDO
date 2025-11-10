import GenericDeleteButtom from './GenericDeleteButton';
import GenericUpdateButton from './GenericUpdateButton';

const TableRow = ({ rowObject, backendURL, refreshRows }) => {
    return (
        <tr>
            {Object.values(rowObject).map((value, index) => (
                <td key={index}>{value}</td>
            ))}

            <GenericDeleteButtom rowObject={rowObject} backendURL={backendURL} refreshRows={refreshRows} />
            <GenericUpdateButton rowObject={rowObject} backendURL={backendURL} refreshRows={refreshRows} />
        </tr>
    );
};

export default TableRow;