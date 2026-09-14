import axios from "axios";
import React, { useContext, useState } from "react";
import "./reception.css";
import * as Yup from "yup";
import { PeoplesContext } from "./PeopleContext";

interface Peopl{
        name: string,
        age: string,
        phone: string,
        file: string,
        address: string,
        id: number,
}

const Reception: React.FC = () => {

    const context = useContext(PeoplesContext);

    if (!context) {
        return null;
    }

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
            .required("سن الزامی می‌باشد")
            .min(1, "سن باید حداقل ۱ باشد"),

        file: Yup.number()
            .required("کد پذیرش الزامی می‌باشد"),

        address: Yup.string()
            .required("آدرس الزامی می‌باشد")
            .min(5, "آدرس باید حداقل ۵ کاراکتر باشد"),
    });

    const [error, setError] = useState<Yup.ValidationError | null>(null);
    const [success, setSuccess] = useState(false);

    const [info, setInfo] = useState<Peopl>();

    const postInfo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await schema.validate(info, {
                abortEarly: false
            });

            const person = {
                name: info.name,
                age: Number(info.age),
                phone: info.phone,
                file: Number(info.file),
                address: info.address,
                id: info.id,
            };

            const res = await axios.post(
                "http://127.0.0.1:8000/api/post_info/",
                person
            );

            console.log(res.data);

            context.setPeople((prev) => [
                ...prev,
                person
            ]);

            setSuccess(true);

            setInfo({
                name: "",
                age: "",
                phone: "",
                file: "",
                address: "",
                id:"",
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
                console.log("DJANGO:", error.response?.data);
                return;
            }

            console.error(error);
        }
    };

    const getError = (field: string) => {
        return error?.inner.find((err) => err.path == field)?.message;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInfo({
            ...info,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="reception-container">
            <div className="reception-card">

                <h1>ایستگاه پذیرش</h1>
                <p>اطلاعات مراجعه‌کننده را وارد کنید</p>

                <form onSubmit={postInfo}>

                    <div className="form-group">
                        <label>نام و نام خانوادگی</label>

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
                        <label>شماره تلفن</label>

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
                        <label>سن</label>

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
                        <label>کد پذیرش</label>

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
                        <label>آدرس</label>

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