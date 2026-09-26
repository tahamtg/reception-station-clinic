import { Routes, Route } from "react-router-dom";
import Reception from "./reception";
import PeopleProvider from "./PeopleContext";
import Peoples from "./peopls";
import Layout from "./layout";
import PersonInfo from "./information";
import CallCenterContext from "./callcenterContexts";
import Consent from "./consent";
import Assistant from "./Assistant";
import CallCenterTable from "./callcentertable";
import CallCenter from "./callcenter";
import PhotoGraph from "./photographer";
import Login from "./login";

const App = () => {
    return (
        <PeopleProvider>
        <CallCenterContext>
            <Layout>
                <Routes>
                    <Route path="/" element={<Reception />} />
                    <Route path="/peoples" element={<Peoples />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/consent" element={<Consent />} />
                    <Route path="/Assistant" element={<Assistant />} />
                    <Route path="/callcentertable" element={<CallCenterTable />} />
                    <Route path="/photographer" element={<PhotoGraph />} />
                    <Route path="/callcenter" element={<CallCenter />} />
                    <Route path="/peoples/:id" element={<PersonInfo />} />
                </Routes>
            </Layout>
        </CallCenterContext>
        </PeopleProvider>
    );
};

export default App;