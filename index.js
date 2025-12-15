
//1,import express

const express=require("express")

//5 import cors

const cors=require("cors")

//8 import router

const router=require("./router")

//7 import dotenv

require("dotenv").config()

//11,connect db

require("./db/connection")

//2create express

const GamersConnect=express()

//6,tells server to use cors

GamersConnect.use(cors())

//10,parse request

GamersConnect.use(express.json())

//9,tell server to use router

GamersConnect.use(router)

//3 create port

const PORT=3000

//4,tell to server

GamersConnect.listen(PORT,()=>{
    console.log(`server running successfully at ${PORT}`);
    
})

