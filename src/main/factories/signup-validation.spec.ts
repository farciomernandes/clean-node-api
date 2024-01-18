import { Validation } from "../../presentation/helper/validators/validation"
import { RequiredFieldValidation } from "../../presentation/helper/validators/required-field-validation"
import { ValidationComposite } from "../../presentation/helper/validators/validation-composite"
import { makeSignUpValidation } from "./signup-validation"
import { CompareFieldsValidation } from "../../presentation/helper/validators/compare-fields-validation"

jest.mock("../../presentation/helper/validators/validation-composite")

describe('SignUpValidationFacotry', ()=> {
    test('Should call ValidationComposite with all validations', ()=> {
        makeSignUpValidation()
        const validations: Validation[] = []
        for(const field of ['name', 'email', 'password', 'passwordConfirmation']){
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})