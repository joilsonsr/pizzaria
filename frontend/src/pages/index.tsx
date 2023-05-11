import { useContext, FormEvent,useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/home.module.scss'

import logoImg from '../../public/logo.svg'

import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

import { AuthContext } from '../contexts/AuthContext'

import Link from 'next/link'


export default function Home() {
  const {signIn} = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)


  async function handleLogin(event:FormEvent) {
    event.preventDefault();
    if (email ==='' || password ===''){
      alert("PREENCHA os DADOS")
      return;
    }
    setLoading(true);
    let data= {
      email,
      password
    }
    await signIn(data);
    setLoading(false)
  }
  return (
    <>
      <Head>
        <title>
          Sujetio Pizza-Faça seu Login
        </title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo Sujeito Pizzaria"/>
        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input
              placeholder='Digite seu email'
              type='text'
              value={email}
              onChange={(e)=> setEmail (e.target.value)}
            />
             <Input
              placeholder='Digite sua senha'
              type='password'
              value={password}
              onChange={(e)=> setPassword (e.target.value)}
            />
            <Button
              type="submit"
              loading={loading}
            >
              Acessar
            </Button>
          </form> 
          <Link className={styles.text} href="/signup">
           Nao possui uma conta? Cadastre-se       
          </Link>
        </div> 
      </div>
    </>
  )
}
