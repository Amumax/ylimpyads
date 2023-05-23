import React from "react";
import {Link} from "react-router-dom";

function index() {
    return (
        <footer className="footer">
            <p className="footer-by">Максим Найденов © 2023
            &nbsp;<Link to="/usage">Регламент</Link>
            &nbsp;<Link to="/rules">Правила</Link></p>
        </footer>
    );
}

export default index;
