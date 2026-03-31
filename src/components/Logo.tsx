import logo from "../assets/logo-white-icon.png";
const Logo = () => {
    return (
        <div className="absolute left-4 h-[70px] z-[200] flex items-center">
            <img src={logo} className="h-6"></img>
        </div>
    );
};

export default Logo;
