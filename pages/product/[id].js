import { useRouter } from "next/router";
import Image from "next/image";
import React, { useContext } from "react";
import { Store } from "../../utilities/Store";

import Score from "../../components/product-page/Score";
import Quantity from "../../components/product-page/Quantity";
import ProductItem from "../../components/product-tile/ProductTile";

export default function ProductPage({ product }) {
  const { state, dispatch } = useContext(Store);

  const { query } = useRouter();
  const { id } = query;
  // const product = products.find((x) => x._id === _id);

  if (!product) {
    return <p> product not found</p>;
  }

  const addToCartHandler = () => {
    const itemExists = state.cart.cartItems.find((item) => item._id === product._id);
    const quantity = itemExists ? itemExists.quantity + 1 : 1;

    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });

    // console.log(state.cart.cartItems.length);
  };

  let productImages = [];
  product.img.includes(",") ? (productImages = product.img.split(",")) : (productImages = productImages.concat(product.img));
  let imageSrc = productImages[0];

  function changeSrcLeft() {
    console.log("arrow clicked");
    imageSrc === productImages[0] && productImages[2] ? (imageSrc = productImages[2]) : null;
  }
  function changeSrcRight() {
    console.log("arrow clicked");

    imageSrc === productImages[0] && productImages[1] ? (imageSrc = productImages[1]) : null;
    console.log(imageSrc);
  }

  return (
    <div className="product-page">
      <div className="left">
        <Image src={imageSrc} alt={product.name} width={200} height={200} layout="responsive" placeholder="blur" blurDataURL="/placeholder.png"></Image>

        {productImages[1] ? (
          <>
            <div className="arrow-left" onClick={changeSrcLeft}>
              &#8592;
            </div>
            <div className="arrow-rigth" onClick={changeSrcRight}>
              &#8594;
            </div>
          </>
        ) : null}

        {product.speed !== 0 ? (
          <div className="product-flight-score">
            <Score name="Speed" score={product.speed}></Score>
            <Score name="Glide" score={product.glide}></Score>
            <Score name="Turn" score={product.turn}></Score>
            <Score name="Fade" score={product.fade}></Score>
          </div>
        ) : null}
      </div>

      <div className="right">
        {product.countInStock < 5 ? <p className="only-stock">Only {product.countInStock} left!</p> : null}
        <h2>{product.name}</h2>
        <h3>
          {product.brand} | {product.brand}
        </h3>

        <p>{product.description}</p>

        <p className="price">
          <span>{product.price}</span> dkk
        </p>

        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="weight-color">Weight / Color:</label>
            <select name="weight-color" id="weight-color">
              <option value="pink">180g / Pink</option>
            </select>
          </div>
          {/* <Quantity name="Quantity" quant={quant} setQuant={setQuant} /> */}
        </div>

        <button onClick={addToCartHandler}>Add to basket</button>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const req = await fetch("https://cocktails-240e.restdb.io/rest/disc-connection", {
    method: "GET",
    headers: { "cache-control": "no-cache", "x-apikey": "a7a3d1237d76a4c6bd5943e4230d2b86f526e" },
  });
  const data = await req.json();

  const paths = data.map((product) => {
    return {
      params: { id: product._id.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const id = context.params.id;
  const req = await fetch("https://cocktails-240e.restdb.io/rest/disc-connection/" + id, {
    method: "GET",
    headers: { "cache-control": "no-cache", "x-apikey": "a7a3d1237d76a4c6bd5943e4230d2b86f526e" },
  });
  const product = await req.json();

  if (product)
    return {
      props: { product },
    };
}
