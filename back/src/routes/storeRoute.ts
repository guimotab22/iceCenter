import express from "express";
import StoreController from "../controller/StoreController.js";

const storeRoute = express.Router()
storeRoute
    //coloca do caminho mais específico pro menos específico
    .get("/store/all/company/:companyId", StoreController.getAllByIdCompany)
    .get("/store/:storeId", StoreController.get)
    .get("/:slug", StoreController.getBySlug)
    .put("/store/:storeId", StoreController.put)
    .post("/store/create", StoreController.createStore)
    .delete(`/store/:id`, StoreController.delete)

export default storeRoute