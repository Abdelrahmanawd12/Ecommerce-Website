// import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
// import { of } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';

// export function emailExistsValidator(): AsyncValidatorFn {
//   return (control: AbstractControl): any => {
//     return this.customerRegisterService.checkEmailExists(control.value).pipe(
//       map((emailExists: boolean) => {
//         return emailExists ? { emailExists: true } : null;
//       }),
//       catchError(() => of(null)) 
//     );
//   };
// }
