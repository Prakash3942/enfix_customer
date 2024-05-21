import { NextPage } from "next";
import Login from "../../src/modules/Login/Login";
import VerifyOTP from "../../src/modules/VerifyOTP/VerifyOTP";

const Index: NextPage = () => {
  return (
      <VerifyOTP />
  );
};
(Index as any).layout = null;
export default Index;
