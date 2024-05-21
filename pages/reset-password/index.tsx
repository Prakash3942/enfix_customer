import { NextPage } from "next";
import Login from "../../src/modules/Login/Login";
import ResetPassword from "../../src/modules/ResetPassword/ResetPassword";

const Index: NextPage = () => {
  return (
      <ResetPassword />
  );
};
(Index as any).layout = null;
export default Index;
