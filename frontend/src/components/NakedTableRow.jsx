const TableRow = ({ rowObject, backendURL, refreshRows }) => {
    return (
        <tr>
            {Object.values(rowObject).map((value, index) => (
                <td key={index}>{value}</td>
            ))}

        </tr>
    );
};

export default TableRow;