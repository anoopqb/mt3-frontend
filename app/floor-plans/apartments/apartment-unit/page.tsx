import ApartmentUnitRenderer from '@/app/components/ApartmentUnitRenderer';
import { Suspense } from 'react';

const unitPage = () => {
    return(
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Apartment Unit Floor Plan</h1>
            <Suspense fallback={<div>Loading apartment unit...</div>}>
                <ApartmentUnitRenderer />
            </Suspense>
        </div>
    );
}

export default unitPage;