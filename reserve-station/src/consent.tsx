import type React from "react";
import { useEffect, useRef, useState } from "react";
import "./consent.css";
import axios from "axios";

interface afrad {
    name: string;
    age: number;
    phone: number;
    file: string;
    address: string;
    reserve_date: string;
    date: string;
    id: number;
    services: string;
}


const Consent: React.FC = () => {

    const [addText, setAddText] = useState(false);
    const [service, setService] = useState("");
    const [afrad, setAfrad] = useState<afrad[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const web = useRef<WebSocket | null>(null);

    const selectedPerson = afrad.find(
        (person) => person.id === selectedId
    );

    const addService = async (id: number) => {

        if (!service.trim()) return;

        try {

            const req = await axios.post(
                `http://127.0.0.1:8000/api/update_service/${id}/`,
                {
                    service: service
                }
            );

            setAfrad((prev) =>
                prev.map((person) =>
                    person.id === id
                        ? {
                            ...person,
                            services: req.data.service
                        }
                        : person
                )
            );

            setService("");
            setAddText(false);

            console.log(req.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        console.log("USE EFFECT RUN");

        const wkurl =
            "ws://127.0.0.1:8000/ws/services/getdata/";

            web.current = new WebSocket(wkurl);

            web.current.onopen = () => {

            console.log("connected websocket");

            web.current?.send(
                JSON.stringify({
                    type: "send_data"
                    })
                );

            };

        web.current.onmessage = (event) => {

            const data = JSON.parse(event.data);

            console.log("WEBSOCKET DATA:", data);

            if (data.type === "get_Data") {

                const person: afrad = {
                    name: data.name,
                    age: data.age,
                    phone: data.phone,
                    file: data.file,
                    address: data.address,
                    reserve_date: data.reserve_date,
                    date: data.date,
                    id: data.id,
                    services: data.services,
                };

                console.log("PERSON:", person);

                setAfrad((prev) => {

                    const exists = prev.some(
                        (item) => item.id === person.id
                    );

                    if (exists) {
                        return prev;
                    }

                    return [
                        ...prev,
                        person
                    ];

                });

            }

        };

        web.current.onerror = (error) => {

            console.log("WebSocket error:", error);

        };

        web.current.onclose = () => {

            console.log("WebSocket closed");

        };

        return () => {

            console.log("USE EFFECT CLEANUP");

            web.current?.close();
            web.current = null;

        };

    }, []);

    return (
        <div className="consent-container">

            <h1>مراجعه کنندگان مشاوره</h1>

            <div className="consent-list">

                {afrad.map((person) => (

                    <div
                        key={person.id}
                        className={`person-box ${
                            selectedId === person.id ? "active" : ""
                        }`}
                        onClick={() => setSelectedId(person.id)}
                    >

                        <span>
                            {person.name}
                        </span>

                    </div>

                ))}

            </div>

            {selectedPerson && (

                <div className="person-details">

                    <div className="details-header">

                        <h2>
                            {selectedPerson.name}
                        </h2>

                        <button
                            onClick={() => setSelectedId(null)}
                        >
                            بستن
                        </button>

                    </div>

                    <div className="details-grid">

                        <div>
                            <span>آیدی</span>
                            <p>{selectedPerson.id}</p>
                        </div>

                        <div>
                            <span>نام</span>
                            <p>{selectedPerson.name}</p>
                        </div>

                        <div>
                            <span>سن</span>
                            <p>{selectedPerson.age}</p>
                        </div>

                        <div>
                            <span>تلفن</span>
                            <p>{selectedPerson.phone}</p>
                        </div>

                        <div>
                            <span>کد پذیرش</span>
                            <p>{selectedPerson.file}</p>
                        </div>

                        <div>
                            <span>تاریخ رزرو</span>
                            <p>{selectedPerson.reserve_date}</p>
                        </div>

                        <div className="address">

                            <span>آدرس</span>

                            <p>
                                {selectedPerson.address}
                            </p>

                        </div>

                        {!addText && (

                            <div>

                                <span>
                                    خدمات قابل انجام
                                </span>

                                <button
                                    onClick={() =>
                                        setAddText(true)
                                    }
                                >
                                    اضافه کردن خدمات
                                </button>

                            </div>

                        )}

                        {addText && (

                            <div className="address">

                                <span>
                                    خدمات جدید
                                </span>

                                <input
                                    type="text"
                                    name="text"
                                    id="text"
                                    value={service}
                                    onChange={(e) =>
                                        setService(e.target.value)
                                    }
                                />

                                <section className="action_button">

                                    <button
                                        onClick={() =>
                                            addService(
                                                selectedPerson.id
                                            )
                                        }
                                    >
                                        ثبت خدمات
                                    </button>

                                    <button
                                        onClick={() =>
                                            setAddText(false)
                                        }
                                    >
                                        لغو
                                    </button>

                                </section>

                            </div>

                        )}

                        {selectedPerson.services ? (

                            <div className="address services-container">

                                <span>
                                    خدمات انجام شده
                                </span>

                                <div className="services-list">

                                    {selectedPerson.services
                                        .split(",")
                                        .reverse()
                                        .map((item, index) => (

                                            <div
                                                className="items"
                                                key={`${item}-${index}`}
                                            >

                                                <span className="service-index">
                                                    {index + 1} -
                                                </span>

                                                <span className="services">
                                                    {item.trim()}
                                                </span>

                                            </div>

                                        ))}

                                </div>

                            </div>

                        ) : (

                            <div>

                                <span>
                                    خدماتی انجام نشده
                                </span>

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
};

export default Consent;