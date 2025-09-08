// Mock data embedded directly in service to prevent file dependency issues
const mediaPlansMockData = [
  {
    Id: 1,
    Name: "Q4 Holiday Campaign",
    Budget: 150000,
    Status: "Active",
    Channels: ["Google Ads", "Meta", "TikTok"],
    StartDate: "2024-10-01",
    EndDate: "2024-12-31",
    TargetAudience: "Holiday Shoppers 25-45",
    Objective: "Brand Awareness & Sales",
    CreatedAt: "2024-09-15",
    UpdatedAt: "2024-11-20"
  },
  {
    Id: 2,
    Name: "Brand Awareness Spring 2024",
    Budget: 75000,
    Status: "Completed",
    Channels: ["LinkedIn", "YouTube", "Meta"],
    StartDate: "2024-03-01",
    EndDate: "2024-05-31",
    TargetAudience: "Professionals 30-50",
    Objective: "Brand Awareness",
    CreatedAt: "2024-02-10",
    UpdatedAt: "2024-05-31"
  },
  {
    Id: 3,
    Name: "Product Launch Campaign",
    Budget: 200000,
    Status: "Draft",
    Channels: ["Google Ads", "YouTube", "Twitter"],
    StartDate: "2024-12-01",
    EndDate: "2025-02-28",
    TargetAudience: "Tech Enthusiasts 22-40",
    Objective: "Product Launch",
    CreatedAt: "2024-11-01",
    UpdatedAt: "2024-11-15"
  },
  {
    Id: 4,
    Name: "Summer Sale Promotion",
    Budget: 120000,
    Status: "Paused",
    Channels: ["Meta", "TikTok", "Snapchat"],
    StartDate: "2024-06-01",
    EndDate: "2024-08-31",
    TargetAudience: "Young Adults 18-35",
    Objective: "Sales & Conversion",
    CreatedAt: "2024-05-15",
    UpdatedAt: "2024-07-10"
  },
  {
    Id: 5,
    Name: "B2B Lead Generation",
    Budget: 85000,
    Status: "Active",
    Channels: ["LinkedIn", "Google Ads"],
    StartDate: "2024-09-01",
    EndDate: "2024-12-31",
    TargetAudience: "Business Decision Makers",
    Objective: "Lead Generation",
    CreatedAt: "2024-08-20",
    UpdatedAt: "2024-11-18"
  }
];

class MediaPlansService {
  constructor() {
    this.data = [...mediaPlansMockData];
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
      throw new Error("Media plan not found");
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
      throw new Error("Media plan not found");
    }
    this.data[index] = { ...this.data[index], ...updatedData };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Media plan not found");
    }
    this.data.splice(index, 1);
    return true;
  }
}

export default new MediaPlansService();