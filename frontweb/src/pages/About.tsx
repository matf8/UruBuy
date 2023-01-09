import NavbarUrubuy from "../components/Navbar/NavbarUrubuy";
import { Footer } from "../components/Footer";

function About() {
    return(
        <div id="page-container">
                <NavbarUrubuy />
                    <div className=" mx-auto mb-28 block pb-24 pt-24 pl-8 pr-8 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Acerca de nosotros</h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum aliquam porta auctor. Fusce et ornare justo, et dictum justo. </p>
                    </div>
                <Footer />  
        </div>
       
    );
};

export default About;