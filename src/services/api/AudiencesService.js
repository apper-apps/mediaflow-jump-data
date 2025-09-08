import audiencesMockData from "@/services/mockData/audiences.json";

class AudiencesService {
  constructor() {
    this.data = [...audiencesMockData];
    this.currentId = Math.max(...this.data.map(item => item.Id)) + 1;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.data];
  }

  async getById(id) {
    await this.delay();
    const item = this.data.find(item => item.Id === parseInt(id));
    if (!item) {
      throw new Error("Audience not found");
    }
    return { ...item };
  }

  async create(newItem) {
    await this.delay();
    const item = {
      ...newItem,
      Id: this.currentId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.unshift(item);
    return { ...item };
  }

  async update(id, updatedData) {
    await this.delay();
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Audience not found");
    }
    this.data[index] = { ...this.data[index], ...updatedData };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Audience not found");
    }
    this.data.splice(index, 1);
    return true;
  }
}

export default new AudiencesService();