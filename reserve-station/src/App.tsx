import { Routes, Route } from "react-router-dom";
import Reception from "./reception";
import PeopleProvider from "./PeopleContext";
import Peoples from "./peopls";
import Layout from "./layout";
import PersonInfo from "./information";
import ConsentContext from "./ConsentContexts";
import Consent from "./consent";
import Assistant from "./Assistant";

const App = () => {
    return (
        <PeopleProvider>
        <ConsentContext>
            <Layout>
                <Routes>
                    <Route path="/" element={<Reception />} />
                    <Route path="/peoples" element={<Peoples />} />
                    <Route path="/consent" element={<Consent />} />
                    <Route path="/Assistant" element={<Assistant />} />
                    <Route path="/peoples/:id" element={<PersonInfo />} />
                </Routes>
            </Layout>
        </ConsentContext>
        </PeopleProvider>
    );
};

export default App;