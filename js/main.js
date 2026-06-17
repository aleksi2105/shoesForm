'use strict'

class Footwear {
  constructor(brand, size, color, material, price, id = null) {
    this.brand = brand;
    this.size = size;
    this.color = color;
    this.material = material;
    this.price = price;
    this.id = id ?? crypto.randomUUID?.() ?? Date.now() + '-' + Math.random().toString(36);
  }

  getTypeName() {
    return "Обувь";
  }

  getExtraProps() {
    return { prop1: "—", prop2: "—" };
  }

  static removeFromStorageById(id, inventoryArray, saveCallback) {
    const newArray = inventoryArray.filter(item => item.id !== id);
    if (newArray.length !== inventoryArray.length) {
      // сохраняем новый массив
      saveCallback(newArray);
      return true;
    }
    return false;
  }

}

class Boots extends Footwear {
  constructor(brand, size, color, material, price, height, insulation, id = null) {
    super(brand, size, color, material, price, id);
    this.height = height;
    this.insulation = insulation;
  }

  getTypeName() {
    return "Сапоги";
  }

  getExtraProps() {
    return { prop1: `Высота: ${this.height} см`, prop2: `Утепление: ${this.insulation}` };
  }
}

class Shoes extends Footwear {
  constructor(brand, size, color, material, price, toeShape, heelHeight, id = null) {
    super(brand, size, color, material, price, id);
    this.toeShape = toeShape;
    this.heelHeight = heelHeight;
  }

  getTypeName() {
    return "Туфли";
  }

  getExtraProps() {
    return { prop1: `Мыс: ${this.toeShape}`, prop2: `Каблук: ${this.heelHeight} см` };
  }
}

class Sneakers extends Footwear {
  constructor(brand, size, color, material, price, waterproof, weight, id = null) {
    super(brand, size, color, material, price, id);
    this.waterproof = waterproof;
    this.weight = weight;
  }

  getTypeName() {
    return "Кроссовки";
  }

  getExtraProps() {
    return { prop1: `Непромокаемые: ${this.waterproof}`, prop2: `Вес: ${this.weight} г` };
  }
}