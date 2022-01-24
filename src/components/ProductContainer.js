import React from "react";
import Moment from "react-moment";


export default function ProductContainer({
  city,
  product_name,
  brand_name,
  price,
  date,
  discription,
  img,
}) {

  
  return (
    <div className="product-container">
      <div className="left-product">
        <img src={img} />
        <span className="prod-date">{city}</span>
      </div>
      <div className="right-product">
        <span className="prod-name">{product_name}</span>
        <span className="prod-brand">{brand_name}</span>
        <span className="prod-price">$ {price}</span>
        <span className="prod-date">Date: <Moment format="DD:MM:YYYY" >{date}</Moment> </span>
      </div>
      <div className="lower-product">{discription}</div>
    </div>
  );
}
