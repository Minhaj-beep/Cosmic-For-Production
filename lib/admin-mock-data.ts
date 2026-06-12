// Mock data for admin dashboard

export type AdminRole = 'admin' | 'editor';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
}

export const MOCK_ADMIN_USER: AdminUser = {
  id: '1',
  name: 'Rajan Mehta',
  email: 'rajan@cosmicbicycles.com',
  role: 'admin',
};

export const MOCK_CREDENTIALS = { email: 'admin@cosmicbicycles.com', password: 'admin123' };

// Products
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  price: number;
  offerPrice?: number;
  stock: 'in_stock' | 'low_stock' | 'out_of_stock';
  status: 'published' | 'draft';
  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;
  images: string[];
  description: string;
  specs: { key: string; value: string }[];
  variants: { size: string; color: string; stock: number }[];
  createdAt: string;
}

export const mockProducts: Product[] = [
  { id: 'p1', name: 'Cosmic Apex Pro', sku: 'CSM-APX-001', category: 'Road', subcategory: 'Race', price: 89999, offerPrice: 79999, stock: 'in_stock', status: 'published', featured: true, newArrival: false, bestseller: true, images: ['https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg'], description: 'Race-ready performance road bike.', specs: [{ key: 'Frame', value: 'Carbon Fiber' }, { key: 'Weight', value: '7.2 kg' }], variants: [{ size: 'S', color: 'Matte Black', stock: 5 }, { size: 'M', color: 'Matte Black', stock: 8 }], createdAt: '2026-01-15' },
  { id: 'p2', name: 'Cosmic Trail X', sku: 'CSM-TRL-002', category: 'Mountain', subcategory: 'Trail', price: 69999, stock: 'low_stock', status: 'published', featured: false, newArrival: true, bestseller: false, images: ['https://images.pexels.com/photos/1266377/pexels-photo-1266377.jpeg'], description: 'Versatile trail mountain bike.', specs: [{ key: 'Frame', value: 'Alloy 6061' }, { key: 'Suspension', value: '120mm' }], variants: [{ size: 'M', color: 'Red', stock: 3 }], createdAt: '2026-02-10' },
  { id: 'p3', name: 'Cosmic Gravel One', sku: 'CSM-GRV-003', category: 'Gravel', subcategory: 'Adventure', price: 74999, offerPrice: 69999, stock: 'in_stock', status: 'published', featured: true, newArrival: true, bestseller: false, images: ['https://images.pexels.com/photos/2158963/pexels-photo-2158963.jpeg'], description: 'All-road gravel adventure bike.', specs: [{ key: 'Frame', value: 'Carbon' }, { key: 'Tyre Clearance', value: '45mm' }], variants: [{ size: 'L', color: 'Sand', stock: 6 }], createdAt: '2026-03-01' },
  { id: 'p4', name: 'Cosmic Urban Glide', sku: 'CSM-URB-004', category: 'Urban', subcategory: 'City', price: 34999, stock: 'in_stock', status: 'draft', featured: false, newArrival: false, bestseller: false, images: ['https://images.pexels.com/photos/1571939/pexels-photo-1571939.jpeg'], description: 'Smooth urban commuter bike.', specs: [{ key: 'Frame', value: 'Alloy' }, { key: 'Gears', value: '8-speed' }], variants: [{ size: 'M', color: 'White', stock: 10 }], createdAt: '2026-03-20' },
  { id: 'p5', name: 'Cosmic Kids Star', sku: 'CSM-KID-005', category: 'Kids', subcategory: "Children's", price: 15999, stock: 'out_of_stock', status: 'published', featured: false, newArrival: false, bestseller: true, images: ['https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg'], description: 'Fun and safe bicycle for kids.', specs: [{ key: 'Wheel Size', value: '20"' }, { key: 'Age', value: '7–12 years' }], variants: [{ size: 'One Size', color: 'Blue', stock: 0 }], createdAt: '2026-04-05' },
];

// Categories
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  status: 'active' | 'inactive';
}

