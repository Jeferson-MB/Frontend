class RegisterForm extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = /*html*/`
        <div class="register-bg">
            <div class="register-center">
                <div class="card white z-depth-4 register-card">
                    <h5 class="center-align azul grisáceo oscuro-2-text text-darken-5">Registro de Usuario</h5>
                    <div class="card-content">
                        <!-- Campo de nombre de usuario -->
                        <div class="input-field">
                            <input autofocus type="text" id="reg-username" autocomplete="off">
                            <label for="reg-username">Nombre de Usuario</label>
                        </div>
                        <!-- Campo de contraseña -->
                        <div class="input-field">
                            <input type="password" id="reg-password" autocomplete="off">
                            <label for="reg-password">Contraseña</label>
                        </div>
                        <!-- Campo de confirmar contraseña -->
                        <div class="input-field">
                            <input type="password" id="reg-confirm-password" autocomplete="off">
                            <label for="reg-confirm-password">Confirmar Contraseña</label>
                        </div>
                        <!-- Campo de foto de perfil -->
                        <div class="file-field input-field">
                            <div class="btn waves-effect waves-light">
                                <span>Foto de Perfil</span>
                                <input type="file" id="profile-photo" accept="image/*">
                            </div>
                            <div class="file-path-wrapper">
                                <input class="file-path validate" type="text" placeholder="Selecciona una imagen">
                            </div>
                        </div>
                        <!-- Preview de la imagen -->
                        <div class="center-align" style="margin: 20px 0;">
                            <img id="photo-preview" src="" alt="Vista previa" style="max-width: 150px; max-height: 150px; border-radius: 50%; display: none; border: 3px solid #ddd;">
                        </div>
                        <!-- Botones -->
                        <div class="row" style="margin-top: 30px;">
                            <div class="col s12">
                                <button id="btnRegister" class="btn waves-effect waves-light">
                                    Registrarse
                                </button>
                            </div>
                        </div>
                        <div class="center-align" style="margin-top: 15px;">
                            <p>¿Ya tienes cuenta? <a href="login.html" class="blue-text">Inicia sesión aquí</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}

customElements.define('register-form', RegisterForm);
