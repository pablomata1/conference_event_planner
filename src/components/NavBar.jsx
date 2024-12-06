import React from "react";


const Navigation = ({handleToggleItems, navigateToProducts}) => {
    return (
        <>
            <div className="company_logo">Conference Expense Planner</div>
                <div className="left_navbar">
                    <div className="nav_links">
                        <a href="#venue" onClick={() => navigateToProducts("#venue")} >Venue</a>
                        <a href="#addons" onClick={() => navigateToProducts('#addons')}>Add-ons</a>
                        <a href="#meals" onClick={() => navigateToProducts('#meals')}>Meals</a>
                    </div>
                    <button className="details_button" onClick={handleToggleItems}>
                        Show Details
                    </button>
            </div>
        </>
    )
};

export default Navigation;