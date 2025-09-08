class CompetitorAdsService {
  constructor() {
    // Initialize with empty data array - can be populated via API or uploads
    this.data = [];
    this.currentId = 1;
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
      throw new Error("Competitor ad not found");
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
      throw new Error("Competitor ad not found");
    }
    this.data[index] = { ...this.data[index], ...updatedData };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Competitor ad not found");
    }
    this.data.splice(index, 1);
    return true;
  }
}

export default new CompetitorAdsService();