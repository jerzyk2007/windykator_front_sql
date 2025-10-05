import { createContext, useState } from "react";
const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [excelFile, setExcelFile] = useState(false);

  return (
    <DataContext.Provider
      value={{
        auth,
        setAuth,
        excelFile,
        setExcelFile,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
