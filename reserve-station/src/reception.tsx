import axios from "axios";
import React, { useContext, useState, useEffect, useRef } from "react";
import "./reception.css";
import * as Yup from "yup";
import { contextCon } from "./callcenterContexts";

interface People {
    name: string;
    age: string;
    phone: string;
    file: string;
    address: string;
    reserve_date: string;
    image: string;
    price: string;
}

const Reception: React.FC = () => {

    const contextConsent = useContext(contextCon);
    const web = useRef<WebSocket | null>(null);

    const [error, setError] =
        useState<Yup.ValidationError | null>(null);

    const [success, setSuccess] = useState(false);

    const [info, setInfo] = useState<People>({
        name: "",
        age: "",
        phone: "",
        file: "",
        address: "",
        reserve_date: "",
        price: "",
        image: "",
    });

    const schema = Yup.object({
        name: Yup.string()
            .required("نام و نام خانوادگی را بنویسید!")
            .min(2, "نام و نام خانوادگی باید حداقل ۲ کاراکتر باشد"),

        phone: Yup.string()
            .required("شماره تلفن الزامی می‌باشد")
            .matches(
                /^09\d{9}$/,
                "شماره تلفن باید ۱۱ رقم و با 09 شروع شود"
            ),

        age: Yup.number()
            .typeError("سن باید عدد باشد")
            .required("سن الزامی می‌باشد")
            .min(1, "سن باید حداقل ۱ باشد"),

        file: Yup.number()
            .typeError("کد پذیرش باید عدد باشد")
            .required("کد پذیرش الزامی می‌باشد"),

        address: Yup.string()
            .required("آدرس الزامی می‌باشد")
            .min(5, "آدرس باید حداقل ۵ کاراکتر باشد"),

        reserve_date: Yup.string()
            .required("تاریخ الزامی است")
    });

    useEffect(() => {

        const wkurl =
            "ws://127.0.0.1:8000/ws/services/getdata/";

        web.current = new WebSocket(wkurl);

        web.current.onopen = () => {
            console.log("connected websocket");
        };

        web.current.onmessage = (event) => {

            const data = JSON.parse(event.data);

            console.log(data);
        };

        web.current.onerror = (error) => {
            console.log("WebSocket error:", error);
        };

        web.current.onclose = () => {
            console.log("WebSocket closed");
        };

        return () => {

            web.current?.close();
            web.current = null;

        };

    }, []);

     useEffect(() => {

    const getPeople = async () => {

        const rqres = await axios.get(
            "http://127.0.0.1:8000/api/get_info/"
        );

        console.log("GET DATA:", rqres.data);

        if (
            web.current &&
            web.current.readyState === WebSocket.OPEN
        ) {

            web.current.send(
                JSON.stringify({
                    type: "send_data",
                    data: rqres.data,
                })
            );

        }

    };

    getPeople();

}, []);

    const postInfo = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        try {

            await schema.validate(info, {
                abortEarly: false,
            });

            const res = await axios.post(
                "http://127.0.0.1:8000/api/post_info/",
                {
                    ...info,
                    age: Number(info.age),
                    file: Number(info.file),
                }
            );

            console.log(res.data);

            console.log("DJANGO DATA:", res.data);

            console.log(
                "WEBSOCKET STATE:",
                web.current?.readyState
            );

            setSuccess(true);

            setInfo({
                name: "",
                age: "",
                phone: "",
                file: "",
                address: "",
                reserve_date: "",
                image: "",
                price: "",
            });

            setError(null);

        } catch (error) {

            setSuccess(false);

            if (error instanceof Yup.ValidationError) {

                setError(error);

                console.log("YUP:", error.inner);

                return;
            }

            if (axios.isAxiosError(error)) {

                console.log(
                    "DJANGO:",
                    error.response?.data
                );

                return;
            }

            console.error(error);
        }
    };

    const getError = (field: string) => {

        return error?.inner.find(
            (err) => err.path === field
        )?.message;

    };

    const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
        ) => {

            const newInfo = {
                ...info,
                [e.target.name]:
                    e.target.name === "price"
                        ? e.target.value
                        : e.target.value,
            };

            setInfo(newInfo);

            contextConsent?.setDataConsent(
                JSON.stringify(newInfo)
            );

            setError(null);
            setSuccess(false);
        };

    return (
        <div className="reception-container">

            <div className="reception-card">

                <h1>ایستگاه پذیرش</h1>

                <p>
                    اطلاعات مراجعه‌کننده را وارد کنید
                </p>

                <form onSubmit={postInfo}>

                    <div className="form-group">

                        <label>
                            نام و نام خانوادگی
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="نام و نام خانوادگی"
                            value={info.name}
                            onChange={handleChange}
                        />

                        {getError("name") && (
                            <span className="error">
                                {getError("name")}
                            </span>
                        )}

                    </div>

                    <div className="form-group">

                        <label>
                            شماره تلفن
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            placeholder="09123456789"
                            value={info.phone}
                            onChange={handleChange}
                        />

                        {getError("phone") && (
                            <span className="error">
                                {getError("phone")}
                            </span>
                        )}

                    </div>

                    <div className="form-group">

                        <label>
                            سن
                        </label>

                        <input
                            type="number"
                            name="age"
                            placeholder="سن"
                            value={info.age}
                            onChange={handleChange}
                        />

                        {getError("age") && (
                            <span className="error">
                                {getError("age")}
                            </span>
                        )}

                    </div>

                    <div className="form-group">

                        <label>
                            کد پذیرش
                        </label>

                        <input
                            type="number"
                            name="file"
                            placeholder="کد پذیرش"
                            value={info.file}
                            onChange={handleChange}
                        />

                        {getError("file") && (
                            <span className="error">
                                {getError("file")}
                            </span>
                        )}

                    </div>

                    <div className="form-group">

                        <label>
                            آدرس
                        </label>

                        <input
                            type="text"
                            name="address"
                            placeholder="آدرس"
                            value={info.address}
                            onChange={handleChange}
                        />

                        {getError("address") && (
                            <span className="error">
                                {getError("address")}
                            </span>
                        )}

                    </div>

                    <div className="form-group">

                        <label>
                            تاریخ رزرو
                        </label>

                        <input
                            type="date"
                            name="reserve_date"
                            value={info.reserve_date}
                            onChange={handleChange}
                        />

                        {getError("reserve_date") && (
                            <span className="error">
                                {getError("reserve_date")}
                            </span>
                        )}

                    </div>


                    <div className="form-group">

                        <label>
                            پرداخت
                        </label>

                        <input
                            type="number"
                            name="price"
                            placeholder="پرداخت"
                            value={info.price}
                            onChange={handleChange}
                        />

                    </div>

                    {success && (
                        <div className="success">
                            اطلاعات با موفقیت ذخیره شد
                        </div>
                    )}

                    <button type="submit">
                        ثبت اطلاعات
                    </button>

                </form>

            </div>

        </div>
    );
};

export default Reception;

