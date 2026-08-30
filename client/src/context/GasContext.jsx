import React, { createContext, useContext, useState, useEffect } from 'react';

const GasContext = createContext();

const initialSellers = [
  {
    id: 's1',
    name: 'ABC Gas Station',
    sellerType: 'filling_station',
    isVerified: true,
    rating: 4.8,
    reviewCount: 126,
    distanceKm: 1.2,
    locationName: 'Ikeja, Lagos',
    coords: { x: 38, y: 42 },
    address: '23 Allen Avenue, Ikeja, Lagos',
    phone: '0803 123 4567',
    openingHours: '8:00 AM - 7:00 PM',
    isOpen: true,
    deliveryAvailable: true,
    pickupAvailable: true,
    inventory: [
      { size: '6kg', count: 42, pricePerKg: 1300, status: 'AVAILABLE' },
      { size: '12.5kg', count: 48, pricePerKg: 1450, status: 'AVAILABLE' },
      { size: '25kg', count: 8, pricePerKg: 2800, status: 'LOW_STOCK' },
      { size: '50kg', count: 0, pricePerKg: 0, status: 'OUT_OF_STOCK' },
    ]
  },
  {
    id: 's2',
    name: 'Grace Gas & Energy',
    sellerType: 'independent_seller',
    isVerified: true,
    rating: 4.9,
    reviewCount: 94,
    distanceKm: 2.1,
    locationName: 'Yaba, Lagos',
    coords: { x: 55, y: 62 },
    address: '14 Herbert Macaulay Way, Yaba',
    phone: '0802 888 1122',
    openingHours: '7:30 AM - 8:00 PM',
    isOpen: true,
    deliveryAvailable: true,
    pickupAvailable: true,
    inventory: [
      { size: '6kg', count: 18, pricePerKg: 1350, status: 'AVAILABLE' },
      { size: '12.5kg', count: 65, pricePerKg: 1400, status: 'AVAILABLE' },
      { size: '25kg', count: 12, pricePerKg: 2750, status: 'AVAILABLE' },
      { size: '50kg', count: 4, pricePerKg: 5400, status: 'LOW_STOCK' },
    ]
  },
  {
    id: 's3',
    name: 'Surulere Mega Refill Hub',
    sellerType: 'filling_station',
    isVerified: true,
    rating: 4.7,
    reviewCount: 210,
    distanceKm: 3.4,
    locationName: 'Surulere, Lagos',
    coords: { x: 28, y: 70 },
    address: '88 Bode Thomas Street, Surulere',
    phone: '0814 555 9900',
    openingHours: '8:00 AM - 9:00 PM',
    isOpen: true,
    deliveryAvailable: true,
    pickupAvailable: true,
    inventory: [
      { size: '6kg', count: 5, pricePerKg: 1300, status: 'LOW_STOCK' },
      { size: '12.5kg', count: 0, pricePerKg: 1420, status: 'OUT_OF_STOCK' },
      { size: '25kg', count: 15, pricePerKg: 2800, status: 'AVAILABLE' },
      { size: '50kg', count: 10, pricePerKg: 5500, status: 'AVAILABLE' },
    ]
  },
  {
    id: 's4',
    name: 'Lekki Gas Express Depot',
    sellerType: 'filling_station',
    isVerified: true,
    rating: 4.8,
    reviewCount: 156,
    distanceKm: 5.8,
    locationName: 'Lekki Phase 1, Lagos',
    coords: { x: 72, y: 35 },
    address: 'Admiralty Way, Lekki Phase 1',
    phone: '0809 111 2233',
    openingHours: '24/7',
    isOpen: true,
    deliveryAvailable: true,
    pickupAvailable: true,
    inventory: [
      { size: '6kg', count: 30, pricePerKg: 1500, status: 'AVAILABLE' },
      { size: '12.5kg', count: 80, pricePerKg: 1550, status: 'AVAILABLE' },
      { size: '25kg', count: 25, pricePerKg: 3000, status: 'AVAILABLE' },
      { size: '50kg', count: 14, pricePerKg: 5900, status: 'AVAILABLE' },
    ]
  },
  {
    id: 's5',
    name: 'Ajah Fast Gas Point',
    sellerType: 'independent_seller',
    isVerified: false,
    rating: 4.4,
    reviewCount: 42,
    distanceKm: 8.2,
    locationName: 'Ajah, Lagos',
    coords: { x: 84, y: 55 },
    address: 'Addo Road, Ajah, Lagos',
    phone: '0703 444 8899',
    openingHours: '8:00 AM - 6:00 PM',
    isOpen: false,
    deliveryAvailable: false,
    pickupAvailable: true,
    inventory: [
      { size: '6kg', count: 0, pricePerKg: 1300, status: 'CLOSED' },
      { size: '12.5kg', count: 0, pricePerKg: 1400, status: 'CLOSED' },
      { size: '25kg', count: 0, pricePerKg: 2800, status: 'CLOSED' },
      { size: '50kg', count: 0, pricePerKg: 5500, status: 'CLOSED' },
    ]
  }
];

