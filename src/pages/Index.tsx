
import AICard from "@/components/AICard";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const Index = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Header />
        <div className="p-4 font-inter">
          <div className="w-full max-w-4xl mx-auto">
            <AICard />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Index;
