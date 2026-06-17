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

function loadFromLocalStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    const restored = [];
    for (const item of parsed) {
      let obj = null;
      if (item.type === 'Boots') {
        obj = Boots.fromPlainObject(item);
      } else if (item.type === 'Shoes') {
        obj = DressShoes.fromPlainObject(item);
      } else if (item.type === 'Sneakers') {
        obj = Sneakers.fromPlainObject(item);
      } else {
        continue;
      }
      if (obj) restored.push(obj);
    }
    return restored;
  } catch (e) {
    console.error("Ошибка парсинга localStorage", e);
    return [];
  }
}

function updateFullState(newInventory) {
  footwearInventory = newInventory;
  renderTable();
  saveToLocalStorage();
}

function deleteShoeById(id) {
  Footwear.removeFromStorageById(id, footwearInventory, (updatedArr) => {
    footwearInventory = updatedArr;
    renderTable();
    saveToLocalStorage();
  });
}

function renderDynamicFields() {
  const selectedType = shoeTypeSelect.value;
  if (!selectedType) {
    dynamicContainer.style.display = 'none';
    dynamicContainer.innerHTML = '';
    return;
  }
  dynamicContainer.style.display = 'grid';
  if (selectedType === 'boots') {
    dynamicContainer.innerHTML = `
                <div class="input-group">
                    <label class="input-group-label">Высота голенища (см) <span>*</span></label>
                    <input type="number" id="height" class="form-input" placeholder="например: 38" required>
                </div>
                <div class="input-group">
                    <label class="input-group-label">Вид утепления <span>*</span></label>
                    <input type="text" id="insulation" class="form-input" placeholder="мех, шерсть, без утеплителя" required>
                </div>
            `;
  } else if (selectedType === 'Shoes') {
    dynamicContainer.innerHTML = `
                <div class="input-group">
                    <label class="input-group-label">Вид мыса <span>*</span></label>
                    <input type="text" id="toeShape" class="form-input" placeholder="закрытый, круглый" required>
                </div>
                <div class="input-group">
                    <label class="input-group-label">Высота каблука (см) <span>*</span></label>
                    <input type="number" id="heelHeight" class="form-input" placeholder="например: 2" required>
                </div>
            `;
  } else if (selectedType === 'sneakers') {
    dynamicContainer.innerHTML = `
                <div class="input-group">
                    <label class="input-group-label">Непромокаемые <span>*</span></label>
                    <select id="waterproof" class="form-select" required>
                        <option value="" disabled selected>– выберите –</option>
                        <option value="Да">Да, влагозащита</option>
                        <option value="Нет">Нет, стандартные</option>
                        <option value="Мембрана">Мембрана</option>
                    </select>
                </div>
                <div class="input-group">
                    <label class="input-group-label">Вес (граммы) <span>*</span></label>
                    <input type="number" id="weight" class="form-input" placeholder="280-1000" required>
                </div>
            `;
  }

  const dynRequired = dynamicContainer.querySelectorAll('input, select');
  dynRequired.forEach(field => field.setAttribute('required', 'required'));
}