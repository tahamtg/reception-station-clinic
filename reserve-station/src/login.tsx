import { useState } from "react";
import "./login.css";
import * as Yup from "yup";
import axios from "axios";

interface Users {
    username: string;
    password: string;
}

const Login = () => {

    const [users, setUsers] = useState<Users>({
        username: "",
        password: "",
    });

    const [error, setError] = useState<Yup.ValidationError | null>(null);

    const schema = Yup.object({
        username: Yup.string()
            .required("نام کاربری الزامی است"),

        password: Yup.string()
            .required("پسورد الزامی است")
            .min(7, "حداقل باید 7 کاراکتر باشد")
            .matches(/[a-z]/, "حداقل باید یک حرف کوچک داشته باشد")
            .matches(/[0-9]/, "حداقل باید یک عدد داشته باشد")
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await schema.validate(users, {
                abortEarly: false
            });

            setError(null);

            const res = await axios.post(
                "http://127.0.0.1:8000/api/login/",
                users,
                {
                    withCredentials: true
                }
            );

            console.log(res.data);

        } catch (e) {

            if (e instanceof Yup.ValidationError) {
                setError(e);
                return;
            }

            console.log(e);
        }
    };

    const getError = (field: string) => {
        return error?.inner.find(
            (item) => item.path === field
        )?.message;
    };

    return (
        <div className="login-container">
            <form
                className="login-form"
                onSubmit={handleSubmit}
            >
                <h2>ورود به حساب کاربری</h2>

                <input
                    type="text"
                    name="username"
                    placeholder="نام کاربری"
                    value={users.username}
                    onChange={(e) =>
                        setUsers({
                            ...users,
                            username: e.target.value
                        })
                    }
                />

                {getError("username") && (
                    <span>{getError("username")}</span>
                )}

                <input
                    type="password"
                    name="password"
                    placeholder="پسورد"
                    value={users.password}
                    onChange={(e) =>
                        setUsers({
                            ...users,
                            password: e.target.value
                        })
                    }
                />

                {getError("password") && (
                    <span>{getError("password")}</span>
                )}

                <button type="submit">
                    ورود
                </button>
            </form>
        </div>
    );
};

export default Login;