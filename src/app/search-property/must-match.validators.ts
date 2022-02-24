import { FormGroup } from '@angular/forms';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { RouteConfigLoadEnd } from '@angular/router';


// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

export function goalValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;

        const goalValid = value[0].select && value[1].select;

        return !goalValid ? {goalSelect:true}: null;
    }
}