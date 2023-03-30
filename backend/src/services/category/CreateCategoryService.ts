import prismaClient from "../../prisma";

interface CategoryRequest{
    name: string;
}

class CreateCategoryService{
    async execute({name}:CategoryRequest){
        if(name===''){
            throw new Error('Nome Invalido')
        }
        const categoryjaExist= await prismaClient.category.findFirst({
            where:{
                name:name
            }
        })

        if(categoryjaExist){
            throw new Error("Categoria já foi cadastrada")
        }
        
        const category = await prismaClient.category.create({
            data:{
                name:name,
            },
            select:{
                id:true,
                name:true,
            }
        })
        return category
    }
}

export {CreateCategoryService}