const initialOrders = [
  {
    orderNumber: '#GF10284',
    customerName: 'David Goodluck',
    customerPhone: '0803 123 4567',
    sellerName: 'ABC Gas Station',
    sellerAddress: '23 Allen Avenue, Ikeja, Lagos',
    cylinderSize: '12.5kg',
    quantity: 2,
    gasPriceTotal: 2500,
    deliveryFee: 500,
    serviceFee: 100,
    totalAmount: 3100,
    paymentMethod: 'Card',
    status: 'ON_THE_WAY',
    createdAt: 'Today, 10:30 AM',
    estimatedMinutes: 15,
    rider: { name: 'Michael', rating: 4.9, phone: '0802 987 6543' }
  },
  {
    orderNumber: '#GF10212',
    customerName: 'Tunde Adeleke',
    customerPhone: '0812 444 5566',
    sellerName: 'Grace Gas & Energy',
    sellerAddress: '14 Herbert Macaulay Way, Yaba',
    cylinderSize: '6kg',
    quantity: 1,
    gasPriceTotal: 1350,
    deliveryFee: 400,
    serviceFee: 100,
    totalAmount: 1850,
    paymentMethod: 'Wallet',
    status: 'DELIVERED',
    createdAt: 'Yesterday, 4:20 PM',
    estimatedMinutes: 0,
    rider: { name: 'Samuel', rating: 4.8, phone: '0805 111 2233' }
  }
];

const initialVerificationRequests = [
  {
    id: 'v1',
    businessName: 'Kofo Cooking Gas Supplies',
    ownerName: 'Kofoworola Johnson',
    sellerType: 'independent_seller',
    phone: '0806 777 8899',
    email: 'kofo@gassupply.ng',
    location: 'Surulere, Lagos',
    submittedDate: '28 Aug 2026',
    status: 'PENDING',
    idCardDoc: 'ID_CARD_KOFO.pdf',
    permitDoc: 'BUSINESS_PERMIT_KOFO.pdf'
  },
  {
    id: 'v2',
    businessName: 'V.I. Clean Gas Terminal Ltd',
    ownerName: 'Chief Emeka Okafor',
    sellerType: 'filling_station',
    phone: '0802 333 4455',
    email: 'contact@vicleangas.ng',
    location: 'Victoria Island, Lagos',
    submittedDate: '29 Aug 2026',
    status: 'PENDING',
    idCardDoc: 'CAC_REG_EMEKA.pdf',
    permitDoc: 'DPR_LICENSE_VICLEAN.pdf'
  }
];

