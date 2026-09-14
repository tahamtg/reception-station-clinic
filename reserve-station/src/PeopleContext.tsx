import React, { createContext, useState } from "react";

interface People {
    name: string;
    age: number;
    phone: string;
    file: number;
    address: string;
    id: number;
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