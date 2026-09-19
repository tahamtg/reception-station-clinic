import type React from "react";
import { useEffect, useRef, useState } from "react";
import "./consent.css";

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

const Assistant: React.FC = () => {

    const [afrad, setAfrad] = useState<afrad[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const web = useRef<WebSocket | null>(null);

    const selectedPerson = afrad.find(
        (person) => person.id === selectedId
    );

    useEffect(() => {

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

            if (data.type === "get_Data_for_Assistant") {

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

            web.current?.close();
            web.current = null;

        };

    }, []);

    return (
        <div className="consent-container">

            <h1>بخش دستیار</h1>

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

                        <div>
                            <span>خدمات برای مراجعه کننده</span>
                            <p>{selectedPerson.services}</p>
                        </div>

                        <div className="address">

                            <span>آدرس</span>

                            <p>
                                {selectedPerson.address}
                            </p>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Assistant;