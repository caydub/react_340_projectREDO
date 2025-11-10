const CreateSalesForm = ({ genres, backendURL, refreshSales }) => {

    return (
        <>
            <h2>Create a Sale</h2>
            <form className='cuForm'>
                <label htmlFor="choose_customer_fname">Customer First Name: </label>
                <input
                    type="text"
                    name="choose_customer_fname"
                    id="choose_customer_fname"
                />

                <label htmlFor="choose_customer_lname">Customer Last Name: </label>
                <input
                    type="text"
                    name="choose_customer_lname"
                    id="choose_customer_lname"
                />

                <label htmlFor="insert_date">Sale Date: </label>
                <input
                    type="date"
                    name="insert_date"
                    id="insert_date"
                />

                <input type="submit" value="Line Items" />
            </form>
        </>
    );
};

export default CreateSalesForm;