import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Navigation } from "./base_layout/Navigation";
import { Footer } from "./base_layout/Footer";
import { Home } from "./Home";
import { About } from "./static_pages/About";
import { TermsOfService } from "./static_pages/TermsOfService";
import { Privacy } from "./static_pages/Privacy";
import { P404 } from "./static_pages/P404";
import { Category } from "./shop/Category";
import { Search } from "./shop/Search";
import { Product } from "./shop/Product";
import { LostPassword } from "./account/LostPassword";
import { Register } from "./account/Register";
import { Cart } from "./shop/Cart";
import { ProfileEditAccount } from "./account/ProfileEditAccount";
import { ProfileAddress } from "./account/ProfileAddress";
import { ProfilePayments } from "./account/ProfilePayments";
import { ProfileOrders } from "./account/ProfileOrders";
import { ProfileOrder } from "./account/ProfileOrder";
import { baseURL } from "./api/API";
import Axios from "axios";

function App() {
  const [user, setUser] = useState({});
  const [isloggedin, setisLoggedIn] = useState(false);
  let login = 1;
  useEffect(() => {
    Axios.get(baseURL + "/auth/me", {
      withCredentials: true,
    }).then((res) => {
      setisLoggedIn(true);
      setUser(res.data.user);
    });
  }, [login]);
  login++;
  return (
    <Router>
      <div>
        <Navigation loggedin={isloggedin} user={user} />
        <Switch>
          {/* User Account */}
          <Route
            exact={true}
            path="/account/profile"
            children={<ProfileEditAccount />}
          />
          <Route
            exact={true}
            path="/account/profile/edit_account"
            children={<ProfileEditAccount />}
          />
          <Route
            exact={true}
            path="/account/profile/addresses"
            children={<ProfileAddress />}
          />
          <Route
            exact={true}
            path="/account/profile/payment_methods"
            children={<ProfilePayments />}
          />
          <Route
            exact={true}
            path="/account/profile/orders"
            children={<ProfileOrders />}
          />
          <Route
            exact={true}
            path="/account/profile/order/:id"
            children={<ProfileOrder />}
          />

          {/* Account */}
          <Route
            exact={true}
            path="/account/lostpassword"
            children={<LostPassword />}
          />
          <Route
            exact={true}
            path="/account/register"
            children={<Register />}
          />

          {/* Shop */}
          <Route
            exact={true}
            path="/shop/category/:cat"
            children={<Category />}
          />
          <Route
            exact={true}
            path="/shop/search/:search"
            children={<Search />}
          />
          <Route
            exact={true}
            path="/shop/product/:product"
            children={<Product />}
          />
          <Route exact={true} path="/shop/cart" children={<Cart />} />

          {/* Static pages */}
          <Route exact={true} path="/about" children={<About />} />
          <Route exact={true} path="/tos" children={<TermsOfService />} />
          <Route exact={true} path="/privacy" children={<Privacy />} />

          <Route exact={true} path="/" children={<Home />} />
          <Route children={<P404 />} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
