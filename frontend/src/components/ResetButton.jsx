const ResetButton = ({ backendURL, onResetComplete }) => {

    const handleReset = async (e) => {
        e.preventDefault();

        // Confirm before resetting
        if (!window.confirm('Are you sure you want to reset the database? This will delete all current data and restore sample data.')) {
            return;
        }

        try {
            const response = await fetch(backendURL + '/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                alert('Database reset successfully!');
                console.log(result.message);

                // Call callback if provided to refresh any data on parent components
                if (onResetComplete) {
                    onResetComplete();
                }
            } else {
                throw new Error('Failed to reset database');
            }
        } catch (error) {
            console.error('Error resetting database:', error);
            alert('An error occurred while resetting the database. Please try again.');
        }
    };

    return (
        <div className="reset-button-container">
            <form onSubmit={handleReset}>
                <button type='submit' className="reset-button">
                    Reset Database
                </button>
            </form>
        </div>
    );
};

export default ResetButton;