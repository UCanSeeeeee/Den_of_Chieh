/** @jsx h */

import blog, { ga, redirects, h } from "blog";

blog({
  author: "Chieh Wang",
  title: "Chieh Wang",
  // theme: "dark",
  description: "知其然，然后知其所以然。",
  // header: <header>Your custom header</header>,
  // section: <section>Your custom section</section>,
  // footer: <footer>Your custom footer</footer>,
  avatar: "/touxiang.jpeg",
  avatarClass: "rounded-full",
  dateStyle: "long",
  links: [
    { title: "Email", url: "mailto:chieh504@vip.qq.com" },
    { title: "GitHub", url: "https://github.com/UCanSeeeeee" },
  ],
  favicon: "/icons8-teddy-bear-48.png",

  // middlewares: [

  // If you want to set up Google Analytics, paste your GA key here.
  // ga("UA-XXXXXXXX-X"),

  // If you want to provide some redirections, you can specify them here,
  // pathname specified in a key will redirect to pathname in the value.
  // redirects({
  //  "/hello_world.html": "/hello_world",
  // }),

  // ]
});
