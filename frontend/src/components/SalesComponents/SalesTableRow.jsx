import LineItemsButton from './LineItemsButton';

const TableRow = ({ rowObject, backendURL, refreshRows }) => {
    return (
        <tr>
            {Object.values(rowObject).map((value, index) => (
                <td key={index}>{value}</td>
            ))}

            <LineItemsButton rowObject={rowObject} backendURL={backendURL} refreshRows={refreshRows} />
        </tr>
    );
};

export default TableRow;