export const mockCategories: Category[] = [
  { id: 'c1', name: 'Road', slug: 'road', description: 'High-performance road bicycles', productCount: 12, status: 'active' },
  { id: 'c2', name: 'Mountain', slug: 'mountain', description: 'Off-road mountain bikes', productCount: 9, status: 'active' },
  { id: 'c3', name: 'Gravel', slug: 'gravel', description: 'Adventure gravel bikes', productCount: 6, status: 'active' },
  { id: 'c4', name: 'Urban', slug: 'urban', description: 'City and commuter bikes', productCount: 7, status: 'active' },
  { id: 'c5', name: 'Kids', slug: 'kids', description: "Children's bicycles", productCount: 5, status: 'active' },
  { id: 'c6', name: 'Electric', slug: 'electric', description: 'Electric assist bicycles', productCount: 3, status: 'inactive' },
];

// Accessories
export interface AccessoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'published' | 'draft';
  image: string;
}

export const mockAccessories: AccessoryItem[] = [
  { id: 'a1', name: 'Cosmic Pro Helmet', sku: 'ACC-HLM-001', category: 'Helmets', price: 4999, stock: 24, status: 'published', image: 'https://images.pexels.com/photos/1571939/pexels-photo-1571939.jpeg' },
  { id: 'a2', name: 'Aero Water Bottle', sku: 'ACC-BTL-002', category: 'Hydration', price: 699, stock: 120, status: 'published', image: 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg' },
  { id: 'a3', name: 'Trail Saddle Bag', sku: 'ACC-BAG-003', category: 'Bags', price: 1899, stock: 45, status: 'published', image: 'https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg' },
  { id: 'a4', name: 'Cosmic Cycling Gloves', sku: 'ACC-GLV-004', category: 'Apparel', price: 1299, stock: 60, status: 'draft', image: 'https://images.pexels.com/photos/2158963/pexels-photo-2158963.jpeg' },
  { id: 'a5', name: 'LED Front Light', sku: 'ACC-LGT-005', category: 'Lights', price: 2499, stock: 33, status: 'published', image: 'https://images.pexels.com/photos/1266377/pexels-photo-1266377.jpeg' },
];

// Spare Parts
export interface SparePart {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  compatibility: string;
  status: 'published' | 'draft';
}

export const mockSpareParts: SparePart[] = [
  { id: 'sp1', name: 'Shimano Brake Cable Set', sku: 'SP-BRK-001', category: 'Brakes', price: 399, stock: 200, compatibility: 'All Models', status: 'published' },
  { id: 'sp2', name: 'Alloy Bottom Bracket', sku: 'SP-BB-002', category: 'Drivetrain', price: 1299, stock: 50, compatibility: 'Road, Gravel', status: 'published' },
  { id: 'sp3', name: 'Rear Derailleur Hanger', sku: 'SP-DRL-003', category: 'Drivetrain', price: 499, stock: 80, compatibility: 'Mountain, Trail X', status: 'published' },
  { id: 'sp4', name: 'Continental Tyre 700c', sku: 'SP-TYR-004', category: 'Tyres', price: 2999, stock: 30, compatibility: 'Road, Gravel', status: 'published' },
  { id: 'sp5', name: 'Headset Bearing Kit', sku: 'SP-HS-005', category: 'Steering', price: 899, stock: 40, compatibility: 'All Models', status: 'draft' },
];

// Dealer Enquiries
export interface DealerEnquiry {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  notes: string;
  createdAt: string;
}

export const mockDealerEnquiries: DealerEnquiry[] = [
  { id: 'de1', name: 'Vikram Sharma', company: 'Sharma Cycles', email: 'vikram@sharmacycles.in', phone: '9876543210', city: 'Pune', state: 'Maharashtra', message: 'I am interested in becoming an authorized dealer for Cosmic bicycles in Pune. We have a 2000 sqft showroom and an existing customer base.', status: 'new', notes: '', createdAt: '2026-05-20' },
  { id: 'de2', name: 'Anita Patel', company: 'Patel Sports', email: 'anita@patelsports.com', phone: '8765432109', city: 'Ahmedabad', state: 'Gujarat', message: 'We run a sports equipment store and would like to add Cosmic bicycles to our product line.', status: 'in_progress', notes: 'Called back, meeting scheduled for next week.', createdAt: '2026-05-15' },
  { id: 'de3', name: 'Ramesh Nair', company: 'Kerala Cycles', email: 'ramesh@keralacycles.com', phone: '7654321098', city: 'Kochi', state: 'Kerala', message: 'Looking to expand our portfolio with premium bicycle brands. Interested in dealership.', status: 'resolved', notes: 'Agreement signed. Onboarding complete.', createdAt: '2026-04-30' },
  { id: 'de4', name: 'Priya Singh', company: 'Singh Traders', email: 'priya@singhtraders.com', phone: '9543210987', city: 'Jaipur', state: 'Rajasthan', message: 'New business enquiry for dealership in Rajasthan region.', status: 'new', notes: '', createdAt: '2026-05-22' },
  { id: 'de5', name: 'Arjun Reddy', company: 'Reddy Sports Hub', email: 'arjun@reddysports.com', phone: '8432109876', city: 'Hyderabad', state: 'Telangana', message: 'Interested in distributorship for Telangana and Andhra Pradesh regions.', status: 'in_progress', notes: 'Documents under review.', createdAt: '2026-05-10' },
];

// Vacancies
export interface Vacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  experience: string;
  type: 'full_time' | 'part_time' | 'contract';
  description: string;
  requirements: string[];
  status: 'active' | 'closed' | 'draft';
  applicants: number;
  createdAt: string;
}

