import { NextPage } from "next";
import Login from "../../src/modules/Login/Login";

const Index: NextPage = () => {
  return (
      <Login />
  );
};
(Index as any).layout = null;
export default Index;
