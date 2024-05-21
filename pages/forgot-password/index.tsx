import { NextPage } from "next";
import ForgotPassowrd from "../../src/modules/ForgotPassowrd/ForgotPassowrd";

const Index: NextPage = () => {
  return (
      <ForgotPassowrd />
  );
};
(Index as any).layout = null;
export default Index;
