import { useState } from "react";
import ProductPagesList from "@/components/organisms/ProductPagesList";
import CreateProductPage from "@/components/organisms/CreateProductPage";
import ExportModal from "@/components/atoms/ExportModal";

const ProductPages = () => {
  const [currentView, setCurrentView] = useState("list");
  const [editingPage, setEditingPage] = useState(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportingPage, setExportingPage] = useState(null);
  const handleCreateNew = () => {
    setCurrentView("create");
    setEditingPage(null);
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setCurrentView("create");
  };

const handleBack = () => {
    setCurrentView("list");
    setEditingPage(null);
  };

  const handleExport = (page) => {
    setExportingPage(page);
    setExportModalOpen(true);
  };

  const handleCloseExportModal = () => {
    setExportModalOpen(false);
    setExportingPage(null);
  };
switch (currentView) {
    case "create":
      return (
        <>
          <CreateProductPage
            onBack={handleBack}
            editingPage={editingPage}
            onExport={handleExport}
          />
          <ExportModal
            isOpen={exportModalOpen}
            onClose={handleCloseExportModal}
            page={exportingPage}
          />
        </>
      );
default:
      return (
        <>
          <ProductPagesList
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onExport={handleExport}
          />
          <ExportModal
            isOpen={exportModalOpen}
            onClose={handleCloseExportModal}
            page={exportingPage}
          />
        </>
      );
  }
};

export default ProductPages;