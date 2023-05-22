import React from "react";
import Navbar from "../Navbar";

function NotFound() {
  return (
    <body>
      <Navbar />
      <h1>Ошибочка</h1>
      <h2>Здесь ничего нет</h2>
      <footer className="footer">
          <p className="footer-by">Максим Найденов © 2023</p>
      </footer>
    </body>
  );
}

export default NotFound;
