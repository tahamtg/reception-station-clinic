import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

interface People {
    name: string;
    age: number;
    phone: string;
    file: number;
    address: string;
    reserve_date: string;
    services: string;
    id: number;
    date: string;
    price: number;
    submit?: boolean;
    status: string;
}

interface PeopleContextType {
    people: People[];
    setPeople: React.Dispatch<React.SetStateAction<People[]>>;
}

export const PeoplesContext = createContext<PeopleContextType | null>(null);

interface Children {
    children: React.ReactNode;
}

const PeopleProvider: React.FC<Children> = ({ children }) => {

    const [people, setPeople] = useState<People[]>([]);

    useEffect(() => {
        const getPeople = async () => {
            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/get_info/"
                );

                setPeople(res.data);
            } catch (error) {
                console.log(error);
            }
        };

        getPeople();
    }, []);

    return (
        <PeoplesContext.Provider
            value={{
                people,
                setPeople
            }}
        >
            {children}
        </PeoplesContext.Provider>
    );
};

export default PeopleProvider;