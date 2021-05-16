import {AbstractControl, FormArray, FormControl, FormGroup} from "@angular/forms";

export class BaseModel {
    public makeForm() {
        let elements: any = {};
        const fillElements = (level: any, result: any) => {
            for (let field in level) {
                let newField: any;
                let newControl: AbstractControl;
                if (typeof level[field] === 'function') {
                    continue;
                }
                if (Array.isArray(level[field])) {
                    newField = [];
                    fillElements(level[field], newField);
                    newControl = new FormArray(newField);
                } else if (typeof(level[field]) === 'object' && level[field] !== null) {
                    newField = {};
                    fillElements(level[field], newField);
                    newControl = new FormGroup(newField)
                } else {
                    newControl = new FormControl(level[field])
                }
                if (Array.isArray(result)) {
                    result.push(newControl);
                } else {
                    result[field] = newControl;
                }
            }
        }
        let obj = this.getObjectForForm();
        fillElements(obj, elements);
        let formGroup = new FormGroup(elements);
        let validators = this.validators();
        for (let v in validators) {
            let fc = formGroup.get(v);
            if (fc) {
                fc.setValidators(validators[v]);
            }
        }
        return formGroup;
    }

    public validators(): any {
        return {};
    }

    public copyFrom(obj: any) {
        for (let i in obj) {
            if (this.callCopier(i, obj)) {
                continue;
            }
            if ((this as any)[i] instanceof BaseModel) {
                (this as any)[i].copyFrom(obj[i])
            } else {
                (this as any)[i] = obj[i];
            }
        }
        this.afterCopy();
        return this;
    }

    private callCopier(i: string, obj: any) {
        const methodName = "copy" + i[0].toUpperCase() + i.slice(1);
        if ((this as any)[methodName]) {
            (this as any)[methodName](obj[i]);
            return true;
        }
        return false;
    }

    protected afterCopy() {
        /* Do nothing */
    }

    protected getObjectForForm(): any {
        return Object.assign({}, this);
    }
}
