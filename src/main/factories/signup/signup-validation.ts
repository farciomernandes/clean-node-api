import { Validation } from '../../../presentation/protocols/validation';
import { RequiredFieldValidation } from '../../../presentation/helper/validators/required-field-validation';
import { ValidationComposite } from '../../../presentation/helper/validators/validation-composite';
import { CompareFieldsValidation } from '../../../presentation/helper/validators/compare-fields-validation';
import { EmailValidation } from '../../../presentation/helper/validators/email-validation';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';



export const makeSignUpValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    for(const field of ['name', 'email', 'password', 'passwordConfirmation']){
        validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validations);
}