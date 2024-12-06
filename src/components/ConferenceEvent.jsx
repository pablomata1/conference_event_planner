import React, { useState } from "react";
import "../css//ConferenceEvent.css";
import TotalCost from "./TotalCost";
import Navigation from "./NavBar";
import ItemsDisplay from "./ItemsDisplay";
import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "./venueSlice";
import { incrementAvQuantity, decrementAvQuantity } from "./avSlice";
import { toggleMealSelection } from "./mealsSlice";

const ConferenceEvent = () => {
  
  const [showItems, setShowItems] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  //Retrieving items from store
  const venueItems = useSelector((state) => state.venue);
  const avItems = useSelector(state => state.av);
  const mealItems = useSelector(state => state.meals);
  const dispatch = useDispatch();
  const remainingAuditoriumQuantity = 3 - venueItems.find(item => item.name === "Auditorium Hall (Capacity:200)").quantity;
    
  const handleToggleItems = () => {
    console.log("handleToggleItems called");
    setShowItems(!showItems);
  };

//Functions for venue
  const handleAddToCart = (index) => {
    if (venueItems[index].name === "Auditorium Hall (Capacity:200)" && venueItems[index].quantity >= 3) {
      return; //prevent further actions
    }
    dispatch(incrementQuantity(index));
  };
    
  const handleRemoveFromCart = (index) => {
    if (venueItems[index].quantity > 0) {
      dispatch(decrementQuantity(index));
    }
  };

 //Functions for Add Ons 
  const handleIncrementAvQuantity = (index) => {
    dispatch(incrementAvQuantity(index));
  };

  const handleDecrementAvQuantity = (index) => {
    if(avItems[index].quantity > 0){
      dispatch(decrementAvQuantity(index));
    }
  };

  const handleMealSelection = (index) => {
       const item = mealItems[index]
        // Ensure numberOfPeople is set before toggling selection
        if(item.selected && item.type === 'mealForPeople'){
          const newNumberOfPeople = item.selected ? numberOfPeople : 0;
          dispatch(toggleMealSelection(index,newNumberOfPeople));
        } else{
          dispatch(toggleMealSelection(index));
       }
  };

  //function to calculate the cost of selected items based on sectin : 'venue, av, meals '
  const calculateTotalCost = (section) => {
    let totalCost = 0;
    if (section === "venue") {
      totalCost = venueItems.reduce((total, item) => total + item.cost * item.quantity, 0);
    } else if (section === 'av'){
      totalCost = avItems.reduce((total, item) => total + item.cost * item.quantity, 0);
    }else if (section === 'meals'){
      mealItems.forEach(item => {
        if(item.selected){
          totalCost += item.cost * numberOfPeople;
        }
      });

    }
    
    return totalCost;
  };

  //Saving the return total cost for each category
  const venueTotalCost = calculateTotalCost("venue");
  const avTotalCost = calculateTotalCost('av');
  const mealsTotalCost = calculateTotalCost('meals');
 //svaes the differet total costs in this object varibable, so it can be passed into ItemsDisplay Component
  const totalCosts = {
    venue: venueTotalCost,
    av: avTotalCost,
    meals: mealsTotalCost,
  };

  //function will store all items the user selected in an array by creating an empty array named items
  const getItemsFromTotalCost = () => {
    const items = [];
    //These functions look for and include only items in the array the user selects
    //and labels each item in the array, "venue", "av", or "meals".
    venueItems.forEach(item => {
      if(item.quantity > 0){
        items.push({...item, type: 'venue'});
      }
    });
    avItems.forEach(item => {
      //The some() method checks if any array elements pass a test (provided as a callback function).
      //returns true if any of the aray elements pass the test, otherwise false
      if(item.quantity > 0 && !items.some((i) => i.name === item.name && i.type === 'av')){
        items.push({...item, type: 'av'});
      }
    });
    mealItems.forEach(item => {
      if(item.selected){
        //saves object with item information and additional information type
        //Example: {img: '', name: '', cost: '', quantity: '', type: ''}
        const itemForDisplay = {...item, type: 'meals'};
        //if the item has property number of people then add the same property to itemForDisplay
        if(item.numberOfPeople){
          itemForDisplay.numberOfPeople = numberOfPeople;
        }
        //push the itemForDisplay into the items array.
        items.push(itemForDisplay);
      }
    });
    return items;
  };

  const items = getItemsFromTotalCost();

  const navigateToProducts = (idType) => {
    if (idType == '#venue' || idType == '#addons' || idType == '#meals') {
      if (showItems) { // Check if showItems is false
        setShowItems(!showItems); // Toggle showItems to true only if it's currently false
      }
    }
  };

  //displays items using map
  const venuItemsDisplay = venueItems.map((item, index) => 
    <div className="venue_main" key={index}>
      <div className="img">
        <img src={item.img} alt={item.name} />
      </div>
      <div className="text">{item.name}</div>
      <div>${item.cost}</div>
      <div className="button_container">
        {venueItems[index].name === "Auditorium Hall (Capacity:200)" ? (
          <>
            <button
              className={venueItems[index].quantity === 0 ? "btn-warning btn-disabled" : " btn-warning"}
              onClick={() => handleRemoveFromCart(index)}
            > &#8211; </button>
            <span className="selected_count">
              {item.quantity}
            </span>
            <button
              className={remainingAuditoriumQuantity === 0? "btn-success btn-disabled" : "btn-success"}
              onClick={() => handleAddToCart(index)}
            > &#43; </button>
          </>
        ) : (
        <div className="button_container">
          <button
            className={venueItems[index].quantity ===0 ? " btn-warning btn-disabled" : "btn-warning btn-plus"}
            onClick={() => handleRemoveFromCart(index)}
          >
          &#8211;
          </button>
          <span className="selected_count">
            {item.quantity}
          </span>
          <button
            className={venueItems[index].quantity === 10 ? " btn-success btn-disabled" : "btn-success btn-plus"}
            onClick={() => handleAddToCart(index)}
          >
          &#43;
          </button>
        </div>
        )}
      </div>
    </div>
  ); //end map

  //Displays avItems
  const avItemsDisplay = avItems.map((item, index) =>
    <div className="av_data venue_main" key={index}>
      <div className="img">
          <img src={item.img} alt={item.name} />
      </div>
      <div className="text"> {item.name} </div>
      <div> ${item.cost} </div>
      <div className="addons_btn">
          <button className="btn-warning" onClick={() => handleDecrementAvQuantity(index)}> &ndash; </button>
          <span className="quantity-value">{item.quantity}</span>
          <button className=" btn-success" onClick={() => handleIncrementAvQuantity(index)}> &#43; </button>
      </div>
    </div>
  );

  //Displays meal items
  const mealItemsDisplay = mealItems.map((item, index) => 
    <div className="meal_item" key={index} style={{ padding: 15 }}>
      <div className="inner">
        <input type="checkbox" id={ `meal_${index}` }
          checked={ item.selected }
          onChange={() => handleMealSelection(index)}
       />
        <label htmlFor={`meal_${index}`}> {item.name} </label>
      </div>
    <div className="meal_cost">${item.cost}</div>
</div>
  );



//-----------------------------------RETURN---------------------------------------------------- 
  return (
    <>
      <div className="navbar_event_conference">
        <Navigation handleToggleItems={handleToggleItems} navigateToProducts={navigateToProducts}/>
      </div>

      <div className="main_container">
        {!showItems ? (
          <div className="items-information">

            {/*Necessary Add-ons*/}
            <div id="venue" className="venue_container container_main">

              <div className="text">
                <h1>Venue Room Selection</h1>
              </div>
              <div className="venue_selection">
                {venuItemsDisplay} 
              </div>
              <div className="total_cost">Total Cost: ${venueTotalCost}</div>

            </div>

            {/*Necessary Add-ons*/}
            <div id="addons" className="venue_container container_main">

              <div className="text">
                <h1> Add-ons Selection</h1>
              </div>
              <div className="addons_selection">
                {avItemsDisplay}
              </div>  
              <div className="total_cost">Total Cost: ${avTotalCost}</div>

            </div>

            {/* Meal Section */}
            <div id="meals" className="venue_container container_main">

              <div className="text">
                 <h1>Meals Selection</h1>
              </div>
              <div className="input-container venue_selection">
                <label htmlFor="numberOfPeople"><h3>Number of People:</h3></label>
                <input type="number" className="input_box5" id="numberOfPeople" value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                    min="1"
                />
              </div>
              <div className="meal_selection">
                {mealItemsDisplay}
              </div>
              <div className="total_cost">Total Cost: ${mealsTotalCost} </div>

            </div>

          </div>
          ) : (
            <div className="total_amount_detail">
              {/* The TotalCost component receives the props totalCosts and ItemsDisplay.
              The totalCosts prop contains cost data and the ItemsDisplay() component with items is passed as props to the TotalCost component. */}
              <TotalCost totalCosts={totalCosts} handleClick={handleToggleItems} ItemsDisplay={()=> <ItemsDisplay items={items} numberOfPeople={numberOfPeople}/>}/>
            </div>
          )
        }

      </div>
    </> // End empty div

  ); //End return
};

export default ConferenceEvent;
