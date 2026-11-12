export class ContactForm {
  constructor(id, name, phone, email, service, message, date) {
    this.id = Number(id)
    this.name = name
    this.phone = phone
    this.email = email
    this.service = service
    this.message = message
    this.date = date
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      phone: this.phone,
      email: this.email,
      service: this.service,
      message: this.message,
      date: this.date
    }
  }
}
