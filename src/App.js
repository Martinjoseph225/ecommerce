import React, { useEffect, useState } from "react";
import { commerce } from "./lib/commerce";

import { Products, NavBar, Cart, Checkout } from "./components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Review from "./components/CheckoutForm/Review";

const App = () => {
  const [products, setproducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const fetchProducts = async () => {
    const { data } = await commerce.products.list();
    setproducts(data);
  };
  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve());
  };
  const handleAddToCart = async (productId, quantity) => {
    const item = await commerce.cart.add(productId, quantity);

    setCart(item.cart);
  };
  const handleUpdateCartQty = async (productId, quantity) => {
    const { cart } = await commerce.cart.update(productId, { quantity });
    setCart(cart);
  };
  const handleRemoveFromCart = async (lineItemId) => {
    const { cart } = await commerce.cart.remove(lineItemId);
    setCart(cart);
  };
  const handleEmptyCart = async () => {
    const { cart } = await commerce.cart.empty();
    setCart(cart);
  };

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();
    setCart(newCart);
    console.log("test2");
  };

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    try {
      const incomingOrder = await commerce.checkout.capture(
        checkoutTokenId,
        newOrder
      );
      setOrder(incomingOrder);
      console.log("test1");
      refreshCart();
      // handleEmptyCart();
    } catch (error) {
      setErrorMessage(error.data.error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  return (
    <Router>
      <div>
        <NavBar totalItems={cart.total_items} />

        <Routes>
          <Route
            exact
            path="/"
            element={
              <Products products={products} onAddToCart={handleAddToCart} />
            }
          />

          <Route
            exact
            path="/cart"
            element={
              <Cart
                cart={cart}
                handleUpdateCartQty={handleUpdateCartQty}
                handleRemoveFromCart={handleRemoveFromCart}
                handleEmptyCart={handleEmptyCart}
              />
            }
          />

          <Route>
            <Route
              exact
              path="/checkout"
              element={
                <Checkout
                  cart={cart}
                  order={order}
                  onCaptureCheckout={handleCaptureCheckout}
                  error={errorMessage}
                />
              }
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
