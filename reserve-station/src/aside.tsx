import type React from "react";
import { Link } from "react-router-dom";
import "./aside.css";

interface Props {}

const Aside: React.FC<Props> = () => {
    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <Link to="/">ثبت اطلاعات</Link>
                <Link to="/peoples">جدول پذیرش</Link>
                <Link to="/photographer">عکاس</Link>
                <Link to="/callcenter">کال سنتر</Link>
                <Link to="/callcentertable">جدول کال سنتر</Link>
            </nav>
        </aside>
    );
};

export default Aside;

