import '/Home.css'; // Import your CSS file
import ResetButton from '../components/ResetButton';

function Home({ backendURL }) {

    const handleResetComplete = () => {
        // Optional: Add any logic you want to run after reset
        console.log('Database has been reset');
    };

    return (
        <>
            <h1>Welcome to Group 60's Project!</h1>
            <h1>Album Ranking and Sales Database Management System</h1>
            <div className="homepageDescription">
                <p>Caleb Richter</p>
                <p> &</p>
                <p>Andrew Walsh</p>
                <p>Group 60</p>
                <p>Funky McRhythms Record DBMS</p>
            </div>

            <ResetButton
                backendURL={backendURL}
                onResetComplete={handleResetComplete}
            />
        </>
    )
}

export default Home;