import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm = this.formBuilder.group({
        username: ["", [Validators.required]],
        password: ["", [Validators.required]]
    });

    loginError: boolean = false;

    constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    }

    ngOnInit(): void {
    }

    login() {
        if (this.loginForm.invalid) {
            Object.keys(this.loginForm.controls).forEach(key => this.loginForm.get(key)?.markAsDirty());
            return;
        }
        this.authService.login(this.loginForm.value).toPromise().then(
            () => {
                alert("Ура");
            }
        ).catch(
            () => {
                this.loginError = true;
            }
        )
    }
}
