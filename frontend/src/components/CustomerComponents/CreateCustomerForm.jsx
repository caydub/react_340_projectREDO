const CreateCustomerForm = ({ backendURL, refreshCustomers }) => {

    return (
        <>
            <h2>Create a Customer</h2>

            <form className='cuForm'>
                <label htmlFor="create_customer_firstname">Customer First Name: </label>
                <input
                    type="text"
                    name="create_customer_firstname"
                    id="create_customer_firstname"
                />
                <label htmlFor="create_customer_lastname">Customer Last Name: </label>
                <input
                    type="text"
                    name="create_customer_lastname"
                    id="create_customer_lastname"
                />
                <label htmlFor="create_customer_phonenumber">Customer Phone Number: </label>
                <input
                    type="text"
                    name="create_customer_phonenumber"
                    id="create_customer_phonenumber"
                />
                <label htmlFor="create_customer_email">Customer Email: </label>
                <input
                    type="text"
                    name="create_customer_email"
                    id="create_customer_email"
                />
                <input type="submit"/>
            </form>
        </>
    );
};

export default CreateCustomerForm;