import { Routes, Route } from "react-router-dom";
import Reception from "./reception";
import PeopleProvider from "./PeopleContext";
import Peoples from "./peopls";

const App = () => {
  return (
    <PeopleProvider>
    <Routes>
      <Route path="/" element={<Reception />} />
      <Route path="/peoples" element={<Peoples />} />
    </Routes>
    </PeopleProvider>

  );
};

export default App;