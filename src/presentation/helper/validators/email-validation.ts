import { InvalidParamError, MissingParamError } from "../../errors";
import { Validation } from "./validation";
import { EmailValidator } from '../../protocols/email-validator'


export class EmailValidation implements Validation {
    private readonly fieldName: string;
    private readonly emailValidator: EmailValidator;

    constructor(fieldName: string, emailValidator: EmailValidator){
        this.emailValidator = emailValidator;
        this.fieldName = fieldName;
    }

    validate(input: any): Error {
      const isValid = this.emailValidator.isValid(input[this.fieldName]);
      if (!isValid) {
        return new InvalidParamError(this.fieldName)
      }
    }

}