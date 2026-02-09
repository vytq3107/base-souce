import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          // Basic phone number validation (10-12 digits)
          const regex = /^[0-9]{10,12}$/;
          return regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Phone number must be between 10 and 12 digits';
        },
      },
    });
  };
}
