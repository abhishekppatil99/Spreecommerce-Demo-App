import React from "react";
import { Profile } from "./Profile";
import { ProfileOrderCategoryItem } from "./ProfileOrderCategoryItem";

const ProfileOrders = () => {
  const order_pending = {
    date: "16.04.2021 17:26",
    status: "Pending",
    price: 125.35,
    products: [
      {
        name: "something",
        price: 39.99,
        amount: 3,
      },
      {
        name: "something",
        price: 39.99,
        amount: 3,
      },
      {
        name: "something",
        price: 39.99,
        amount: 3,
      },
    ],
    actions: [
      {
        href: "/",
        color: "default",
        name: "cancel",
      },
    ],
  };
  const order_shipping = {
    date: "16.04.2021 17:26",
    status: "Shipped",
    price: 125.35,
    products: [
      {
        name: "something",
        price: 39.99,
        amount: 3,
      },
    ],
    actions: [
      {
        href: "/",
        color: "success",
        name: "tracking",
      },
    ],
  };
  const order_done = {
    date: "16.04.2021 17:26",
    status: "Delivered",
    price: 125.35,
    products: [
      {
        name: "something",
        price: 39.99,
        amount: 3,
      },
    ],
    actions: [
      {
        href: "/",
        color: "danger",
        name: "return",
      },
    ],
  };
  const my_orders_pending = [];
  const my_orders_shipping = [];
  const my_orders_done = [];
  my_orders_pending.push(order_pending);
  my_orders_pending.push(order_pending);
  my_orders_pending.push(order_pending);
  my_orders_shipping.push(order_shipping);
  my_orders_shipping.push(order_shipping);
  my_orders_done.push(order_done);
  my_orders_done.push(order_done);
  my_orders_done.push(order_done);
  my_orders_done.push(order_done);
  my_orders_done.push(order_done);
  my_orders_done.push(order_done);
  my_orders_done.push(order_done);
  my_orders_done.push(order_done);
  return (
    <Profile>
      {my_orders_pending.length ? (
        <ProfileOrderCategoryItem name="Pending" orders={my_orders_pending} />
      ) : (
        ""
      )}
      {my_orders_shipping.length ? (
        <ProfileOrderCategoryItem name="Shipped" orders={my_orders_shipping} />
      ) : (
        ""
      )}
      {my_orders_done.length ? (
        <ProfileOrderCategoryItem name="Delivered" orders={my_orders_done} />
      ) : (
        ""
      )}
    </Profile>
  );
};
export { ProfileOrders };