export const mockVacancies: Vacancy[] = [
  { id: 'v1', title: 'Senior Product Designer', department: 'Design', location: 'Mumbai', experience: '4–6 years', type: 'full_time', description: 'Lead product design for our bicycle lineup and accessories.', requirements: ['Industrial design degree', 'CAD proficiency', 'Cycling industry experience preferred'], status: 'active', applicants: 12, createdAt: '2026-04-01' },
  { id: 'v2', title: 'Sales Territory Manager', department: 'Sales', location: 'Delhi / NCR', experience: '3–5 years', type: 'full_time', description: 'Manage dealer network and drive sales in North India.', requirements: ['B2B sales experience', 'Bicycle or sports industry background', 'Own vehicle'], status: 'active', applicants: 8, createdAt: '2026-04-15' },
  { id: 'v3', title: 'Digital Marketing Executive', department: 'Marketing', location: 'Mumbai (Remote)', experience: '2–4 years', type: 'full_time', description: 'Drive digital campaigns across social, SEO, and email.', requirements: ['Meta Ads experience', 'Content creation skills', 'Analytics proficiency'], status: 'active', applicants: 21, createdAt: '2026-05-01' },
  { id: 'v4', title: 'Warehouse Executive', department: 'Operations', location: 'Pune', experience: '1–3 years', type: 'full_time', description: 'Oversee inventory, dispatch, and logistics operations.', requirements: ['Inventory management', 'ERP knowledge', 'Physical fitness'], status: 'closed', applicants: 5, createdAt: '2026-03-15' },
];

// Applications
export interface Application {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  coverLetter: string;
  status: 'new' | 'shortlisted' | 'interviewed' | 'rejected' | 'hired';
  notes: string;
  appliedAt: string;
}

export const mockApplications: Application[] = [
  { id: 'app1', vacancyId: 'v1', vacancyTitle: 'Senior Product Designer', name: 'Kavya Menon', email: 'kavya@email.com', phone: '9988776655', experience: '5 years', coverLetter: 'I have been designing bicycles for 5 years and am passionate about Cosmic\'s design language.', status: 'shortlisted', notes: 'Strong portfolio.', appliedAt: '2026-04-10' },
  { id: 'app2', vacancyId: 'v1', vacancyTitle: 'Senior Product Designer', name: 'Dev Kapoor', email: 'dev@email.com', phone: '9877665544', experience: '4 years', coverLetter: 'Experienced industrial designer looking for a new challenge.', status: 'new', notes: '', appliedAt: '2026-04-12' },
  { id: 'app3', vacancyId: 'v2', vacancyTitle: 'Sales Territory Manager', name: 'Sanjay Gupta', email: 'sanjay@email.com', phone: '9766554433', experience: '4 years', coverLetter: 'I have managed the north India territory for a leading sports brand.', status: 'interviewed', notes: 'Good communication. Follow up next week.', appliedAt: '2026-04-20' },
  { id: 'app4', vacancyId: 'v3', vacancyTitle: 'Digital Marketing Executive', name: 'Meera Iyer', email: 'meera@email.com', phone: '9655443322', experience: '3 years', coverLetter: 'Digital marketing professional with expertise in cycling and sports brands.', status: 'hired', notes: 'Joining date: June 1.', appliedAt: '2026-05-05' },
  { id: 'app5', vacancyId: 'v3', vacancyTitle: 'Digital Marketing Executive', name: 'Rohit Joshi', email: 'rohit@email.com', phone: '9544332211', experience: '2 years', coverLetter: 'Creative marketer with a passion for sports.', status: 'rejected', notes: 'Less experience required.', appliedAt: '2026-05-06' },
  { id: 'app6', vacancyId: 'v2', vacancyTitle: 'Sales Territory Manager', name: 'Pallavi Das', email: 'pallavi@email.com', phone: '9433221100', experience: '5 years', coverLetter: 'Proven track record in B2B sales across North India.', status: 'new', notes: '', appliedAt: '2026-05-08' },
];

