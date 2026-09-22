import React, { createContext, useState } from "react";

interface consent{
    dataConsent : string;
    setDataConsent : React.Dispatch<React.SetStateAction<string>>;
}

interface children{
    children: React.ReactNode;
}

export const contextCon = createContext<consent | null>(null)

const CallCenterContext: React.FC<children> = ({children}) => {

    const [dataConsent, setDataConsent] = useState<string>("")

    return ( 
        <contextCon.Provider value={{dataConsent, setDataConsent}}>
            <>
            {children}
            </>
        </contextCon.Provider>
     );

}
 
export default CallCenterContext;
