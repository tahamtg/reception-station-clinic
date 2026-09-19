import type React from "react";
import { useContext, useEffect, useState } from "react";
import { PeoplesContext } from "./PeopleContext";
import "./people.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Update {
    name: string;
    file: string;
    address: string;
    phone: number;
    age: number;
    reserve_date: string;
}

const Peoples: React.FC = () => {
    const context = useContext(PeoplesContext);

    const [is_update, setIs_update] = useState<boolean>(!true);

    const [upinfo, setUpInfo] = useState<Update>({
        name: "",
        age: 0,
        file: "",
        address: "",
        phone: 0,
        reserve_date: "",
    });

    const [userId, setUserId] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const navigate = useNavigate();

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

    const filteredPeople = context.people.filter(
        (person) =>
            person.name.includes(search) ||
            person.phone.includes(search) ||
            String(person.file).includes(search)
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
        const worksheet = XLSX.utils.json_to_sheet(context.people);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "مراجعه کنندگان"
        );

        XLSX.writeFile(workbook, "people.xlsx");
    };

    const js_to_pdf = () => {
        const doc = new jsPDF();

        autoTable(doc, {
            head: [[
                "آیدی",
                "نام",
                "سن",
                "تلفن",
                "کد پذیرش",
                "آدرس",
                "تاریخ رزرو",
            ]],

            body: context.people.map((add) => [
                add.id,
                add.name,
                add.age,
                add.phone,
                add.file,
                add.address,
                add.reserve_date,
            ]),
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
                    (person) => person.id !== id
                )
            );
        } catch (e) {
            console.log(e);
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
                    address: args.address,
                    file: args.file,
                    age: args.age,
                    reserve_date: args.reserve_date,
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
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="peoples-container">

            <div className="peoples-search">
                <input
                    type="text"
                    placeholder="جستجوی نام، شماره تماس یا شماره پرونده..."
                    value={search}
                    onChange={(e) =>
                        handleSearch(e.target.value)
                    }
                />
            </div>

            {isSearching ? (
                <div className="peoples-search-status">
                    در حال جستجو...
                </div>
            ) : (
                <table className="peoples-table">

                    <thead>
                        <tr>
                            <th>آیدی</th>
                            <th>نام</th>
                            <th>سن</th>
                            <th>تلفن</th>
                            <th>کد پذیرش</th>
                            <th>آدرس</th>
                            <th>تاریخ رزرو</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>

                    <tbody>

                        {filteredPeople.map((person) => (

                            <tr key={person.id}>

                                <td>
                                    {person.id}
                                </td>

                                <td>
                                    {userId === person.id ? (
                                        <input
                                            type="text"
                                            value={upinfo.name}
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
                                            type="number"
                                            value={upinfo.age}
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
                                            type="tel"
                                            value={upinfo.phone}
                                            onChange={(e) =>
                                                setUpInfo({
                                                    ...upinfo,
                                                    phone: Number(
                                                        e.target.value
                                                    ),
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
                                            type="number"
                                            value={upinfo.file}
                                            onChange={(e) =>
                                                setUpInfo({
                                                    ...upinfo,
                                                    file: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        person.file
                                    )}
                                </td>

                                <td>
                                    {userId === person.id ? (
                                        <input
                                            type="text"
                                            value={upinfo.address}
                                            onChange={(e) =>
                                                setUpInfo({
                                                    ...upinfo,
                                                    address: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        person.address
                                    )}
                                </td>

                                <td>
                                    {userId === person.id ? (
                                        <input
                                            type="date"
                                            value={upinfo.reserve_date}
                                            onChange={(e) =>
                                                setUpInfo({
                                                    ...upinfo,
                                                    reserve_date:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        person.reserve_date
                                    )}
                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            delete_id(person.id)
                                        }
                                    >
                                        حذف
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (
                                                userId === person.id
                                            ) {
                                                setIs_update(false);
                                                setUserId(null);
                                            } else {
                                                setUserId(person.id);
                                                setIs_update(true);

                                                setUpInfo({
                                                    name: person.name,
                                                    age: person.age,
                                                    phone: Number(
                                                        person.phone
                                                    ),
                                                    file: String(
                                                        person.file
                                                    ),
                                                    address:
                                                        person.address,
                                                    reserve_date:
                                                        person.reserve_date,
                                                });
                                            }
                                        }}
                                    >
                                        {userId === person.id
                                            ? "لغو"
                                            : "ویرایش"}
                                    </button>

                                    {userId === person.id && (
                                        <button
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
                                        onClick={() =>
                                            navigate(
                                                `/peoples/${person.id}`
                                            )
                                        }
                                    >
                                        اطلاعات کاملتر
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>
            )}

            {!isSearching &&
                search.trim() &&
                filteredPeople.length === 0 && (
                    <div className="peoples-search-status">
                        مراجعه‌کننده‌ای پیدا نشد
                    </div>
                )}

            <button onClick={exportExcel}>
                تبدیل به EXCEL
            </button>

            <button onClick={js_to_pdf}>
                تبدیل به PDF
            </button>

        </div>
    );
};

export default Peoples;