/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Summary: Table rows adapted from CS340 starter code.
*/

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