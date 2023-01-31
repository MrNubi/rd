import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Axios from 'axios';
import { AuthProvider } from '../context/auth';
import { useRouter } from 'next/router';
import NavBar from '../components/Navbar';
import { SWRConfig } from 'swr';
import axios from 'axios';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import head from 'next/head';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  config.autoAddCss = false;
  const { pathname } = useRouter();
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname);

  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api';
  Axios.defaults.withCredentials = true;
  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };
  return (
    <>
      <Head>
        <script
          defer
          src="https://use.fontawesome.com/releases/v5.15.4/js/all.js"
          integrity="sha384-rOA1PnstxnOBLzCLMcre8ybwbTmemjzdNlILg8O7z1lUkLXozs4DHonlDtnE7fpc"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <SWRConfig value={{ fetcher }}>
        <AuthProvider>
          {!authRoute && <NavBar />}
          <div className={authRoute ? '' : 'pt-12'}>
            <Component {...pageProps} />
          </div>
        </AuthProvider>
      </SWRConfig>
    </>
  );
}
