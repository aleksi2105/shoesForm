'use strict'

class Footwear {
  constructor({ brand, size, color, material, price, forKids = false, id = null }) {
    this.brand = brand;
    this.size = size;
    this.color = color;
    this.material = material;
    this.price = price;
    this.forKids = forKids;
    this.id = id ?? crypto.randomUUID?.() ?? Date.now() + '-' + Math.random().toString(36);
  }

  getTypeName() {
    return "Обувь";
  }

  getExtraProps() {
    return { prop1: "—", prop2: "—" };
  }

  getChildrenStatus() {
    return this.forKids ? "Да" : "Нет";
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
  constructor({ brand, size, color, material, price, height, insulation, forKids = false, id = null }) {
    super({ brand, size, color, material, price, forKids, id });
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
    return new Boots({
      brand: obj.brand,
      size: obj.size,
      color: obj.color,
      material: obj.material,
      price: obj.price,
      height: obj.height,
      insulation: obj.insulation,
      forKids: obj.forKids || false,
      id: obj.id
    });
  }
}

class Shoes extends Footwear {
  constructor({ brand, size, color, material, price, toeShape, heelHeight, forKids = false, id = null }) {
    super({ brand, size, color, material, price, forKids, id });
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
    return new Shoes({
      brand: obj.brand,
      size: obj.size,
      color: obj.color,
      material: obj.material,
      price: obj.price,
      toeShape: obj.toeShape,
      heelHeight: obj.heelHeight,
      forKids: obj.forKids || false,
      id: obj.id
    }
    );
  }
}

class Sneakers extends Footwear {
  constructor({ brand, size, color, material, price, waterproof, weight, forKids = false, id = null }) {
    super({ brand, size, color, material, price, forKids, id });
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
    return new Sneakers({
      brand: obj.brand,
      size: obj.size,
      color: obj.color,
      material: obj.material,
      price: obj.price,
      waterproof: obj.waterproof,
      weight: obj.weight,
      forKids: obj.forKids || false,
      id: obj.id
    });
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
const forKidsCheckbox = document.getElementById('forKids');

const STORAGE_KEY = 'footwear_inventory_app';

function saveToLocalStorage() {
  try {
    const serialized = footwearInventory.map(item => {
      const base = {
        type: item.constructor.name,
        id: item.id,
        brand: item.brand,
        size: item.size,
        color: item.color,
        material: item.material,
        price: item.price,
        forKids: item.forKids || false,
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
        obj = Shoes.fromPlainObject(item);
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
  } else if (selectedType === 'shoes') {
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

function validateCommonFields() {
  if (!brandInput.value.trim()) return "Введите бренд.";
  if (!sizeInput.value) return "Укажите размер.";
  if (parseFloat(sizeInput.value) <= 0) return "Размер должен быть больше 0.";
  if (!colorInput.value.trim()) return "Укажите цвет.";
  if (!materialInput.value.trim()) return "Укажите материал.";
  if (!priceInput.value) return "Укажите цену.";
  if (parseFloat(priceInput.value) <= 0) return "Цена должна быть больше 0.";
  if (!shoeTypeSelect.value) return "Выберите тип обуви.";
  return null;
}

function getDynamicData(type) {
  if (type === 'boots') {
    const height = document.getElementById('height')?.value.trim();
    const insulation = document.getElementById('insulation')?.value.trim();
    if (!height) throw new Error("Введите высоту голенища.");
    if (!insulation) throw new Error("Укажите вид утепления.");
    if (parseFloat(height) <= 0) throw new Error("Высота голенища > 0.");
    return { height: parseFloat(height), insulation };
  }
  else if (type === 'shoes') {
    const toeShape = document.getElementById('toeShape')?.value.trim();
    const heelHeight = document.getElementById('heelHeight')?.value.trim();
    if (!toeShape) throw new Error("Введите вид мыса.");
    if (!heelHeight) throw new Error("Укажите высоту каблука.");
    if (parseFloat(heelHeight) < 0) throw new Error("Высота каблука не может быть отрицательной.");
    return { toeShape, heelHeight: parseFloat(heelHeight) };
  }
  else if (type === 'sneakers') {
    const waterproof = document.getElementById('waterproof')?.value;
    const weight = document.getElementById('weight')?.value.trim();
    if (!waterproof) throw new Error("Выберите свойство 'непромокаемые'.");
    if (!weight) throw new Error("Укажите вес.");
    if (parseFloat(weight) <= 0) throw new Error("Вес > 0.");
    return { waterproof, weight: parseFloat(weight) };
  }
  throw new Error("Неизвестный тип");
}

function onFormSubmit(event) {
  event.preventDefault();
  const commonError = validateCommonFields();
  if (commonError) {
    alert(commonError);
    return;
  }
  const selectedType = shoeTypeSelect.value;
  if (!selectedType) {
    alert("Выберите класс обуви");
    return;
  }
  // const brand = brandInput.value.trim();
  // const size = parseFloat(sizeInput.value);
  // const color = colorInput.value.trim();
  // const material = materialInput.value.trim();
  // const price = parseFloat(priceInput.value);
  const forKids = forKidsCheckbox?.checked || false;

  let newShoe = null;
  try {
    const dynamic = getDynamicData(selectedType);
    const baseData = {
      brand: brandInput.value.trim(),
      size: parseFloat(sizeInput.value),
      color: colorInput.value.trim(),
      material: materialInput.value.trim(),
      price: parseFloat(priceInput.value),
      forKids: forKids
    };

    if (selectedType === 'boots') {
      newShoe = new Boots({
        ...baseData,
        height: dynamic.height,
        insulation: dynamic.insulation
      });
    } else if (selectedType === 'shoes') {
      newShoe = new Shoes({
        ...baseData,
        toeShape: dynamic.toeShape,
        heelHeight: dynamic.heelHeight
      });
    } else if (selectedType === 'sneakers') {
      newShoe = new Sneakers({
        ...baseData,
        waterproof: dynamic.waterproof,
        weight: dynamic.weight
      });
    }
  } catch (err) {
    alert(err.message);
    return;
  }

  // let newShoe = null;
  // try {
  //   const dynamic = getDynamicData(selectedType);
  //   if (selectedType === 'boots') {
  //     newShoe = new Boots(brand, size, color, material, price, dynamic.height, dynamic.insulation, forKids);
  //   } else if (selectedType === 'shoes') {
  //     newShoe = new Shoes(brand, size, color, material, price, dynamic.toeShape, dynamic.heelHeight, forKids);
  //   } else if (selectedType === 'sneakers') {
  //     newShoe = new Sneakers(brand, size, color, material, price, dynamic.waterproof, dynamic.weight, forKids);
  //   }
  // } catch (err) {
  //   alert(err.message);
  //   return;
  // }

  footwearInventory.push(newShoe);
  updateFullState(footwearInventory);

  form.reset();
  shoeTypeSelect.value = "";
  dynamicContainer.style.display = 'none';
  dynamicContainer.innerHTML = '';
  forKidsCheckbox.checked = false;
  brandInput.focus();
}

function renderTable() {
  if (!tableBody) return;
  if (footwearInventory.length === 0) {
    tableBody.innerHTML = `<tr class="empty-row"><td colspan="10">Нет добавленных моделей. Заполните форму и сохраните.</td></tr>`;
    itemsCounter.innerText = `0 записей`;
    return;
  }
  let html = '';
  footwearInventory.forEach((item, idx) => {
    const extra = item.getExtraProps();
    const typeName = item.getTypeName();
    html += `<tr>
                        <td><strong>${escapeHtml(typeName)}</strong></td>
                        <td>${escapeHtml(item.brand)}</td>
                        <td>${item.size}</td>
                        <td>${escapeHtml(item.color)}</td>
                        <td>${escapeHtml(item.material)}</td>
                        <td>${item.price.toLocaleString()} ₽</td>
                        <td>${item.getChildrenStatus()}</td>                        
                        <td>${escapeHtml(extra.prop1)}</td>
                        <td>${escapeHtml(extra.prop2)}</td>
                        <td style="text-align:center">
                            <button class="delete-btn" data-id="${item.id}" title="Удалить">Удалить</button>
                        </td>
                    </tr>`;
  });
  tableBody.innerHTML = html;
  itemsCounter.innerText = `${footwearInventory.length} ${footwearInventory.length === 1 ? 'запись' : 'записей'}`;


  const deleteBtns = document.querySelectorAll('.delete-btn');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const shoeId = btn.getAttribute('data-id');
      if (shoeId) {
        deleteShoeById(shoeId);
      }
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>]/g, function (m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

function init() {
  const stored = loadFromLocalStorage();
  footwearInventory = stored;
  renderTable();
  saveToLocalStorage();
  shoeTypeSelect.addEventListener('change', renderDynamicFields);
  form.addEventListener('submit', onFormSubmit);
  renderDynamicFields();
}

init();
