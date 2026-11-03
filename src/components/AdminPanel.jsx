import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderTree,
  Package, 
  ShoppingBag, 
  Building2, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Search, 
  DollarSign, 
  AlertCircle, 
  LogOut, 
  Upload, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Tag,
  Boxes,
  Menu,
  X,
  Store,
  UserCheck,
  ArrowLeft,
  Save,
  Eye,
  Check,
  CheckCircle2,
  Star,
  Sparkles,
  Image as ImageIcon,
  Layers,
  ListPlus,
  ShieldCheck,
  Percent,
  HelpCircle,
  ChevronDown,
  Clock,
  Truck,
  Printer
} from 'lucide-react';
import { 
  fetchCategoriesFromDb,
  saveCategoryToDb,
  deleteCategoryFromDb,
  fetchProductsFromDb,
  saveProductToDb,
  deleteProductFromDb,
  uploadProjectMedia
} from '../services/firebaseService';
import { fetchAllOrders, updateOrderStatus } from '../services/orderService';
import { listAccounts, setAccountStatus, fetchCertificate } from '../services/authService';
import ModernAdminDashboard from './admin/ModernAdminDashboard';
import OrderDetailsPage from './admin/OrderDetailsPage';

export default function AdminPanel({ onSignOut }) {
  const navigate = useNavigate();
  
  // Left Sidebar Active Tab: 'overview' | 'categories' | 'products' | 'product-editor' | 'retail-orders' | 'wholesale-orders' | 'customers'
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Real Database State (Loaded directly from DB / Firestore)
  const [categories, setCategories] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [retailOrders, setRetailOrders] = useState([]);
  const [wholesaleOrders, setWholesaleOrders] = useState([]);
  const [retailCustomers, setRetailCustomers] = useState([]);
  const [wholesaleCustomers, setWholesaleCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadErrors, setLoadErrors] = useState([]);
  const [accountActionId, setAccountActionId] = useState(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [customerSubTab, setCustomerSubTab] = useState('retail'); // 'retail' | 'wholesale'

  // Retail Orders Search & Filter States
  const [retailOrderSearch, setRetailOrderSearch] = useState('');
  const [retailStatusFilter, setRetailStatusFilter] = useState('all');
  const [selectedRetailOrder, setSelectedRetailOrder] = useState(null);

  // Wholesale Orders Search & Filter States
  const [wholesaleOrderSearch, setWholesaleOrderSearch] = useState('');
  const [wholesaleStatusFilter, setWholesaleStatusFilter] = useState('all');
  const [selectedWholesaleOrder, setSelectedWholesaleOrder] = useState(null);


  // Dedicated Full-Page Product Editor State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNewProductMode, setIsNewProductMode] = useState(false);
  const [editorSaveSuccess, setEditorSaveSuccess] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [newFlavorInput, setNewFlavorInput] = useState('');
  const [newGalleryInput, setNewGalleryInput] = useState('');

  // Category Form & Edit State
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    id: '',
    title: '',
    img: '/images/cat_snacks.jpg'
  });

  const categoryFileInputRef = useRef(null);
  const productMainFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);

  // Initial Data Load from Database
  const loadDatabaseData = async () => {
    setIsLoading(true);
    const errors = [];
    const [cats, prods, ordersData, customersData] = await Promise.allSettled([
      fetchCategoriesFromDb(),
      fetchProductsFromDb(),
      fetchAllOrders(),
      listAccounts()
    ]);
    if (cats.status === 'fulfilled') setCategories(cats.value);
    if (prods.status === 'fulfilled') setProductsList(prods.value);
    if (ordersData.status === 'fulfilled') {
      setRetailOrders(ordersData.value.retail || []);
      setWholesaleOrders(ordersData.value.wholesale || []);
    } else {
      errors.push(`Orders: ${ordersData.reason?.message || 'could not be loaded'}`);
    }
    if (customersData.status === 'fulfilled') {
      setRetailCustomers(customersData.value.retail || []);
      setWholesaleCustomers(customersData.value.wholesale || []);
    } else {
      errors.push(`Customers: ${customersData.reason?.message || 'could not be loaded'}`);
    }
    setLoadErrors(errors);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDatabaseData();
  }, []);

  // 1. Create or Edit Category Handlers
  const handleStartCreateCategory = () => {
    setIsEditingCategory(false);
    setNewCategory({ id: '', title: '', img: '/images/cat_snacks.jpg' });
    setIsAddCategoryOpen(true);
  };

  const handleStartEditCategory = (cat) => {
    setIsEditingCategory(true);
    setNewCategory({
      id: cat.id,
      title: cat.title || cat.name || '',
      img: cat.img || cat.image || '/images/cat_snacks.jpg'
    });
    setIsAddCategoryOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.title.trim()) return;
    const catId = newCategory.id || newCategory.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const saved = await saveCategoryToDb({
      id: catId,
      title: newCategory.title.trim(),
      name: newCategory.title.trim(),
      img: newCategory.img || '/images/cat_snacks.jpg',
      image: newCategory.img || '/images/cat_snacks.jpg'
    });
    setCategories(prev => {
      const idx = prev.findIndex(c => c.id === catId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
    setProductsList(prev => prev.map(p => p.categoryId === catId ? { ...p, categoryName: saved.title } : p));
    setIsAddCategoryOpen(false);
    setIsEditingCategory(false);
    setNewCategory({ id: '', title: '', img: '/images/cat_snacks.jpg' });
  };

  // Delete Category Handler
  const handleDeleteCategory = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete category "${title}"?`)) return;
    await deleteCategoryFromDb(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // 2. Start Adding Product (Dedicated Full Page - No Popup)
  const handleStartAddProduct = () => {
    setIsNewProductMode(true);
    setEditorSaveSuccess(false);
    setEditingProduct({
      id: `prod-${Date.now()}`,
      title: '',
      name: '',
      sku: '',
      barcode: '',
      unit: 'ea.',
      categoryId: categories[0]?.id || '',
      categoryName: categories[0]?.title || '',
      brand: '',
      origin: '🌍 Imported',
      netWeight: '',
      retailPrice: '',
      price: '',
      originalPrice: '',
      wholesalePrice: '',
      b2bPrice: '',
      caseQty: 1,
      moq: 1,
      stock: 100,
      inStock: true,
      featured: false,
      img: '/images/ruby_red_hero.jpg',
      image: '/images/ruby_red_hero.jpg',
      gallery: [],
      description: '',
      bullets: [],
      flavors: []
    });
    setActiveTab('product-editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Start Editing Product (Dedicated Full Page - No Popup)
  const handleStartEditProduct = (prod) => {
    setIsNewProductMode(false);
    setEditorSaveSuccess(false);
    const image = prod.img || prod.image || '/images/ruby_red_hero.jpg';

    setEditingProduct({
      ...prod,
      title: prod.title || prod.name || '',
      name: prod.title || prod.name || '',
      sku: prod.sku || '',
      barcode: prod.barcode || '',
      unit: prod.unit || 'ea.',
      categoryId: prod.categoryId || categories[0]?.id || '',
      categoryName: prod.categoryName || '',
      brand: prod.brand || prod.overview?.brand || '',
      origin: prod.origin || prod.overview?.origin || '🌍 Imported',
      netWeight: prod.netWeight || prod.overview?.netWeight || '',
      retailPrice: prod.retailPrice ?? prod.price ?? '',
      price: prod.retailPrice ?? prod.price ?? '',
      originalPrice: prod.originalPrice ?? '',
      wholesalePrice: prod.wholesalePrice ?? prod.b2bPrice ?? '',
      b2bPrice: prod.wholesalePrice ?? prod.b2bPrice ?? '',
      caseQty: prod.caseQty ?? 1,
      moq: prod.moq ?? 1,
      stock: prod.stock ?? prod.stockCount ?? 100,
      inStock: prod.inStock !== false,
      featured: prod.featured === true,
      img: image,
      image,
      gallery: Array.isArray(prod.gallery) && prod.gallery.length > 0 ? prod.gallery : [image],
      description: prod.description || prod.fullDesc || prod.shortDesc || '',
      bullets: Array.isArray(prod.bullets) ? prod.bullets : [],
      flavors: Array.isArray(prod.flavors) ? prod.flavors : []
    });
    setActiveTab('product-editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Save Product from Dedicated Page
  const handleSaveProductFromEditor = async (e) => {
    if (e) e.preventDefault();
    if (!editingProduct || !editingProduct.title) {
      alert('Please provide a product title');
      return;
    }
    if (!editingProduct.categoryId) {
      alert('Please choose a category');
      return;
    }
    setIsSavingProduct(true);
    try {
      const matchedCat = categories.find(c => c.id === editingProduct.categoryId);
      const prodPayload = {
        ...editingProduct,
        id: editingProduct.id || editingProduct.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
        categoryName: matchedCat ? (matchedCat.title || matchedCat.name) : editingProduct.categoryName,
        stockCount: editingProduct.stock
      };
      // saveProductToDb normalises prices, stock, gallery, overview and the rest

      const saved = await saveProductToDb(prodPayload);
      setProductsList(prev => [saved, ...prev.filter(p => p.id !== saved.id)]);
      setEditingProduct(saved);
      setIsNewProductMode(false);
      setEditorSaveSuccess(true);
      setTimeout(() => setEditorSaveSuccess(false), 4500);
    } catch (err) {
      console.error('Save product error:', err);
      alert('Failed to save product: ' + err.message);
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Add & Remove Flavor Helpers
  const handleAddFlavor = () => {
    if (!newFlavorInput.trim() || !editingProduct) return;
    setEditingProduct(prev => ({
      ...prev,
      flavors: [...(prev.flavors || []), newFlavorInput.trim()]
    }));
    setNewFlavorInput('');
  };

  const handleRemoveFlavor = (indexToRemove) => {
    setEditingProduct(prev => ({
      ...prev,
      flavors: (prev.flavors || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };



  // Add & Remove Gallery Images
  const handleAddGalleryImage = (url) => {
    if (!url || !editingProduct) return;
    setEditingProduct(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), url]
    }));
    setNewGalleryInput('');
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setEditingProduct(prev => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Delete Product Handler
  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete product "${title}"?`)) return;
    await deleteProductFromDb(id);
    setProductsList(prev => prev.filter(p => p.id !== id));
  };

  // Toggle Stock Handler
  const handleToggleStock = async (prod) => {
    const updated = { ...prod, inStock: !prod.inStock };
    await saveProductToDb(updated);
    setProductsList(prev => prev.map(p => p.id === prod.id ? updated : p));
  };

  // Update Order Status Handler
  const handleUpdateOrderStatus = async (orderId, newStatus, isWholesale = false) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      alert(`Could not update order ${orderId}: ${err.message}`);
      return false;
    }
    if (isWholesale) {
      setWholesaleOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } else {
      setRetailOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
    return true;
  };

  // Orders + spend per customer account (orders store the account id as userId)
  const customerOrderStats = React.useMemo(() => {
    const stats = new Map();
    [...retailOrders, ...wholesaleOrders].forEach(o => {
      if (!o.userId || o.status === 'Cancelled') return;
      const s = stats.get(o.userId) || { count: 0, spent: 0 };
      s.count += 1;
      s.spent += Number(o.total ?? o.amount) || 0;
      stats.set(o.userId, s);
    });
    return stats;
  }, [retailOrders, wholesaleOrders]);

  // Wholesale approval workflow
  const handleSetAccountStatus = async (account, status) => {
    const label = { Approved: 'approve', Rejected: 'reject', Suspended: 'suspend' }[status] || status;
    if (!window.confirm(`Are you sure you want to ${label} ${account.businessName || account.email}?`)) return;
    setAccountActionId(account.id);
    try {
      await setAccountStatus(account.id, status);
      setWholesaleCustomers(prev => prev.map(w => w.id === account.id ? { ...w, status } : w));
    } catch (err) {
      alert(`Could not update this account: ${err.message}`);
    } finally {
      setAccountActionId(null);
    }
  };

  const handleViewCertificate = async (account) => {
    const popup = window.open('', '_blank');
    try {
      const file = await fetchCertificate(account.id);
      if (!file?.dataUrl) throw new Error('No certificate file was found for this account.');
      const blob = await (await fetch(file.dataUrl)).blob();
      const url = URL.createObjectURL(blob);
      if (popup) popup.location.href = url;
      else window.open(url, '_blank');
    } catch (err) {
      if (popup) popup.close();
      alert(err.message);
    }
  };

  // Filtered Products for Products Tab
  const filteredProducts = productsList.filter(p => {
    const matchesSearch = [p.title || p.name, p.sku, p.barcode]
      .some(v => String(v || '').toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategoryFilter === 'all' || p.categoryId === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Retail Orders
  const filteredRetailOrders = retailOrders.filter(o => {
    const q = retailOrderSearch.toLowerCase();
    const matchesSearch = (o.id || '').toLowerCase().includes(q) ||
      (o.customer || '').toLowerCase().includes(q) ||
      (o.email || '').toLowerCase().includes(q) ||
      (o.itemsSummary || (typeof o.items === 'string' ? o.items : '')).toLowerCase().includes(q);
    const matchesStatus = retailStatusFilter === 'all' || o.status === retailStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRetailSales = retailOrders.reduce((acc, o) => acc + (Number(o.amount) || 0), 0);
  const retailProcessingCount = retailOrders.filter(o => o.status === 'Processing').length;
  const retailShippedCount = retailOrders.filter(o => o.status === 'Shipped').length;
  const retailDeliveredCount = retailOrders.filter(o => o.status === 'Delivered').length;

  // Filtered Wholesale Orders
  const filteredWholesaleOrders = wholesaleOrders.filter(w => {
    const q = wholesaleOrderSearch.toLowerCase();
    const matchesSearch = (w.id || '').toLowerCase().includes(q) ||
      (w.storeName || '').toLowerCase().includes(q) ||
      (w.contact || '').toLowerCase().includes(q) ||
      (w.email || '').toLowerCase().includes(q) ||
      (w.itemsSummary || (typeof w.items === 'string' ? w.items : '')).toLowerCase().includes(q) ||
      (w.cases || '').toLowerCase().includes(q);
    const matchesStatus = wholesaleStatusFilter === 'all' || w.status === wholesaleStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalWholesaleSales = wholesaleOrders.reduce((acc, w) => acc + (Number(w.amount) || 0), 0);
  const wholesaleProcessingCount = wholesaleOrders.filter(w => w.status === 'Processing').length;
  const wholesaleShippedCount = wholesaleOrders.filter(w => w.status === 'Shipped').length;
  const wholesaleDeliveredCount = wholesaleOrders.filter(w => w.status === 'Delivered').length;
  const totalWholesaleCasesCount = wholesaleOrders.reduce((acc, w) => {
    const match = (w.cases || '').match(/(\d+)\s*Cases/i);
    return acc + (match ? parseInt(match[1]) : 0);
  }, 0);

  return (
    <div className="h-[100dvh] overflow-hidden bg-slate-100/70 text-slate-900 flex selection:bg-[#d9232e] selection:text-white font-sans antialiased">
      
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR NAVIGATION (Light Theme, Clean & Professional)            */}
      {/* ========================================================================= */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] h-[100dvh] lg:h-screen overflow-y-auto bg-[#d9232e] border-r border-[#b91c1c] flex flex-col justify-between shrink-0 transition-transform duration-200 lg:static lg:translate-x-0 font-['Outfit',sans-serif]
        ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div>
          {/* Brand Header */}
          <div className="h-16 px-5 border-b border-white/15 flex items-center justify-between">
            <div 
              className="cursor-pointer flex items-center gap-2 transition-transform hover:scale-102 bg-white/95 px-3 py-1.5 rounded-xl shadow-xs"
              onClick={() => navigate('/')}
              title="Return to Storefront"
            >
              <img 
                src="/images/logo.png" 
                alt="Ruby Red" 
                className="h-8 w-auto object-contain"
              />
            </div>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              aria-label="Close admin menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Navigation Items */}
          <div className="p-3 space-y-1.5 pt-4">
            {/* TAB: Overview */}
            <button
              onClick={() => { setActiveTab('overview'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-[#d9232e] shadow-sm font-semibold tracking-tight'
                  : 'text-white/90 hover:bg-white/10 hover:text-white font-medium'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeTab === 'overview' ? 'text-[#d9232e]' : 'text-white/70'}`} />
              <span>Dashboard Overview</span>
            </button>

            {/* TAB: Categories */}
            <button
              onClick={() => { setActiveTab('categories'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-white text-[#d9232e] shadow-sm font-semibold tracking-tight'
                  : 'text-white/90 hover:bg-white/10 hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderTree className={`w-4 h-4 shrink-0 ${activeTab === 'categories' ? 'text-[#d9232e]' : 'text-white/70'}`} />
                <span>Categories</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'categories' ? 'bg-red-50 text-[#d9232e] font-semibold' : 'bg-white/20 text-white font-medium'
              }`}>
                {categories.length}
              </span>
            </button>

            {/* TAB: Products */}
            <button
              onClick={() => { setActiveTab('products'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                activeTab === 'products' || activeTab === 'product-editor'
                  ? 'bg-white text-[#d9232e] shadow-sm font-semibold tracking-tight'
                  : 'text-white/90 hover:bg-white/10 hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className={`w-4 h-4 shrink-0 ${activeTab === 'products' || activeTab === 'product-editor' ? 'text-[#d9232e]' : 'text-white/70'}`} />
                <span>Products</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'products' || activeTab === 'product-editor' ? 'bg-red-50 text-[#d9232e] font-semibold' : 'bg-white/20 text-white font-medium'
              }`}>
                {productsList.length}
              </span>
            </button>

            {/* Nested Sub-indicator when on dedicated product editor page */}
            {activeTab === 'product-editor' && (
              <div className="ml-5 pl-3 border-l-2 border-white/40 py-1.5 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-white">
                  <Edit className="w-3 h-3 shrink-0" />
                  <span className="truncate max-w-[150px]">
                    {isNewProductMode ? 'New Product' : (editingProduct?.title || 'Edit Product')}
                  </span>
                </div>
              </div>
            )}

            {/* TAB: Retail Orders */}
            <button
              onClick={() => { setActiveTab('retail-orders'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                activeTab === 'retail-orders'
                  ? 'bg-white text-[#d9232e] shadow-sm font-semibold tracking-tight'
                  : 'text-white/90 hover:bg-white/10 hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className={`w-4 h-4 shrink-0 ${activeTab === 'retail-orders' ? 'text-[#d9232e]' : 'text-white/70'}`} />
                <span>Retail Orders</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'retail-orders' ? 'bg-red-50 text-[#d9232e] font-semibold' : 'bg-white/20 text-white font-medium'
              }`}>
                {retailOrders.length}
              </span>
            </button>

            {/* TAB: Wholesale Orders */}
            <button
              onClick={() => { setActiveTab('wholesale-orders'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                activeTab === 'wholesale-orders'
                  ? 'bg-white text-[#d9232e] shadow-sm font-semibold tracking-tight'
                  : 'text-white/90 hover:bg-white/10 hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className={`w-4 h-4 shrink-0 ${activeTab === 'wholesale-orders' ? 'text-[#d9232e]' : 'text-white/70'}`} />
                <span>Wholesale Orders</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'wholesale-orders' ? 'bg-red-50 text-[#d9232e] font-semibold' : 'bg-white/20 text-white font-medium'
              }`}>
                {wholesaleOrders.length}
              </span>
            </button>

            {/* TAB: Customers */}
            <button
              onClick={() => { setActiveTab('customers'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-white text-[#d9232e] shadow-sm font-semibold tracking-tight'
                  : 'text-white/90 hover:bg-white/10 hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className={`w-4 h-4 shrink-0 ${activeTab === 'customers' ? 'text-[#d9232e]' : 'text-white/70'}`} />
                <span>Customers</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'customers' ? 'bg-red-50 text-[#d9232e] font-semibold' : 'bg-white/20 text-white font-medium'
              }`}>
                {retailCustomers.length + wholesaleCustomers.length}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Profile */}
        <div className="p-3 border-t border-white/15 bg-black/10">
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white text-[#d9232e] flex items-center justify-center font-semibold text-xs shrink-0 shadow-xs">
              SN
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">Salim NM</p>
              <p className="text-[10px] text-white/70 truncate font-normal">Super Admin • Houston, TX</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN ADMIN CONTENT WORKSPACE                                            */}
      {/* ========================================================================= */}
      <div className="flex-1 min-w-0 flex flex-col h-[100dvh] overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/90 h-16 px-3 sm:px-8 flex items-center justify-between gap-2 sticky top-0 z-30 shadow-2xs shrink-0">
          {activeTab === 'product-editor' ? (
            <>
              {/* Product Editor: Breadcrumb & Title */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  aria-label="Open admin menu"
                  className="lg:hidden p-2 -ml-1 rounded-xl text-slate-600 hover:bg-slate-100 shrink-0"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#d9232e] transition-colors cursor-pointer shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Products</span>
                </button>
                <span className="text-slate-300 hidden xs:inline">/</span>
                <span className="text-xs font-semibold text-slate-400 shrink-0 hidden xs:inline">
                  {isNewProductMode ? 'New' : 'Edit'}
                </span>
                <span className="text-slate-300 hidden sm:inline">/</span>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate max-w-[180px] sm:max-w-xs md:max-w-md hidden sm:block">
                  {isNewProductMode ? 'New Product' : (editingProduct?.title || 'Edit Product')}
                </h2>
                {editingProduct && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 hidden md:inline-block ${
                    editingProduct.inStock 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {editingProduct.inStock ? 'Live' : 'Sold Out'}
                  </span>
                )}
              </div>

              {/* Product Editor Actions */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="hidden sm:inline-block px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                {!isNewProductMode && editingProduct?.id && (
                  <>
                    <button
                      type="button"
                      onClick={async () => {
                        await handleDeleteProduct(editingProduct.id, editingProduct.title || editingProduct.name);
                        setActiveTab('products');
                      }}
                      className="p-2 sm:p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete Product"
                      aria-label="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => window.open(`/#/product/${editingProduct.id}`, '_blank')}
                      className="p-2 sm:p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                      title="View on Storefront"
                      aria-label="View on Storefront"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  disabled={isSavingProduct}
                  onClick={handleSaveProductFromEditor}
                  className="px-3 sm:px-4 py-2 bg-[#d9232e] hover:bg-[#b91c1c] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  {isSavingProduct ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{isNewProductMode ? 'Publish' : <>Save<span className="hidden sm:inline"> Changes</span></>}</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  aria-label="Open admin menu"
                  className="lg:hidden p-2 -ml-1 rounded-xl text-slate-600 hover:bg-slate-100 shrink-0"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-semibold font-['Outfit',sans-serif] tracking-tight text-[#d9232e] capitalize truncate">
                    {activeTab === 'overview' && 'Dashboard Overview'}
                    {activeTab === 'categories' && 'Categories'}
                    {activeTab === 'products' && 'Products'}
                    {activeTab === 'retail-orders' && (selectedRetailOrder ? `Retail Order #${selectedRetailOrder.id}` : 'Retail Orders')}
                    {activeTab === 'wholesale-orders' && (selectedWholesaleOrder ? `Wholesale Order #${selectedWholesaleOrder.id}` : 'Wholesale Orders')}
                    {activeTab === 'customers' && 'Customers'}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                {activeTab === 'categories' && (
                  <button
                    onClick={handleStartCreateCategory}
                    aria-label="Create Category"
                    className="p-2 sm:px-3.5 sm:py-1.5 bg-[#d9232e] hover:bg-[#b91c1c] active:scale-[0.99] text-white font-medium text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-xs cursor-pointer font-['Outfit',sans-serif] whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">Create Category</span>
                  </button>
                )}

                {activeTab === 'products' && (
                  <button
                    onClick={handleStartAddProduct}
                    aria-label="Add Product"
                    className="p-2 sm:px-3.5 sm:py-1.5 bg-[#d9232e] hover:bg-[#b91c1c] active:scale-[0.99] text-white font-medium text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-xs cursor-pointer font-['Outfit',sans-serif] whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">Add Product</span>
                  </button>
                )}

                {/* Storefront button */}
                <button
                  onClick={() => navigate('/')}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#d9232e] hover:bg-[#b91c1c] active:scale-[0.99] text-white text-xs font-medium font-['Outfit',sans-serif] tracking-tight transition-all flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                  title="Open Public Storefront"
                  aria-label="Open Public Storefront"
                >
                  <ExternalLink className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0 text-white/90" />
                  <span className="hidden sm:inline">Storefront</span>
                </button>

                {/* Sign Out button */}
                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#d9232e] hover:bg-[#b91c1c] active:scale-[0.99] text-white text-xs font-medium font-['Outfit',sans-serif] tracking-tight transition-all flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                    title="Sign Out of Admin Console"
                    aria-label="Sign Out of Admin Console"
                  >
                    <LogOut className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0 text-white/90" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                )}
              </div>
            </>
          )}
        </header>

        {/* Content Body */}
        <main className="flex-1 p-3 xs:p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-[1600px] w-full mx-auto">
          {loadErrors.length > 0 && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex flex-wrap items-center justify-between gap-2">
              <span>{loadErrors.join(' ')}</span>
              <button
                type="button"
                onClick={loadDatabaseData}
                className="px-3 py-1.5 rounded-lg bg-white border border-red-200 hover:bg-red-100 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          
          {/* ===================================================================== */}
          {/* ===================================================================== */}
          {/* TAB 1: OVERVIEW (Modern Interactive Infographic & Graph Dashboard)    */}
          {/* ===================================================================== */}
          {activeTab === 'overview' && (
            <ModernAdminDashboard 
              categories={categories}
              productsList={productsList}
              retailOrders={retailOrders}
              wholesaleOrders={wholesaleOrders}
              retailCustomers={retailCustomers}
              wholesaleCustomers={wholesaleCustomers}
              setActiveTab={setActiveTab}
              handleStartAddProduct={handleStartAddProduct}
              handleStartCreateCategory={handleStartCreateCategory}
              onSelectRetailOrder={(order) => {
                setSelectedRetailOrder(order);
                setActiveTab('retail-orders');
              }}
              onSelectWholesaleOrder={(order) => {
                setSelectedWholesaleOrder(order);
                setActiveTab('wholesale-orders');
              }}
            />
          )}

          {/* ===================================================================== */}
          {/* TAB 2: CATEGORIES (Create new categories: title and img as requested)  */}
          {/* ===================================================================== */}
          {activeTab === 'categories' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Categories Cards Grid - 5 Cards per row with full-cover images */}
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {categories.map((cat) => {
                  const categoryProductsCount = productsList.filter(p => p.categoryId === cat.id).length;
                  return (
                    <div 
                      key={cat.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative">
                        <img 
                          src={cat.img || cat.image || '/images/cat_snacks.jpg'} 
                          alt={cat.title || cat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-[10px] font-black text-white shadow-xs">
                          {categoryProductsCount} Products
                        </span>
                      </div>

                      <div className="p-3.5 space-y-2.5">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900 truncate" title={cat.title || cat.name}>
                            {cat.title || cat.name}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <button
                            onClick={() => {
                              setSelectedCategoryFilter(cat.id);
                              setActiveTab('products');
                            }}
                            className="text-xs font-bold text-[#d9232e] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <span>View Products</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStartEditCategory(cat)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Category Details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.title || cat.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 3: PRODUCTS (Separate Retail & Wholesale Pricing as requested)    */}
          {/* ===================================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Category Filter Pills & Search in a single line */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center gap-3">
                <div className="relative w-full md:w-64 lg:w-72 shrink-0">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products by title..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#d9232e]"
                  />
                </div>

                <div className="h-6 w-px bg-slate-200 hidden md:block shrink-0" />

                {/* Categories Filter Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 flex-1 min-w-0">
                  <button
                    onClick={() => setSelectedCategoryFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      selectedCategoryFilter === 'all'
                        ? 'bg-[#d9232e] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Categories ({productsList.length})
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategoryFilter(c.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                        selectedCategoryFilter === c.id
                          ? 'bg-[#d9232e] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {c.title || c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Table with SEPARATE Retail & Wholesale Pricing */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-center text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5 w-[35%] text-left">Product Title</th>
                        <th className="p-3.5 w-[14%]">Category</th>
                        <th className="p-3.5 w-[14%] text-blue-800 bg-blue-50/50">Retail Price ($)</th>
                        <th className="p-3.5 w-[14%] text-amber-900 bg-amber-50/50">Wholesale Price ($)</th>
                        <th className="p-3.5 w-[14%]">Stock Status</th>
                        <th className="p-3.5 w-[9%]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                          <td 
                            className="p-3.5 text-left cursor-pointer"
                            onClick={() => handleStartEditProduct(p)}
                            title="Click to edit full product details"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={p.img || p.image}
                                alt={p.title || p.name}
                                className="w-10 h-10 object-contain rounded-lg border border-slate-100 bg-slate-50 shrink-0 hover:scale-105 transition-transform"
                              />
                              <div>
                                <p className="font-bold text-slate-900 hover:text-[#d9232e] transition-colors">{p.title || p.name}</p>
                                <p className="text-[10px] text-slate-400">{[p.sku && `SKU ${p.sku}`, p.netWeight, p.origin].filter(Boolean).join(' • ')} • Stock: {p.stock ?? p.stockCount ?? 0}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 text-center">
                            <span className="capitalize px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                              {p.categoryName || p.categoryId}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold text-blue-900 bg-blue-50/20 font-mono text-sm text-center">
                            ${(parseFloat(p.retailPrice || p.price || 0)).toFixed(2)}
                          </td>
                          <td className="p-3.5 font-bold text-amber-900 bg-amber-50/20 font-mono text-sm text-center">
                            ${(parseFloat(p.wholesalePrice || p.b2bPrice || 0)).toFixed(2)}
                          </td>
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => handleToggleStock(p)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                p.inStock
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                              }`}
                            >
                              {p.inStock ? 'In Stock (Live)' : 'Sold Out'}
                            </button>
                          </td>
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => handleStartEditProduct(p)}
                              className="p-2 text-slate-400 hover:text-[#d9232e] hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                              title="Edit Product Details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* DEDICATED FULL-PAGE PRODUCT DETAILS EDITOR (NO POPUP - FULL PAGE)     */}
          {/* ===================================================================== */}
          {activeTab === 'product-editor' && editingProduct && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Success Feedback Alert */}
              {editorSaveSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800 text-xs font-bold shadow-2xs animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Product saved successfully! All fields and separate pricing are synchronized with the live store.</span>
                  </div>
                  <button
                    onClick={() => setEditorSaveSuccess(false)}
                    className="text-emerald-600 hover:text-emerald-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* FORM GRID SECTIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT 8 COLS: Main Content Cards */}
                <div className="lg:col-span-8 space-y-5">

                  {/* CARD 1: Core Product Information */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-[#d9232e] flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#d9232e]" />
                        <span>Product Details</span>
                      </h3>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1.5">
                          Title <span className="text-[#d9232e]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Calbee Hot & Spicy Potato Chips 80 GM"
                          value={editingProduct.title || ''}
                          onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value, name: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1.5">
                            Category <span className="text-[#d9232e]">*</span>
                          </label>
                          <select
                            value={editingProduct.categoryId}
                            onChange={e => {
                              const selCat = categories.find(c => c.id === e.target.value);
                              setEditingProduct({
                                ...editingProduct,
                                categoryId: e.target.value,
                                categoryName: selCat ? (selCat.title || selCat.name) : 'Exotic Snacks'
                              });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-slate-900 cursor-pointer"
                          >
                            {categories.map(c => (
                              <option key={c.id} value={c.id}>
                                {c.title || c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1.5">
                            Brand
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Calbee"
                            value={editingProduct.brand || ''}
                            onChange={e => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1.5">
                            Origin
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Japan"
                            value={editingProduct.origin || ''}
                            onChange={e => setEditingProduct({ ...editingProduct, origin: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1.5">
                            Net Weight / Size
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 80 g"
                            value={editingProduct.netWeight || ''}
                            onChange={e => setEditingProduct({ ...editingProduct, netWeight: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1.5">
                            SKU / Product ID
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 290878"
                            value={editingProduct.sku || ''}
                            onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1.5">
                            Barcode (UPC / EAN)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 4901330507935"
                            value={editingProduct.barcode || ''}
                            onChange={e => setEditingProduct({ ...editingProduct, barcode: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1.5">
                          Description
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Describe the product taste, ingredients, and key highlights..."
                          value={editingProduct.description || ''}
                          onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900 leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: Visual Media & Gallery */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#d9232e] flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#d9232e]" />
                        <span>Media & Images</span>
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        {1 + (editingProduct.gallery?.length || 0)} image{(1 + (editingProduct.gallery?.length || 0)) > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="space-y-4 text-xs">
                      {/* Main Image */}
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1.5">
                          Primary Image <span className="text-[#d9232e]">*</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Image URL or upload a file..."
                            value={editingProduct.img || editingProduct.image || ''}
                            onChange={e => setEditingProduct({ ...editingProduct, img: e.target.value, image: e.target.value })}
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-slate-900"
                          />
                          <input
                            type="file"
                            ref={productMainFileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const res = await uploadProjectMedia(file);
                                setEditingProduct(prev => ({ ...prev, img: res.url, image: res.url }));
                              } catch (err) {
                                alert(err.message);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => productMainFileInputRef.current?.click()}
                            className="shrink-0 whitespace-nowrap px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1.5 transition-colors"
                          >
                            <Upload className="w-3.5 h-3.5 text-slate-600" />
                            <span>Upload</span>
                          </button>
                        </div>

                        {(editingProduct.img || editingProduct.image) && (
                          <div className="mt-2.5 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                              <img
                                src={editingProduct.img || editingProduct.image}
                                alt="Main Preview"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-slate-800 text-[11px]">Primary Storefront Image</p>
                              <p className="text-[10px] text-slate-400 font-mono truncate">{editingProduct.img || editingProduct.image}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Additional Gallery Thumbnails */}
                      <div className="pt-2 border-t border-slate-100">
                        <label className="block text-slate-700 font-semibold mb-2">
                          Additional Gallery Photos
                        </label>

                        {/* Thumbnails list */}
                        {editingProduct.gallery && editingProduct.gallery.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mb-3">
                            {editingProduct.gallery.map((gImg, gIdx) => (
                              <div key={gIdx} className="relative group bg-slate-50 border border-slate-200 rounded-xl p-1 aspect-square flex items-center justify-center overflow-hidden">
                                <img src={gImg} alt={`Thumbnail ${gIdx + 1}`} className="w-full h-full object-contain" />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGalleryImage(gIdx)}
                                  className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                                  title="Remove image"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add photo URL..."
                            value={newGalleryInput}
                            onChange={e => setNewGalleryInput(e.target.value)}
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-slate-900"
                          />
                          <input
                            type="file"
                            ref={galleryFileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const res = await uploadProjectMedia(file);
                                handleAddGalleryImage(res.url);
                              } catch (err) {
                                alert(err.message);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => galleryFileInputRef.current?.click()}
                            className="shrink-0 whitespace-nowrap px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1.5 transition-colors"
                          >
                            <Upload className="w-3.5 h-3.5 text-slate-600" />
                            <span>Upload</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddGalleryImage(newGalleryInput)}
                            className="shrink-0 px-3.5 py-2 bg-slate-900 hover:bg-black text-white font-semibold rounded-xl transition-colors cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: Flavors / Varieties */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#d9232e] flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#d9232e]" />
                        <span>Flavors & Varieties</span>
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        {editingProduct.flavors?.length || 0} option{(editingProduct.flavors?.length || 0) === 1 ? '' : 's'}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* Flavors Pill List */}
                      <div className="flex flex-wrap gap-2 min-h-7 items-center">
                        {(editingProduct.flavors || []).map((flavor, fIdx) => (
                          <div 
                            key={fIdx}
                            className="bg-slate-100 text-slate-800 font-semibold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-slate-200"
                          >
                            <span>{flavor}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFlavor(fIdx)}
                              className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Remove Flavor"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {(!editingProduct.flavors || editingProduct.flavors.length === 0) && (
                          <span className="text-slate-400 text-xs">No flavor varieties configured.</span>
                        )}
                      </div>

                      {/* Add Flavor Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Extra Fiery Hot, Truffle Herb..."
                          value={newFlavorInput}
                          onChange={e => setNewFlavorInput(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddFlavor(); } }}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                        <button
                          type="button"
                          onClick={handleAddFlavor}
                          className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT 4 COLS: Pricing & Inventory */}
                <div className="lg:col-span-4 space-y-5">

                  {/* PRICING CARD */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-[#d9232e] flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#d9232e]" />
                        <span>Pricing Structure</span>
                      </h3>
                    </div>

                    <div className="space-y-4 text-xs">
                      {/* Retail Pricing */}
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-slate-800 font-bold text-xs">
                            Retail Price ($) <span className="text-[#d9232e]">*</span>
                          </label>
                          <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            Single Unit
                          </span>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">$</span>
                          <input
                            type="number"
                            step="0.01"
                            required
                            placeholder="0.00"
                            value={editingProduct.retailPrice}
                            onChange={e => setEditingProduct({ ...editingProduct, retailPrice: e.target.value, price: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-2 text-slate-900 font-mono font-bold text-base focus:outline-none focus:border-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-500 font-medium mb-1 text-[11px]">
                            Regular / Compare-at Price ($)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">$</span>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={editingProduct.originalPrice}
                              onChange={e => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 text-slate-700 font-mono text-xs focus:outline-none focus:border-slate-900"
                            />
                          </div>
                        </div>

                        {editingProduct.originalPrice && editingProduct.retailPrice && (
                          parseFloat(editingProduct.originalPrice) > parseFloat(editingProduct.retailPrice) && (
                            <div className="text-[11px] text-emerald-700 font-semibold flex items-center justify-between pt-0.5">
                              <span>Customer saves:</span>
                              <span className="font-mono font-bold">
                                ${(parseFloat(editingProduct.originalPrice) - parseFloat(editingProduct.retailPrice)).toFixed(2)} ({Math.round(((parseFloat(editingProduct.originalPrice) - parseFloat(editingProduct.retailPrice)) / parseFloat(editingProduct.originalPrice)) * 100)}% off)
                              </span>
                            </div>
                          )
                        )}
                      </div>

                      {/* Wholesale Pricing */}
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-slate-800 font-bold text-xs">
                            Wholesale Unit Rate ($) <span className="text-[#d9232e]">*</span>
                          </label>
                          <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            B2B Bulk
                          </span>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">$</span>
                          <input
                            type="number"
                            step="0.01"
                            required
                            placeholder="0.00"
                            value={editingProduct.wholesalePrice}
                            onChange={e => setEditingProduct({ ...editingProduct, wholesalePrice: e.target.value, b2bPrice: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-2 text-slate-900 font-mono font-bold text-base focus:outline-none focus:border-slate-900"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-slate-500 font-medium mb-1 text-[11px]">Units / Case</label>
                            <input
                              type="number"
                              value={editingProduct.caseQty}
                              onChange={e => setEditingProduct({ ...editingProduct, caseQty: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-mono font-semibold focus:outline-none focus:border-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-medium mb-1 text-[11px]">Min. Order (Cases)</label>
                            <input
                              type="number"
                              value={editingProduct.moq || 1}
                              onChange={e => setEditingProduct({ ...editingProduct, moq: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-mono font-semibold focus:outline-none focus:border-slate-900"
                            />
                          </div>
                        </div>

                        {editingProduct.wholesalePrice && editingProduct.caseQty && (
                          <div className="text-[11px] text-slate-600 font-medium flex justify-between pt-0.5 border-t border-slate-200/60">
                            <span>Case Total:</span>
                            <span className="font-mono font-bold text-slate-900">
                              ${(parseFloat(editingProduct.wholesalePrice || 0) * parseInt(editingProduct.caseQty || 24)).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* INVENTORY & STATUS CARD */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-[#d9232e] flex items-center gap-2">
                        <Boxes className="w-4 h-4 text-[#d9232e]" />
                        <span>Inventory & Visibility</span>
                      </h3>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Availability Status</label>
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, inStock: !editingProduct.inStock })}
                          className={`w-full py-2 px-3 rounded-xl font-bold text-xs cursor-pointer border transition-colors flex items-center justify-center gap-2 ${
                            editingProduct.inStock
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${editingProduct.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span>{editingProduct.inStock ? 'In Stock (Visible on Store)' : 'Sold Out (Hidden/Badge)'}</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Home Page</label>
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, featured: !editingProduct.featured })}
                          className={`w-full py-2 px-3 rounded-xl font-bold text-xs cursor-pointer border transition-colors flex items-center justify-center gap-2 ${
                            editingProduct.featured
                              ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${editingProduct.featured ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                          <span>{editingProduct.featured ? 'Featured on Home Page' : 'Not Featured'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Stock Quantity</label>
                          <input
                            type="number"
                            min="0"
                            value={editingProduct.stock ?? editingProduct.stockCount ?? ''}
                            onChange={e => setEditingProduct({ ...editingProduct, stock: e.target.value, stockCount: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-semibold focus:outline-none focus:border-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>Rating</span>
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="1"
                            max="5"
                            placeholder="None"
                            value={editingProduct.rating ?? ''}
                            onChange={e => setEditingProduct({ ...editingProduct, rating: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-semibold focus:outline-none focus:border-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 4: RETAIL ORDERS SUBTAB                                           */}
          {/* ===================================================================== */}
          {activeTab === 'retail-orders' && (
            selectedRetailOrder ? (
              <OrderDetailsPage 
                order={selectedRetailOrder}
                orderType="retail"
                onBack={() => setSelectedRetailOrder(null)}
                onUpdateStatus={handleUpdateOrderStatus}
              />
            ) : (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* 1. Operational KPI Metric Cards (No duplicated title banner) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-start justify-between gap-2 text-slate-500 text-xs font-semibold">
                    <span className="min-w-0">Retail Revenue</span>
                    <div className="p-2 shrink-0 rounded-xl bg-emerald-50 text-emerald-600">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-lg xs:text-xl sm:text-2xl font-black break-all text-slate-900 font-mono">${totalRetailSales.toFixed(2)}</p>
                  <p className="text-[11px] text-slate-400 font-medium leading-snug">{retailOrders.length} customer orders placed</p>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-start justify-between gap-2 text-slate-500 text-xs font-semibold">
                    <span className="min-w-0">Processing</span>
                    <div className="p-2 shrink-0 rounded-xl bg-amber-50 text-amber-600">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-lg xs:text-xl sm:text-2xl font-black break-all text-amber-600 font-mono">{retailProcessingCount}</p>
                  <p className="text-[11px] text-slate-400 font-medium leading-snug">Needs packaging & dispatch</p>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-start justify-between gap-2 text-slate-500 text-xs font-semibold">
                    <span className="min-w-0">In Transit</span>
                    <div className="p-2 shrink-0 rounded-xl bg-blue-50 text-blue-600">
                      <Truck className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-lg xs:text-xl sm:text-2xl font-black break-all text-blue-600 font-mono">{retailShippedCount}</p>
                  <p className="text-[11px] text-slate-400 font-medium leading-snug">Shipped with courier</p>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-start justify-between gap-2 text-slate-500 text-xs font-semibold">
                    <span className="min-w-0">Delivered</span>
                    <div className="p-2 shrink-0 rounded-xl bg-emerald-50 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-lg xs:text-xl sm:text-2xl font-black break-all text-emerald-600 font-mono">{retailDeliveredCount}</p>
                  <p className="text-[11px] text-slate-400 font-medium leading-snug">Successfully completed</p>
                </div>
              </div>

              {/* 2. Search & Status Filter Bar */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by order ID, shopper, or items..."
                    value={retailOrderSearch}
                    onChange={e => setRetailOrderSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#d9232e]"
                  />
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5">
                  <button
                    onClick={() => setRetailStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      retailStatusFilter === 'all'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All ({retailOrders.length})
                  </button>
                  <button
                    onClick={() => setRetailStatusFilter('Processing')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      retailStatusFilter === 'Processing'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    Processing ({retailProcessingCount})
                  </button>
                  <button
                    onClick={() => setRetailStatusFilter('Shipped')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      retailStatusFilter === 'Shipped'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    Shipped ({retailShippedCount})
                  </button>
                  <button
                    onClick={() => setRetailStatusFilter('Delivered')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      retailStatusFilter === 'Delivered'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    Delivered ({retailDeliveredCount})
                  </button>
                </div>
              </div>

              {/* 3. Orders Table (Clean & Non-Redundant: Single Status Dropdown Badge + Actions) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Order ID</th>
                        <th className="p-3.5">Customer</th>
                        <th className="p-3.5">Items Ordered</th>
                        <th className="p-3.5">Total Amount</th>
                        <th className="p-3.5">Fulfillment Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRetailOrders.map(o => (
                        <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 font-mono">
                            <span className="font-bold text-slate-900">{o.id}</span>
                            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                              {o.date || '—'}
                            </p>
                          </td>
                          <td className="p-3.5">
                            <p className="font-bold text-slate-900">{o.customer}</p>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">{o.email || o.phone || '—'}</p>
                          </td>
                          <td className="p-3.5 text-slate-700 max-w-xs">
                            <span className="line-clamp-2 leading-relaxed">{o.itemsSummary || (typeof o.items === 'string' ? o.items : '')}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-slate-900 font-mono text-sm">${Number(o.amount).toFixed(2)}</span>
                            <p className="text-[10px] text-slate-500 mt-0.5">{o.deliveryMethod || ''}{o.paymentMethod ? ` • ${o.paymentMethod}` : ''}</p>
                          </td>
                          {/* UNIFIED SINGLE STATUS SELECTOR: No redundant column */}
                          <td className="p-3.5">
                            <div className="relative inline-block">
                              <select
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value, false)}
                                className={`appearance-none font-bold text-xs pl-3 pr-7 py-1.5 rounded-xl border cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                  o.status === 'Delivered'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-400'
                                    : o.status === 'Shipped'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-400'
                                    : 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-400'
                                }`}
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                              <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                            </div>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedRetailOrder(o)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>Details</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredRetailOrders.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                            No retail orders match your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
            )
          )}

          {/* ===================================================================== */}
          {/* TAB 5: WHOLESALE ORDERS SUBTAB                                        */}
          {/* ===================================================================== */}
          {activeTab === 'wholesale-orders' && (
            selectedWholesaleOrder ? (
              <OrderDetailsPage 
                order={selectedWholesaleOrder}
                orderType="wholesale"
                onBack={() => setSelectedWholesaleOrder(null)}
                onUpdateStatus={handleUpdateOrderStatus}
              />
            ) : (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* 1. Operational B2B KPI Metric Cards (No duplicated title banner) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-start justify-between gap-2 text-slate-500 text-xs font-semibold">
                    <span className="min-w-0">Wholesale Revenue</span>
                    <div className="p-2 shrink-0 rounded-xl bg-amber-50 text-amber-600">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-lg xs:text-xl sm:text-2xl font-black break-all text-slate-900 font-mono">${totalWholesaleSales.toFixed(2)}</p>
                  <p className="text-[11px] text-slate-400 font-medium leading-snug">{wholesaleOrders.length} B2B accounts active</p>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-start justify-between gap-2 text-slate-500 text-xs font-semibold">
                    <span className="min-w-0">Total Cases Volume</span>
                    <div className="p-2 shrink-0 rounded-xl bg-amber-50 text-amber-600">
                      <Boxes className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-lg xs:text-xl sm:text-2xl font-black break-all text-amber-600 font-mono">{totalWholesaleCasesCount} Cases</p>
                  <p className="text-[11px] text-slate-400 font-medium leading-snug">Bulk factory cartons ordered</p>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-start justify-between gap-2 text-slate-500 text-xs font-semibold">
                    <span className="min-w-0">Processing Orders</span>
                    <div className="p-2 shrink-0 rounded-xl bg-amber-50 text-amber-600">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-lg xs:text-xl sm:text-2xl font-black break-all text-amber-600 font-mono">{wholesaleProcessingCount}</p>
                  <p className="text-[11px] text-slate-400 font-medium leading-snug">Awaiting warehouse palletizing</p>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-start justify-between gap-2 text-slate-500 text-xs font-semibold">
                    <span className="min-w-0">Dispatched / Delivered</span>
                    <div className="p-2 shrink-0 rounded-xl bg-blue-50 text-blue-600">
                      <Truck className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-lg xs:text-xl sm:text-2xl font-black break-all text-blue-600 font-mono">{wholesaleShippedCount + wholesaleDeliveredCount}</p>
                  <p className="text-[11px] text-slate-400 font-medium leading-snug">In transit & delivered</p>
                </div>
              </div>

              {/* 2. Search & Status Filter Bar */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by Order Ref, store, contact, or cases..."
                    value={wholesaleOrderSearch}
                    onChange={e => setWholesaleOrderSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#d9232e]"
                  />
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5">
                  <button
                    onClick={() => setWholesaleStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      wholesaleStatusFilter === 'all'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All ({wholesaleOrders.length})
                  </button>
                  <button
                    onClick={() => setWholesaleStatusFilter('Processing')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      wholesaleStatusFilter === 'Processing'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    Processing ({wholesaleProcessingCount})
                  </button>
                  <button
                    onClick={() => setWholesaleStatusFilter('Shipped')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      wholesaleStatusFilter === 'Shipped'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    Shipped ({wholesaleShippedCount})
                  </button>
                  <button
                    onClick={() => setWholesaleStatusFilter('Delivered')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      wholesaleStatusFilter === 'Delivered'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    Delivered ({wholesaleDeliveredCount})
                  </button>
                </div>
              </div>

              {/* 3. Wholesale Orders Table (Clean & Non-Redundant: Single Status Dropdown Badge + Actions) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Order Ref</th>
                        <th className="p-3.5">Store / Wholesaler</th>
                        <th className="p-3.5">Volume (Cases)</th>
                        <th className="p-3.5">Items Breakdown</th>
                        <th className="p-3.5">Wholesale Total</th>
                        <th className="p-3.5">Fulfillment Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredWholesaleOrders.map(w => (
                        <tr key={w.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 font-mono">
                            <span className="font-bold text-slate-900">{w.id}</span>
                            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                              {w.date || '—'}
                            </p>
                          </td>
                          <td className="p-3.5">
                            <p className="font-bold text-slate-900">{w.storeName}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Contact: <span className="font-semibold text-slate-700">{w.contact}</span> • {w.phone}
                            </p>
                          </td>
                          <td className="p-3.5">
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold font-mono text-xs border border-amber-200">
                              {w.cases}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-700 max-w-xs">
                            <span className="line-clamp-2 leading-relaxed">{w.itemsSummary || (typeof w.items === 'string' ? w.items : '')}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-slate-900 font-mono text-sm">${Number(w.amount).toFixed(2)}</span>
                            <p className="text-[10px] text-slate-500 mt-0.5">{w.deliveryMethod || ''}{w.paymentMethod ? ` • ${w.paymentMethod}` : ''}</p>
                          </td>
                          {/* UNIFIED SINGLE STATUS SELECTOR: No redundant column */}
                          <td className="p-3.5">
                            <div className="relative inline-block">
                              <select
                                value={w.status}
                                onChange={(e) => handleUpdateOrderStatus(w.id, e.target.value, true)}
                                className={`appearance-none font-bold text-xs pl-3 pr-7 py-1.5 rounded-xl border cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                  w.status === 'Delivered'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-400'
                                    : w.status === 'Shipped'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-400'
                                    : 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-400'
                                }`}
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                              <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                            </div>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedWholesaleOrder(w)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>Details</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredWholesaleOrders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                            No wholesale orders match your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
            )
          )}

          {/* ===================================================================== */}
          {/* TAB 6: CUSTOMERS (Retail Customers and Wholesale Customers)           */}
          {/* ===================================================================== */}
          {activeTab === 'customers' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Customer View Switcher */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCustomerSubTab('retail')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      customerSubTab === 'retail'
                        ? 'bg-[#d9232e] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Retail Customers ({retailCustomers.length})
                  </button>
                  <button
                    onClick={() => setCustomerSubTab('wholesale')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      customerSubTab === 'wholesale'
                        ? 'bg-[#d9232e] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Wholesale Customers ({wholesaleCustomers.length})
                  </button>
                </div>
                <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
                  {customerSubTab === 'wholesale'
                    ? `${wholesaleCustomers.filter(w => w.status === 'Pending').length} awaiting approval`
                    : 'Registered shopper accounts'}
                </span>
              </div>

              {/* RETAIL CUSTOMERS TABLE */}
              {customerSubTab === 'retail' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px] text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3.5">Customer Name</th>
                          <th className="p-3.5">Email</th>
                          <th className="p-3.5">Phone</th>
                          <th className="p-3.5">City / Location</th>
                          <th className="p-3.5">Age Verified (21+)</th>
                          <th className="p-3.5">Orders Count</th>
                          <th className="p-3.5 font-bold">Total Spent</th>
                          <th className="p-3.5 text-right">Joined Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {retailCustomers.length === 0 && (
                          <tr><td colSpan={8} className="p-6 text-center text-slate-400">No retail customers yet.</td></tr>
                        )}
                        {retailCustomers.map((c, i) => {
                          const stats = customerOrderStats.get(c.id) || { count: 0, spent: 0 };
                          return (
                          <tr key={c.id || i} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-3.5 font-bold text-slate-900">{c.name || c.displayName}</td>
                            <td className="p-3.5 text-slate-700">{c.email || '—'}</td>
                            <td className="p-3.5 text-slate-500 whitespace-nowrap">{c.phone || '—'}</td>
                            <td className="p-3.5 text-slate-600">{typeof c.address === 'string' && c.address ? c.address : '—'}</td>
                            <td className="p-3.5">
                              {c.isAgeVerified ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Confirmed 21+</span>
                                </span>
                              ) : (
                                <span className="text-[11px] font-semibold text-slate-400">Not confirmed</span>
                              )}
                            </td>
                            <td className="p-3.5 font-bold text-slate-800">{stats.count} {stats.count === 1 ? 'Order' : 'Orders'}</td>
                            <td className="p-3.5 font-bold text-blue-900 font-mono">${stats.spent.toFixed(2)}</td>
                            <td className="p-3.5 text-right text-slate-400 whitespace-nowrap">{c.joinedDate || (c.createdAt || '').slice(0, 10) || '—'}</td>
                          </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* WHOLESALE CUSTOMERS TABLE (Auto-Active, No Approval Gate) */}
              {customerSubTab === 'wholesale' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px] text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3.5">Business & Store Type</th>
                          <th className="p-3.5">Primary Buyer Contact</th>
                          <th className="p-3.5">Email & Phone</th>
                          <th className="p-3.5">Texas Resale Tax ID</th>
                          <th className="p-3.5">Certificate</th>
                          <th className="p-3.5">Orders</th>
                          <th className="p-3.5 text-right">Account Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {wholesaleCustomers.length === 0 && (
                          <tr><td colSpan={7} className="p-6 text-center text-slate-400">No wholesale applications yet.</td></tr>
                        )}
                        {wholesaleCustomers.map((w, i) => {
                          const stats = customerOrderStats.get(w.id) || { count: 0, spent: 0 };
                          const busy = accountActionId === w.id;
                          const statusStyle = {
                            Approved: 'text-emerald-700 bg-emerald-50 border-emerald-200',
                            Pending: 'text-amber-800 bg-amber-50 border-amber-200',
                            Rejected: 'text-rose-700 bg-rose-50 border-rose-200',
                            Suspended: 'text-slate-700 bg-slate-100 border-slate-200'
                          }[w.status] || 'text-amber-800 bg-amber-50 border-amber-200';
                          return (
                          <tr key={w.id || i} className="hover:bg-slate-50/70 transition-colors align-top">
                            <td className="p-3.5">
                              <p className="font-bold text-slate-900">{w.businessName || w.dba || '—'}</p>
                              <p className="text-[11px] text-amber-700 font-semibold">{w.storeType || ''}</p>
                              {w.monthlyVolume && <p className="text-[11px] text-slate-500">{w.monthlyVolume}</p>}
                            </td>
                            <td className="p-3.5 font-semibold text-slate-900">{w.contactName || w.name || '—'}</td>
                            <td className="p-3.5 text-[11px] text-slate-500">
                              <p>{w.email}</p>
                              <p>{w.phone}</p>
                            </td>
                            <td className="p-3.5 font-mono font-bold text-slate-800">{w.taxId || '—'}</td>
                            <td className="p-3.5">
                              {w.documents && w.documents.length > 0 && !w.documentsUploadFailed ? (
                                <button
                                  type="button"
                                  onClick={() => handleViewCertificate(w)}
                                  className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
                                >
                                  View file
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-400">{w.documentsUploadFailed ? 'Upload failed' : 'Not provided'}</span>
                              )}
                            </td>
                            <td className="p-3.5 font-bold text-slate-700 whitespace-nowrap">
                              {stats.count} • ${stats.spent.toFixed(2)}
                            </td>
                            <td className="p-3.5 text-right">
                              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusStyle}`}>
                                {w.status || 'Pending'}
                              </span>
                              <div className="mt-2 flex justify-end gap-1.5">
                                {w.status !== 'Approved' && (
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => handleSetAccountStatus(w, 'Approved')}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer disabled:opacity-50"
                                  >
                                    Approve
                                  </button>
                                )}
                                {w.status === 'Pending' && (
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => handleSetAccountStatus(w, 'Rejected')}
                                    className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold cursor-pointer disabled:opacity-50"
                                  >
                                    Reject
                                  </button>
                                )}
                                {w.status === 'Approved' && (
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => handleSetAccountStatus(w, 'Suspended')}
                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[11px] font-bold cursor-pointer disabled:opacity-50"
                                  >
                                    Suspend
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE NEW CATEGORY (Title & Img as requested)                   */}
      {/* ========================================================================= */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full max-h-[calc(100dvh-1.5rem)] overflow-y-auto p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#d9232e]" />
                <span>{isEditingCategory ? 'Edit Category Details' : 'Create New Category'}</span>
              </h3>
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                aria-label="Close"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Category Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Japanese Mochi Treats"
                  value={newCategory.title}
                  onChange={e => setNewCategory({ ...newCategory, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#d9232e]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Category Image URL / Upload *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="/images/cat_snacks.jpg"
                    value={newCategory.img}
                    onChange={e => setNewCategory({ ...newCategory, img: e.target.value })}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#d9232e]"
                  />
                  <input
                    type="file"
                    ref={categoryFileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const res = await uploadProjectMedia(file);
                        setNewCategory(prev => ({ ...prev, img: res.url }));
                      } catch (err) {
                        alert(err.message);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => categoryFileInputRef.current?.click()}
                    className="shrink-0 whitespace-nowrap px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#d9232e]" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              {/* Preview */}
              {newCategory.img && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                  <img 
                    src={newCategory.img} 
                    alt="Preview" 
                    className="w-12 h-12 rounded-lg object-cover bg-white border border-slate-100"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="text-[11px] text-slate-600 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{newCategory.title || 'Category Preview'}</p>
                    <p className="text-slate-400 truncate">{newCategory.img}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#d9232e] hover:bg-[#b91c1c] text-white font-extrabold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {isEditingCategory ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
