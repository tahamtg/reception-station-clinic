import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { PeoplesContext } from "./PeopleContext";
import "./personInfo.css";

const PersonInfo: React.FC = () => {

    const context = useContext(PeoplesContext);

    const { id } = useParams<{ id: string }>();

    if (!context) {
        return (
            <div className="person-error">
                Context پیدا نشد.
            </div>
        );
    }

    const person = context.people.find(
        (item) => item.id === Number(id)
    );

    if (!person) {
        return (
            <div className="person-page">

                <div className="person-card">

                    <h2>
                        مراجعه‌کننده پیدا نشد
                    </h2>

                    <p>
                        اطلاعات این مراجعه‌کننده در سیستم وجود ندارد.
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="person-page">

            <div className="person-header">

                <div>

                    <span className="person-label">
                        اطلاعات مراجعه‌کننده
                    </span>

                    <h1>
                        {person.name}
                    </h1>

                    <p>
                        شناسه مراجعه‌کننده: #{person.id}
                    </p>

                </div>

                <div className="person-avatar">
                    {person.name.charAt(0)}
                </div>

            </div>

            <div className="person-grid">

                <div className="info-box">
                    <span>
                        نام و نام خانوادگی
                    </span>

                    <strong>
                        {person.name}
                    </strong>
                </div>

                <div className="info-box">
                    <span>
                        سن
                    </span>

                    <strong>
                        {person.age} سال
                    </strong>
                </div>

                <div className="info-box">
                    <span>
                        شماره تماس
                    </span>

                    <strong>
                        {person.phone}
                    </strong>
                </div>

                <div className="info-box">
                    <span>
                        شماره پرونده
                    </span>

                    <strong>
                        {person.file}
                    </strong>
                </div>

                <div className="info-box">
                    <span>
                        تاریخ ثبت مراجعه کننده
                    </span>

                    <strong>
                        {person.date}
                    </strong>
                </div>

                <div className="info-box">
                    <span>
                        تاریخ رزرو
                    </span>

                    <strong>
                        {person.reserve_date}
                    </strong>
                </div>

                <div className="info-box full">

                    <span>
                        آدرس
                    </span>

                    <strong>
                        {person.address || "ثبت نشده"}
                    </strong>

                </div>

            </div>

            <div className="person-actions">

                <button className="edit-btn">
                    ویرایش اطلاعات
                </button>

                <button
                    className="back-btn"
                    onClick={() =>
                        window.history.back()
                    }
                >
                    بازگشت
                </button>

            </div>

        </div>
    );
};

export default PersonInfo;