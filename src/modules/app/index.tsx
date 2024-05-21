import * as React from "react";
import { useEffect } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import { SnackbarProvider } from "notistack";
// import 'react-phone-input-2/lib/style.css'
// import 'cropperjs/dist/cropper.css';
import { useDispatch, useSelector } from "react-redux";
// import { fetchRefreshToken, setUser, setUserType } from "../data/slice";
// import { NextIntlProvider } from "next-intl";
import { useRouter } from "next/router";
// import DefaultLayout from "../../../core/components/DefaultLayout";
// import theme from "../../../core/theme/theme";
// import createEmotionCache from "../../../createEmotionCache";
// import { AppDispatch, AppStoreState } from "../../../core/store/store";
// import { authCookieName, cookieStorage } from "../../../core/apis/rest.app";
import theme from "../../theme/theme";
import DefaultLayout from "../../components/DefaultLayout";
import createEmotionCache from "../createEmotionCache";
import { AppDispatch, AppStoreState } from "../../store/store";
import { authCookieName, cookieStorage } from "../../apis/rest.app";
import { fetchRefreshToken, setUser } from "./slice";
import { GetDeviceId } from "../../utils/core/DeviceId";
import Loader from "../../components/Loaders/Loader";
// import { ReduxState } from "../../../core/types/State";
// import Loader from "../../../core/components/Loaders/Loader";

const clientSideEmotionCache = createEmotionCache();
const withoutLoginPages = [
  "/login",
  "/client-login",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
];

function App(props: any) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const { status } = useSelector((state: AppStoreState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { locale = "en" } = router;

  let Layout = Component.layout === null ? React.Fragment : DefaultLayout;

  useEffect(() => {
    GetDeviceId().then(() => {});
    const token = localStorage.getItem(authCookieName);
    if (token) {
      if (!withoutLoginPages.includes(router.pathname)) {
        dispatch(fetchRefreshToken())
          .unwrap()
          .then((res: any) => {
            localStorage.setItem(authCookieName, res.accessToken);
            cookieStorage.setItem(authCookieName, res.accessToken);
            dispatch(setUser({ user: res.user }));
          })
          .catch((err: any) => {
            if (err) {
              router.push("/login");
              localStorage.removeItem(authCookieName);
              cookieStorage.removeItem(authCookieName);
            }
          });
      }
    } else if (!token && !withoutLoginPages.includes(router.pathname)) {
      router.push("/login");
    }
  }, []);

  const MySnackbarProvider: any = SnackbarProvider as any;
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(true), 1000);
  }, []);

  return (
    // <NextIntlProvider
    //   messages={require(`../../locales/${locale}.json`)}
    //   locale={locale}
    // >
      <MySnackbarProvider>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>
              {Component.title
                ? `${Component.title} | ${process.env.name}`
                : process.env.name}
            </title>
            <meta
              content="initial-scale=1, width=device-width"
              name="viewport"
            />
          </Head>
          {!loading ? (
            <Loader />
          ) : (
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {/* {status === ReduxState.PENDING ? (
              <Loader />
            ) : ( */}
              <Layout>
                <Component {...pageProps} />
              </Layout>
              {/* )} */}
            </ThemeProvider>
          )}
        </CacheProvider>
      </MySnackbarProvider>
    // </NextIntlProvider>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

export default App;
