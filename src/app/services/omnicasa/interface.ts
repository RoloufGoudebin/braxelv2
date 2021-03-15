export interface PropertyList {
    GetPropertyListJsonResult : Value;
}

export interface Value{
    Value : Items;
}

export interface Items{
    Items : Property[]
}

export interface Property {
    GetPropertyListJsonResult : any;
    City : string;
    ID: number;
    TypeDescription: string;
    Zip: number;
    LargePicture: string;
    StartPrice: number;
    MainTypeName: string;
    SurfaceTotal: number;
    SurfaceGarden: number;
    EnergyPerformance: number;
    KitchenName: string;
    WindowGlazing: string;
    OrientationT: string;
    MainStyleName: string;
    HasLift: boolean;
    Floor: number;
    ConstructionYear: number;
    SurfaceTerrace: number;
    ConstructionName: string;
    DescriptionA: string;
    DescriptionB: string
    NumberOfBedRooms: number;
    NumberOfBathRooms: number;
    NumberOfShowerRooms: number;
    NumberOfGarages: number;
    GoogleX: number;
    GoogleY: number;
    PriceUnitText: string;
}
