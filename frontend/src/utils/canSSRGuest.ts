import { GetServerSideProps,GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { parseCookies } from "nookies";

//funcao para paginas que só pode ser acessadas por visitantes

export function canSSRGuest<P>(fn:GetServerSideProps<P>){
    return async(ctx:GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>>=>{
        //se o cara tentar acessar a pagina porem tanto ja um login salvo redirecionamos
        const cookies = parseCookies(ctx);
        if(cookies['@nextauth.token']){
            return {
                redirect:{
                    destination:'/dashboard',
                    permanent:false,
                }
            }
        }
        return await fn(ctx);
    }
}