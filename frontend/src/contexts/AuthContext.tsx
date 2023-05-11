import {createContext,ReactNode, useState} from 'react'
import {api} from '../services/apiClient'

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
            //redirecionar o user para /dashboard
            Router.push('/dashboard')

       }catch(err){
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
            console.log('Cadastrado com sucesso')
            Router.push('/')
       }catch(err){
            console.log('Erro ao cadastrar', err)
       }
    }
    return (
        <AuthContext.Provider value={{user,isAuthenticated,signIn, signOut,signUp}}>
            {children}
        </AuthContext.Provider>
    )
}