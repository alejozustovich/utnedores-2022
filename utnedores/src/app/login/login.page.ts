import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formLogin: FormGroup;
  spinner = false;

  constructor(private authService: AuthService,
    private fb: FormBuilder
    ) { }

  ngOnInit() {
    this.formLogin = this.fb.group(
      {
        correo: ['', [Validators.required, Validators.email]],
        clave: ['', [Validators.required, Validators.minLength(6)]]
      }
    )
  }

  get correo() {
    return this.formLogin.get('correo');
  }

  get clave() {
    return this.formLogin.get('clave');
  }

  iniciarSesion(){
    this.authService.login(this.formLogin.value);
  }

}
