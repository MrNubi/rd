import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Axios from 'axios';
import { AuthProvider } from '../context/auth';
import { useRouter } from 'next/router';
import NavBar from '../components/Navbar';
import { SWRConfig } from 'swr';
import axios from 'axios';

export default function App({ Component, pageProps }: AppProps) {
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
    <SWRConfig value={{ fetcher }}>
      <AuthProvider>
        {!authRoute && <NavBar />}
        <div className={authRoute ? '' : 'pt-12'}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  );
}