// Dealers / Store Locator
export interface Dealer {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  type: 'dealer' | 'service_center' | 'flagship';
  status: 'active' | 'inactive';
}

export const mockDealers: Dealer[] = [
  { id: 'd1', name: 'Mumbai Flagship Store', address: 'Shop 12, Linking Road, Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', phone: '022-26441234', email: 'mumbai@cosmicbicycles.com', type: 'flagship', status: 'active' },
  { id: 'd2', name: 'Sharma Cycles Pune', address: '45 FC Road, Shivajinagar', city: 'Pune', state: 'Maharashtra', pincode: '411005', phone: '020-25561234', email: 'pune@sharmacycles.in', type: 'dealer', status: 'active' },
  { id: 'd3', name: 'Bengaluru Cycle World', address: '78 Indiranagar 100ft Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560038', phone: '080-41234567', email: 'blr@cycleworld.in', type: 'dealer', status: 'active' },
  { id: 'd4', name: 'Delhi Sports Hub', address: 'Plot 22, Connaught Place', city: 'New Delhi', state: 'Delhi', pincode: '110001', phone: '011-23456789', email: 'delhi@sportshub.com', type: 'dealer', status: 'inactive' },
  { id: 'd5', name: 'Chennai Cycle Service', address: '15 Anna Nagar East', city: 'Chennai', state: 'Tamil Nadu', pincode: '600102', phone: '044-26781234', email: 'chennai@cosmicbicycles.com', type: 'service_center', status: 'active' },
  { id: 'd6', name: 'Hyderabad Bikes Zone', address: 'Road No.3, Banjara Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500034', phone: '040-23456789', email: 'hyd@bikeszone.in', type: 'dealer', status: 'active' },
];

// SEO Pages
export interface SeoEntry {
  id: string;
  page: string;
  route: string;
  title: string;
  description: string;
  keywords: string;
  lastUpdated: string;
}

export const mockSeoEntries: SeoEntry[] = [
  { id: 'seo1', page: 'Home', route: '/', title: 'Cosmic Bikes — Sky Is The Limit', description: 'Cosmic crafts premium performance bicycles for road, mountain, gravel, and urban riding.', keywords: 'cosmic bicycles, premium bikes, road bike, mountain bike India', lastUpdated: '2026-05-01' },
  { id: 'seo2', page: 'About', route: '/about', title: 'About Cosmic Bicycles', description: 'Learn about Cosmic Bicycles, our story, mission, and the team behind every bike.', keywords: 'about cosmic, bicycle brand India, cosmic history', lastUpdated: '2026-04-15' },
  { id: 'seo3', page: 'Products', route: '/products', title: 'All Bikes — Cosmic Bicycles', description: 'Browse our complete range of road, mountain, gravel, urban, and kids bicycles.', keywords: 'buy cosmic bike, bicycle price India', lastUpdated: '2026-05-10' },
  { id: 'seo4', page: 'Collections — Road', route: '/collections/road', title: 'Road Bikes — Cosmic', description: 'High-performance road bicycles engineered for speed and precision.', keywords: 'road bike India, cosmic road bike, performance bicycle', lastUpdated: '2026-05-12' },
  { id: 'seo5', page: 'Accessories', route: '/accessories', title: 'Cycling Accessories — Cosmic', description: 'Shop helmets, bags, lights, and cycling gear from Cosmic.', keywords: 'cycling accessories India, cosmic accessories', lastUpdated: '2026-04-20' },
  { id: 'seo6', page: 'Spare Parts', route: '/spare-parts', title: 'Bicycle Spare Parts — Cosmic', description: 'Genuine spare parts for all Cosmic bicycle models.', keywords: 'bicycle spare parts India, cosmic spare parts', lastUpdated: '2026-04-18' },
  { id: 'seo7', page: 'Careers', route: '/careers', title: 'Careers at Cosmic Bicycles', description: 'Join the Cosmic team. View open positions and grow with us.', keywords: 'cosmic careers, jobs cycling industry', lastUpdated: '2026-03-30' },
  { id: 'seo8', page: 'Contact', route: '/contact', title: 'Contact Cosmic Bicycles', description: 'Get in touch with Cosmic Bicycles for enquiries, support, and dealer partnerships.', keywords: 'cosmic contact, bicycle support India', lastUpdated: '2026-03-25' },
  { id: 'seo9', page: 'Store Locator', route: '/store-locator', title: 'Find a Cosmic Dealer Near You', description: 'Locate authorized Cosmic dealers and service centers across India.', keywords: 'cosmic dealer locator, bike shop India', lastUpdated: '2026-04-05' },
];

