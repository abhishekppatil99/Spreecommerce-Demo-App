const Carousel = (setItems) => {

  setItems([
    {
      image:
        process.env.PUBLIC_URL + "/images/itw_1_1.png",
      title: "First slide label",
      text: "Nulla vitae elit libero, a pharetra augue mollis interdum.",
    },
    {
      image:
        process.env.PUBLIC_URL + "/images/itw_2_2_4.jpg",
      title: "Second slide label",
      text: "Nulla vitae elit libero, a pharetra augue mollis interdum.",
    },
    {
      image:
        process.env.PUBLIC_URL + "/images/itw_3_1.png",
      title: "Third slide label",
      text: "Nulla vitae elit libero, a pharetra augue mollis interdum.",
    },
  ]);
};
export { Carousel };
