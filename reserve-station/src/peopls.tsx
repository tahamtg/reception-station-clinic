import type React from "react";
import { useContext, useEffect } from "react";
import { PeoplesContext } from "./PeopleContext";
import "./people.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import font from "./assets/Vazirmatn-Regular.ttf";

const Peoples: React.FC = () => {
    const context = useContext(PeoplesContext);

    useEffect(() => {
        const getPeople = async () => {
            const res = await axios.get(
                "http://127.0.0.1:8000/api/get_info/"
            );

            context?.setPeople(res.data);
        };

        getPeople();
    }, []);

    if (!context) {
        return null;
    }

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
            head: [
                ["نام", "سن", "تلفن", "کد پذیرش", "آدرس"]
            ],
            body: context.people.map((add) => [
                add.name,
                add.age,
                add.phone,
                add.file,
                add.address
                
            ])
        });

        doc.save("people.pdf");
    };

    return (
        <div className="peoples-container">

            <table className="peoples-table">

                <thead>
                    <tr>
                        <th>نام</th>
                        <th>سن</th>
                        <th>تلفن</th>
                        <th>کد پذیرش</th>
                        <th>آدرس</th>
                    </tr>
                </thead>

                <tbody>
                    {context.people.map((person, index) => (
                        <tr key={index}>
                            <td>{person.name}</td>
                            <td>{person.age}</td>
                            <td>{person.phone}</td>
                            <td>{person.file}</td>
                            <td>{person.address}</td>
                            <td><button>حذف</button></td>
                        </tr>
                    ))}
                </tbody>

            </table>

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