// Media
export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: string;
  dimensions: string;
  uploadedAt: string;
  usedIn: string[];
}

export const mockMedia: MediaItem[] = [
  { id: 'm1', name: 'hero-apex-pro.jpg', url: 'https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg', type: 'image', size: '2.4 MB', dimensions: '1920×1080', uploadedAt: '2026-01-10', usedIn: ['Hero Section', 'Apex Pro Product'] },
  { id: 'm2', name: 'trail-x-action.jpg', url: 'https://images.pexels.com/photos/1266377/pexels-photo-1266377.jpeg', type: 'image', size: '1.8 MB', dimensions: '1600×900', uploadedAt: '2026-02-05', usedIn: ['Trail X Product'] },
  { id: 'm3', name: 'gravel-adventure.jpg', url: 'https://images.pexels.com/photos/2158963/pexels-photo-2158963.jpeg', type: 'image', size: '3.1 MB', dimensions: '1920×1200', uploadedAt: '2026-03-15', usedIn: ['Gravel One Product', 'Hero Slide 3'] },
  { id: 'm4', name: 'urban-glide.jpg', url: 'https://images.pexels.com/photos/1571939/pexels-photo-1571939.jpeg', type: 'image', size: '1.5 MB', dimensions: '1600×900', uploadedAt: '2026-03-20', usedIn: ['Urban Glide Product'] },
  { id: 'm5', name: 'kids-star.jpg', url: 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg', type: 'image', size: '1.2 MB', dimensions: '1200×800', uploadedAt: '2026-04-01', usedIn: ['Kids Star Product'] },
  { id: 'm6', name: 'banner-cta.jpg', url: 'https://images.pexels.com/photos/2158963/pexels-photo-2158963.jpeg', type: 'image', size: '2.8 MB', dimensions: '1920×600', uploadedAt: '2026-04-10', usedIn: ['CTA Banner'] },
];

// Site Settings
export interface SiteSettings {
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  socialLinks: { platform: string; url: string }[];
  footerCopyright: string;
  footerAbout: string;
  maintenanceMode: boolean;
}

export const mockSiteSettings: SiteSettings = {
  companyName: 'Cosmic Bicycles',
  tagline: 'Sky Is The Limit',
  email: 'info@cosmicbicycles.com',
  phone: '+91 98765 43210',
  address: 'Nandi Marketing, Mumbai, Maharashtra, India',
  socialLinks: [
    { platform: 'Instagram', url: 'https://instagram.com/cosmicbicycles' },
    { platform: 'Facebook', url: 'https://facebook.com/cosmicbicycles' },
    { platform: 'YouTube', url: 'https://youtube.com/cosmicbicycles' },
    { platform: 'Twitter', url: 'https://twitter.com/cosmicbicycles' },
  ],
  footerCopyright: '© 2026 Cosmic Bicycles. All rights reserved.',
  footerAbout: 'Crafting precision performance bicycles since 2008.',
  maintenanceMode: false,
};
