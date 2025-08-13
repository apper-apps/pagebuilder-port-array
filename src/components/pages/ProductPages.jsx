import { useState } from "react";
import ProductPagesList from "@/components/organisms/ProductPagesList";
import CreateProductPage from "@/components/organisms/CreateProductPage";

const ProductPages = () => {
  const [currentView, setCurrentView] = useState("list");
  const [editingPage, setEditingPage] = useState(null);

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

  switch (currentView) {
    case "create":
      return (
        <CreateProductPage
          onBack={handleBack}
          editingPage={editingPage}
        />
      );
    default:
      return (
        <ProductPagesList
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
        />
      );
  }
};

export default ProductPages;