import { Validation } from '../../presentation/helper/validators/validation';
import { RequiredFieldValidation } from '../../presentation/helper/validators/required-field-validation';
import { ValidationComposite } from '../../presentation/helper/validators/validation-composite';



export const makeSignUpValidation = (): ValidationComposite => {
    const validatios: Validation[] = []
    for(const field of ['name', 'email', 'password', 'passwordConfirmation']){
        validatios.push(new RequiredFieldValidation(field))
    }
    return new ValidationComposite(validatios);
}