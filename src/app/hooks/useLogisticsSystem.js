import { useState, useEffect } from 'react';

const useLogisticsSystem = () => {
  const [loading, setLoading] = useState(true);

  // 1. Fixed Assets Inventory
  const [assets, setAssets] = useState([
    { 
      id: "AST-IT-001", name: "Dell Latitude 5420", type: "IT", 
      serial: "DELL-882299", condition: "Good", status: "Assigned", 
      purchaseDate: "Jan 10, 2022", warranty: "Jan 10, 2025", 
      value: 85000 
    },
    { 
      id: "AST-FUR-102", name: "Ergonomic Office Chair", type: "Furniture", 
      serial: "GF-221", condition: "Minor Wear", status: "Assigned", 
      purchaseDate: "Mar 15, 2021", warranty: "Expired", 
      value: 12000 
    },
    { 
      id: "AST-LAB-305", name: "Digital Oscilloscope", type: "Lab Equipment", 
      serial: "TEK-9900", condition: "Excellent", status: "In Lab", 
      purchaseDate: "Aug 01, 2023", warranty: "Aug 01, 2026", 
      value: 45000 
    },
    { 
      id: "AST-VEH-001", name: "Dept. Vehicle (Toyota Innova)", type: "Vehicle", 
      serial: "KA-05-MQ-9911", condition: "Good", status: "Shared Pool", 
      purchaseDate: "Jun 20, 2019", warranty: "Expired", 
      value: 1800000 
    }
  ]);

  // 2. Software Licenses
  const [software, setSoftware] = useState([
    { id: 1, name: "MATLAB Campus Wide", version: "2023b", key: "XXXX-YYYY-ZZZZ", expiry: "Dec 31, 2024", seats: "Unlimited" },
    { id: 2, name: "AutoCAD Educational", version: "2024", key: "ACAD-8821-0092", expiry: "Oct 15, 2024", seats: "Single User" }
  ]);

  // 3. Consumables (Stock Register)
  const [stock, setStock] = useState([
    { id: 1, item: "A4 Paper Reams", issued: 5, unit: "Pack", date: "Oct 01, 2023", remaining: 2 },
    { id: 2, item: "Whiteboard Markers", issued: 10, unit: "Box", date: "Sep 15, 2023", remaining: 4 },
    { id: 3, item: "Lab Chemicals (H2SO4)", issued: 500, unit: "ml", date: "Aug 20, 2023", remaining: 100 }
  ]);

  // 4. Maintenance History
  const [maintenance, setMaintenance] = useState([
    { id: 101, assetId: "AST-IT-001", type: "Repair", desc: "Keyboard Replacement", date: "Jul 10, 2023", cost: 2500, status: "Closed" },
    { id: 102, assetId: "AST-LAB-305", type: "Calibration", desc: "Annual Calibration", date: "Sep 01, 2023", cost: 0, status: "AMC Covered" }
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // --- ACTIONS ---

  const requestStock = (item, qty) => {
    alert(`Request submitted for ${qty} ${item}`);
  };

  const initiateTransfer = (assetId, targetDept) => {
    setAssets(prev => prev.map(a => 
      a.id === assetId ? { ...a, status: "Transfer Pending" } : a
    ));
  };

  const reportIssue = (assetId, issue) => {
    const newLog = { 
      id: Date.now(), assetId, type: "Reported Issue", 
      desc: issue, date: new Date().toLocaleDateString(), 
      cost: 0, status: "Open" 
    };
    setMaintenance([newLog, ...maintenance]);
  };

  return { 
    loading, 
    assets, 
    software, 
    stock, 
    maintenance,
    requestStock,
    initiateTransfer,
    reportIssue
  };
};

export default useLogisticsSystem;