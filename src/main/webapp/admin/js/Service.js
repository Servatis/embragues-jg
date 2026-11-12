export class Service {
  constructor(id, name, description, category_id, is_active) {
    this.id = Number(id)
    this.name = name
    this.description = description
    this.category_id = Number(category_id)
    this.is_active = Boolean(is_active)
  }

  // Mapeo dinámico del nombre de categoría según category_id
  getCategoryName() {
    const categories = {
      1: 'Mantenimiento',
      2: 'Diagnóstico',
      3: 'Reparación'
    }
    return categories[this.category_id]
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category_id: this.category_id,
      is_active: this.is_active
    }
  }
}
