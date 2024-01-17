import { Validation } from "../../presentation/helper/validators/validation"
import { RequiredFieldValidation } from "../../presentation/helper/validators/required-field-validation"
import { ValidationComposite } from "../../presentation/helper/validators/validation-composite"
import { makeSignUpValidation } from "./signup-validation"

jest.mock("../../presentation/helper/validators/validation-composite")

describe('SignUpValidationFacotry', ()=> {
    test('Should call ValidationComposite with all validations', ()=> {
        makeSignUpValidation()
        const validatios: Validation[] = []
        for(const field of ['name', 'email', 'password', 'passwordConfirmation']){
            validatios.push(new RequiredFieldValidation(field))
        }
        expect(ValidationComposite).toHaveBeenCalledWith(validatios)
    })
})