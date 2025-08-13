import mockData from "@/services/mockData/templates.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TemplatesService {
  constructor() {
    this.data = [...mockData];
    this.customizations = new Map(); // Store template customizations
  }

  // Save template customization
  async saveCustomization(templateId, customization) {
    await delay(100);
    this.customizations.set(templateId, customization);
    return customization;
  }

  // Get template customization
  async getCustomization(templateId) {
    await delay(50);
    return this.customizations.get(templateId) || null;
  }

  // Delete template customization
  async deleteCustomization(templateId) {
    await delay(50);
    return this.customizations.delete(templateId);
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(150);
    const item = this.data.find(item => item.Id === parseInt(id));
    if (!item) {
      throw new Error("Template not found");
    }
    return { ...item };
  }

  async create(item) {
    await delay(300);
    const maxId = Math.max(...this.data.map(item => item.Id), 0);
    const newItem = {
      ...item,
      Id: maxId + 1
    };
    this.data.push(newItem);
    return { ...newItem };
  }

  async update(id, data) {
    await delay(250);
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Template not found");
    }
    const updatedItem = {
      ...this.data[index],
      ...data,
      Id: parseInt(id)
    };
    this.data[index] = updatedItem;
    return { ...updatedItem };
  }

  async delete(id) {
    await delay(200);
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Template not found");
    }
    this.data.splice(index, 1);
    return { success: true };
  }
}

export default new TemplatesService();