export const GasProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [activeRole, setActiveRole] = useState('customer'); // 'customer' | 'seller' | 'station' | 'admin'
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' | 'desktop'
  
  // User Auth State
  const [user, setUser] = useState({
    name: 'David Goodluck',
    phone: '0803 123 4567',
    email: 'davidgoodluck@gmail.com',
    role: 'customer',
    isLoggedIn: true
  });
  
  // Dynamic Sellers State
  const [sellers, setSellers] = useState(initialSellers);
  const [selectedSeller, setSelectedSeller] = useState(initialSellers[0]);
  
  // Active Order Pipeline
  const [orders, setOrders] = useState(initialOrders);
  const [activeOrder, setActiveOrder] = useState(initialOrders[0]);
  
  // Verification Database
  const [verificationRequests, setVerificationRequests] = useState(initialVerificationRequests);

  // Filters State
  const [filters, setFilters] = useState({
    cylinderSize: '12.5kg',
    sellerType: 'All',
    availability: 'All',
    distance: '5 km',
    priceSort: 'Low to High',
    deliveryMode: 'Both'
  });

  // Handler for Screen Navigation with Auto Role Context Adjustment
  const navigateToScreen = (screenNumber) => {
    setCurrentScreen(screenNumber);
    // Auto switch role & view mode based on target screen if needed
    if (screenNumber >= 6 && screenNumber <= 15) {
      setActiveRole('customer');
      setViewMode('mobile');
    } else if (screenNumber >= 16 && screenNumber <= 21) {
      setActiveRole('seller');
      setViewMode('mobile');
    } else if (screenNumber >= 22 && screenNumber <= 25) {
      setActiveRole('station');
      setViewMode('mobile');
    } else if (screenNumber >= 26 && screenNumber <= 34) {
      setActiveRole('admin');
      setViewMode('desktop');
    }
  };

  // Inventory Update Handler (Seller changes stock count -> instantly updates Seller & Live Map)
  const updateSellerInventory = (sellerId, size, newCount, newPrice, newStatus) => {
    setSellers(prevSellers =>
      prevSellers.map(seller => {
        if (seller.id === sellerId) {
          const updatedInventory = seller.inventory.map(item => {
            if (item.size === size) {
              return {
                ...item,
                count: parseInt(newCount, 10),
                pricePerKg: parseInt(newPrice, 10),
                status: newStatus
              };
            }
            return item;
          });
          return { ...seller, inventory: updatedInventory };
        }
        return seller;
      })
    );
  };

  // Submit New Order
  const createNewOrder = (orderData) => {
    const newOrd = {
      orderNumber: `#GF${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: user.name,
      customerPhone: user.phone,
      sellerName: orderData.sellerName || 'ABC Gas Station',
      sellerAddress: orderData.sellerAddress || '23 Allen Avenue, Ikeja, Lagos',
      cylinderSize: orderData.cylinderSize || '12.5kg',
      quantity: orderData.quantity || 1,
      gasPriceTotal: orderData.gasPriceTotal || 2500,
      deliveryFee: orderData.deliveryFee || 500,
      serviceFee: orderData.serviceFee || 100,
      totalAmount: orderData.totalAmount || 3100,
      paymentMethod: orderData.paymentMethod || 'Card',
      status: 'ORDER_CONFIRMED',
      createdAt: 'Just now',
      estimatedMinutes: 35,
      rider: { name: 'Michael', rating: 4.9, phone: '0802 987 6543' }
    };
    setOrders([newOrd, ...orders]);
    setActiveOrder(newOrd);
    navigateToScreen(12); // Go to Order Confirmation
  };

  // Update Order Status (Seller changes order status)
  const updateOrderStatus = (orderNumber, nextStatus) => {
    setOrders(prev =>
      prev.map(ord => (ord.orderNumber === orderNumber ? { ...ord, status: nextStatus } : ord))
    );
    if (activeOrder.orderNumber === orderNumber) {
      setActiveOrder(prev => ({ ...prev, status: nextStatus }));
    }
  };

  // Verify Seller Application (Admin)
  const handleApproveVerification = (id) => {
    setVerificationRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status: 'APPROVED' } : req))
    );
  };

  return (
    <GasContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        navigateToScreen,
        activeRole,
        setActiveRole,
        viewMode,
        setViewMode,
        user,
        setUser,
        sellers,
        setSellers,
        selectedSeller,
        setSelectedSeller,
        orders,
        activeOrder,
        createNewOrder,
        updateOrderStatus,
        verificationRequests,
        handleApproveVerification,
        filters,
        setFilters,
        updateSellerInventory
      }}
    >
      {children}
    </GasContext.Provider>
  );
};

export const useGas = () => useContext(GasContext);
