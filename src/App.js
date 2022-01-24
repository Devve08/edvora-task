import { useEffect, useState } from "react";
import ReactElasticCarousel from "react-elastic-carousel";
import "./App.css";
import ProductContainer from "./components/ProductContainer";

function App() {
  const [productValue, setProductValue] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [data, setData] = useState([]);
  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2, itemsToScroll: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 1200, itemsToShow: 4 }
  ];

  const handleStateChange = (e) => {
    setStateValue(e.target.value);
  };

  const handleProductChange = (e) => {
    setProductValue(e.target.value);
  };

  const handleCityChange = (e) => {
    setCityValue(e.target.value);
  };

  // fetching data from api

  const fetchData = async () => {
    let response = await fetch("https://assessment-edvora.herokuapp.com");
    let result = await response.json();
    setData(result);
    localStorage.setItem("data", JSON.stringify(result));
  };

  // Compare function in order to sort the data coming from the api in a better way so it can search faster
  const compare = (a, b) => {
    if (a.product_name < b.product_name) {
      return -1;
    }
    if (a.product_name > b.product_name) {
      return 1;
    }
    return 0;
  };
  // We will sort and then check if any filters required before mapping through the data.
  const sortedData = data.sort(compare).filter((item) => {
    if (!productValue && !stateValue && !cityValue) {
      return item;
    } else if (item.product_name == productValue) {
      return item;
    } else if (item.address.city == cityValue) {
      return item;
    } else if (item.address.state == stateValue) {
      return item;
    }
  });

 
  // We will check what Products, States, and Cities to display in dropdowns according to the recieved data
  // If a product or a state is selected the dropdown options in the state and city will change respectively.


  let uniqueProductsArray = [
    ...new Map(
      sortedData.map((item) => [item.product_name, item.product_name])
    ).values(),
  ];

  let uniqueStatesArray = [];
  if (!productValue) {
    uniqueStatesArray = [
      ...new Map(
        sortedData.map((item) => [item.address.state, item.address.state])
      ).values(),
    ];
  } else {
    sortedData.map((item) => {
      if (item.product_name == productValue) {
        if (!uniqueStatesArray.includes(item.address.state)) {
          uniqueStatesArray.push(item.address.state);
        }
      }
    });
  }

  let uniqueCitiesArray = [];
  if (!stateValue) {
    uniqueCitiesArray = [
      ...new Map(
        sortedData.map((item) => [item.address.city, item.address.city])
      ).values(),
    ];
  } else {
    sortedData.map((item) => {
      if (item.address.state == stateValue) {
        if (!uniqueCitiesArray.includes(item.address.city)) {
          uniqueCitiesArray.push(item.address.city);
        }
      }
    });
  }

  // Splitting the data recieved into multiple arrays with the brand name being the key for every array,  
  const split = sortedData.reduce(function (r, o) {
    var key = o.brand_name;
    if (r[key] || (r[key] = [])) r[key].push(o);
    return r;
  }, {});
  const splitArray = Object.entries(split);

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="App">
      <div className="left-section">
        <span>Filter</span>
        <div className="line"></div>
        <select value={productValue} onChange={handleProductChange}>
          <option value={""}>Product</option>
          {uniqueProductsArray.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>
        <select value={stateValue} onChange={handleStateChange}>
          <option value={""}> State</option>
          {uniqueStatesArray.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>
        <select value={cityValue} onChange={handleCityChange}>
          <option value={""}>City</option>
          {uniqueCitiesArray.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>
      </div>
      <div className="right-section">
        <h1>Edvora</h1>
        <h2>Products</h2>
        {console.log(splitArray)}
        {splitArray.map((item) => {
          return (
            <div className="result">
              <h3>{item[0]}</h3> 
              <div className="line-two"></div>
              <div className="horizontal-scroll">
                <ReactElasticCarousel breakPoints={breakPoints} itemsToShow={3}>
                  {item[1]
                    .filter((pro) => {
                      if (!stateValue && !cityValue) {
                        return pro;
                      } else if (stateValue) {
                        if(!cityValue){
                          return stateValue == pro.address.state
                        } return cityValue == pro.address.city
                      } else if(cityValue) {
                        return cityValue == pro.address.city
                      }
                    })
                    .map((pro) => (
                      <ProductContainer
                        product_name={pro.product_name}
                        city={pro.address.city}
                        brand_name={pro.brand_name}
                        date={pro.time}
                        img={pro.image}
                        price={pro.price}
                        discription={pro.discription}
                      />
                    ))}
                </ReactElasticCarousel>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
