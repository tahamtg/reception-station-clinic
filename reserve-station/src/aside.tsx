import type React from "react";
import { Link } from "react-router-dom";
import "./aside.css";

interface Props {}

const Aside: React.FC<Props> = () => {
    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <Link to="/">ثبت اطلاعات</Link>
                <Link to="/peoples">مراجعه کنندگان</Link>
                <Link to="/consent">مشاوره</Link>
                <Link to="/Assistant">دستیار ها</Link>
            </nav>
        </aside>
    );
};

export default Aside;

