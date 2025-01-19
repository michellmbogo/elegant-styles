import react from "react";
function Navbar(){
    return(
        <div>
            <nav id="navbar">
            <h1 id="title">Urban Apparel</h1>
            <ul class="navbar-menu">
                <li><a href="">Home</a></li>
                <li><a href="#Products">Products</a></li>
                <li><a href="#cart_section"> Cart</a></li>

            </ul>
        </nav>
        </div>
    );
}export default Navbar;