import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/molecules/Sidebar";
import Header from "@/components/molecules/Header";
import ProductPages from "@/components/pages/ProductPages";
import CollectionPages from "@/components/pages/CollectionPages";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
        
        <div className="lg:ml-64">
          <Header onMenuToggle={handleMenuToggle} />
          
          <main className="p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<ProductPages />} />
              <Route path="/collections" element={<CollectionPages />} />
            </Routes>
          </main>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;