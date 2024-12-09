import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsTimeString(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) =>
    registerDecorator({
      name: 'IsTimeString',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          const timeDate = new Date(`1970-01-01Z${value}`);
          return timeDate?.toString() !== 'Invalid Date';
        },
      },
    });
}
