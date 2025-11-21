// This module adapted from the starter code provided in CS340 Modules/Explorations

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