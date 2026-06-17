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

  static fromPlainObject(obj) {
    return new Boots(obj.brand, obj.size, obj.color, obj.material, obj.price, obj.height, obj.insulation, obj.id);
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

  static fromPlainObject(obj) {
    return new Shoes(obj.brand, obj.size, obj.color, obj.material, obj.price, obj.toeShape, obj.heelHeight, obj.id);
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

  static fromPlainObject(obj) {
    return new Sneakers(obj.brand, obj.size, obj.color, obj.material, obj.price, obj.waterproof, obj.weight, obj.id);
  }
}

let footwearInventory = [];

const form = document.getElementById('shoeForm');
const shoeTypeSelect = document.getElementById('shoeType');
const dynamicContainer = document.getElementById('dynamicContainer');
const tableBody = document.getElementById('tableBody');
const itemsCounter = document.getElementById('itemsCounter');

const brandInput = document.getElementById('brand');
const sizeInput = document.getElementById('size');
const colorInput = document.getElementById('color');
const materialInput = document.getElementById('material');
const priceInput = document.getElementById('price');

const STORAGE_KEY = 'footwear_inventory_app';

function saveToLocalStorage() {
  try {
    const serialized = shoesInventory.map(item => {
      const base = {
        type: item.constructor.name,
        id: item.id,
        brand: item.brand,
        size: item.size,
        color: item.color,
        material: item.material,
        price: item.price,
      };
      if (item instanceof Boots) {
        base.height = item.height;
        base.insulation = item.insulation;
      } else if (item instanceof Shoes) {
        base.toeShape = item.toeShape;
        base.heelHeight = item.heelHeight;
      } else if (item instanceof Sneakers) {
        base.waterproof = item.waterproof;
        base.weight = item.weight;
      }
      return base;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (e) { console.warn(e); }
}