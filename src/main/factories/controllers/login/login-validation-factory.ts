import { Validation } from '../../../../presentation/protocols/validation';
import { ValidationComposite, EmailValidation, RequiredFieldValidation } from '../../../../presentation/helper/validators';
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter';

export const makeLoginValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    for(const field of ['email', 'password']){
        validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validations);
}