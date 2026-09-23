import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./personInfo.css";


interface Person {

    id: number;
    name: string;
    age: number;
    phone: string;
    file: number | null;
    address: string | null;
    reserve_date: string;
    date: string | null;
    services: string | null;
    price: number | null;

}


const PersonInfo: React.FC = () => {

    const { id } = useParams<{ id: string }>();

    const [person, setPerson] =
        useState<Person | null>(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const getPerson = async () => {

            try {

                const res = await axios.get(
                    "http://127.0.0.1:8000/api/get_submit_info/"
                );

                const selectedPerson =
                    res.data.find(
                        (item: Person) =>
                            item.id === Number(id)
                    );

                setPerson(
                    selectedPerson || null
                );

            } catch (error) {

                console.log(error);

                setPerson(null);

            } finally {

                setLoading(false);

            }

        };

        getPerson();

    }, [id]);


    if (loading) {

        return (

            <div className="person-page">

                <div className="person-card">

                    <h2>
                        در حال دریافت اطلاعات...
                    </h2>

                </div>

            </div>

        );

    }


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
                        پرونده
                    </span>

                    <strong>
                        {person.file || "ثبت نشده"}
                    </strong>

                </div>


                <div className="info-box">

                    <span>
                        آدرس
                    </span>

                    <strong>
                        {person.address || "ثبت نشده"}
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


                <div className="info-box">

                    <span>
                        تاریخ ثبت
                    </span>

                    <strong>
                        {person.date || "ثبت نشده"}
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


                <div className="info-box">

                    <span>
                        خدمات
                    </span>

                    <strong>
                        {person.services || "خدمتی ثبت نشده"}
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