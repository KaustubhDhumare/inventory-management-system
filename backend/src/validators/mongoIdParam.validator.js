import { param } from "express-validator";


const mongoIdParamValidator = (field = "id", lable= "id")=> [
    param(field)
        .isMongoId()
        .withMessage(`Invalid ${lable}`),
];

export default mongoIdParamValidator;