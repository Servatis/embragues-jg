export class User {
  constructor(id, name, username, email, pass, role_id, image, is_active) {
    this.id = Number(id)
    this.name = name
    this.username = username
    this.email = email
    this.pass = pass
    this.role_id = Number(role_id)
    this.image = image
    this.is_active = Boolean(is_active)
  }

  // Mapeo dinámico del nombre de rol según role_id
  getRoleName() {
    const roles = {
      1: 'Administrador',
      2: 'Colaborador',
      3: 'Cliente'
    }
    return roles[this.role_id]
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      username : this.username,
      email: this.email,
      pass: this.pass,
      role_id: this.role_id,
      image: this.image,
      is_active: this.is_active
    }
  }
}
