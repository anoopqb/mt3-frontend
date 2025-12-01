import ApartmentRenderer from "@/app/components/ApartmentRenderer";
import { Suspense } from "react";


const ApartmentsPage = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Floor Plans</h1>
            <Suspense fallback={<div>Loading apartments...</div>}>
                <ApartmentRenderer />
            </Suspense>
        </div>
    );
};

export default ApartmentsPage;