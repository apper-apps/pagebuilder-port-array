import mockData from "@/services/mockData/collections.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CollectionsService {
  constructor() {
    this.data = [...mockData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(250);
    const item = this.data.find(item => item.Id === parseInt(id));
    if (!item) {
      throw new Error("Collection not found");
    }
    return { ...item };
  }

async create(item) {
    await delay(400);
    const maxId = Math.max(...this.data.map(item => item.Id), 0);
    const newItem = {
      ...item,
      Id: maxId + 1,
      productIds: item.productIds || [],
      comparisonCriteria: item.comparisonCriteria || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.push(newItem);
    return { ...newItem };
  }

async update(id, data) {
    await delay(350);
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Collection not found");
    }
    const updatedItem = {
      ...this.data[index],
      ...data,
      Id: parseInt(id),
      productIds: data.productIds || this.data[index].productIds || [],
      comparisonCriteria: data.comparisonCriteria || this.data[index].comparisonCriteria || [],
      updatedAt: new Date().toISOString()
    };
    this.data[index] = updatedItem;
    return { ...updatedItem };
  }

  async delete(id) {
    await delay(250);
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Collection not found");
    }
    this.data.splice(index, 1);
    return { success: true };
  }
}

export default new CollectionsService();