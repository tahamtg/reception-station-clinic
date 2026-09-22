import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { contextCon } from "./callcenterContexts";
import "./personInfo.css";

const PersonInfo: React.FC = () => {

    const CallCenterContext = useContext(contextCon);

    const { id } = useParams<{ id: string }>();

    if (!CallCenterContext) {
        return (
            <div className="person-error">
                Context پیدا نشد.
            </div>
        );
    }

    let person;

    try {

        person = JSON.parse(
            CallCenterContext.dataConsent || "{}"
        );

    } catch (error) {

        return (
            <div className="person-error">
                اطلاعات مراجعه‌کننده نامعتبر است.
            </div>
        );

    }

    if (!person.name) {
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
                        شناسه مراجعه‌کننده: #{id}
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
                        بیعانه
                    </span>

                    <strong>
                        {person.price || "ثبت نشده"}
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