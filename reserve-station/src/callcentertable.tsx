import type React from "react";
import { useContext, useEffect, useState } from "react";
import { PeoplesContext } from "./PeopleContext";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CallCenterTable.css";

interface Update {
    name: string;
    phone: string;
    age: number;
    price: number;
}

const CallCenterTable: React.FC = () => {

    const context = useContext(PeoplesContext);

    const [is_update, setIs_update] =
        useState<boolean>(!true);

    const [upinfo, setUpInfo] = useState<Update>({
        name: "",
        age: 0,
        phone: "",
        price: 0,
    });

    const [userId, setUserId] =
        useState<number | null>(null);

    const [search, setSearch] =
        useState("");

    const [isSearching, setIsSearching] =
        useState(false);

    const navigate = useNavigate();

    const [isSubmit, setIsSubmit] = useState(false)

    useEffect(() => {

        const getPeople = async () => {

            try {

                const res = await axios.get(
                    "http://127.0.0.1:8000/api/get_info/"
                );

                context?.setPeople(res.data);

            } catch (error) {

                console.log(error);

            }

        };

        getPeople();

    }, []);

    if (!context) {
        return null;
    }

    const filteredPeople =
        context.people.filter(
            (person) =>
                person.name.includes(search) ||
                person.phone.includes(search)
        );

    const handleSearch = (value: string) => {

        setSearch(value);

        if (value.trim()) {

            setIsSearching(true);

            setTimeout(() => {
                setIsSearching(false);
            }, 500);

        } else {

            setIsSearching(false);

        }

    };

    const exportExcel = () => {

        const worksheet =
            XLSX.utils.json_to_sheet(
                context.people
            );

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "مراجعه کنندگان"
        );

        XLSX.writeFile(
            workbook,
            "people.xlsx"
        );

    };

    const js_to_pdf = () => {

        const doc = new jsPDF();

        autoTable(doc, {

            head: [[
                "آیدی",
                "نام",
                "سن",
                "تلفن",
                "بیعانه",
                "وضعیت",
            ]],

            body: context.people.map(
                (person) => [
                    person.id,
                    person.name,
                    person.age,
                    person.phone,
                    person.price,
                    person.status === "cancelled"
                        ? "کنسل شد"
                        : person.status === "consent"
                            ? "وقت مشاوره داره"
                            : person.status === "pending"
                                ? "جواب نداده"
                                : person.status === "done"
                                    ? "انجام شده"
                                    : "نامشخص",
                ]
            ),

        });

        doc.save("people.pdf");

    };

    const delete_id = async (id: number) => {

        try {

            await axios.delete(
                `http://127.0.0.1:8000/api/delete_info/${id}/`
            );

            context.setPeople((prev) =>
                prev.filter(
                    (person) =>
                        person.id !== id
                )
            );

        } catch (error) {

            console.log(error);

        }

    };

    const submit = async (id: number) => {

        setIsSubmit(true)

        try {

            const person = context.people.find(
                (person) =>
                    person.id === id
            );

            if (!person) {
                return;
            }

            const req = await axios.post(
                `http://127.0.0.1:8000/api/confirm_info/${id}/`,
                {
                    name: person.name,
                    age: person.age,
                    phone: person.phone,
                    file: person.file,
                    address: person.address,
                    reserve_date: person.reserve_date,
                    date: person.date,
                    services: person.services,
                    price: person.price,
                    status: person.status,
                }
            );

            console.log(
                "SUBMIT DATA:",
                req.data
            );

            context.setPeople((prev) =>
                prev.filter(
                    (person) =>
                        person.id !== id
                )
            );

        } catch (error) {

            console.log(error);

        }

    };

    const update_id = async (
        id: number,
        args: Update
    ) => {

        setIs_update(true);

        try {

            const up = await axios.patch(
                `http://127.0.0.1:8000/api/update_info/${id}/`,
                {
                    name: args.name,
                    phone: args.phone,
                    age: args.age,
                    price: args.price,
                }
            );

            context.setPeople((prev) =>
                prev.map((person) =>
                    person.id === id
                        ? {
                            ...person,
                            ...up.data,
                        }
                        : person
                )
            );

            setIs_update(false);
            setUserId(null);

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="callcenter-container">

            <div className="callcenter-search">

                <input
                    type="text"
                    placeholder="جستجوی نام یا شماره تماس..."
                    value={search}
                    onChange={(e) =>
                        handleSearch(
                            e.target.value
                        )
                    }
                />

            </div>

            {isSearching ? (

                <div className="callcenter-search-status">
                    در حال جستجو...
                </div>

            ) : (

                <table className="callcenter-table">

                    <thead>

                        <tr>

                            <th>آیدی</th>
                            <th>نام</th>
                            <th>سن</th>
                            <th>تلفن</th>
                            <th>بیعانه</th>
                            <th>وضعیت</th>
                            <th>عملیات</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredPeople.map(
                            (person) => (

                                <tr
                                    key={person.id}
                                >

                                    <td>
                                        {person.id}
                                    </td>

                                    <td>

                                        {userId === person.id ? (

                                            <input
                                                className="callcenter-input"
                                                type="text"
                                                value={
                                                    upinfo.name
                                                }
                                                onChange={(e) =>
                                                    setUpInfo({
                                                        ...upinfo,
                                                        name: e.target.value,
                                                    })
                                                }
                                            />

                                        ) : (

                                            person.name

                                        )}

                                    </td>

                                    <td>

                                        {userId === person.id ? (

                                            <input
                                                className="callcenter-input"
                                                type="number"
                                                value={
                                                    upinfo.age
                                                }
                                                onChange={(e) =>
                                                    setUpInfo({
                                                        ...upinfo,
                                                        age: Number(
                                                            e.target.value
                                                        ),
                                                    })
                                                }
                                            />

                                        ) : (

                                            person.age

                                        )}

                                    </td>

                                    <td>

                                        {userId === person.id ? (

                                            <input
                                                className="callcenter-input"
                                                type="tel"
                                                value={
                                                    upinfo.phone
                                                }
                                                onChange={(e) =>
                                                    setUpInfo({
                                                        ...upinfo,
                                                        phone: e.target.value,
                                                    })
                                                }
                                            />

                                        ) : (

                                            person.phone

                                        )}

                                    </td>

                                    <td>

                                        {userId === person.id ? (

                                            <input
                                                className="callcenter-input"
                                                type="number"
                                                value={
                                                    upinfo.price
                                                }
                                                onChange={(e) =>
                                                    setUpInfo({
                                                        ...upinfo,
                                                        price: Number(
                                                            e.target.value
                                                        ),
                                                    })
                                                }
                                            />

                                        ) : (

                                            person.price

                                        )}

                                    </td>

                                    <td>

                                        {person.status === "cancelled"
                                            ? "کنسل شد"
                                            : person.status === "consent"
                                                ? "وقت مشاوره داره"
                                                : person.status === "pending"
                                                    ? "جواب نداده"
                                                    : person.status === "done"
                                                        ? "انجام شده"
                                                        : "نامشخص"}

                                    </td>

                                    <td>

                                        <div className="callcenter-actions">

                                            <button
                                                className="callcenter-btn callcenter-delete"
                                                onClick={() =>
                                                    delete_id(
                                                        person.id
                                                    )
                                                }
                                            >
                                                حذف
                                            </button>

                                            <button
                                                className="callcenter-btn callcenter-submit"
                                                disabled={isSubmit === true}
                                                onClick={() =>
                                                    submit(
                                                        person.id
                                                    )
                                                }
                                            >
                                                {isSubmit === true
                                                    ? "ثبت شد"
                                                    : "تثبیت"}
                                            </button>

                                            <button
                                                className="callcenter-btn callcenter-edit"
                                                onClick={() => {

                                                    if (
                                                        userId ===
                                                        person.id
                                                    ) {

                                                        setIs_update(
                                                            false
                                                        );

                                                        setUserId(
                                                            null
                                                        );

                                                    } else {

                                                        setUserId(
                                                            person.id
                                                        );

                                                        setIs_update(
                                                            true
                                                        );

                                                        setUpInfo({
                                                            name: person.name,
                                                            age: Number(
                                                                person.age
                                                            ),
                                                            phone: person.phone,
                                                            price: Number(
                                                                person.price
                                                            ),
                                                        });

                                                    }

                                                }}
                                            >
                                                {
                                                    userId ===
                                                    person.id
                                                        ? "لغو"
                                                        : "ویرایش"
                                                }
                                            </button>

                                            {userId ===
                                                person.id && (

                                                    <button
                                                        className="callcenter-btn callcenter-save"
                                                        onClick={() =>
                                                            update_id(
                                                                person.id,
                                                                upinfo
                                                            )
                                                        }
                                                    >
                                                        ذخیره
                                                    </button>

                                                )}

                                            <button
                                                className="callcenter-btn callcenter-details"
                                                onClick={() =>
                                                    navigate(
                                                        `/peoples/${person.id}`
                                                    )
                                                }
                                            >
                                                اطلاعات کاملتر
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            )}

            {!isSearching &&
                search.trim() &&
                filteredPeople.length === 0 && (

                    <div className="callcenter-search-status">
                        مراجعه‌کننده‌ای پیدا نشد
                    </div>

                )}

            <div className="callcenter-export">

                <button
                    className="callcenter-btn callcenter-export-btn"
                    onClick={exportExcel}
                >
                    تبدیل به EXCEL
                </button>

                <button
                    className="callcenter-btn callcenter-export-btn"
                    onClick={js_to_pdf}
                >
                    تبدیل به PDF
                </button>

            </div>

        </div>

    );

};

export default CallCenterTable;
