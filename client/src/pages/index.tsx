import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '../styles/Home.module.css';
import Login from './login';
import { useRouter } from 'next/router';

export default function Home() {
  let router = useRouter();
  const mover = () => {
    router.push('/login');
  };
  let mover2 = () => {
    router.push('/subs/create');
  };
  return (
    <div className={styles.container}>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button onClick={mover}>로그인</button>
      <button onClick={mover2}>Subs</button>
    </div>
  );
}
