import FloorPlansRenderer from "../components/FloorPlansRenderer";
import Script from "next/script";

const FloorPlansPage = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Floor Plans</h1>
            <FloorPlansRenderer />
        </div>
    );
};

export default FloorPlansPage;