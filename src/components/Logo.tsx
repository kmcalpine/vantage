import logo from "../assets/logo-white-icon.png";
const Logo = () => {
    return (
        <div className="absolute top-8 left-4 z-[200]">
            <img src={logo} className="h-6"></img>
        </div>
    );
};

export default Logo;
