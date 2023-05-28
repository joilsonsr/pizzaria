import {createContext,ReactNode, useState,useEffect} from 'react'
import {api} from '../services/apiClient'
import { toast } from 'react-toastify';

import {destroyCookie, setCookie,parseCookies} from 'nookies'
import Router from 'next/router';

type AuthContextData={
    user:UserProps;
    isAuthenticated:boolean;
    signIn: (credentials:signInProps)=> Promise<void>;
    signOut:()=>void;
    signUp:(credentials:signUpProps) => Promise<void>;
}
type UserProps ={
    id:string;
    name:string;
    email:string;
}
type signInProps = {
    email: string;
    password: string;
}
type signUpProps = {
    name:string;
    email:string;
    password: string;
}
type AuthProviderProps ={
    children:ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
    try {
        destroyCookie(undefined,'@nextauth.token')
        Router.push('/')
    }catch{
        console.log('error ao deslogar')
    }
}

export function AuthProvider({children}:AuthProviderProps){
   const [user,setUser] = useState<UserProps>();
   const isAuthenticated = !!user

    useEffect(()=>{
        //tertnar pegar algo do cookie
        const {'@nextauth.token':token} = parseCookies();
        if(token){
            api.get('/me').then(response=>{
                const {id, name, email} = response.data;
                setUser({
                    id,
                    name,
                    email
                    }
                )
            })
            .catch(()=>{
                //se deu erro deslogamos o user.
                signOut();
            })
        }
    },[])

   async function signIn({email,password}:signInProps){
       try{
            const response = await  api.post('/session',{
                email,
                password
            })
            //console.log(response.data);
           const {id,name, token} = response.data;
            setCookie(undefined,'@nextauth.token',token,{
                maxAge:60*60*24*30,//expira 1 mes
                path:"/"//quais camihos ertao acesso ao cookie
            })
            setUser({
                id,
                name,
                email
            })
            //passar para proximas requsições o nosso token
            api.defaults.headers['Authorization'] = `Bearer ${token}`
            toast.success('Logado com sucesso')

            //redirecionar o user para /dashboard
            Router.push('/dashboard')

       }catch(err){
            toast.error("Erro ao acessar")
            console.log("Erro ao acessar", err)
       }
    }
    async function signUp({name, email, password}:signUpProps) {
       try{
            const response = api.post('/users',{
                name,
                email,
                password
            })
            toast.success('Conta criada com sucesso')
            Router.push('/')
       }catch(err){
            toast.error('Erro ao cadastrar!')
            console.log('Erro ao cadastrar', err)
       }
    }
    return (
        <AuthContext.Provider value={{user,isAuthenticated,signIn, signOut,signUp}}>
            {children}
        </AuthContext.Provider>
    )
}