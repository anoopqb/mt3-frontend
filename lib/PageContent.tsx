import DynamicZoneManager from "@/app/components/manager";

interface DynamicZoneComponent {
    id: number;
    __component: string;
    [key: string]: unknown;
}

interface PageData {
    id: number;
    dynamicZone?: DynamicZoneComponent[];
    dynamic_zone?: DynamicZoneComponent[]; // Support both naming conventions
    [key: string]: unknown;
}

export default function PageContent({
    pageData,
}: {
    pageData: PageData | null | undefined;
}) {
    // Try both naming conventions
    const dynamicZone = pageData?.dynamicZone || pageData?.dynamic_zone;
    return <>{dynamicZone && <DynamicZoneManager dynamicZone={dynamicZone} />}</>;
}